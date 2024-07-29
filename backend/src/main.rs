use dotenv::dotenv;

mod app;
mod config;
mod controllers;
mod database;
mod middlewares;
mod models;
mod schema;
mod utils;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load the environment variables
    dotenv().ok();

    // Initialize the logger
    env_logger::init();

    // Start the application
    app::app().await
}
