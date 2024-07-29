use crate::{database::Database, models};
use actix_web::{delete, get, post, web, HttpResponse, Responder};
use validator::Validate;

#[post("/create/{event_id}")]
async fn create_post(
    database: web::Data<Database>,
    mut new_post: web::Json<models::Publication>,
    event_id: web::Path<i32>,
) -> impl Responder {
    if let Err(_) = new_post.validate() {
        return HttpResponse::BadRequest().finish();
    }

    new_post.event_id = event_id.into_inner();
    new_post.date = chrono::Local::now().naive_local();
    match database.create_post(new_post.into_inner()).await {
        Ok(id) => HttpResponse::Ok().json(id),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("")]
pub async fn get_posts(database: web::Data<Database>, event_id: web::Path<i32>) -> impl Responder {
    match database.get_posts_by_event_id(event_id.into_inner()).await {
        Ok(posts) => HttpResponse::Ok().json(posts),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[delete("/{id}")]
async fn delete_post(database: web::Data<Database>, id: web::Path<i32>) -> impl Responder {
    match database.delete_post_by_id(id.into_inner()).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

pub fn routes() -> actix_web::Scope {
    web::scope("/post")
        .service(create_post)
        .service(delete_post)
        .service(
            web::scope("/all/{event_id}")
                .service(get_posts)
        )
}
