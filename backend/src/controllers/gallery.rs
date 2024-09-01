use crate::{
    controllers::admin::gallery::GalleryService, database::Database, utils::documents::DocService,
};
use actix_web::{get, web, Error, HttpResponse, Result};

#[get("")]
pub async fn get_images(database: web::Data<Database>) -> Result<HttpResponse, Error> {
    match database.get_events_with_images().await {
        Ok(mut images) => {
            let service = GalleryService(&database);

            for image in images.iter_mut() {
                service.transform_all(&mut image.1);
            }

            Ok(HttpResponse::Ok().json(images))
        }
        Err(_) => Ok(HttpResponse::InternalServerError().finish()),
    }
}

pub fn routes() -> actix_web::Scope {
    web::scope("/gallery")
        .service(get_images)
}
