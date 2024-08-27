use crate::{database::Database, models};
use actix_web::{delete, get, post, web, HttpResponse, Responder};
use validator::Validate;

#[get("/all")]
async fn get_events(database: web::Data<Database>) -> impl Responder {
    match database.get_events().await {
        Ok(events) => HttpResponse::Ok().json(events),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/all/{id}")]
async fn get_event(database: web::Data<Database>, id: web::Path<i32>) -> impl Responder {
    match database.get_event_by_id(id.into_inner()).await {
        Ok(Some(event)) => HttpResponse::Ok().json(event),
        Ok(None) => HttpResponse::NotFound().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[post("/create")]
async fn create_event(database: web::Data<Database>) -> impl Responder {
    let start_date = chrono::Local::now().naive_local();
    let end_date = start_date + chrono::Duration::days(2);
    let mut new_event = models::Event {
        id: None,
        title: String::from("HackMx"),
        description: String::from("Este evento es una celebración de la innovación y la creatividad tecnológica, donde estudiantes de diversas disciplinas se unen para resolver desafíos reales presentados por reconocidos patrocinadores del sector tecnológico y empresarial.\n\nHackMx ofrece una experiencia completa con una variedad de actividades, incluyendo talleres, sesiones de networking, y competencias adicionales como torneos de videojuegos. Los participantes tienen la oportunidad de aprender de expertos de la industria, compartir sus ideas y obtener retroalimentación valiosa, todo en un ambiente dinámico y estimulante."),
        quota_per_team: 5,
        start_date,
        end_date,
        location: String::from("Campus Estado de México"),
        map_url: String::from("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3758.79851021442!2d-99.23062555369646!3d19.593131082826712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d21db668855ad3%3A0xee1a52e08e9baf1!2sTecnol%C3%B3gico%20Monterrey!5e0!3m2!1ses-419!2smx!4v1724686584579!5m2!1ses-419!2smx")
    };

    match database.create_event(new_event.clone()).await {
        Ok(id) => {
            new_event.id = Some(id);
            HttpResponse::Ok().json(new_event)
        }
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[post("/{id}/update")]
async fn update_event(
    database: web::Data<Database>,
    id: web::Path<i32>,
    mut event: web::Json<models::Event>,
) -> impl Responder {
    if let Err(_) = event.validate() {
        return HttpResponse::BadRequest().finish();
    }

    event.id = Some(id.into_inner());
    let new_event = event.into_inner();

    match database.update_event(new_event).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[post("/add_task/{event_id}")]
async fn add_task(
    database: web::Data<Database>,
    event_id: web::Path<i32>,
    mut task: web::Json<models::EventTask>,
) -> impl Responder {
    if let Err(_) = task.validate() {
        return HttpResponse::BadRequest().finish();
    }

    task.event_id = event_id.into_inner();
    match database.create_task(task.into_inner()).await {
        Ok(id) => HttpResponse::Ok().json(id),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[delete("/delete_task/{id}")]
async fn delete_task(database: web::Data<Database>, id: web::Path<i32>) -> impl Responder {
    match database.delete_task_by_id(id.into_inner()).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/all_tasks/{event_id}")]
async fn get_tasks(database: web::Data<Database>, event_id: web::Path<i32>) -> impl Responder {
    match database.get_tasks_by_event_id(event_id.into_inner()).await {
        Ok(tasks) => HttpResponse::Ok().json(tasks),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[delete("/{id}")]
async fn delete_event(database: web::Data<Database>, id: web::Path<i32>) -> impl Responder {
    match database.delete_event_by_id(id.into_inner()).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/participants/count/{event_id}")]
async fn get_participants_count(
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> impl Responder {
    match database.get_participants_count(event_id.into_inner()).await {
        Ok(count) => HttpResponse::Ok().json(count),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/tasks/count/{event_id}")]
async fn get_tasks_count(
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> impl Responder {
    match database.get_tasks_count(event_id.into_inner()).await {
        Ok(count) => HttpResponse::Ok().json(count),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/sponsors/count/{event_id}")]
async fn get_sponsors_count(
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> impl Responder {
    match database.get_sponsors_count(event_id.into_inner()).await {
        Ok(count) => HttpResponse::Ok().json(count),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/teams/count/{event_id}")]
async fn get_teams_count(
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> impl Responder {
    match database.get_teams_count(event_id.into_inner()).await {
        Ok(count) => HttpResponse::Ok().json(count),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/documents/count/{event_id}")]
async fn get_documents_count(
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> impl Responder {
    match database.get_documents_count(event_id.into_inner()).await {
        Ok(count) => HttpResponse::Ok().json(count),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/publications/count/{event_id}")]
async fn get_publications_count(
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> impl Responder {
    match database.get_publications_count(event_id.into_inner()).await {
        Ok(count) => HttpResponse::Ok().json(count),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/participants/{event_id}")]
async fn get_participants(
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> impl Responder {
    match database
        .get_participants_with_user_by_event_id(event_id.into_inner())
        .await
    {
        Ok(participants) => HttpResponse::Ok().json(participants),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/teams/{event_id}")]
async fn get_teams(database: web::Data<Database>, event_id: web::Path<i32>) -> impl Responder {
    match database
        .get_teams_names_by_event_id(event_id.into_inner())
        .await
    {
        Ok(teams) => HttpResponse::Ok().json(teams),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

pub fn routes() -> actix_web::Scope {
    web::scope("/event")
        .service(create_event)
        .service(get_event)
        .service(get_events)
        .service(update_event)
        .service(add_task)
        .service(delete_task)
        .service(get_tasks)
        .service(delete_event)
        .service(get_participants_count)
        .service(get_tasks_count)
        .service(get_sponsors_count)
        .service(get_teams_count)
        .service(get_documents_count)
        .service(get_publications_count)
        .service(get_participants)
        .service(get_teams)
}
