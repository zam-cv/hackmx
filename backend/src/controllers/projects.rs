use crate::{
    database::Database,
    middlewares, models,
    utils::documents::{DocService, Upload},
};
use actix_multipart::form::{json::Json as MpJson, tempfile::TempFile, MultipartForm};
use actix_web::{get, post, web, Error, HttpMessage, HttpRequest, HttpResponse, Result};
use actix_web_lab::middleware::from_fn;
use validator::Validate;

#[derive(Debug, MultipartForm)]
pub struct UploadForm {
    #[multipart(limit = "10MB")]
    file: TempFile,
    json: MpJson<models::Project>,
}

impl Upload for UploadForm {
    fn name(&self) -> &String {
        &self.json.zip
    }

    fn temp_file(self) -> TempFile {
        self.file
    }
}

pub struct ProjectsService<'a>(pub &'a Database);

impl<'a> DocService<models::Project, UploadForm> for ProjectsService<'a> {
    fn folder(&self) -> &str {
        "private/projects"
    }

    fn prefix(&self) -> &str {
        "project"
    }

    async fn db_create_document(&self, document: models::Project) -> anyhow::Result<i32> {
        self.0.create_project(document).await
    }

    async fn db_delete_document_by_id(&self, id: i32) -> anyhow::Result<models::Project> {
        self.0.delete_project_by_id(id).await
    }

    async fn db_get_document_by_id(&self, id: i32) -> anyhow::Result<Option<models::Project>> {
        self.0.get_project_by_id(id).await
    }
}

#[post("")]
async fn upload_file(
    req: HttpRequest,
    database: web::Data<Database>,
    event_id: web::Path<i32>,
    MultipartForm(mut form): MultipartForm<UploadForm>,
) -> Result<HttpResponse, Error> {
    let event_id = event_id.into_inner();

    if let Ok(sponsor_available) = database
        .is_sponsor_available(form.json.sponsor_id, event_id)
        .await
    {
        if !sponsor_available {
            return Ok(HttpResponse::BadRequest().finish());
        }
    } else {
        return Ok(HttpResponse::BadRequest().finish());
    }

    if let Some(user_id) = req.extensions().get::<i32>() {
        if let Ok(Some(team_id)) = database
            .get_team_id_by_user_id_and_event_id(*user_id, event_id)
            .await
        {
            if let Ok(exists) = database.exists_project_by_team_id(team_id).await {
                if exists {
                    return Ok(HttpResponse::BadRequest().finish());
                }
            } else {
                return Ok(HttpResponse::BadRequest().finish());
            }

            form.json.team_id = team_id;
            let document = form.json.clone();

            if let Err(_) = document.validate() {
                return Ok(HttpResponse::BadRequest().finish());
            }

            let service = ProjectsService(&database);
            if let Ok(mut doc) = service.save_file(form, document).await {
                service.transform(&mut doc);
                return Ok(HttpResponse::Ok().json(doc));
            }
        }
    }

    Ok(HttpResponse::Ok().finish())
}

#[post("")]
pub async fn update_file(
    req: HttpRequest,
    database: web::Data<Database>,
    event_id: web::Path<i32>,
    MultipartForm(mut form): MultipartForm<UploadForm>,
) -> Result<HttpResponse, Error> {
    let event_id = event_id.into_inner();

    if let Some(user_id) = req.extensions().get::<i32>() {
        if let Ok(Some(team_id)) = database
            .get_team_id_by_user_id_and_event_id(*user_id, event_id)
            .await
        {
            let name = form.json.zip.clone();
            let service = ProjectsService(&database);

            form.json.team_id = team_id;
            let mut document = form.json.clone();

            if let Ok(Some(project)) = database.get_project_by_team_id(team_id).await {
                if form.name().is_empty() {
                    document.zip = project.zip.clone();

                    if let Ok(_) = database.update_project_by_team_id(team_id, document).await {
                        return Ok(HttpResponse::Ok().json(project));
                    }
                } else {
                    if let Ok(sponsor_available) = database
                        .is_sponsor_available(form.json.sponsor_id, event_id)
                        .await
                    {
                        if !sponsor_available {
                            return Ok(HttpResponse::BadRequest().finish());
                        }
                    } else {
                        return Ok(HttpResponse::BadRequest().finish());
                    }

                    if let Some(project_id) = project.id {
                        if let Ok(mut doc) = service.update_file(project_id, form).await {
                            if let Ok(_) =
                                database.update_project_by_team_id(team_id, document).await
                            {
                                doc.zip = name;
                                service.transform(&mut doc);
                                return Ok(HttpResponse::Ok().json(doc));
                            }
                        }
                    }
                }
            }
        }
    }

    Ok(HttpResponse::Ok().finish())
}

#[get("")]
pub async fn get_project_by_event_id(
    req: HttpRequest,
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> Result<HttpResponse, Error> {
    if let Some(user_id) = req.extensions().get::<i32>() {
        if let Ok(Some(project)) = database
            .get_project_by_user_id_and_event_id(*user_id, event_id.into_inner())
            .await
        {
            return Ok(HttpResponse::Ok().json(project));
        }
    }

    return Ok(HttpResponse::Ok().finish());
}

#[get("user")]
pub async fn get_projects_by_user_id(
    req: HttpRequest,
    database: web::Data<Database>,
) -> Result<HttpResponse, Error> {
    if let Some(user_id) = req.extensions().get::<i32>() {
        if let Ok(projects) = database.get_projects_by_user_id(*user_id).await {
            return Ok(HttpResponse::Ok().json(projects));
        }
    }

    return Ok(HttpResponse::Ok().finish());
}

pub fn routes() -> actix_web::Scope {
    web::scope("/projects")
        .service(
            web::scope("upload/{event_id}")
                .wrap(from_fn(middlewares::user_in_event_middleware))
                .wrap(from_fn(middlewares::event_not_ended_middleware))
                .service(upload_file),
        )
        .service(
            web::scope("get/{event_id}")
                .wrap(from_fn(middlewares::user_in_event_middleware))
                .wrap(from_fn(middlewares::event_not_ended_middleware))
                .service(get_project_by_event_id),
        )
        .service(
            web::scope("update/{event_id}")
                .wrap(from_fn(middlewares::user_in_event_middleware))
                .wrap(from_fn(middlewares::event_not_ended_middleware))
                .service(update_file),
        )
        .service(get_projects_by_user_id)
}
