use crate::{schema, models::*, utils::documents::Doc};
use serde::{Deserialize, Serialize};
use validator::Validate;
use diesel::prelude::*;

#[derive(Deserialize, Serialize, Validate, Clone, Debug)]
#[derive(Queryable, Selectable, Identifiable, Insertable, AsChangeset)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(primary_key(id))]
#[diesel(table_name = schema::sponsors)]
pub struct Sponsor {
    #[serde(skip_deserializing)]
    #[diesel(deserialize_as = i32)]
    pub id: Option<i32>,
    #[validate(length(min = 2, max = 100))]
    pub name: String,
    #[validate(length(min = 0, max = 200))]
    pub image: String,
    #[validate(length(min = 2, max = 500))]
    pub description: String,
    #[validate(length(min = 2, max = 255))]
    pub email: String,
}

impl Doc for Sponsor {
    fn id(&mut self) -> &mut Option<i32> {
        &mut self.id
    }

    fn name(&mut self) -> &mut String {
        &mut self.image
    }
}

#[derive(Deserialize, Serialize, Validate)]
#[derive(Queryable, Selectable, Identifiable, Insertable, AsChangeset, Associations)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(primary_key(id))]
#[diesel(belongs_to(Event))]
#[diesel(table_name = schema::event_sponsors)]
pub struct EventSponsor {
    #[serde(skip_deserializing)]
    #[diesel(deserialize_as = i32)]
    pub id: Option<i32>,
    pub event_id: i32,
    pub sponsor_id: i32,
}

#[derive(Deserialize, Serialize, Validate)]
#[derive(Queryable, Selectable, Identifiable, Insertable, AsChangeset, Associations)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(primary_key(id))]
#[diesel(belongs_to(EventSponsor))]
#[diesel(table_name = schema::awards)]
pub struct Award {
    #[serde(skip_deserializing)]
    #[diesel(deserialize_as = i32)]
    pub id: Option<i32>,
    #[serde(skip_deserializing, skip_serializing)]
    pub event_sponsor_id: i32,
    #[validate(length(min = 2, max = 100))]
    pub title: String,
}
