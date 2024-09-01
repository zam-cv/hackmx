use crate::{database::Database, models, utils};
use lazy_static::lazy_static;
use std::env;

lazy_static! {
    pub static ref USER_SECRET_KEY: String = env::var("USER_SECRET_KEY").expect("USER_SECRET_KEY must be set");
    pub static ref ADMIN_SECRET_KEY: String = env::var("ADMIN_SECRET_KEY").expect("ADMIN_SECRET_KEY must be set");
    pub static ref USER_COOKIE_NAME: String = env::var("USER_COOKIE_NAME").expect("USER_COOKIE_NAME must be set");
    pub static ref ADMIN_COOKIE_NAME: String = env::var("ADMIN_COOKIE_NAME").expect("ADMIN_COOKIE_NAME must be set");
}

// constants
pub const TOKEN_EXPIRATION_TIME: usize = 60 * 60 * 24 * 15; // 15 days
pub const MAX_POOL_SIZE: u32 = 5; // Database connection pool size

async fn create_default_admin(database: &Database) -> anyhow::Result<()> {
    let email = env::var("ADMIN_DEFAULT_EMAIL").expect("ADMIN_DEFAULT_EMAIL must be set");
    let password = env::var("ADMIN_DEFAULT_PASSWORD").expect("ADMIN_DEFAULT_PASSWORD must be set");

    match database.get_admin_by_email(email.clone()).await? {
        Some(_) => {
            log::info!("Admin already exists");
            Ok(())
        },
        None => {
            match utils::hash_password(&password.clone()) {
                Ok(hash) => {
                    let new_admin = models::Admin {
                        id: None,
                        username: "admin".to_string(),
                        email,
                        password: hash,
                    };

                    database.create_admin(new_admin).await?;
                    log::info!("Admin created");
                    Ok(())
                },
                Err(_) => {
                    log::error!("Failed to hash password");
                    Err(anyhow::anyhow!("Failed to hash password"))
                }
            }
        }
    }
}

pub async fn database_setup(database: &Database) {
    // Create the default admin
    create_default_admin(database).await.unwrap();

    // Create the uploads directory
    std::fs::create_dir_all("./uploads").unwrap();
    std::fs::create_dir_all("./private").unwrap();

    // Create the subdirectories
    std::fs::create_dir_all("./uploads/documents").unwrap();
    std::fs::create_dir_all("./uploads/sponsors").unwrap();
    std::fs::create_dir_all("./uploads/universities").unwrap();
    std::fs::create_dir_all("./uploads/gallery").unwrap();
    std::fs::create_dir_all("./private/projects").unwrap();
}