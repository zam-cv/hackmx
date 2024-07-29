use crate::{schema, models::*};
use serde::{Deserialize, Serialize};
use validator::Validate;
use diesel::prelude::*;

#[derive(Deserialize, Serialize, Validate, Clone)]
#[derive(Queryable, Selectable, Identifiable, Insertable, AsChangeset)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(primary_key(id))]
#[diesel(table_name = schema::events)]
pub struct Event {
    #[serde(skip_deserializing)]
    #[diesel(deserialize_as = i32)]
    pub id: Option<i32>,
    #[validate(length(min = 2, max = 100))]
    pub title: String,
    #[validate(length(min = 2, max = 1000))]
    pub description: String,
    pub quota_per_team: i32,
    pub start_date: chrono::NaiveDateTime,
    pub end_date: chrono::NaiveDateTime,
    #[validate(length(min = 2, max = 100))]
    pub location: String,
}

#[derive(Deserialize, Serialize, Validate)]
#[derive(Queryable, Selectable, Identifiable, Insertable, AsChangeset, Associations)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(primary_key(user_id, event_id))]
#[diesel(belongs_to(User), belongs_to(Event))]
#[diesel(table_name = schema::event_participants)]
pub struct EventParticipant {
    #[serde(skip_deserializing, skip_serializing)]
    pub user_id: i32,
    #[serde(skip_deserializing, skip_serializing)]
    pub event_id: i32,
    #[serde(skip_deserializing)]
    pub confirmed: bool,
    pub with_bus: bool,
}

#[derive(Deserialize, Serialize, Validate)]
#[derive(Queryable, Selectable, Identifiable, Insertable, AsChangeset, Associations)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(primary_key(id))]
#[diesel(belongs_to(Event))]
#[diesel(table_name = schema::event_tasks)]
pub struct EventTask {
    #[serde(skip_deserializing)]
    #[diesel(deserialize_as = i32)]
    pub id: Option<i32>,
    #[serde(skip_deserializing)]
    pub event_id: i32,
    #[validate(length(min = 2, max = 100))]
    pub title: String,
    #[validate(length(min = 2, max = 500))]
    pub description: String,
    pub date: chrono::NaiveDateTime,
}

#[derive(Deserialize, Serialize)]
pub struct ParticipantDetails {
    pub has_team: bool,
    pub is_leader: bool,
    pub team_id: Option<i32>,
}