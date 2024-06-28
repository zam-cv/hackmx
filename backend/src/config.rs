use lazy_static::lazy_static;
use std::env;

lazy_static! {
    pub static ref USER_SECRET_KEY: String = env::var("USER_SECRET_KEY").expect("USER_SECRET_KEY must be set");
    pub static ref ADMIN_SECRET_KEY: String = env::var("ADMIN_SECRET_KEY").expect("ADMIN_SECRET_KEY must be set");
}

// constants
pub const TOKEN_EXPIRATION_TIME: usize = 60 * 60 * 24 * 15; // 15 days
pub const MAX_POOL_SIZE: u32 = 5; // Database connection pool size