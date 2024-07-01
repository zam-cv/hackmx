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
) -> Result<ServiceResponse<impl MessageBody>, Error> {
    let token = match req.headers().get("Authorization") {
        Some(header) => header.to_str().map(|s| s.to_string()).ok(),
        None => support_websockets(&req),
    };

    if let Some(token) = token {
        // Check if the token is valid
        if let Ok(claims) = utils::decode_token(secret_key, &token[7..]) {
            // Check if the token has expired
            if claims.exp < chrono::Utc::now().timestamp() as usize {
                let response = HttpResponse::Unauthorized().finish();
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

pub trait User {
    fn id(&self) -> Option<i32>;
    fn username(&mut self) -> &mut String;
    fn email(&mut self) -> &mut String;
    fn password(&mut self) -> &mut String;
}

pub trait Auth<Model: Validate + User + DeserializeOwned + 'static> {
    // config
    fn secret_key(&self) -> &'static String;

    // database
    async fn get_user_by_email(&self, email: String) -> anyhow::Result<Option<Model>>;
    async fn create_user(&self, new_user: Model) -> anyhow::Result<i32>;
    async fn get_user_by_id(&self, id: i32) -> anyhow::Result<Option<Model>>;

    // routes
    async fn register(&self, mut user: web::Json<Model>) -> HttpResponse {
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

    async fn signin(&self, credentials: web::Json<Credentials>) -> HttpResponse {
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
                    return HttpResponse::Ok().json(Session {
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

    async fn verify(&self, req: HttpRequest) -> HttpResponse {
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

    fn routes<T>(self) -> actix_web::Scope
    where
        T: 'static + User + Validate + DeserializeOwned,
        Self: Sized + 'static,
    {
        let secret_key = self.secret_key();

        web::scope("")
            .app_data(web::Data::new(self))
            .route("/register", web::post().to(register::<Self, Model>))
            .route("/signin", web::post().to(signin::<Self, Model>))
            .service(
                web::scope("")
                    .wrap(from_fn(move |req, srv| middleware(req, srv, &secret_key)))
                    .route("/verify", web::get().to(verify::<Self, Model>)),
            )
    }
}

pub async fn register<A, Model>(auth: web::Data<A>, user: web::Json<Model>) -> HttpResponse
where
    Model: Validate + User + DeserializeOwned + 'static,
    A: Auth<Model>
{
    auth.register(user).await
}

pub async fn signin<A, Model>(
    auth: web::Data<A>,
    credentials: web::Json<Credentials>,
) -> HttpResponse
where
    Model: Validate + User + DeserializeOwned + 'static,
    A: Auth<Model>,
{
    auth.signin(credentials).await
}

pub async fn verify<A, Model>(auth: web::Data<A>, req: HttpRequest) -> HttpResponse
where
    Model: Validate + User + DeserializeOwned + 'static,
    A: Auth<Model>,
{
    auth.verify(req).await
}
