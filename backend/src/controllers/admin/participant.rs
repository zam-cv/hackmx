use crate::database::Database;
use actix_web::{post, web, HttpResponse, Responder};

#[post("update-confirmed/{event_id}/{user_id}")]
async fn update_participant_confirmed(
    database: web::Data<Database>,
    path: web::Path<(i32, i32)>,
    body: String,
) -> impl Responder {
    let (event_id, user_id) = path.into_inner();
    if let Ok(body) = body.parse::<bool>() {
        match database
            .update_participant_confirmed(event_id, user_id, body)
            .await
        {
            Ok(_) => HttpResponse::Ok().finish(),
            Err(_) => HttpResponse::InternalServerError().finish(),
        }
    } else {
        HttpResponse::BadRequest().finish()
    }
}

pub fn routes() -> actix_web::Scope {
    web::scope("/participant")
      .service(update_participant_confirmed)
}
