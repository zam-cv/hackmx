use crate::{controllers::admin::storage, database::Database, utils::documents::DocService};
use actix_web::{get, web, HttpResponse, Responder};

#[get("/all")]
async fn get_all_sponsors(database: web::Data<Database>) -> impl Responder {
    match database.get_sponsors().await {
        Ok(mut sponsors) => {
            let service = storage::DocumentsServiceForSponsors(&database);
            service.transform_all(&mut sponsors);
            HttpResponse::Ok().json(sponsors)
        }
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

pub fn routes() -> actix_web::Scope {
    web::scope("/sponsor").service(get_all_sponsors)
}
