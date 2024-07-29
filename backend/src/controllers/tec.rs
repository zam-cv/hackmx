use crate::models::types::{Campus, Major};
use actix_web::{get, web, HttpResponse, Responder};
use lazy_static::lazy_static;
use strum::IntoEnumIterator;

lazy_static! {
    pub static ref CAMPUS_LIST: Vec<Campus> = Campus::iter().collect();
    pub static ref MAJORS: Vec<Major> = Major::iter().collect();
}

#[get("/campus_list")]
async fn get_campus() -> impl Responder {
    HttpResponse::Ok().json(CAMPUS_LIST.clone())
}

#[get("/majors")]
async fn get_majors() -> impl Responder {
    HttpResponse::Ok().json(MAJORS.clone())
}

pub fn routes() -> actix_web::Scope {
    web::scope("/tec")
      .service(get_campus)
      .service(get_majors)
}
