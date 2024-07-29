use crate::{database::Database, models, utils};
use actix_web::{get, post, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use validator::Validate;

#[get("")]
async fn get_user(req: HttpRequest, database: web::Data<Database>) -> impl Responder {
    if let Some(id) = req.extensions().get::<i32>() {
        let user = database.get_user_by_id(*id).await;
        match user {
            Ok(user) => HttpResponse::Ok().json(user),
            Err(_) => HttpResponse::InternalServerError().finish(),
        }
    } else {
        HttpResponse::BadRequest().finish()
    }
}

#[post("update")]
async fn update_user(
    req: HttpRequest,
    database: web::Data<Database>,
    mut new_user: web::Json<models::User>,
) -> impl Responder {
    let mut with_password = true;

    if new_user.password.is_empty() {
        with_password = false;
        new_user.password = String::from("12345678");
    }

    if let Err(e) = new_user.validate() {
        log::error!("{}", e);
        return HttpResponse::BadRequest().finish();
    }

    if let Some(id) = req.extensions().get::<i32>() {
        let user = database.get_user_by_id(*id).await;
        match user {
            Ok(Some(user)) => {
                new_user.id = user.id;
                new_user.email = user.email;
                log::info!("Updating user: {:?}", new_user);

                if with_password {
                    if let Ok(password) = utils::hash_password(&new_user.password) {
                        new_user.password = password;
                    }
                }

                let _ = database.update_user(new_user.into_inner()).await;
                HttpResponse::Ok().finish()
            }
            _ => HttpResponse::InternalServerError().finish(),
        }
    } else {
        HttpResponse::BadRequest().finish()
    }
}

#[get("/info")]
async fn get_user_info(req: HttpRequest, database: web::Data<Database>) -> impl Responder {
    if let Some(id) = req.extensions().get::<i32>() {
        let user = database.get_info_user_by_id(*id).await;
        match user {
            Ok(user) => HttpResponse::Ok().json(user),
            Err(_) => HttpResponse::InternalServerError().finish(),
        }
    } else {
        HttpResponse::BadRequest().finish()
    }
}

pub fn routes() -> actix_web::Scope {
    web::scope("/user")
      .service(get_user)
      .service(update_user)
      .service(get_user_info)
}
