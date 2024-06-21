use actix_web::{get, middleware::Logger, App, HttpResponse, HttpServer, Responder};
use dotenv::dotenv;
use std::env;

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load the environment variables
    dotenv().ok();

    // Initialize the logger
    env_logger::init();

    // Get the HOST and PORT environment variables
    let host = env::var("HOST").unwrap_or("0.0.0.0".to_string());
    let port = env::var("PORT").unwrap_or("8080".to_string());

    // Start the HTTP server
    log::info!("Starting the server");
    log::info!("Listening on http://{}:{}", host, port);

    HttpServer::new(|| App::new().wrap(Logger::default()).service(hello))
        .bind(format!("{}:{}", host, port))?
        .run()
        .await
}
