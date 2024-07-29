use crate::{
    config,
    database::Database,
    models,
    utils::auth::{Auth, Credentials, ExtendedAuth},
};
use actix_web::web;

pub struct UserAuth(pub Database);

impl Auth<models::User> for UserAuth {
    fn cookie_name(&self) -> &'static str {
        &config::USER_COOKIE_NAME
    }

    fn secret_key(&self) -> &'static String {
        &config::USER_SECRET_KEY
    }

    async fn get_user_by_email(&self, email: String) -> anyhow::Result<Option<models::User>> {
        self.0.get_user_by_email(email).await
    }

    async fn create_user(&self, new_user: models::User) -> anyhow::Result<i32> {
        self.0.create_user(new_user).await
    }

    async fn get_user_by_id(&self, id: i32) -> anyhow::Result<Option<models::User>> {
        self.0.get_user_by_id(id).await
    }
}

impl ExtendedAuth<models::User> for UserAuth {
    async fn extended_register(
        &self,
        mut user: web::Json<models::User>,
    ) -> actix_web::HttpResponse {
        user.firstname = user.firstname.to_lowercase();
        user.lastname = user.lastname.to_lowercase();

        match self.0.get_email_extensions_from_universities().await {
            Ok(email_extensions) => {
                let extension = user.email.split('@').collect::<Vec<&str>>();

                match extension.last() {
                    Some(extension) => {
                        if email_extensions.contains(&extension.to_string()) {
                            self.default_register(user).await
                        } else {
                            actix_web::HttpResponse::BadRequest().body("Invalid email extension")
                        }
                    }
                    None => actix_web::HttpResponse::BadRequest().body("Invalid email extension"),
                }
            }
            Err(_) => actix_web::HttpResponse::InternalServerError().finish(),
        }
    }

    async fn extended_signin(
        &self,
        credentials: web::Json<Credentials>,
    ) -> actix_web::HttpResponse {
        self.default_signin(credentials).await
    }

    async fn extended_logout(&self) -> actix_web::HttpResponse {
        self.default_logout().await
    }

    async fn extended_verify(&self, req: actix_web::HttpRequest) -> actix_web::HttpResponse {
        self.default_verify(req).await
    }
}

pub struct AdminAuth(pub Database);

impl Auth<models::Admin> for AdminAuth {
    fn cookie_name(&self) -> &'static str {
        &config::ADMIN_COOKIE_NAME
    }

    fn secret_key(&self) -> &'static String {
        &config::ADMIN_SECRET_KEY
    }

    async fn get_user_by_email(&self, email: String) -> anyhow::Result<Option<models::Admin>> {
        self.0.get_admin_by_email(email).await
    }

    async fn create_user(&self, new_user: models::Admin) -> anyhow::Result<i32> {
        self.0.create_admin(new_user).await
    }

    async fn get_user_by_id(&self, id: i32) -> anyhow::Result<Option<models::Admin>> {
        self.0.get_admin_by_id(id).await
    }
}

pub fn routes(database: Database) -> actix_web::Scope {
    let user_auth = UserAuth(database.clone());
    let admin_auth = AdminAuth(database);

    web::scope("/auth")
        .service(web::scope("/user").service(user_auth.extended_routes::<models::User>()))
        .service(web::scope("/admin").service(admin_auth.default_routes::<models::Admin>()))
}
