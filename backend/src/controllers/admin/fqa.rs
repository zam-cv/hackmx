use crate::{database::Database, models};
use actix_web::{delete, get, post, web, HttpResponse, Responder};
use validator::Validate;

#[post("/create/{event_id}")]
async fn create_fqa(
    database: web::Data<Database>,
    mut new_fqa: web::Json<models::Fqa>,
    event_id: web::Path<i32>,
) -> impl Responder {
    if let Err(_) = new_fqa.validate() {
        return HttpResponse::BadRequest().finish();
    }

    new_fqa.event_id = event_id.into_inner();
    match database.create_fqa(new_fqa.into_inner()).await {
        Ok(id) => HttpResponse::Ok().json(id),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/all/{event_id}")]
async fn get_fqas(database: web::Data<Database>, event_id: web::Path<i32>) -> impl Responder {
    match database.get_fqa_by_event_id(event_id.into_inner()).await {
        Ok(fqa) => HttpResponse::Ok().json(fqa),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[delete("/{id}")]
async fn delete_fqa(database: web::Data<Database>, id: web::Path<i32>) -> impl Responder {
    match database.delete_fqa_by_id(id.into_inner()).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

pub fn routes() -> actix_web::Scope {
    web::scope("/fqa")
        .service(create_fqa)
        .service(get_fqas)
        .service(delete_fqa)
}
