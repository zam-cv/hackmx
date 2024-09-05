use crate::{config, database::Database, utils::auth};
use actix_web::{
    body::MessageBody,
    dev::{ServiceRequest, ServiceResponse},
    http::header::{self, HeaderValue},
    web, Error, HttpMessage, HttpResponse,
};
use actix_web_lab::middleware::Next;

pub async fn user_middleware(
    req: ServiceRequest,
    next: Next<impl MessageBody + 'static>,
) -> Result<ServiceResponse<impl MessageBody>, Error> {
    auth::middleware(
        req,
        next,
        &config::USER_SECRET_KEY,
        &config::USER_COOKIE_NAME,
    )
    .await
}

pub async fn admin_middleware(
    req: ServiceRequest,
    next: Next<impl MessageBody + 'static>,
) -> Result<ServiceResponse<impl MessageBody>, Error> {
    auth::middleware(
        req,
        next,
        &config::ADMIN_SECRET_KEY,
        &config::ADMIN_COOKIE_NAME,
    )
    .await
}

pub async fn redirect_middleware(
    req: ServiceRequest,
    next: Next<impl MessageBody + 'static>,
) -> Result<ServiceResponse<impl MessageBody>, Error> {
    let path = req.path();

    if path.contains('.') {
        return Ok(next.call(req).await?.map_into_left_body());
    }

    if let Ok(Some(_)) =
        auth::is_authenticated(&req, &config::USER_SECRET_KEY, &config::USER_COOKIE_NAME).await
    {
        match path {
            "/" | "/register" | "/login" | "/gallery" | "/team" => {
                let response = HttpResponse::Found()
                    .append_header(("location", "/dashboard"))
                    .finish();

                return Ok(req.into_response(response).map_into_right_body());
            }
            _ => {
                let mut res = next.call(req).await?.map_into_left_body();

                res.headers_mut().insert(
                    header::CACHE_CONTROL,
                    HeaderValue::from_static(
                        "no-store, no-cache, must-revalidate, proxy-revalidate",
                    ),
                );

                res.headers_mut()
                    .insert(header::PRAGMA, HeaderValue::from_static("no-cache"));

                res.headers_mut()
                    .insert(header::EXPIRES, HeaderValue::from_static("0"));

                return Ok(res);
            }
        }
    } else {
        match path {
            "/" | "/forgot-password" | "/gallery" | "/register" | "/login" | "/team" => {
                return Ok(next.call(req).await?.map_into_left_body())
            }
            _ => {
                let response = HttpResponse::Found()
                    .append_header(("location", "/login"))
                    .finish();

                return Ok(req.into_response(response).map_into_right_body());
            }
        }
    }
}

pub async fn event_not_started_middleware(
    req: ServiceRequest,
    next: Next<impl MessageBody + 'static>,
) -> Result<ServiceResponse<impl MessageBody>, Error> {
    let event_id = match req.match_info().get("event_id").map(|id| id.parse::<i32>()) {
        Some(Ok(id)) => Some(id),
        _ => None,
    };

    if let Some(database) = req.app_data::<web::Data<Database>>() {
        if let Some(event_id) = event_id {
            if let Ok(true) = database.is_event_not_started(event_id).await {
                return Ok(next.call(req).await?.map_into_left_body());
            }
        }
    }

    let response = HttpResponse::Unauthorized().finish();
    Ok(req.into_response(response).map_into_right_body())
}

pub async fn user_in_event_middleware(
    req: ServiceRequest,
    next: Next<impl MessageBody + 'static>,
) -> Result<ServiceResponse<impl MessageBody>, Error> {
    let user_id = req.extensions().get::<i32>().map(|id| *id);
    let event_id = match req.match_info().get("event_id").map(|id| id.parse::<i32>()) {
        Some(Ok(id)) => Some(id),
        _ => None,
    };

    if let Some(database) = req.app_data::<web::Data<Database>>() {
        if let (Some(user_id), Some(event_id)) = (user_id, event_id) {
            if let Ok(true) = database.is_user_in_event(user_id, event_id).await {
                return Ok(next.call(req).await?.map_into_left_body());
            }
        }
    }

    let response = HttpResponse::Unauthorized().finish();
    Ok(req.into_response(response).map_into_right_body())
}

pub async fn team_in_event_middleware(
    req: ServiceRequest,
    next: Next<impl MessageBody + 'static>,
) -> Result<ServiceResponse<impl MessageBody>, Error> {
    let team_id = match req.match_info().get("team_id").map(|id| id.parse::<i32>()) {
        Some(Ok(id)) => Some(id),
        _ => None,
    };

    let event_id = match req.match_info().get("event_id").map(|id| id.parse::<i32>()) {
        Some(Ok(id)) => Some(id),
        _ => None,
    };

    if let Some(database) = req.app_data::<web::Data<Database>>() {
        if let (Some(team_id), Some(event_id)) = (team_id, event_id) {
            if let Ok(true) = database.is_team_in_event(team_id, event_id).await {
                return Ok(next.call(req).await?.map_into_left_body());
            }
        }
    }

    let response = HttpResponse::Unauthorized().finish();
    Ok(req.into_response(response).map_into_right_body())
}

pub async fn event_not_ended_middleware(
    req: ServiceRequest,
    next: Next<impl MessageBody + 'static>,
) -> Result<ServiceResponse<impl MessageBody>, Error> {
    let event_id = match req.match_info().get("event_id").map(|id| id.parse::<i32>()) {
        Some(Ok(id)) => Some(id),
        _ => None,
    };

    if let Some(database) = req.app_data::<web::Data<Database>>() {
        if let Some(event_id) = event_id {
            if let Ok(true) = database.is_event_not_ended(event_id).await {
                return Ok(next.call(req).await?.map_into_left_body());
            }
        }
    }

    let response = HttpResponse::Unauthorized().finish();
    Ok(req.into_response(response).map_into_right_body())
}
