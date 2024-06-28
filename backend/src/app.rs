use crate::{controllers, database::Database};
use actix_web::{middleware::Logger, web, App, HttpServer};
use std::env;

pub async fn app() -> std::io::Result<()> {
    // Create Database instance
    let database = Database::new();
    log::info!("Database connection established");

    // Get the HOST and PORT environment variables
    let host = env::var("HOST").unwrap_or("0.0.0.0".to_string());
    let port = env::var("PORT").unwrap_or("8080".to_string());

    // Start the HTTP server
    log::info!("Starting the server");
    log::info!("Listening on http://{}:{}", host, port);

    HttpServer::new(move || {
        App::new().wrap(Logger::default()).service(
            web::scope("/api")
                .service(controllers::auth::routes(database.clone()))
        )
    })
    .bind(format!("{}:{}", host, port))?
    .run()
    .await
}
