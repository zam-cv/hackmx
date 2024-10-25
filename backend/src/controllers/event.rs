use crate::{
    controllers::admin::{
        storage::DocumentsServiceForSponsors,
        documents::get_documents,
        post::get_posts,
    },
    database::Database,
    middlewares, models,
    utils::{self, documents::DocService},
};
use actix_web::{get, post, web, HttpMessage, HttpRequest, HttpResponse, Responder};
use actix_web_lab::middleware::from_fn;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct RegistrationDetails {
    user_in_event: bool,
    quota_available: bool,
}

#[get("/all")]
async fn get_events(req: HttpRequest, database: web::Data<Database>) -> impl Responder {
    if let Some(user_id) = req.extensions().get::<i32>() {
        return match database.get_events_with_user_in_event(*user_id).await {
            Ok(events) => HttpResponse::Ok().json(events),
            Err(_) => HttpResponse::InternalServerError().finish(),
        };
    }

    HttpResponse::BadRequest().finish()
}

#[get("")]
async fn get_event_by_id(database: web::Data<Database>, id: web::Path<i32>) -> impl Responder {
    match database.get_event_by_id(id.into_inner()).await {
        Ok(event) => HttpResponse::Ok().json(event),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/{event_id}/sponsors")]
async fn get_event_sponsors(
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> impl Responder {
    match database
        .get_sponsors_by_event_id(event_id.into_inner())
        .await
    {
        Ok(mut sponsors) => {
            let documents_service = DocumentsServiceForSponsors(&database);
            sponsors.iter_mut().for_each(|sponsor| {
                if let Some(id) = sponsor.0 {
                    documents_service.transform_string(&id, &mut sponsor.2);
                }
            });

            HttpResponse::Ok().json(sponsors)
        }
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/{event_id}/participants/count")]
async fn get_event_participants(
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> impl Responder {
    match database
        .get_participants_by_event_id(event_id.into_inner())
        .await
    {
        Ok(participants) => HttpResponse::Ok().json(participants),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/{event_id}/universities/quota")]
async fn get_event_universities_quota(
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> impl Responder {
    match database.get_quota_by_event_id(event_id.into_inner()).await {
        Ok(universities_quota) => HttpResponse::Ok().json(universities_quota),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/{event_id}/tasks")]
async fn get_event_tasks(
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> impl Responder {
    match database.get_tasks_by_event_id(event_id.into_inner()).await {
        Ok(tasks) => HttpResponse::Ok().json(tasks),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/{event_id}/fqa")]
async fn get_event_fqa(database: web::Data<Database>, event_id: web::Path<i32>) -> impl Responder {
    match database.get_fqa_by_event_id(event_id.into_inner()).await {
        Ok(fqa) => HttpResponse::Ok().json(fqa),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[post("/register")]
async fn register_to_event(
    req: HttpRequest,
    database: web::Data<Database>,
    event_id: web::Path<i32>,
    mut event_participant: web::Json<models::EventParticipant>,
) -> impl Responder {
    if let Some(user_id) = req.extensions().get::<i32>() {
        let event_id = event_id.into_inner();

        match database.is_user_in_event(*user_id, event_id.clone()).await {
            Ok(false) => {
                if let Ok(Some(email_extension)) =
                    database.get_email_extension_by_user_id(*user_id).await
                {
                    match database
                        .is_quota_available(event_id.clone(), email_extension)
                        .await
                    {
                        Ok(true) => {
                            // Do nothing
                        }
                        _ => {
                            return HttpResponse::BadRequest().finish();
                        }
                    }
                }

                event_participant.user_id = *user_id;
                event_participant.event_id = event_id;
                event_participant.confirmed = false;

                if let Err(_) = database
                    .register_to_event(event_participant.into_inner())
                    .await
                {
                    return HttpResponse::InternalServerError().finish();
                }

                HttpResponse::Ok().finish()
            }
            _ => HttpResponse::BadRequest().finish(),
        }
    } else {
        HttpResponse::BadRequest().finish()
    }
}

#[get("/registration-details")]
async fn get_registration_details(
    req: HttpRequest,
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> impl Responder {
    if let Some(user_id) = req.extensions().get::<i32>() {
        let event_id = event_id.into_inner();

        let user_in_event = match database.is_user_in_event(*user_id, event_id).await {
            Ok(true) => true,
            _ => false,
        };

        if let Ok(Some(email_extension)) = database.get_email_extension_by_user_id(*user_id).await {
            let quota_available = match database.is_quota_available(event_id, email_extension).await
            {
                Ok(true) => true,
                _ => false,
            };

            return HttpResponse::Ok().json(RegistrationDetails {
                user_in_event,
                quota_available,
            });
        }

        HttpResponse::InternalServerError().finish()
    } else {
        HttpResponse::BadRequest().finish()
    }
}

#[post("")]
async fn create_team(
    req: HttpRequest,
    event_id: web::Path<i32>,
    database: web::Data<Database>,
) -> impl Responder {
    if let Some(user_id) = req.extensions().get::<i32>() {
        let event_id = event_id.into_inner();

        if let Ok(teams) = database.get_teams_count(event_id.clone()).await {
            let team = models::Team {
                id: None,
                name: format!("Team {}", teams + 1),
                description: String::new(),
                event_id,
                user_id: *user_id,
                code: Some(utils::generate_code()),
            };

            match database.create_team(team).await {
                Ok(team) => return HttpResponse::Ok().json(team),
                Err(_) => return HttpResponse::InternalServerError().finish(),
            }
        }
    }

    HttpResponse::BadRequest().finish()
}

#[get("/teams/{event_id}")]
async fn get_teams_by_event_id(
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> impl Responder {
    match database.get_teams_by_event_id(event_id.into_inner()).await {
        Ok(teams) => HttpResponse::Ok().json(teams),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/team-quota/{event_id}")]
async fn get_team_quota_by_event_id(
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> impl Responder {
    match database
        .get_team_quota_by_event_id(event_id.into_inner())
        .await
    {
        Ok(quota) => HttpResponse::Ok().json(quota),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/participant")]
async fn get_participant_details(
    req: HttpRequest,
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> impl Responder {
    if let Some(user_id) = req.extensions().get::<i32>() {
        return match database
            .get_participant_details_by_user_id(*user_id, event_id.into_inner())
            .await
        {
            Ok(participants) => HttpResponse::Ok().json(participants),
            Err(_) => HttpResponse::InternalServerError().finish(),
        };
    }

    HttpResponse::BadRequest().finish()
}

#[post("/delete-team")]
async fn delete_team(
    req: HttpRequest,
    database: web::Data<Database>,
    path: web::Path<(i32, i32)>,
) -> impl Responder {
    let event_id = path.0;

    if let Some(user_id) = req.extensions().get::<i32>() {
        match database.delete_team_by_user_id(*user_id, event_id).await {
            Ok(_) => return HttpResponse::Ok().finish(),
            Err(_) => return HttpResponse::InternalServerError().finish(),
        }
    }

    HttpResponse::BadRequest().finish()
}

#[post("/join-team")]
async fn join_team(
    req: HttpRequest,
    database: web::Data<Database>,
    path: web::Path<(i32, i32)>,
    your_code: String,
) -> impl Responder {
    let event_id = path.0;
    let team_id = path.1;

    match database.is_team_quota_available(event_id, team_id).await {
        Ok(true) => {}
        _ => return HttpResponse::BadRequest().finish(),
    };

    if let Some(user_id) = req.extensions().get::<i32>() {
        match database.is_not_member_of_any_team(*user_id, event_id).await {
            Ok(true) => {}
            _ => return HttpResponse::BadRequest().finish(),
        };

        if let Ok(code) = database.get_team_code(team_id).await {
            return match code {
                Some(code) => {
                    if let Ok(your_code) = your_code.parse::<i32>() {
                        if code == your_code {
                            match database.join_team(team_id, *user_id).await {
                                Ok(_) => return HttpResponse::Ok().finish(),
                                Err(_) => return HttpResponse::InternalServerError().finish(),
                            }
                        } else {
                            HttpResponse::BadRequest().finish()
                        }
                    } else {
                        HttpResponse::BadRequest().finish()
                    }
                }
                None => match database.join_team(team_id, *user_id).await {
                    Ok(_) => HttpResponse::Ok().finish(),
                    Err(_) => HttpResponse::InternalServerError().finish(),
                },
            };
        }
    }

    HttpResponse::BadRequest().finish()
}

#[get("/members/team/{team_id}")]
async fn get_members_by_team_id(
    database: web::Data<Database>,
    team_id: web::Path<i32>,
) -> impl Responder {
    match database
        .get_members_with_leader_by_team_id(team_id.into_inner())
        .await
    {
        Ok(members) => HttpResponse::Ok().json(members),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[post("/leave-team")]
async fn leave_team(
    req: HttpRequest,
    database: web::Data<Database>,
    path: web::Path<(i32, i32)>,
) -> impl Responder {
    let (_, team_id) = path.into_inner();

    if let Some(user_id) = req.extensions().get::<i32>() {
        match database.leave_team(team_id, *user_id).await {
            Ok(_) => return HttpResponse::Ok().finish(),
            Err(_) => return HttpResponse::InternalServerError().finish(),
        }
    }

    HttpResponse::BadRequest().finish()
}

#[get("/team-info/{team_id}")]
async fn get_team_info(database: web::Data<Database>, team_id: web::Path<i32>) -> impl Responder {
    match database.get_team_by_id(team_id.into_inner()).await {
        Ok(team) => HttpResponse::Ok().json(team),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/code")]
async fn get_team_code(
    req: HttpRequest,
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> impl Responder {
    if let Some(user_id) = req.extensions().get::<i32>() {
        return match database
            .get_team_code_by_user_id(*user_id, event_id.into_inner())
            .await
        {
            Ok(Some(code)) => HttpResponse::Ok().json(code),
            Ok(None) => HttpResponse::Ok().json(String::new()),
            _ => HttpResponse::InternalServerError().finish(),
        };
    }

    HttpResponse::BadRequest().finish()
}

#[post("/name")]
async fn update_team_name(
    req: HttpRequest,
    database: web::Data<Database>,
    event_id: web::Path<i32>,
    name: String,
) -> impl Responder {
    if name.is_empty() {
        return HttpResponse::BadRequest().finish();
    }

    if let Some(user_id) = req.extensions().get::<i32>() {
        let event_id = event_id.into_inner();
        match database
            .update_team_name(*user_id, event_id, name)
            .await
        {
            Ok(_) => HttpResponse::Ok().finish(),
            Err(_) => HttpResponse::InternalServerError().finish(),
        }
    } else {
        HttpResponse::BadRequest().finish()
    }
}

#[post("/description")]
async fn update_team_description(
    req: HttpRequest,
    database: web::Data<Database>,
    event_id: web::Path<i32>,
    description: String,
) -> impl Responder {
    if let Some(user_id) = req.extensions().get::<i32>() {
        let event_id = event_id.into_inner();
        match database
            .update_team_description(*user_id, event_id, description)
            .await
        {
            Ok(_) => HttpResponse::Ok().finish(),
            Err(_) => HttpResponse::InternalServerError().finish(),
        }
    } else {
        HttpResponse::BadRequest().finish()
    }
}

#[post("/code")]
async fn update_team_code(
    req: HttpRequest,
    database: web::Data<Database>,
    event_id: web::Path<i32>,
    code: String,
) -> impl Responder {
    if let Some(user_id) = req.extensions().get::<i32>() {
        let event_id = event_id.into_inner();
        if code.is_empty() {
            match database.update_team_code(*user_id, event_id, None).await {
                Ok(_) => {
                    return HttpResponse::Ok().finish();
                }
                _ => {
                    return HttpResponse::InternalServerError().finish();
                }
            }
        } else {
            match code.parse::<i32>() {
                Ok(code) => {
                    match database
                        .update_team_code(*user_id, event_id, Some(code))
                        .await
                    {
                        Ok(_) => {
                            return HttpResponse::Ok().finish();
                        }
                        _ => {
                            return HttpResponse::InternalServerError().finish();
                        }
                    }
                }
                _ => {
                    return HttpResponse::BadRequest().finish();
                }
            }
        }
    } else {
        HttpResponse::BadRequest().finish()
    }
}

#[post("/delete-member/{member_id}")]
async fn delete_member_by_user_id(
    req: HttpRequest,
    database: web::Data<Database>,
    path: web::Path<(i32, i32)>,
) -> impl Responder {
    let (event_id, member_id) = path.into_inner();

    if let Some(user_id) = req.extensions().get::<i32>() {
        match database
            .delete_member_by_user_id(*user_id, member_id, event_id)
            .await
        {
            Ok(_) => return HttpResponse::Ok().finish(),
            Err(_) => return HttpResponse::InternalServerError().finish(),
        }
    }

    HttpResponse::BadRequest().finish()
}

#[post("")]
async fn send_message(
    req: HttpRequest,
    database: web::Data<Database>,
    event_id: web::Path<i32>,
    message: web::Json<models::Message>,
) -> impl Responder {
    if let Some(user_id) = req.extensions().get::<i32>() {
        let event_id = event_id.into_inner();
        let mut message = message.into_inner();

        message.event_id = event_id;
        message.user_id = *user_id;
        message.date = chrono::Local::now().naive_local();

        match database.create_message(message).await {
            Ok(_) => HttpResponse::Ok().finish(),
            Err(_) => HttpResponse::InternalServerError().finish(),
        }
    } else {
        HttpResponse::BadRequest().finish()
    }
}

#[get("sponsors-with-id-and-names/{event_id}")]
async fn get_sponsors_with_id_and_name(
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> impl Responder {
    match database.get_sponsors_with_id_and_name_by_event_id(event_id.into_inner()).await {
        Ok(sponsors) => HttpResponse::Ok().json(sponsors),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("event-info/{event_id}")]
async fn get_event_info(
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> impl Responder {
    match database.get_event_info_by_id(event_id.into_inner()).await {
        Ok(event) => HttpResponse::Ok().json(event),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("")]
async fn is_in_event() -> impl Responder {
    return HttpResponse::Ok().finish();
}

pub fn routes() -> actix_web::Scope {
    web::scope("/event")
        .service(get_events)
        .service(get_event_sponsors)
        .service(get_event_participants)
        .service(get_event_universities_quota)
        .service(get_event_tasks)
        .service(get_event_fqa)
        .service(get_teams_by_event_id)
        .service(get_team_quota_by_event_id)
        .service(get_members_by_team_id)
        .service(get_team_info)
        .service(get_sponsors_with_id_and_name)
        .service(get_event_info)
        .service(
            web::scope("/is-in-event/{event_id}")
                .wrap(from_fn(middlewares::user_in_event_middleware))
                .service(is_in_event),
        )
        .service(
            web::scope("/send-message/{event_id}")
                .wrap(from_fn(middlewares::user_in_event_middleware))
                .service(send_message),
        )
        .service(
            web::scope("posts/{event_id}")
                // .wrap(from_fn(middlewares::event_not_ended_middleware))
                .service(get_posts)
        )
        .service(
            web::scope("documents/{event_id}")
                // .wrap(from_fn(middlewares::event_not_ended_middleware))
                .service(get_documents)
        )
        .service(
            web::scope("update-team/{event_id}")
                // .wrap(from_fn(middlewares::event_not_ended_middleware))
                .service(update_team_name)
                .service(update_team_description)
                .service(update_team_code)
                .service(delete_member_by_user_id)
        )
        .service(
            web::scope("team/{event_id}")
                .wrap(from_fn(middlewares::user_in_event_middleware))
                // .wrap(from_fn(middlewares::event_not_started_middleware))
                .service(create_team)
                .service(get_participant_details)
                .service(get_team_code)
                .service(
                    web::scope("/edit/{team_id}")
                        .wrap(from_fn(middlewares::team_in_event_middleware))
                        .service(delete_team)
                        .service(join_team)
                        .service(leave_team),
                ),
        )
        .service(
            web::scope("/{event_id}")
                // .wrap(from_fn(middlewares::event_not_started_middleware))
                .service(get_event_by_id)
                .service(register_to_event)
                .service(get_registration_details),
        )
}
