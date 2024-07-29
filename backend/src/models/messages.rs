use crate::{schema, models::*};
use serde::{Deserialize, Serialize};
use validator::Validate;
use diesel::prelude::*;

#[derive(Deserialize, Serialize, Validate, Clone)]
#[derive(Queryable, Selectable, Identifiable, Insertable, AsChangeset, Associations)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(primary_key(id))]
#[diesel(belongs_to(Event), belongs_to(User))]
#[diesel(table_name = schema::messages)]
pub struct Message {
    #[serde(skip_deserializing)]
    #[diesel(deserialize_as = i32)]
    pub id: Option<i32>,
    #[serde(skip_deserializing, skip_serializing)]
    pub event_id: i32,
    #[serde(skip_deserializing, skip_serializing)]
    pub user_id: i32,
    #[validate(length(min = 2, max = 500))]
    pub content: String,
    #[serde(skip_deserializing)]
    pub date: chrono::NaiveDateTime
}