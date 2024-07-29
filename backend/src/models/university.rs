use crate::{schema, models::*, utils::documents::Doc};
use serde::{Deserialize, Serialize};
use validator::Validate;
use diesel::prelude::*;

#[derive(Deserialize, Serialize, Validate, Clone)]
#[derive(Queryable, Selectable, Identifiable, Insertable, AsChangeset)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(primary_key(id))]
#[diesel(table_name = schema::universities)]
pub struct University {
    #[serde(skip_deserializing)]
    #[diesel(deserialize_as = i32)]
    pub id: Option<i32>,
    #[validate(length(min = 2, max = 100))]
    pub name: String,
    #[validate(length(min = 0, max = 200))]
    pub image: String,
    #[validate(length(min = 0, max = 500))]
    pub description: String,
    #[validate(length(min = 0, max = 50))]
    pub email_extension: String,
}

impl Doc for University {
    fn id(&mut self) -> &mut Option<i32> {
        &mut self.id
    }

    fn name(&mut self) -> &mut String {
        &mut self.image
    }
}

#[derive(Deserialize, Serialize)]
#[derive(Queryable, Selectable, Identifiable, Insertable, AsChangeset, Associations)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(primary_key(event_id, university_id))]
#[diesel(belongs_to(Event), belongs_to(University))]
#[diesel(table_name = schema::university_quota)]
pub struct UniversityQuota {
    #[serde(skip_serializing)]
    pub event_id: i32,
    #[serde(skip_serializing)]
    pub university_id: i32,
    pub quota: i32,
}