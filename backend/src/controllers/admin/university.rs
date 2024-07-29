use crate::{controllers::admin::storage, database::Database, utils::documents::DocService};
use actix_web::{get, post, web, HttpResponse, Responder};

#[get("/all/{event_id}")]
async fn get_universities(
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> impl Responder {
    match database
        .get_universities_with_quota(event_id.into_inner())
        .await
    {
        Ok(mut universities) => {
            let service = storage::DocumentsServiceForUniversities(&database);
            universities.iter_mut().for_each(|(u, _)| service.transform(u));

            HttpResponse::Ok().json(universities)
        },
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[post("/add_quota/{event_id}/{university_id}")]
async fn add_quota(
    mut req_body: String,
    database: web::Data<Database>,
    path: web::Path<(i32, i32)>,
) -> impl Responder {
    let (event_id, university_id) = path.into_inner();

    if req_body.is_empty() {
        req_body = "0".to_string();
    }

    if let Ok(quota) = req_body.parse::<i32>() {
        if quota < 0 {
            return HttpResponse::BadRequest().finish();
        }

        match database
            .unsert_university_quota(event_id, university_id, quota)
            .await
        {
            Ok(_) => HttpResponse::Ok().finish(),
            Err(e) => {
                log::error!("Failed to insert university quota: {:?}", e);
                HttpResponse::InternalServerError().finish()
            }
        }
    } else {
        HttpResponse::BadRequest().finish()
    }
}

pub fn routes() -> actix_web::Scope {
    web::scope("/university")
        .service(get_universities)
        .service(add_quota)
}
