use crate::utils;
use actix_web::{
    body::MessageBody,
    dev::{ServiceRequest, ServiceResponse},
    web, Error, HttpMessage, HttpRequest, HttpResponse,
};
use actix_web_lab::middleware::{from_fn, Next};
use serde::de::DeserializeOwned;
use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Deserialize, Serialize)]
pub struct Credentials {
    pub email: String,
    pub password: String,
}

#[derive(Deserialize, Serialize)]
pub struct UserInformation {
    pub username: String,
    pub email: String,
}

#[derive(Deserialize, Serialize)]
pub struct Session {
    pub token: String,
    pub user_information: UserInformation,
}

// support for websockets
fn support_websockets(req: &ServiceRequest) -> Option<String> {
    req.headers()
        .get(actix_web::http::header::SEC_WEBSOCKET_PROTOCOL)
        .and_then(|header| {
            header
                .to_str()
                .map(|s| {
                    let parts: Vec<&str> = s.split(", ").collect();

                    if parts.len() == 2 {
                        let token = parts[1];
                        req.extensions_mut().insert(token.to_string());
                        return Some(token.to_string());
                    }

                    None
                })
                .ok()
                .flatten()
        })
}

pub async fn middleware(
    req: ServiceRequest,
    next: Next<impl MessageBody + 'static>,
    secret_key: &String,
    cookie_name: &'static str,
) -> Result<ServiceResponse<impl MessageBody>, Error> {
    let token = match req.cookie(cookie_name) {
        // supoort for cookies
        Some(cookie) => Some(cookie.value().to_string()),
        None => match req.headers().get("Authorization") {
            // support for headers
            Some(header) => header.to_str().map(|s| s.to_string()).ok(),
            // support for websockets
            None => support_websockets(&req),
        },
    };

    if let Some(token) = token {
        // Check if the token is valid
        let token = token.replace("Bearer ", "");
        if let Ok(claims) = utils::decode_token(secret_key, &token) {
            if claims.exp < chrono::Utc::now().timestamp() as usize {
                log::error!("Expired token");
                let cookie = utils::get_cookie_with_expired_token(cookie_name);
                let response = HttpResponse::Unauthorized().cookie(cookie).finish();

                return Ok(req.into_response(response).map_into_right_body());
            }

            // Insert the user id into the request extensions
            req.extensions_mut().insert(claims.id);
            return Ok(next.call(req).await?.map_into_left_body());
        }
    }

    log::error!("Unauthorized");
    let response = HttpResponse::Unauthorized().finish();
    Ok(req.into_response(response).map_into_right_body())
}

pub async fn is_authenticated(
    req: &ServiceRequest,
    secret_key: &String,
    cookie_name: &'static str,
) -> Result<Option<i32>, Error> {
    let token = match req.cookie(cookie_name) {
        // supoort for cookies
        Some(cookie) => Some(cookie.value().to_string()),
        None => match req.headers().get("Authorization") {
            // support for headers
            Some(header) => header.to_str().map(|s| s.to_string()).ok(),
            // support for websockets
            None => support_websockets(&req),
        },
    };

    if let Some(token) = token {
        // Check if the token is valid
        let token = token.replace("Bearer ", "");
        if let Ok(claims) = utils::decode_token(secret_key, &token) {
            if claims.exp < chrono::Utc::now().timestamp() as usize {
                return Ok(None);
            }

            return Ok(Some(claims.id));
        }
    }

    log::error!("Unauthorized");
    Ok(None)
}

pub trait User {
    fn id(&self) -> Option<i32>;
    fn username(&mut self) -> &mut String;
    fn email(&mut self) -> &mut String;
    fn password(&mut self) -> &mut String;
}

pub trait Auth<Model: Validate + User + DeserializeOwned + 'static> {
    // config
    fn secret_key(&self) -> &'static String;
    fn cookie_name(&self) -> &'static str;

    // database
    async fn get_user_by_email(&self, email: String) -> anyhow::Result<Option<Model>>;
    async fn create_user(&self, new_user: Model) -> anyhow::Result<i32>;
    async fn get_user_by_id(&self, id: i32) -> anyhow::Result<Option<Model>>;

    // routes
    async fn default_register(&self, mut user: web::Json<Model>) -> HttpResponse {
        // Validate the user data
        if let Err(_) = user.validate() {
            return HttpResponse::BadRequest().body("Invalid data");
        }

        // Check if the email already exists
        if let Ok(Some(_)) = self.get_user_by_email(user.email().clone()).await {
            return HttpResponse::BadRequest().body("Email already exists");
        }

        // Hash the password
        if let Ok(hash) = utils::hash_password(user.password()) {
            *user.password() = hash;

            // Create the user
            return match self.create_user(user.into_inner()).await {
                Ok(_) => HttpResponse::Ok().body("User created"),
                Err(_) => HttpResponse::InternalServerError().body("Failed to create user"),
            };
        } else {
            return HttpResponse::InternalServerError().body("Failed to hash password");
        }
    }

    async fn default_signin(&self, credentials: web::Json<Credentials>) -> HttpResponse {
        // Get the user by email
        let mut user = match self.get_user_by_email(credentials.email.clone()).await {
            Ok(Some(user)) => user,
            _ => return HttpResponse::BadRequest().body("Invalid credentials"),
        };

        // Verify the password
        if let Ok(true) = utils::verify_password(&credentials.password, user.password()) {
            if let Some(id) = user.id() {
                // Create a token
                if let Ok(token) = utils::create_token(self.secret_key(), id) {
                    let cookie = format!("Bearer {}", token);
                    let cookie = utils::get_cookie_with_token(&cookie, self.cookie_name());
                    return HttpResponse::Ok().cookie(cookie).json(Session {
                        token,
                        user_information: UserInformation {
                            username: std::mem::take(user.username()),
                            email: std::mem::take(user.email()),
                        },
                    });
                }
            }
        };

        log::error!("Invalid credentials");
        HttpResponse::BadRequest().body("Invalid credentials")
    }

    async fn default_verify(&self, req: HttpRequest) -> HttpResponse {
        if let Some(id) = req.extensions().get::<i32>() {
            // Get the user by id
            if let Ok(Some(mut user)) = self.get_user_by_id(*id).await {
                return HttpResponse::Ok().json(UserInformation {
                    username: std::mem::take(user.username()),
                    email: std::mem::take(user.email()),
                });
            }
        }

        HttpResponse::Unauthorized().finish()
    }

    async fn default_logout(&self) -> HttpResponse {
        let cookie = utils::get_cookie_with_expired_token(self.cookie_name());
        HttpResponse::Ok().cookie(cookie).finish()
    }

    fn default_routes<T>(self) -> actix_web::Scope
    where
        T: 'static + User + Validate + DeserializeOwned,
        Self: Sized + 'static,
    {
        let secret_key = self.secret_key();
        let cookie_name = self.cookie_name();

        web::scope("")
            .app_data(web::Data::new(self))
            .route("/register", web::post().to(default_register::<Self, Model>))
            .route("/signin", web::post().to(default_signin::<Self, Model>))
            .route("/logout", web::get().to(default_logout::<Self, Model>))
            .service(
                web::scope("")
                    .wrap(from_fn(move |req, srv| {
                        middleware(req, srv, &secret_key, cookie_name)
                    }))
                    .route("/verify", web::get().to(default_verify::<Self, Model>)),
            )
    }
}

pub trait ExtendedAuth<Model: Validate + User + DeserializeOwned + 'static>: Auth<Model> {
    async fn extended_register(&self, user: web::Json<Model>) -> HttpResponse;
    async fn extended_signin(&self, credentials: web::Json<Credentials>) -> HttpResponse;
    async fn extended_verify(&self, req: HttpRequest) -> HttpResponse;
    async fn extended_logout(&self) -> HttpResponse;

    fn extended_routes<T>(self) -> actix_web::Scope
    where
        T: 'static + User + Validate + DeserializeOwned,
        Self: Sized + 'static,
    {
        let secret_key = self.secret_key();
        let cookie_name = self.cookie_name();

        web::scope("")
            .app_data(web::Data::new(self))
            .route(
                "/register",
                web::post().to(extended_register::<Self, Model>),
            )
            .route("/signin", web::post().to(extended_signin::<Self, Model>))
            .route("/logout", web::get().to(extended_logout::<Self, Model>))
            .service(
                web::scope("")
                    .wrap(from_fn(move |req, srv| {
                        middleware(req, srv, &secret_key, cookie_name)
                    }))
                    .route("/verify", web::get().to(extended_verify::<Self, Model>)),
            )
    }
}

pub async fn default_register<A, Model>(auth: web::Data<A>, user: web::Json<Model>) -> HttpResponse
where
    Model: Validate + User + DeserializeOwned + 'static,
    A: Auth<Model>,
{
    auth.default_register(user).await
}

pub async fn default_signin<A, Model>(
    auth: web::Data<A>,
    credentials: web::Json<Credentials>,
) -> HttpResponse
where
    Model: Validate + User + DeserializeOwned + 'static,
    A: Auth<Model>,
{
    auth.default_signin(credentials).await
}

pub async fn default_logout<A, Model>(auth: web::Data<A>) -> HttpResponse
where
    Model: Validate + User + DeserializeOwned + 'static,
    A: Auth<Model>,
{
    auth.default_logout().await
}

pub async fn default_verify<A, Model>(auth: web::Data<A>, req: HttpRequest) -> HttpResponse
where
    Model: Validate + User + DeserializeOwned + 'static,
    A: Auth<Model>,
{
    auth.default_verify(req).await
}

pub async fn extended_register<A, Model>(auth: web::Data<A>, user: web::Json<Model>) -> HttpResponse
where
    Model: Validate + User + DeserializeOwned + 'static,
    A: ExtendedAuth<Model>,
{
    auth.extended_register(user).await
}

pub async fn extended_signin<A, Model>(
    auth: web::Data<A>,
    credentials: web::Json<Credentials>,
) -> HttpResponse
where
    Model: Validate + User + DeserializeOwned + 'static,
    A: ExtendedAuth<Model>,
{
    auth.extended_signin(credentials).await
}

pub async fn extended_logout<A, Model>(auth: web::Data<A>) -> HttpResponse
where
    Model: Validate + User + DeserializeOwned + 'static,
    A: ExtendedAuth<Model>,
{
    auth.extended_logout().await
}

pub async fn extended_verify<A, Model>(auth: web::Data<A>, req: HttpRequest) -> HttpResponse
where
    Model: Validate + User + DeserializeOwned + 'static,
    A: ExtendedAuth<Model>,
{
    auth.extended_verify(req).await
}
