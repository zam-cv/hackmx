use crate::{
    controllers::projects::DocumentsService, database::Database, utils::documents::DocService,
};
use actix_web::{get, web, Error, HttpResponse, Result};

#[get("/{event_id}")]
pub async fn get_teams(
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> Result<HttpResponse, Error> {
    match database
        .get_teams_with_project_and_members_by_event_id(event_id.into_inner())
        .await
    {
        Ok(mut teams) => {
            let service = DocumentsService(&database);

            for team in teams.iter_mut() {
                if let (_, Some((project, _)), _) = team {
                    service.transform(project);
                }
            }

            Ok(HttpResponse::Ok().json(teams))
        },
        Err(_) => Ok(HttpResponse::InternalServerError().finish()),
    }
}

pub fn routes() -> actix_web::Scope {
    web::scope("/teams").service(get_teams)
}
