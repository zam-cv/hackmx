use crate::{database::Database, models};
use actix_web::{delete, get, post, web, HttpResponse, Responder};

#[post("/add/{event_id}/{sponsor_id}")]
async fn add_sponsor(database: web::Data<Database>, path: web::Path<(i32, i32)>) -> impl Responder {
    let (event_id, sponsor_id) = path.into_inner();

    match database.add_sponsor_to_event(event_id, sponsor_id).await {
        Ok(_) => match database.get_sponsor_by_id(sponsor_id).await {
            Ok(sponsor) => HttpResponse::Ok().json(sponsor),
            Err(_) => HttpResponse::InternalServerError().finish(),
        },
        Err(_) => return HttpResponse::InternalServerError().finish(),
    }
}

#[delete("/delete/{event_id}/{sponsor_id}")]
async fn delete_sponsor(
    database: web::Data<Database>,
    path: web::Path<(i32, i32)>,
) -> impl Responder {
    let (event_id, sponsor_id) = path.into_inner();

    match database
        .delete_sponsor_from_event(event_id, sponsor_id)
        .await
    {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[delete("/delete_award/{award_id}")]
async fn delete_award(
    database: web::Data<Database>,
    award_id: web::Path<i32>,
) -> impl Responder {
    match database
        .delete_award_by_id(award_id.into_inner())
        .await
    {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[post("/add_award/{event_id}/{sponsor_id}")]
async fn add_award(
    database: web::Data<Database>,
    path: web::Path<(i32, i32)>,
    award: web::Json<models::Award>,
) -> impl Responder {
    let (event_id, sponsor_id) = path.into_inner();

    match database
        .add_award_to_sponsor(
            event_id,
            sponsor_id,
            award.into_inner(),
        )
        .await
    {
        Ok(id) => return HttpResponse::Ok().json(id),
        Err(_) => return HttpResponse::InternalServerError().finish(),
    }
}

#[get("/not_in_event/{event_id}")]
async fn get_sponsors_not_in_event(
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> impl Responder {
    match database
        .get_sponsors_not_in_event(event_id.into_inner())
        .await
    {
        Ok(sponsors) => HttpResponse::Ok().json(sponsors),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/event/{event_id}")]
async fn get_sponsors_by_event(
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> impl Responder {
    match database
        .get_sponsors_with_awards_by_event_id(event_id.into_inner())
        .await
    {
        Ok(sponsors) => HttpResponse::Ok().json(sponsors),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

pub fn routes() -> actix_web::Scope {
    web::scope("/sponsor")
        .service(add_sponsor)
        .service(delete_sponsor)
        .service(delete_award)
        .service(add_award)
        .service(get_sponsors_not_in_event)
        .service(get_sponsors_by_event)
}
