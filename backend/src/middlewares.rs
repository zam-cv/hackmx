use crate::{auth, config};
use actix_web::{
    body::MessageBody,
    dev::{ServiceRequest, ServiceResponse},
    Error,
};
use actix_web_lab::middleware::Next;

#[allow(dead_code)]
pub async fn user_middleware(
    req: ServiceRequest,
    next: Next<impl MessageBody + 'static>,
) -> Result<ServiceResponse<impl MessageBody>, Error> {
    auth::middleware(req, next, &config::USER_SECRET_KEY).await
}
