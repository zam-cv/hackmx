use crate::{
    config,
    controllers::{
        admin::{documents::DocumentsService, gallery::GalleryService},
        projects::ProjectsService,
    },
    models, schema,
    utils::documents::DocService,
};
use actix_web::web;
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager, PooledConnection};
use std::{collections, env};

pub type DBPool = r2d2::Pool<ConnectionManager<PgConnection>>;

#[derive(Clone)]
pub struct Database {
    pub pool: DBPool,
}

impl Database {
    pub fn new() -> Self {
        let manager = ConnectionManager::<PgConnection>::new(
            env::var("DATABASE_URL").expect("DATABASE_URL must be set"),
        );

        let pool = r2d2::Pool::builder()
            // Set the maximum number of connections to the database
            .max_size(config::MAX_POOL_SIZE)
            .build(manager)
            .expect("Failed to create pool.");

        Database { pool }
    }

    pub fn get_connection(
        &self,
    ) -> anyhow::Result<PooledConnection<ConnectionManager<PgConnection>>> {
        self.pool.get().map_err(|e| anyhow::anyhow!(e))
    }

    pub async fn query_wrapper<F, T>(&self, f: F) -> anyhow::Result<T>
    where
        F: FnOnce(&mut PgConnection) -> Result<T, diesel::result::Error> + Send + 'static,
        T: Send + 'static,
    {
        let mut conn = self.get_connection()?;

        // Execute the query
        let result = web::block(move || f(&mut conn))
            .await
            .map_err(|e| {
                log::error!("Database error: {:?}", e);
                anyhow::anyhow!(e)
            })?
            .map_err(|e| {
                log::error!("Database error: {:?}", e);
                anyhow::anyhow!(e)
            })?;

        Ok(result)
    }

    pub async fn create_user(&self, new_user: models::User) -> anyhow::Result<i32> {
        self.query_wrapper(move |conn| {
            diesel::insert_into(schema::users::table)
                .values(&new_user)
                .returning(schema::users::id)
                .get_result(conn)
        })
        .await
    }

    pub async fn get_user_by_email(&self, email: String) -> anyhow::Result<Option<models::User>> {
        self.query_wrapper(move |conn| {
            schema::users::table
                .filter(schema::users::email.eq(email))
                .first(conn)
                .optional()
        })
        .await
    }

    pub async fn get_emails_by_event_id(&self, event_id: i32) -> anyhow::Result<Vec<String>> {
        self.query_wrapper(move |conn| {
            schema::event_participants::table
                .filter(schema::event_participants::event_id.eq(event_id))
                .inner_join(schema::users::table)
                .select(schema::users::email)
                .load(conn)
        })
        .await
    }

    pub async fn get_user_by_id(&self, id: i32) -> anyhow::Result<Option<models::User>> {
        self.query_wrapper(move |conn| schema::users::table.find(id).first(conn).optional())
            .await
    }

    pub async fn create_admin(&self, new_admin: models::Admin) -> anyhow::Result<i32> {
        self.query_wrapper(move |conn| {
            diesel::insert_into(schema::admins::table)
                .values(&new_admin)
                .returning(schema::admins::id)
                .get_result(conn)
        })
        .await
    }

    pub async fn get_admin_by_email(&self, email: String) -> anyhow::Result<Option<models::Admin>> {
        self.query_wrapper(move |conn| {
            schema::admins::table
                .filter(schema::admins::email.eq(email))
                .first(conn)
                .optional()
        })
        .await
    }

    pub async fn get_admin_by_id(&self, id: i32) -> anyhow::Result<Option<models::Admin>> {
        self.query_wrapper(move |conn| schema::admins::table.find(id).first(conn).optional())
            .await
    }

    pub async fn create_event(&self, new_event: models::Event) -> anyhow::Result<i32> {
        self.query_wrapper(move |conn| {
            diesel::insert_into(schema::events::table)
                .values(&new_event)
                .returning(schema::events::id)
                .get_result(conn)
        })
        .await
    }

    pub async fn get_events(
        &self,
    ) -> anyhow::Result<
        Vec<(
            i32,
            String,
            chrono::NaiveDateTime,
            chrono::NaiveDateTime,
            String,
        )>,
    > {
        self.query_wrapper(move |conn| {
            schema::events::table
                .select((
                    schema::events::id,
                    schema::events::title,
                    schema::events::start_date,
                    schema::events::end_date,
                    schema::events::location,
                ))
                .load(conn)
        })
        .await
    }

    pub async fn get_events_with_user_in_event(
        &self,
        user_id: i32,
    ) -> anyhow::Result<Vec<(models::Event, bool)>> {
        self.query_wrapper(move |conn| {
            let events = schema::events::table.load::<models::Event>(conn)?;

            let mut result = Vec::new();

            for event in events {
                if let Some(id) = event.id {
                    let is_user_in_event = schema::event_participants::table
                        .filter(schema::event_participants::user_id.eq(user_id))
                        .filter(schema::event_participants::event_id.eq(id))
                        .first::<models::EventParticipant>(conn)
                        .optional()?
                        .is_some();

                    result.push((event, is_user_in_event));
                }
            }

            Ok(result)
        })
        .await
    }

    pub async fn get_event_by_id(&self, id: i32) -> anyhow::Result<Option<models::Event>> {
        self.query_wrapper(move |conn| schema::events::table.find(id).first(conn).optional())
            .await
    }

    pub async fn update_event(&self, new_event: models::Event) -> anyhow::Result<()> {
        if let Some(id) = new_event.id {
            self.query_wrapper(move |conn| {
                diesel::update(schema::events::table.find(id))
                    .set(&new_event)
                    .execute(conn)
            })
            .await?;
        }

        Ok(())
    }

    pub async fn create_post(&self, new_publication: models::Publication) -> anyhow::Result<i32> {
        self.query_wrapper(move |conn| {
            diesel::insert_into(schema::publications::table)
                .values(&new_publication)
                .returning(schema::publications::id)
                .get_result(conn)
        })
        .await
    }

    pub async fn get_posts_by_event_id(
        &self,
        event_id: i32,
    ) -> anyhow::Result<Vec<models::Publication>> {
        self.query_wrapper(move |conn| {
            schema::publications::table
                .filter(schema::publications::event_id.eq(event_id))
                .load(conn)
        })
        .await
    }

    pub async fn delete_post_by_id(&self, id: i32) -> anyhow::Result<()> {
        self.query_wrapper(move |conn| {
            diesel::delete(schema::publications::table.find(id)).execute(conn)
        })
        .await?;

        Ok(())
    }

    pub async fn create_sponsor(&self, new_sponsor: models::Sponsor) -> anyhow::Result<i32> {
        self.query_wrapper(move |conn| {
            diesel::insert_into(schema::sponsors::table)
                .values(&new_sponsor)
                .returning(schema::sponsors::id)
                .get_result(conn)
        })
        .await
    }

    pub async fn get_sponsor_image_by_id(&self, id: i32) -> anyhow::Result<Option<String>> {
        self.query_wrapper(move |conn| {
            schema::sponsors::table
                .filter(schema::sponsors::id.eq(id))
                .select(schema::sponsors::image)
                .first(conn)
                .optional()
        })
        .await
    }

    pub async fn get_university_image_by_id(&self, id: i32) -> anyhow::Result<Option<String>> {
        self.query_wrapper(move |conn| {
            schema::universities::table
                .filter(schema::universities::id.eq(id))
                .select(schema::universities::image)
                .first(conn)
                .optional()
        })
        .await
    }

    pub async fn update_sponsor(&self, new_sponsor: models::Sponsor) -> anyhow::Result<()> {
        if let Some(id) = new_sponsor.id {
            self.query_wrapper(move |conn| {
                diesel::update(schema::sponsors::table.find(id))
                    .set(&new_sponsor)
                    .execute(conn)
            })
            .await?;
        }

        Ok(())
    }

    pub async fn update_sponsor_image(
        &self,
        id: i32,
        image: String,
    ) -> anyhow::Result<models::Sponsor> {
        self.query_wrapper(move |conn| {
            let sponsor = schema::sponsors::table.find(id).first(conn);

            diesel::update(schema::sponsors::table.find(id))
                .set(schema::sponsors::image.eq(image))
                .execute(conn)?;

            sponsor
        })
        .await
    }

    pub async fn update_university_image(
        &self,
        id: i32,
        image: String,
    ) -> anyhow::Result<models::University> {
        self.query_wrapper(move |conn| {
            let university = schema::universities::table.find(id).first(conn);

            diesel::update(schema::universities::table.find(id))
                .set(schema::universities::image.eq(image))
                .execute(conn)?;

            university
        })
        .await
    }

    pub async fn delete_sponsor_by_id(&self, id: i32) -> anyhow::Result<()> {
        self.query_wrapper(move |conn| {
            let event_sponsor_ids = schema::event_sponsors::table
                .filter(schema::event_sponsors::sponsor_id.eq(id))
                .select(schema::event_sponsors::id)
                .load::<i32>(conn)?;

            for event_sponsor_id in event_sponsor_ids {
                diesel::delete(
                    schema::awards::table
                        .filter(schema::awards::event_sponsor_id.eq(event_sponsor_id)),
                )
                .execute(conn)?;
            }

            diesel::delete(
                schema::event_sponsors::table.filter(schema::event_sponsors::sponsor_id.eq(id)),
            )
            .execute(conn)?;

            diesel::delete(schema::sponsors::table.find(id)).execute(conn)
        })
        .await?;

        Ok(())
    }

    pub async fn get_sponsors(&self) -> anyhow::Result<Vec<models::Sponsor>> {
        self.query_wrapper(move |conn| schema::sponsors::table.load(conn))
            .await
    }

    pub async fn get_sponsor_by_id(&self, id: i32) -> anyhow::Result<Option<models::Sponsor>> {
        self.query_wrapper(move |conn| schema::sponsors::table.find(id).first(conn).optional())
            .await
    }

    pub async fn get_university_by_id(
        &self,
        id: i32,
    ) -> anyhow::Result<Option<models::University>> {
        self.query_wrapper(move |conn| schema::universities::table.find(id).first(conn).optional())
            .await
    }

    pub async fn create_university(
        &self,
        new_university: models::University,
    ) -> anyhow::Result<i32> {
        self.query_wrapper(move |conn| {
            diesel::insert_into(schema::universities::table)
                .values(&new_university)
                .returning(schema::universities::id)
                .get_result(conn)
        })
        .await
    }

    pub async fn update_university(
        &self,
        new_university: models::University,
    ) -> anyhow::Result<()> {
        if let Some(id) = new_university.id {
            self.query_wrapper(move |conn| {
                diesel::update(schema::universities::table.find(id))
                    .set(&new_university)
                    .execute(conn)
            })
            .await?;
        }

        Ok(())
    }

    pub async fn delete_university_by_id(&self, id: i32) -> anyhow::Result<()> {
        self.query_wrapper(move |conn| {
            diesel::delete(
                schema::university_quota::table
                    .filter(schema::university_quota::university_id.eq(id)),
            )
            .execute(conn)?;

            diesel::delete(schema::universities::table.find(id)).execute(conn)
        })
        .await?;

        Ok(())
    }

    pub async fn get_universities(&self) -> anyhow::Result<Vec<models::University>> {
        self.query_wrapper(move |conn| schema::universities::table.load(conn))
            .await
    }

    pub async fn get_sponsors_not_in_event(
        &self,
        event_id: i32,
    ) -> anyhow::Result<Vec<models::Sponsor>> {
        self.query_wrapper(move |conn| {
            let sponsors_in_event = schema::event_sponsors::table
                .filter(schema::event_sponsors::event_id.eq(event_id))
                .select(schema::event_sponsors::sponsor_id);

            schema::sponsors::table
                .filter(diesel::dsl::not(
                    schema::sponsors::id.eq_any(sponsors_in_event),
                ))
                .load(conn)
        })
        .await
    }

    pub async fn get_sponsors_by_event_id(
        &self,
        event_id: i32,
    ) -> anyhow::Result<Vec<(Option<i32>, String, String)>> {
        self.query_wrapper(move |conn| {
            schema::sponsors::table
                .inner_join(schema::event_sponsors::table)
                .filter(schema::event_sponsors::event_id.eq(event_id))
                .select((
                    schema::sponsors::id.nullable(),
                    schema::sponsors::name,
                    schema::sponsors::image,
                ))
                .load(conn)
        })
        .await
    }

    pub async fn get_sponsors_with_awards_by_event_id(
        &self,
        event_id: i32,
    ) -> anyhow::Result<Vec<(models::Sponsor, Vec<models::Award>)>> {
        self.query_wrapper(move |conn| {
            let sponsors = schema::sponsors::table
                .inner_join(schema::event_sponsors::table)
                .filter(schema::event_sponsors::event_id.eq(event_id))
                .load::<(models::Sponsor, models::EventSponsor)>(conn)?;

            let mut result = Vec::new();

            for (sponsor, event_sponsor) in sponsors {
                if let Some(event_sponsor_id) = event_sponsor.id {
                    let awards = schema::awards::table
                        .filter(schema::awards::event_sponsor_id.eq(event_sponsor_id))
                        .load(conn)?;

                    result.push((sponsor, awards));
                }
            }

            Ok(result)
        })
        .await
    }

    pub async fn add_sponsor_to_event(
        &self,
        event_id: i32,
        sponsor_id: i32,
    ) -> anyhow::Result<i32> {
        self.query_wrapper(move |conn| {
            if schema::event_sponsors::table
                .filter(schema::event_sponsors::event_id.eq(event_id))
                .filter(schema::event_sponsors::sponsor_id.eq(sponsor_id))
                .first::<models::EventSponsor>(conn)
                .optional()?
                .is_some()
            {
                return Err(diesel::result::Error::RollbackTransaction);
            }

            let new_event_sponsor = models::EventSponsor {
                id: None,
                event_id,
                sponsor_id,
            };

            diesel::insert_into(schema::event_sponsors::table)
                .values(&new_event_sponsor)
                .returning(schema::event_sponsors::id)
                .get_result(conn)
        })
        .await
    }

    pub async fn add_award_to_sponsor(
        &self,
        event_id: i32,
        sponsor_id: i32,
        mut new_award: models::Award,
    ) -> anyhow::Result<i32> {
        self.query_wrapper(move |conn| {
            let event_sponsor_id = schema::event_sponsors::table
                .filter(schema::event_sponsors::event_id.eq(event_id))
                .filter(schema::event_sponsors::sponsor_id.eq(sponsor_id))
                .select(schema::event_sponsors::id)
                .first::<i32>(conn)?;

            new_award.event_sponsor_id = event_sponsor_id;
            diesel::insert_into(schema::awards::table)
                .values(&new_award)
                .returning(schema::awards::id)
                .get_result(conn)
        })
        .await
    }

    pub async fn delete_sponsor_from_event(
        &self,
        event_id: i32,
        sponsor_id: i32,
    ) -> anyhow::Result<()> {
        self.query_wrapper(move |conn| {
            let event_sponsor_id = schema::event_sponsors::table
                .filter(schema::event_sponsors::event_id.eq(event_id))
                .filter(schema::event_sponsors::sponsor_id.eq(sponsor_id))
                .select(schema::event_sponsors::id)
                .first::<i32>(conn)?;

            diesel::delete(
                schema::awards::table.filter(schema::awards::event_sponsor_id.eq(event_sponsor_id)),
            )
            .execute(conn)?;

            diesel::delete(
                schema::event_sponsors::table
                    .filter(schema::event_sponsors::event_id.eq(event_id))
                    .filter(schema::event_sponsors::sponsor_id.eq(sponsor_id)),
            )
            .execute(conn)
        })
        .await?;

        Ok(())
    }

    pub async fn delete_award_by_id(&self, id: i32) -> anyhow::Result<()> {
        self.query_wrapper(move |conn| {
            diesel::delete(schema::awards::table.find(id)).execute(conn)
        })
        .await?;

        Ok(())
    }

    pub async fn get_universities_with_quota(
        &self,
        event_id: i32,
    ) -> anyhow::Result<Vec<(models::University, Option<models::UniversityQuota>)>> {
        self.query_wrapper(move |conn| {
            let universities = schema::universities::table
                .left_join(
                    schema::university_quota::table.on(schema::university_quota::university_id
                        .eq(schema::universities::id)
                        .and(schema::university_quota::event_id.eq(event_id))),
                )
                .select((
                    schema::universities::all_columns,
                    schema::university_quota::all_columns.nullable(),
                ))
                .load::<(models::University, Option<models::UniversityQuota>)>(conn)?;

            Ok(universities)
        })
        .await
    }

    pub async fn unsert_university_quota(
        &self,
        event_id: i32,
        university_id: i32,
        quota: i32,
    ) -> anyhow::Result<()> {
        self.query_wrapper(move |conn| {
            let university_quota = models::UniversityQuota {
                event_id,
                university_id,
                quota,
            };

            diesel::insert_into(schema::university_quota::table)
                .values(&university_quota)
                .on_conflict((
                    schema::university_quota::event_id,
                    schema::university_quota::university_id,
                ))
                .do_update()
                .set(schema::university_quota::quota.eq(quota))
                .execute(conn)
        })
        .await?;

        Ok(())
    }

    pub async fn create_task(&self, new_task: models::EventTask) -> anyhow::Result<i32> {
        self.query_wrapper(move |conn| {
            diesel::insert_into(schema::event_tasks::table)
                .values(&new_task)
                .returning(schema::event_tasks::id)
                .get_result(conn)
        })
        .await
    }

    pub async fn delete_task_by_id(&self, id: i32) -> anyhow::Result<()> {
        self.query_wrapper(move |conn| {
            diesel::delete(schema::event_tasks::table.find(id)).execute(conn)
        })
        .await?;

        Ok(())
    }

    pub async fn get_tasks_by_event_id(
        &self,
        event_id: i32,
    ) -> anyhow::Result<Vec<models::EventTask>> {
        self.query_wrapper(move |conn| {
            schema::event_tasks::table
                .filter(schema::event_tasks::event_id.eq(event_id))
                .order_by(schema::event_tasks::id.asc())
                .load(conn)
        })
        .await
    }    

    pub async fn get_projects_by_event_id(
        &self,
        event_id: i32,
    ) -> anyhow::Result<Vec<models::Project>> {
        self.query_wrapper(move |conn| {
            schema::teams::table
                .inner_join(schema::projects::table)
                .filter(schema::teams::event_id.eq(event_id))
                .select(schema::projects::all_columns)
                .load(conn)
        })
        .await
    }

    pub async fn delete_event_by_id(&self, id: i32) -> anyhow::Result<()> {
        let mut documents = self.get_documents_by_event_id(id).await?;

        let service = DocumentsService(&self);
        service.transform_all(&mut documents);

        let mut projects = self.get_projects_by_event_id(id).await?;

        let service = ProjectsService(&self);
        service.transform_all(&mut projects);

        let mut gallery = self.get_images_by_event_id(id).await?;

        let service = GalleryService(&self);
        service.transform_all(&mut gallery);

        self.query_wrapper(move |conn| {
            diesel::delete(
                schema::publications::table.filter(schema::publications::event_id.eq(id)),
            )
            .execute(conn)?;

            diesel::delete(schema::event_tasks::table.filter(schema::event_tasks::event_id.eq(id)))
                .execute(conn)?;

            diesel::delete(
                schema::university_quota::table.filter(schema::university_quota::event_id.eq(id)),
            )
            .execute(conn)?;

            for document in documents {
                let filename = format!("./{}", document.name);

                if let Err(_) = std::fs::remove_file(filename.clone()) {
                    log::error!("Failed to remove file: {}", filename);
                }
            }

            let base_path = std::path::Path::new("./private/projects")
                .canonicalize()
                .expect("Failed to canonicalize base path");

            for project in projects {
                if project.zip.is_empty() {
                    continue;
                }

                let filename = format!("./{}", project.zip);
                let path = std::path::Path::new(&filename);

                if let Ok(normalized_path) = path.canonicalize() {
                    if normalized_path.starts_with(&base_path) {
                        if let Err(_) = std::fs::remove_file(&normalized_path) {
                            log::error!("Failed to remove file: {:?}", normalized_path);
                        } else {
                            log::info!("Successfully removed file: {:?}", normalized_path);
                        }
                    } else {
                        log::warn!(
                            "Attempt to delete file outside of allowed directory: {:?}",
                            normalized_path
                        );
                    }
                } else {
                    log::error!("Failed to normalize path: {}", filename);
                }
            }

            for image in gallery {
                let filename = format!("./{}", image.name);

                if let Err(_) = std::fs::remove_file(filename.clone()) {
                    log::error!("Failed to remove file: {}", filename);
                }
            }

            diesel::delete(schema::documents::table.filter(schema::documents::event_id.eq(id)))
                .execute(conn)?;

            diesel::delete(
                schema::projects::table.filter(
                    schema::projects::team_id.eq_any(
                        schema::teams::table
                            .filter(schema::teams::event_id.eq(id))
                            .select(schema::teams::id),
                    ),
                ),
            )
            .execute(conn)?;

            diesel::delete(schema::gallery::table.filter(schema::gallery::event_id.eq(id)))
                .execute(conn)?;

            diesel::delete(
                schema::event_participants::table
                    .filter(schema::event_participants::event_id.eq(id)),
            )
            .execute(conn)?;

            let team_ids = schema::teams::table
                .filter(schema::teams::event_id.eq(id))
                .select(schema::teams::id)
                .load::<i32>(conn)?;

            for team_id in team_ids {
                diesel::delete(schema::members::table.filter(schema::members::team_id.eq(team_id)))
                    .execute(conn)?;

                diesel::delete(schema::teams::table.find(team_id)).execute(conn)?;
            }

            let sponsor_ids = schema::event_sponsors::table
                .filter(schema::event_sponsors::event_id.eq(id))
                .select(schema::event_sponsors::sponsor_id)
                .load::<i32>(conn)?;

            for sponsor_id in sponsor_ids {
                let event_sponsor_id = schema::event_sponsors::table
                    .filter(schema::event_sponsors::event_id.eq(id))
                    .filter(schema::event_sponsors::sponsor_id.eq(sponsor_id))
                    .select(schema::event_sponsors::id)
                    .first::<i32>(conn)?;

                diesel::delete(
                    schema::awards::table
                        .filter(schema::awards::event_sponsor_id.eq(event_sponsor_id)),
                )
                .execute(conn)?;
            }

            diesel::delete(schema::messages::table.filter(schema::messages::event_id.eq(id)))
                .execute(conn)?;

            diesel::delete(schema::fqa::table.filter(schema::fqa::event_id.eq(id)))
                .execute(conn)?;

            diesel::delete(
                schema::event_sponsors::table.filter(schema::event_sponsors::event_id.eq(id)),
            )
            .execute(conn)?;

            diesel::delete(schema::events::table.find(id)).execute(conn)
        })
        .await?;

        Ok(())
    }

    pub async fn get_document_by_id(&self, id: i32) -> anyhow::Result<Option<models::Document>> {
        self.query_wrapper(move |conn| schema::documents::table.find(id).first(conn).optional())
            .await
    }

    pub async fn create_document(&self, new_document: models::Document) -> anyhow::Result<i32> {
        self.query_wrapper(move |conn| {
            diesel::insert_into(schema::documents::table)
                .values(&new_document)
                .returning(schema::documents::id)
                .get_result(conn)
        })
        .await
    }

    pub async fn delete_document_by_id(&self, id: i32) -> anyhow::Result<models::Document> {
        self.query_wrapper(move |conn| {
            let document = schema::documents::table.find(id).first(conn)?;
            diesel::delete(schema::documents::table.find(id)).execute(conn)?;
            Ok(document)
        })
        .await
    }

    pub async fn get_documents_by_event_id(
        &self,
        event_id: i32,
    ) -> anyhow::Result<Vec<models::Document>> {
        self.query_wrapper(move |conn| {
            schema::documents::table
                .filter(schema::documents::event_id.eq(event_id))
                .load(conn)
        })
        .await
    }

    pub async fn get_participants_count(&self, event_id: i32) -> anyhow::Result<i64> {
        self.query_wrapper(move |conn| {
            schema::event_participants::table
                .filter(schema::event_participants::event_id.eq(event_id))
                .count()
                .get_result::<i64>(conn)
        })
        .await
    }

    pub async fn get_tasks_count(&self, event_id: i32) -> anyhow::Result<i64> {
        self.query_wrapper(move |conn| {
            schema::event_tasks::table
                .filter(schema::event_tasks::event_id.eq(event_id))
                .count()
                .get_result::<i64>(conn)
        })
        .await
    }

    pub async fn get_sponsors_count(&self, event_id: i32) -> anyhow::Result<i64> {
        self.query_wrapper(move |conn| {
            schema::event_sponsors::table
                .filter(schema::event_sponsors::event_id.eq(event_id))
                .count()
                .get_result::<i64>(conn)
        })
        .await
    }

    pub async fn get_teams_count(&self, event_id: i32) -> anyhow::Result<i64> {
        self.query_wrapper(move |conn| {
            schema::teams::table
                .filter(schema::teams::event_id.eq(event_id))
                .count()
                .get_result::<i64>(conn)
        })
        .await
    }

    pub async fn get_documents_count(&self, event_id: i32) -> anyhow::Result<i64> {
        self.query_wrapper(move |conn| {
            schema::documents::table
                .filter(schema::documents::event_id.eq(event_id))
                .count()
                .get_result::<i64>(conn)
        })
        .await
    }

    pub async fn get_publications_count(&self, event_id: i32) -> anyhow::Result<i64> {
        self.query_wrapper(move |conn| {
            schema::publications::table
                .filter(schema::publications::event_id.eq(event_id))
                .count()
                .get_result::<i64>(conn)
        })
        .await
    }
    pub async fn get_messages_with_username_and_team_by_event_id(
        &self,
        event_id: i32,
    ) -> anyhow::Result<Vec<(models::Message, String, Option<String>)>> {
        self.query_wrapper(move |conn| {
            let results = schema::messages::table
                .inner_join(
                    schema::users::table.on(schema::messages::user_id.eq(schema::users::id)),
                )
                .left_join(
                    schema::teams::table.on(schema::teams::user_id
                        .eq(schema::messages::user_id)
                        .and(schema::teams::event_id.eq(event_id))),
                )
                .filter(schema::messages::event_id.eq(event_id))
                .select((
                    schema::messages::all_columns,
                    schema::users::username,
                    schema::teams::name.nullable(),
                ))
                .load::<(models::Message, String, Option<String>)>(conn)?;

            Ok(results)
        })
        .await
    }

    pub async fn create_fqa(&self, new_fqa: models::Fqa) -> anyhow::Result<i32> {
        self.query_wrapper(move |conn| {
            diesel::insert_into(schema::fqa::table)
                .values(&new_fqa)
                .returning(schema::fqa::id)
                .get_result(conn)
        })
        .await
    }

    pub async fn get_fqa_by_event_id(&self, event_id: i32) -> anyhow::Result<Vec<models::Fqa>> {
        self.query_wrapper(move |conn| {
            schema::fqa::table
                .filter(schema::fqa::event_id.eq(event_id))
                .load(conn)
        })
        .await
    }

    pub async fn delete_fqa_by_id(&self, id: i32) -> anyhow::Result<()> {
        self.query_wrapper(move |conn| diesel::delete(schema::fqa::table.find(id)).execute(conn))
            .await?;

        Ok(())
    }

    pub async fn get_email_extensions_from_universities(
        &self,
    ) -> anyhow::Result<collections::HashSet<String>> {
        self.query_wrapper(move |conn| {
            schema::universities::table
                .select(schema::universities::email_extension)
                .distinct()
                .load::<String>(conn)
        })
        .await
        .map(|extensions| extensions.into_iter().collect())
    }

    pub async fn get_participants_by_event_id(&self, event_id: i32) -> anyhow::Result<i64> {
        self.query_wrapper(move |conn| {
            schema::event_participants::table
                .filter(schema::event_participants::event_id.eq(event_id))
                .count()
                .get_result::<i64>(conn)
        })
        .await
    }

    pub async fn get_quota_by_event_id(&self, event_id: i32) -> anyhow::Result<i64> {
        self.query_wrapper(move |conn| {
            schema::university_quota::table
                .filter(schema::university_quota::event_id.eq(event_id))
                .select(diesel::dsl::sum(schema::university_quota::quota))
                .get_result::<Option<i64>>(conn)
        })
        .await
        .map(|quota| quota.unwrap_or(0))
    }

    pub async fn update_user(&self, new_user: models::User) -> anyhow::Result<()> {
        if let Some(id) = new_user.id {
            self.query_wrapper(move |conn| {
                diesel::update(schema::users::table.find(id))
                    .set(&new_user)
                    .execute(conn)
            })
            .await?;
        }

        Ok(())
    }

    pub async fn is_user_in_event(&self, user_id: i32, event_id: i32) -> anyhow::Result<bool> {
        self.query_wrapper(move |conn| {
            let result = schema::event_participants::table
                .filter(schema::event_participants::user_id.eq(user_id))
                .filter(schema::event_participants::event_id.eq(event_id))
                .first::<models::EventParticipant>(conn)
                .optional()?;

            Ok(result.is_some())
        })
        .await
    }

    pub async fn register_to_event(
        &self,
        event_participant: models::EventParticipant,
    ) -> anyhow::Result<()> {
        self.query_wrapper(move |conn| {
            diesel::insert_into(schema::event_participants::table)
                .values(&event_participant)
                .execute(conn)
        })
        .await?;

        Ok(())
    }

    pub async fn get_participants_by_email_extension(
        &self,
        event_id: i32,
        email_extension: String,
    ) -> anyhow::Result<i64> {
        self.query_wrapper(move |conn| {
            schema::event_participants::table
                .inner_join(schema::users::table)
                .filter(schema::event_participants::event_id.eq(event_id))
                .filter(schema::users::email.like(format!("%@{}", email_extension)))
                .count()
                .get_result::<i64>(conn)
        })
        .await
    }

    pub async fn get_quota_by_email_extension(
        &self,
        event_id: i32,
        email_extension: String,
    ) -> anyhow::Result<Option<i32>> {
        self.query_wrapper(move |conn| {
            schema::university_quota::table
                .inner_join(schema::universities::table)
                .filter(schema::university_quota::event_id.eq(event_id))
                .filter(schema::universities::email_extension.eq(email_extension))
                .select(schema::university_quota::quota)
                .first(conn)
                .optional()
        })
        .await
    }

    pub async fn is_quota_available(
        &self,
        event_id: i32,
        email_extension: String,
    ) -> anyhow::Result<bool> {
        let participants = self
            .get_participants_by_email_extension(event_id, email_extension.clone())
            .await?;
        let quota = self
            .get_quota_by_email_extension(event_id, email_extension)
            .await?;

        if let Some(quota) = quota {
            Ok(participants < quota as i64)
        } else {
            Ok(false)
        }
    }

    pub async fn get_email_extension_by_user_id(
        &self,
        user_id: i32,
    ) -> anyhow::Result<Option<String>> {
        let user = self.get_user_by_id(user_id).await?;
        if let Some(user) = user {
            let email = user.email;
            let email_extension = email.split('@').collect::<Vec<&str>>();
            Ok(email_extension.last().map(|s| s.to_string()))
        } else {
            Ok(None)
        }
    }

    pub async fn is_event_not_started(&self, event_id: i32) -> anyhow::Result<bool> {
        self.query_wrapper(move |conn| {
            let event = schema::events::table
                .filter(schema::events::id.eq(event_id))
                .filter(schema::events::start_date.gt(chrono::Local::now().naive_local()))
                .first::<models::Event>(conn)
                .optional()?;

            Ok(event.is_some())
        })
        .await
    }

    pub async fn is_event_not_ended(&self, event_id: i32) -> anyhow::Result<bool> {
        self.query_wrapper(move |conn| {
            let event = schema::events::table
                .filter(schema::events::id.eq(event_id))
                .filter(schema::events::end_date.gt(chrono::Local::now().naive_local()))
                .first::<models::Event>(conn)
                .optional()?;

            Ok(event.is_some())
        })
        .await
    }

    pub async fn create_team(&self, mut new_team: models::Team) -> anyhow::Result<models::Team> {
        self.query_wrapper(move |conn| {
            let team = schema::teams::table
                .filter(schema::teams::event_id.eq(new_team.event_id))
                .filter(schema::teams::user_id.eq(new_team.user_id))
                .first::<models::Team>(conn)
                .optional()?;

            if team.is_none() {
                let team_id = diesel::insert_into(schema::teams::table)
                    .values(&new_team)
                    .returning(schema::teams::id)
                    .get_result(conn)?;

                diesel::insert_into(schema::members::table)
                    .values(&models::Member {
                        id: None,
                        team_id,
                        user_id: new_team.user_id,
                    })
                    .execute(conn)?;

                new_team.id = Some(team_id);
                Ok(new_team)
            } else {
                Err(diesel::result::Error::RollbackTransaction)
            }
        })
        .await
    }

    pub async fn get_teams_by_event_id(
        &self,
        event_id: i32,
    ) -> anyhow::Result<Vec<(i32, String, bool, i64)>> {
        self.query_wrapper(move |conn| {
            let teams = schema::teams::table
                .filter(schema::teams::event_id.eq(event_id))
                .select((
                    schema::teams::id.nullable(),
                    schema::teams::name,
                    schema::teams::code.nullable(),
                ))
                .load::<(Option<i32>, String, Option<i32>)>(conn)?;

            let mut result = Vec::new();

            for (id, name, code) in teams {
                if let Some(id) = id {
                    let members = schema::members::table
                        .filter(schema::members::team_id.eq(id))
                        .count()
                        .get_result::<i64>(conn)?;

                    let code = code.is_some();
                    result.push((id, name, code, members));
                }
            }

            Ok(result)
        })
        .await
    }

    pub async fn get_team_quota_by_event_id(&self, event_id: i32) -> anyhow::Result<i32> {
        self.query_wrapper(move |conn| {
            schema::events::table
                .filter(schema::events::id.eq(event_id))
                .select(schema::events::quota_per_team)
                .first(conn)
        })
        .await
    }

    pub async fn get_participant_details_by_user_id(
        &self,
        user_id: i32,
        event_id: i32,
    ) -> anyhow::Result<Option<models::ParticipantDetails>> {
        self.query_wrapper(move |conn| {
            let team = schema::teams::table
                .filter(schema::teams::event_id.eq(event_id))
                .filter(schema::teams::user_id.eq(user_id))
                .first::<models::Team>(conn)
                .optional()?;

            let is_leader = if let Some(team) = &team {
                team.user_id == user_id
            } else {
                false
            };

            if let Some(team) = team {
                Ok(Some(models::ParticipantDetails {
                    has_team: true,
                    is_leader,
                    team_id: team.id,
                }))
            } else {
                let member = schema::members::table
                    .filter(schema::members::user_id.eq(user_id))
                    .first::<models::Member>(conn)
                    .optional()?;

                if let Some(member) = member {
                    Ok(Some(models::ParticipantDetails {
                        has_team: true,
                        is_leader: false,
                        team_id: Some(member.team_id),
                    }))
                } else {
                    Ok(Some(models::ParticipantDetails {
                        has_team: false,
                        is_leader: false,
                        team_id: None,
                    }))
                }
            }
        })
        .await
    }

    pub async fn delete_team_by_user_id(&self, user_id: i32, event_id: i32) -> anyhow::Result<()> {
        self.query_wrapper(move |conn| {
            let team = schema::teams::table
                .filter(schema::teams::event_id.eq(event_id))
                .filter(schema::teams::user_id.eq(user_id)) // user_id is the leader
                .first::<models::Team>(conn)?;

            let team_id = team.id;

            if let Some(team_id) = team_id {
                diesel::delete(schema::members::table.filter(schema::members::team_id.eq(team_id)))
                    .execute(conn)?;

                diesel::delete(schema::teams::table.find(team_id)).execute(conn)?;
            }

            Ok(())
        })
        .await?;

        Ok(())
    }

    pub async fn delete_team_by_id(&self, team_id: i32) -> anyhow::Result<()> {
        let mut project = self.get_project_by_team_id(team_id).await?;

        if let Some(ref mut project) = &mut project {
            let service = ProjectsService(&self);
            service.transform(project);
        }

        self.query_wrapper(move |conn| {
            diesel::delete(schema::members::table.filter(schema::members::team_id.eq(team_id)))
                .execute(conn)?;

            if let Some(project) = project {
                if !project.zip.is_empty() {
                    let base_path = std::path::Path::new("./private/projects")
                        .canonicalize()
                        .expect("Failed to canonicalize base path");

                    let filename = format!("./{}", project.zip);
                    let path = std::path::Path::new(&filename);

                    if let Ok(normalized_path) = path.canonicalize() {
                        if normalized_path.starts_with(&base_path) {
                            if let Err(_) = std::fs::remove_file(&normalized_path) {
                                log::error!("Failed to remove file: {:?}", normalized_path);
                            } else {
                                log::info!("Successfully removed file: {:?}", normalized_path);
                            }
                        } else {
                            log::warn!(
                                "Attempt to delete file outside of allowed directory: {:?}",
                                normalized_path
                            );
                        }
                    } else {
                        log::error!("Failed to normalize path: {}", filename);
                    }
                }
            }

            diesel::delete(schema::projects::table.filter(schema::projects::team_id.eq(team_id)))
                .execute(conn)?;

            diesel::delete(schema::teams::table.find(team_id)).execute(conn)
        })
        .await?;

        Ok(())
    }

    pub async fn join_team(&self, team_id: i32, user_id: i32) -> anyhow::Result<models::Member> {
        self.query_wrapper(move |conn| {
            let member = schema::members::table
                .filter(schema::members::team_id.eq(team_id))
                .filter(schema::members::user_id.eq(user_id))
                .first::<models::Member>(conn)
                .optional()?;

            if member.is_none() {
                let new_member = models::Member {
                    id: None,
                    team_id,
                    user_id,
                };

                diesel::insert_into(schema::members::table)
                    .values(&new_member)
                    .execute(conn)?;

                Ok(new_member)
            } else {
                Err(diesel::result::Error::RollbackTransaction)
            }
        })
        .await
    }

    pub async fn is_not_member_of_any_team(
        &self,
        user_id: i32,
        event_id: i32,
    ) -> anyhow::Result<bool> {
        self.query_wrapper(move |conn| {
            let member = schema::members::table
                .inner_join(schema::teams::table)
                .filter(schema::teams::event_id.eq(event_id))
                .filter(schema::members::user_id.eq(user_id))
                .first::<(models::Member, models::Team)>(conn)
                .optional()?;

            Ok(member.is_none())
        })
        .await
    }

    pub async fn is_team_in_event(&self, team_id: i32, event_id: i32) -> anyhow::Result<bool> {
        self.query_wrapper(move |conn| {
            let result = schema::teams::table
                .filter(schema::teams::id.eq(team_id))
                .filter(schema::teams::event_id.eq(event_id))
                .first::<models::Team>(conn)
                .optional()?;

            Ok(result.is_some())
        })
        .await
    }

    pub async fn get_team_code(&self, team_id: i32) -> anyhow::Result<Option<i32>> {
        self.query_wrapper(move |conn| {
            let team = schema::teams::table
                .filter(schema::teams::id.eq(team_id))
                .first::<models::Team>(conn)
                .optional()?;

            Ok(team.map(|team| team.code).flatten())
        })
        .await
    }

    pub async fn get_team_code_by_user_id(
        &self,
        user_id: i32,
        event_id: i32,
    ) -> anyhow::Result<Option<i32>> {
        self.query_wrapper(move |conn| {
            let team = schema::teams::table
                .filter(schema::teams::event_id.eq(event_id))
                .filter(schema::teams::user_id.eq(user_id))
                .first::<models::Team>(conn)
                .optional()?;

            Ok(team.map(|team| team.code).flatten())
        })
        .await
    }

    pub async fn get_team_by_id(&self, team_id: i32) -> anyhow::Result<Option<models::Team>> {
        self.query_wrapper(move |conn| schema::teams::table.find(team_id).first(conn).optional())
            .await
    }

    pub async fn get_members_by_team_id(
        &self,
        team_id: i32,
    ) -> anyhow::Result<Vec<models::Member>> {
        self.query_wrapper(move |conn| {
            schema::members::table
                .filter(schema::members::team_id.eq(team_id))
                .load(conn)
        })
        .await
    }

    pub async fn get_members_with_leader_by_team_id(
        &self,
        team_id: i32,
    ) -> anyhow::Result<((Option<i32>, String), Vec<(Option<i32>, String)>)> {
        self.query_wrapper(move |conn| {
            let team = schema::teams::table
                .filter(schema::teams::id.eq(team_id))
                .first::<models::Team>(conn)?;

            let leader = schema::users::table
                .filter(schema::users::id.eq(team.user_id))
                .select((schema::users::id.nullable(), schema::users::username))
                .first::<(Option<i32>, String)>(conn)?;

            let members = schema::members::table
                .inner_join(schema::users::table)
                .filter(schema::members::team_id.eq(team_id))
                .select((schema::users::id.nullable(), schema::users::username))
                .load::<(Option<i32>, String)>(conn)?;

            Ok((leader, members))
        })
        .await
    }

    pub async fn is_team_quota_available(
        &self,
        event_id: i32,
        team_id: i32,
    ) -> anyhow::Result<bool> {
        let team_quota = self.get_team_quota_by_event_id(event_id).await?;
        let members = self.get_members_by_team_id(team_id).await?;

        Ok(members.len() < team_quota as usize)
    }

    pub async fn get_teams_names_by_event_id(&self, event_id: i32) -> anyhow::Result<Vec<String>> {
        self.query_wrapper(move |conn| {
            schema::teams::table
                .filter(schema::teams::event_id.eq(event_id))
                .select(schema::teams::name)
                .load(conn)
        })
        .await
    }

    pub async fn leave_team(&self, team_id: i32, user_id: i32) -> anyhow::Result<()> {
        self.query_wrapper(move |conn| {
            let team = schema::teams::table
                .filter(schema::teams::id.eq(team_id))
                .first::<models::Team>(conn)?;

            if team.user_id != user_id {
                diesel::delete(
                    schema::members::table
                        .filter(schema::members::team_id.eq(team_id))
                        .filter(schema::members::user_id.eq(user_id)),
                )
                .execute(conn)?;
            }

            Ok(())
        })
        .await?;

        Ok(())
    }

    pub async fn get_info_user_by_id(&self, id: i32) -> anyhow::Result<(Option<i32>, String)> {
        self.query_wrapper(move |conn| {
            schema::users::table
                .filter(schema::users::id.eq(id))
                .select((schema::users::id.nullable(), schema::users::username))
                .first(conn)
        })
        .await
    }

    pub async fn update_team_name(
        &self,
        user_id: i32,
        event_id: i32,
        new_name: String,
    ) -> anyhow::Result<()> {
        self.query_wrapper(move |conn| {
            let team = schema::teams::table
                .filter(schema::teams::event_id.eq(event_id))
                .filter(schema::teams::user_id.eq(user_id))
                .first::<models::Team>(conn)?;

            if let Some(id) = team.id {
                diesel::update(schema::teams::table.find(id))
                    .set(schema::teams::name.eq(new_name))
                    .execute(conn)?;
            }

            Ok(())
        })
        .await?;

        Ok(())
    }

    pub async fn update_team_code(
        &self,
        user_id: i32,
        event_id: i32,
        new_code: Option<i32>,
    ) -> anyhow::Result<()> {
        self.query_wrapper(move |conn| {
            let team = schema::teams::table
                .filter(schema::teams::event_id.eq(event_id))
                .filter(schema::teams::user_id.eq(user_id))
                .first::<models::Team>(conn)?;

            if let Some(id) = team.id {
                diesel::update(schema::teams::table.find(id))
                    .set(schema::teams::code.eq(new_code))
                    .execute(conn)?;
            }

            Ok(())
        })
        .await?;

        Ok(())
    }

    pub async fn update_team_description(
        &self,
        user_id: i32,
        event_id: i32,
        new_description: String,
    ) -> anyhow::Result<()> {
        self.query_wrapper(move |conn| {
            let team = schema::teams::table
                .filter(schema::teams::event_id.eq(event_id))
                .filter(schema::teams::user_id.eq(user_id))
                .first::<models::Team>(conn)?;

            if let Some(id) = team.id {
                diesel::update(schema::teams::table.find(id))
                    .set(schema::teams::description.eq(new_description))
                    .execute(conn)?;
            }

            Ok(())
        })
        .await?;

        Ok(())
    }

    pub async fn delete_member_by_user_id(
        &self,
        user_id: i32,
        member_id: i32,
        event_id: i32,
    ) -> anyhow::Result<()> {
        self.query_wrapper(move |conn| {
            let team = schema::teams::table
                .filter(schema::teams::event_id.eq(event_id))
                .filter(schema::teams::user_id.eq(user_id))
                .first::<models::Team>(conn)?;

            if let Some(id) = team.id {
                diesel::delete(
                    schema::members::table
                        .filter(schema::members::team_id.eq(id))
                        .filter(schema::members::user_id.eq(member_id)),
                )
                .execute(conn)?;
            }

            Ok(())
        })
        .await?;

        Ok(())
    }

    pub async fn get_participants_with_user_by_event_id(
        &self,
        event_id: i32,
    ) -> anyhow::Result<Vec<(models::User, models::EventParticipant, Option<String>)>> {
        self.query_wrapper(move |conn| {
            schema::users::table
                .inner_join(
                    schema::event_participants::table.on(schema::event_participants::user_id
                        .eq(schema::users::id)
                        .and(schema::event_participants::event_id.eq(event_id))),
                )
                .left_join(
                    schema::members::table.on(schema::members::user_id.eq(schema::users::id)),
                )
                .left_join(schema::teams::table.on(schema::teams::id.eq(schema::members::team_id)))
                .select((
                    schema::users::all_columns,
                    schema::event_participants::all_columns,
                    schema::teams::name.nullable(),
                ))
                .load(conn)
        })
        .await
    }

    pub async fn update_participant_confirmed(
        &self,
        event_id: i32,
        user_id: i32,
        confirmation: bool,
    ) -> anyhow::Result<()> {
        self.query_wrapper(move |conn| {
            diesel::update(
                schema::event_participants::table
                    .filter(schema::event_participants::event_id.eq(event_id))
                    .filter(schema::event_participants::user_id.eq(user_id)),
            )
            .set(schema::event_participants::confirmed.eq(confirmation))
            .execute(conn)
        })
        .await?;

        Ok(())
    }

    pub async fn create_message(&self, new_message: models::Message) -> anyhow::Result<i32> {
        self.query_wrapper(move |conn| {
            let count = schema::messages::table
                .filter(schema::messages::event_id.eq(new_message.event_id))
                .filter(schema::messages::user_id.eq(new_message.user_id))
                .count()
                .get_result::<i64>(conn)?;

            if count >= 10 {
                return Err(diesel::result::Error::RollbackTransaction);
            }

            diesel::insert_into(schema::messages::table)
                .values(&new_message)
                .returning(schema::messages::id)
                .get_result(conn)
        })
        .await
    }

    pub async fn get_sponsors_with_id_and_name_by_event_id(
        &self,
        event_id: i32,
    ) -> anyhow::Result<Vec<(Option<i32>, String)>> {
        self.query_wrapper(move |conn| {
            schema::event_sponsors::table
                .inner_join(schema::sponsors::table)
                .filter(schema::event_sponsors::event_id.eq(event_id))
                .select((schema::sponsors::id.nullable(), schema::sponsors::name))
                .load(conn)
        })
        .await
    }

    pub async fn get_end_date_by_event_id(
        &self,
        event_id: i32,
    ) -> anyhow::Result<chrono::NaiveDateTime> {
        self.query_wrapper(move |conn| {
            schema::events::table
                .filter(schema::events::id.eq(event_id))
                .select(schema::events::end_date)
                .first(conn)
        })
        .await
    }

    pub async fn get_event_info_by_id(
        &self,
        event_id: i32,
    ) -> anyhow::Result<(String, chrono::NaiveDateTime)> {
        self.query_wrapper(move |conn| {
            schema::events::table
                .filter(schema::events::id.eq(event_id))
                .select((schema::events::title, schema::events::end_date))
                .first(conn)
        })
        .await
    }

    pub async fn create_project(&self, new_project: models::Project) -> anyhow::Result<i32> {
        self.query_wrapper(move |conn| {
            diesel::insert_into(schema::projects::table)
                .values(&new_project)
                .returning(schema::projects::id)
                .get_result(conn)
        })
        .await
    }

    pub async fn delete_project_by_id(&self, id: i32) -> anyhow::Result<models::Project> {
        self.query_wrapper(move |conn| {
            let project = schema::projects::table.find(id).first(conn)?;
            diesel::delete(schema::projects::table.find(id)).execute(conn)?;
            Ok(project)
        })
        .await
    }

    pub async fn get_project_by_id(&self, id: i32) -> anyhow::Result<Option<models::Project>> {
        self.query_wrapper(move |conn| schema::projects::table.find(id).first(conn).optional())
            .await
    }

    pub async fn get_team_id_by_user_id_and_event_id(
        &self,
        user_id: i32,
        event_id: i32,
    ) -> anyhow::Result<Option<i32>> {
        self.query_wrapper(move |conn| {
            schema::teams::table
                .filter(schema::teams::user_id.eq(user_id))
                .filter(schema::teams::event_id.eq(event_id))
                .select(schema::teams::id)
                .first(conn)
                .optional()
        })
        .await
    }

    pub async fn is_sponsor_available(
        &self,
        sponsor_id: i32,
        event_id: i32,
    ) -> anyhow::Result<bool> {
        self.query_wrapper(move |conn| {
            let result = schema::event_sponsors::table
                .filter(schema::event_sponsors::event_id.eq(event_id))
                .filter(schema::event_sponsors::sponsor_id.eq(sponsor_id))
                .first::<models::EventSponsor>(conn)
                .optional()?;

            Ok(result.is_some())
        })
        .await
    }

    pub async fn exists_project_by_team_id(&self, team_id: i32) -> anyhow::Result<bool> {
        self.query_wrapper(move |conn| {
            let result = schema::projects::table
                .filter(schema::projects::team_id.eq(team_id))
                .first::<models::Project>(conn)
                .optional()?;

            Ok(result.is_some())
        })
        .await
    }

    pub async fn get_project_by_user_id_and_event_id(
        &self,
        user_id: i32,
        event_id: i32,
    ) -> anyhow::Result<Option<models::Project>> {
        self.query_wrapper(move |conn| {
            let team = schema::teams::table
                .filter(schema::teams::user_id.eq(user_id))
                .filter(schema::teams::event_id.eq(event_id))
                .first::<models::Team>(conn)
                .optional()?;

            if let Some(team) = team {
                if let Some(team_id) = team.id {
                    return schema::projects::table
                        .filter(schema::projects::team_id.eq(team_id))
                        .first(conn)
                        .optional();
                }
            }

            Ok(None)
        })
        .await
    }

    pub async fn get_project_by_team_id(
        &self,
        team_id: i32,
    ) -> anyhow::Result<Option<models::Project>> {
        self.query_wrapper(move |conn| {
            schema::projects::table
                .filter(schema::projects::team_id.eq(team_id))
                .first(conn)
                .optional()
        })
        .await
    }

    pub async fn update_project_by_team_id(
        &self,
        team_id: i32,
        new_project: models::Project,
    ) -> anyhow::Result<()> {
        self.query_wrapper(move |conn| {
            let project = schema::projects::table
                .filter(schema::projects::team_id.eq(team_id))
                .first::<models::Project>(conn)?;

            if let Some(id) = project.id {
                diesel::update(schema::projects::table.find(id))
                    .set(&new_project)
                    .execute(conn)?;
            }

            Ok(())
        })
        .await?;

        Ok(())
    }

    pub async fn get_projects_by_user_id(
        &self,
        user_id: i32,
    ) -> anyhow::Result<Vec<models::Project>> {
        self.query_wrapper(move |conn| {
            let teams = schema::teams::table
                .filter(schema::teams::user_id.eq(user_id))
                .select(schema::teams::id)
                .load::<i32>(conn)?;

            let mut projects = Vec::new();

            for team_id in teams {
                let project = schema::projects::table
                    .filter(schema::projects::team_id.eq(team_id))
                    .first::<models::Project>(conn)
                    .optional()?;

                if let Some(project) = project {
                    projects.push(project);
                }
            }

            Ok(projects)
        })
        .await
    }

    pub async fn create_image(&self, new_image: models::Image) -> anyhow::Result<i32> {
        self.query_wrapper(move |conn| {
            diesel::insert_into(schema::gallery::table)
                .values(&new_image)
                .returning(schema::gallery::id)
                .get_result(conn)
        })
        .await
    }

    pub async fn delete_image_by_id(&self, id: i32) -> anyhow::Result<models::Image> {
        self.query_wrapper(move |conn| {
            let image = schema::gallery::table.find(id).first(conn)?;
            diesel::delete(schema::gallery::table.find(id)).execute(conn)?;
            Ok(image)
        })
        .await
    }

    pub async fn get_image_by_id(&self, id: i32) -> anyhow::Result<Option<models::Image>> {
        self.query_wrapper(move |conn| schema::gallery::table.find(id).first(conn).optional())
            .await
    }

    pub async fn get_images_by_event_id(
        &self,
        event_id: i32,
    ) -> anyhow::Result<Vec<models::Image>> {
        self.query_wrapper(move |conn| {
            schema::gallery::table
                .filter(schema::gallery::event_id.eq(event_id))
                .load(conn)
        })
        .await
    }

    pub async fn get_events_with_images(
        &self,
    ) -> anyhow::Result<Vec<(String, Vec<models::Image>)>> {
        self.query_wrapper(move |conn| {
            let events = schema::events::table
                .select((schema::events::id, schema::events::title))
                .load::<(i32, String)>(conn)?;

            let mut result = Vec::new();
            for (event_id, event_title) in events {
                let images = schema::gallery::table
                    .filter(schema::gallery::event_id.eq(event_id))
                    .load::<models::Image>(conn)?;

                result.push((event_title, images));
            }

            Ok(result)
        })
        .await
    }

    pub async fn get_teams_with_project_and_members_by_event_id(
        &self,
        event_id: i32,
    ) -> anyhow::Result<
        Vec<(
            models::Team,
            Option<(models::Project, String)>,
            Vec<(String, String)>,
        )>,
    > {
        self.query_wrapper(move |conn| {
            let teams = schema::teams::table
                .filter(schema::teams::event_id.eq(event_id))
                .load::<models::Team>(conn)?;

            let mut result = Vec::new();
            for team in teams {
                if let Some(team_id) = team.id {
                    let project = schema::projects::table
                        .filter(schema::projects::team_id.eq(team_id))
                        .first::<models::Project>(conn)
                        .optional()?;

                    let project = if let Some(project) = project {
                        let sponsor = schema::sponsors::table
                            .filter(schema::sponsors::id.eq(project.sponsor_id))
                            .select(schema::sponsors::name)
                            .first::<String>(conn)?;

                        Some((project, sponsor))
                    } else {
                        None
                    };

                    let members = schema::members::table
                        .inner_join(schema::users::table)
                        .filter(schema::members::team_id.eq(team_id))
                        .select((
                            schema::users::firstname
                                .concat(" ")
                                .concat(schema::users::lastname),
                            schema::users::personal_email,
                        ))
                        .load::<(String, String)>(conn)?;

                    result.push((team, project, members));
                }
            }

            Ok(result)
        })
        .await
    }
}
