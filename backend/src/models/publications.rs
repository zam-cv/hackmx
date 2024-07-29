use crate::{schema, models::*};
use serde::{Deserialize, Serialize};
use validator::Validate;
use diesel::prelude::*;

#[derive(Deserialize, Serialize, Validate)]
#[derive(Queryable, Selectable, Identifiable, Insertable, AsChangeset, Associations)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(primary_key(id))]
#[diesel(belongs_to(Event))]
#[diesel(table_name = schema::publications)]
pub struct Publication {
    #[serde(skip_deserializing)]
    #[diesel(deserialize_as = i32)]
    pub id: Option<i32>,
    #[serde(skip_deserializing)]
    pub event_id: i32,
    #[validate(length(min = 2, max = 100))]
    pub title: String,
    #[validate(length(min = 2, max = 500))]
    pub description: String,
    #[serde(skip_deserializing)]
    pub date: chrono::NaiveDateTime
}