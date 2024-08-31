use crate::{
  database::Database,
  models,
  utils::documents::{DocService, Upload},
};
use actix_multipart::form::{json::Json as MpJson, tempfile::TempFile, MultipartForm};
use actix_web::{delete, get, post, web, Error, HttpResponse, Result};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct Metadata {
  name: String
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

pub struct DocumentsService<'a>(pub &'a Database);

impl<'a> DocService<models::Image, UploadForm> for DocumentsService<'a> {
  fn folder(&self) -> &str {
      "uploads/gallery"
  }

  fn prefix(&self) -> &str {
      "img"
  }

  async fn db_create_document(&self, document: models::Image) -> anyhow::Result<i32> {
      self.0.create_image(document).await
  }

  async fn db_delete_document_by_id(&self, id: i32) -> anyhow::Result<models::Image> {
      self.0.delete_image_by_id(id).await
  }

  async fn db_get_document_by_id(&self, id: i32) -> anyhow::Result<Option<models::Image>> {
      self.0.get_image_by_id(id).await
  }
}

#[post("/upload/{event_id}")]
async fn upload_file(
  database: web::Data<Database>,
  event_id: web::Path<i32>,
  MultipartForm(form): MultipartForm<UploadForm>,
) -> Result<HttpResponse, Error> {
  let document = models::Image {
      id: None,
      event_id: event_id.into_inner(),
      name: form.json.name.clone(),
  };

  let service = DocumentsService(&database);
  if let Ok(mut doc) = service.save_file(form, document).await {
      service.transform(&mut doc);
      return Ok(HttpResponse::Ok().json(doc));
  }

  Ok(HttpResponse::Ok().finish())
}

#[delete("/delete/{id}")]
async fn delete_document(database: web::Data<Database>, id: web::Path<i32>) -> HttpResponse {
  let id = id.into_inner();
  let service = DocumentsService(&database);

  if let Ok(_) = service.delete_file(id).await {
      return HttpResponse::Ok().finish();
  }

  HttpResponse::InternalServerError().finish()
}

#[get("")]
pub async fn get_documents(
  database: web::Data<Database>,
  event_id: web::Path<i32>,
) -> Result<HttpResponse, Error> {
  match database
      .get_images_by_event_id(event_id.into_inner())
      .await
  {
      Ok(mut documents) => {
          let service = DocumentsService(&database);
          service.transform_all(&mut documents);
          Ok(HttpResponse::Ok().json(documents))
      }
      Err(_) => Ok(HttpResponse::InternalServerError().finish()),
  }
}

pub fn routes() -> actix_web::Scope {
  web::scope("/gallery")
      .service(upload_file)
      .service(delete_document)
      .service(
          web::scope("/all/{event_id}")
              .service(get_documents)
      )
}
