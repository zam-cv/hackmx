use crate::{schema, models::*, utils::documents::Doc};
use serde::{Deserialize, Serialize};
use validator::Validate;
use diesel::prelude::*;

#[derive(Deserialize, Serialize, Validate, Clone, Debug)]
#[derive(Queryable, Selectable, Identifiable, Insertable, AsChangeset, Associations)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(primary_key(id))]
#[diesel(belongs_to(Sponsor))]
#[diesel(table_name = schema::projects)]
pub struct Project {
    #[serde(skip_deserializing)]
    #[diesel(deserialize_as = i32)]
    pub id: Option<i32>,
    #[validate(length(min = 1, max = 100))]
    pub name: String,
    pub url: String,
    pub sponsor_id: i32,
    #[serde(skip_serializing, skip_deserializing)]
    pub team_id: i32,
    #[validate(length(min = 1, max = 200))]
    pub zip: String,
    #[validate(length(min = 0, max = 1000))]
    pub description: String,
}

impl Doc for Project {
    fn id(&mut self) -> &mut Option<i32> {
        &mut self.id
    }

    fn name(&mut self) -> &mut String {
        &mut self.zip
    }
}