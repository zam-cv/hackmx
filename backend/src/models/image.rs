use crate::{schema, models::*, utils::documents::Doc};
use serde::{Deserialize, Serialize};
use validator::Validate;
use diesel::prelude::*;

#[derive(Deserialize, Serialize, Validate, Clone)]
#[derive(Queryable, Selectable, Identifiable, Insertable, AsChangeset, Associations)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(primary_key(id))]
#[diesel(belongs_to(Event))]
#[diesel(table_name = schema::gallery)]
pub struct Image {
    #[serde(skip_deserializing)]
    #[diesel(deserialize_as = i32)]
    pub id: Option<i32>,
    #[serde(skip_serializing)]
    pub event_id: i32,
    #[validate(length(min = 2, max = 100))]
    pub name: String,
}

impl Doc for Image {
    fn id(&mut self) -> &mut Option<i32> {
        &mut self.id
    }

    fn name(&mut self) -> &mut String {
        &mut self.name
    }
}