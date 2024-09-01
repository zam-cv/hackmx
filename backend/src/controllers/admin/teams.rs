use crate::{
    controllers::projects::ProjectsService, database::Database, utils::documents::DocService,
};
use actix_web::{delete, get, web, Error, HttpResponse, Result};

#[get("/{event_id}")]
pub async fn get_teams(
    database: web::Data<Database>,
    event_id: web::Path<i32>,
) -> Result<HttpResponse, Error> {
    match database
        .get_teams_with_project_and_members_by_event_id(event_id.into_inner())
        .await
    {
        Ok(mut teams) => {
            let service = ProjectsService(&database);

            for team in teams.iter_mut() {
                if let (_, Some((project, _)), _) = team {
                    service.transform(project);
                }
            }

            Ok(HttpResponse::Ok().json(teams))
        }
        Err(_) => Ok(HttpResponse::InternalServerError().finish()),
    }
}

#[delete("/{team_id}")]
pub async fn delete_team(database: web::Data<Database>, team_id: web::Path<i32>) -> HttpResponse {
    if let Ok(_) = database.delete_team_by_id(team_id.into_inner()).await {
        return HttpResponse::Ok().finish();
    }

    HttpResponse::InternalServerError().finish()
}

pub fn routes() -> actix_web::Scope {
    web::scope("/teams")
        .service(get_teams)
        .service(delete_team)
}
