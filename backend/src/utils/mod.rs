use crate::config;
use actix_web::cookie::{self, Cookie};
use argon2::Config;
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use rand::Rng;
use serde::{Deserialize, Serialize};

pub mod auth;
pub mod documents;
pub mod mail;

// Is the information that we want to store in the token
#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub id: i32,
    pub exp: usize,
}

pub fn hash_password(password: &str) -> anyhow::Result<String> {
    // Generate a random salt
    let salt = rand::thread_rng().gen::<[u8; 32]>();

    // Hash the password
    let config = Config::default();
    argon2::hash_encoded(password.as_bytes(), &salt, &config)
        .map_err(|_| anyhow::anyhow!("Failed to hash the password"))
}

pub fn verify_password(password: &str, hash: &str) -> anyhow::Result<bool> {
    argon2::verify_encoded(hash, password.as_bytes())
        .map_err(|_| anyhow::anyhow!("Failed to verify the password"))
}

pub fn create_token(secret_key: &String, id: i32) -> anyhow::Result<String> {
    let my_claims = Claims {
        id,
        // The expiration time is expressed in seconds since the UNIX epoch
        exp: config::TOKEN_EXPIRATION_TIME + chrono::Utc::now().timestamp() as usize,
    };

    Ok(encode(
        &Header::default(),
        &my_claims,
        &EncodingKey::from_secret(secret_key.as_ref()),
    )?)
}

pub fn decode_token(secret_key: &String, token: &str) -> anyhow::Result<Claims> {
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret_key.as_ref()),
        &Validation::new(Algorithm::HS256),
    )?;

    Ok(token_data.claims)
}

pub fn get_cookie_with_token<'a>(token: &'a str, name: &'static str) -> Cookie<'a> {
    Cookie::build(name, token)
        .http_only(true)
        .path("/")
        .finish()
}

pub fn get_cookie_with_expired_token(name: &'static str) -> Cookie<'static> {
    Cookie::build(name, "")
        .http_only(true)
        .path("/")
        .expires(cookie::time::OffsetDateTime::now_utc() - cookie::time::Duration::days(1))
        .finish()
}

pub fn generate_code() -> i32 {
    rand::thread_rng().gen_range(100000..=999999)
}