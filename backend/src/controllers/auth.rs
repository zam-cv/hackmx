use crate::{auth::Auth, config, database::Database, models};
use actix_web::web;

pub struct UserAuth(pub Database);

impl Auth<models::User> for UserAuth {
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

pub struct AdminAuth(pub Database);

impl Auth<models::Admin> for AdminAuth {
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
        .service(web::scope("/user").service(user_auth.routes::<models::User>()))
        .service(web::scope("/admin").service(admin_auth.routes::<models::Admin>()))
}
