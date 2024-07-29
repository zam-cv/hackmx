use crate::{
    database::Database,
    models,
    utils::documents::{DocService, Upload},
};
use actix_multipart::form::{json::Json as MpJson, tempfile::TempFile, MultipartForm};
use actix_web::{delete, get, post, web, HttpResponse, Responder};
use serde::Deserialize;
use validator::Validate;

#[derive(Debug, Deserialize)]
struct Metadata {
    name: String,
}

#[derive(Debug, MultipartForm)]
pub struct UploadForm {
    #[multipart(limit = "10MB")]
    file: TempFile,
    json: MpJson<Metadata>,
}

impl Upload for UploadForm {
    fn name(&self) -> &String {
        &self.json.name
    }

    fn temp_file(self) -> TempFile {
        self.file
    }
}

pub struct DocumentsServiceForSponsors<'a>(pub &'a Database);

impl<'a> DocService<models::Sponsor, UploadForm> for DocumentsServiceForSponsors<'a> {
    fn folder(&self) -> &str {
        "uploads/sponsors"
    }

    fn prefix(&self) -> &str {
        "sponsor"
    }

    async fn db_create_document(&self, _: models::Sponsor) -> anyhow::Result<i32> {
        Err(anyhow::Error::msg("Not implemented"))
    }

    async fn db_delete_document_by_id(&self, id: i32) -> anyhow::Result<models::Sponsor> {
        self.0.update_sponsor_image(id, "".to_string()).await
    }

    async fn db_get_document_by_id(&self, id: i32) -> anyhow::Result<Option<models::Sponsor>> {
        self.0.get_sponsor_by_id(id).await
    }
}

pub struct DocumentsServiceForUniversities<'a>(pub &'a Database);

impl<'a> DocService<models::University, UploadForm> for DocumentsServiceForUniversities<'a> {
    fn folder(&self) -> &str {
        "uploads/universities"
    }

    fn prefix(&self) -> &str {
        "university"
    }

    async fn db_create_document(&self, _: models::University) -> anyhow::Result<i32> {
        Err(anyhow::Error::msg("Not implemented"))
    }

    async fn db_delete_document_by_id(&self, id: i32) -> anyhow::Result<models::University> {
        self.0.update_university_image(id, "".to_string()).await
    }

    async fn db_get_document_by_id(&self, id: i32) -> anyhow::Result<Option<models::University>> {
        self.0.get_university_by_id(id).await
    }
}

#[post("sponsor/create")]
async fn create_sponsor(database: web::Data<Database>) -> impl Responder {
    let mut new_sponsor = models::Sponsor {
        id: None,
        name: String::from("Example Sponsor"),
        image: String::from(""),
        description: String::from("This is an example sponsor."),
        email: String::from("m@example.com"),
    };

    match database.create_sponsor(new_sponsor.clone()).await {
        Ok(id) => {
            new_sponsor.id = Some(id);
            HttpResponse::Ok().json(new_sponsor)
        }
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[post("sponsor/update/image/{id}")]
async fn update_sponsor_image(
    database: web::Data<Database>,
    id: web::Path<i32>,
    MultipartForm(form): MultipartForm<UploadForm>,
) -> impl Responder {
    let service = DocumentsServiceForSponsors(&database);
    let id = id.into_inner();
    let name = form.json.name.clone();

    if let Ok(mut doc) = service.update_file(id.clone(), form).await {
        match database.update_sponsor_image(id, name.clone()).await {
            Ok(_) => {
                doc.id = Some(id);
                doc.image = name;
                service.transform(&mut doc);
                HttpResponse::Ok().json(doc)
            }
            Err(_) => HttpResponse::InternalServerError().finish(),
        }
    } else {
        HttpResponse::BadRequest().finish()
    }
}

#[delete("sponsor/delete/image/{id}")]
async fn delete_sponsor_image(database: web::Data<Database>, id: web::Path<i32>) -> impl Responder {
    let service = DocumentsServiceForSponsors(&database);

    if let Ok(_) = service.delete_file(id.into_inner()).await {
        HttpResponse::Ok().finish()
    } else {
        HttpResponse::InternalServerError().finish()
    }
}

#[post("sponsor/{id}/update")]
async fn update_sponsor(
    database: web::Data<Database>,
    id: web::Path<i32>,
    mut sponsor: web::Json<models::Sponsor>,
) -> impl Responder {
    if let Err(_) = sponsor.validate() {
        return HttpResponse::BadRequest().finish();
    }

    let id = id.into_inner();
    sponsor.id = Some(id.clone());
    let mut new_sponsor = sponsor.into_inner();

    match database.get_sponsor_image_by_id(id).await {
        Ok(Some(image)) => {
            new_sponsor.image = image;
        }
        _ => {
            return HttpResponse::InternalServerError().finish();
        }
    };

    match database.update_sponsor(new_sponsor).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[delete("sponsor/{id}")]
async fn delete_sponsor(database: web::Data<Database>, id: web::Path<i32>) -> impl Responder {
    let id = id.into_inner();
    let service = DocumentsServiceForSponsors(&database);

    if let Err(_) = service.delete_file(id.clone()).await {
        return HttpResponse::InternalServerError().finish();
    };

    match database.delete_sponsor_by_id(id).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("sponsor/all")]
async fn get_sponsors(database: web::Data<Database>) -> impl Responder {
    match database.get_sponsors().await {
        Ok(mut sponsors) => {
            let service = DocumentsServiceForSponsors(&database);
            service.transform_all(&mut sponsors);
            HttpResponse::Ok().json(sponsors)
        }
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[post("university/create")]
async fn create_university(database: web::Data<Database>) -> impl Responder {
    let mut new_university = models::University {
        id: None,
        name: String::from("Example University"),
        image: String::from(""),
        description: String::from("This is an example university."),
        email_extension: String::from("example.com"),
    };

    match database.create_university(new_university.clone()).await {
        Ok(id) => {
            new_university.id = Some(id);
            HttpResponse::Ok().json(new_university)
        }
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[post("university/{id}/update")]
async fn update_university(
    database: web::Data<Database>,
    id: web::Path<i32>,
    mut university: web::Json<models::University>,
) -> impl Responder {
    if let Err(_) = university.validate() {
        return HttpResponse::BadRequest().finish();
    }

    let id = id.into_inner();
    university.id = Some(id.clone());
    let mut new_university = university.into_inner();

    match database.get_university_image_by_id(id).await {
        Ok(Some(image)) => {
            new_university.image = image;
        }
        _ => {
            return HttpResponse::InternalServerError().finish();
        }
    };

    match database.update_university(new_university).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[post("university/update/image/{id}")]
async fn update_university_image(
    database: web::Data<Database>,
    id: web::Path<i32>,
    MultipartForm(form): MultipartForm<UploadForm>,
) -> impl Responder {
    let service = DocumentsServiceForUniversities(&database);
    let id = id.into_inner();
    let name = form.json.name.clone();

    if let Ok(mut doc) = service.update_file(id.clone(), form).await {
        match database.update_university_image(id, name.clone()).await {
            Ok(_) => {
                doc.id = Some(id);
                doc.image = name;
                service.transform(&mut doc);
                HttpResponse::Ok().json(doc)
            }
            Err(_) => HttpResponse::InternalServerError().finish(),
        }
    } else {
        HttpResponse::BadRequest().finish()
    }
}

#[delete("university/delete/image/{id}")]
async fn delete_university_image(
    database: web::Data<Database>,
    id: web::Path<i32>,
) -> impl Responder {
    let service = DocumentsServiceForUniversities(&database);

    if let Ok(_) = service.delete_file(id.into_inner()).await {
        HttpResponse::Ok().finish()
    } else {
        HttpResponse::InternalServerError().finish()
    }
}

#[delete("university/{id}")]
async fn delete_university(database: web::Data<Database>, id: web::Path<i32>) -> impl Responder {
    let id = id.into_inner();
    let service = DocumentsServiceForUniversities(&database);

    if let Err(_) = service.delete_file(id.clone()).await {
        return HttpResponse::InternalServerError().finish();
    };

    match database.delete_university_by_id(id).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("university/all")]
async fn get_universities(database: web::Data<Database>) -> impl Responder {
    match database.get_universities().await {
        Ok(mut universities) => {
            let service = DocumentsServiceForUniversities(&database);
            service.transform_all(&mut universities);
            HttpResponse::Ok().json(universities)
        }
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

pub fn routes() -> actix_web::Scope {
    web::scope("/storage")
        .service(create_sponsor)
        .service(update_sponsor)
        .service(update_sponsor_image)
        .service(delete_sponsor_image)
        .service(delete_sponsor)
        .service(get_sponsors)
        .service(create_university)
        .service(update_university)
        .service(update_university_image)
        .service(delete_university_image)
        .service(delete_university)
        .service(get_universities)
}
