use crate::{schema, models::*};
use serde::{Deserialize, Serialize};
use validator::Validate;
use diesel::prelude::*;

#[derive(Deserialize, Serialize, Validate)]
#[derive(Queryable, Selectable, Identifiable, Insertable, AsChangeset, Associations)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(primary_key(id))]
#[diesel(belongs_to(User), belongs_to(Event))]
#[diesel(table_name = schema::teams)]
pub struct Team {
    #[serde(skip_deserializing)]
    #[diesel(deserialize_as = i32)]
    pub id: Option<i32>,
    #[serde(skip_deserializing, skip_serializing)]
    pub event_id: i32,
    #[validate(length(min = 1, max = 100))]
    pub name: String,
    #[validate(length(min = 0, max = 500))]
    pub description: String,
    #[serde(skip_deserializing)]
    pub user_id: i32, // Team leader
    #[serde(skip_serializing)]
    pub code: Option<i32>
}

#[derive(Deserialize, Serialize, Validate)]
#[derive(Queryable, Selectable, Identifiable, Insertable, AsChangeset, Associations)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(primary_key(id))]
#[diesel(belongs_to(Team), belongs_to(User))]
#[diesel(table_name = schema::members)]
pub struct Member {
    #[serde(skip_deserializing)]
    #[diesel(deserialize_as = i32)]
    pub id: Option<i32>,
    pub team_id: i32,
    pub user_id: i32
}