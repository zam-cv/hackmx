use crate::database::Database;
use actix_web::{get, web, HttpResponse, Responder};

#[get("/all/{event_id}")]
async fn get_messages(
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> impl Responder {
    match database
        .get_messages_with_username_and_team_by_event_id(event_id.into_inner())
        .await
    {
        Ok(messages) => HttpResponse::Ok().json(messages),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

pub fn routes() -> actix_web::Scope {
    web::scope("/message")
      .service(get_messages)
}
