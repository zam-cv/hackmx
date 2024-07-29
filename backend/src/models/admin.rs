use crate::{utils::auth, schema};
use serde::{Deserialize, Serialize};
use validator::Validate;
use diesel::prelude::*;

#[derive(Deserialize, Serialize, Validate)]
#[derive(Queryable, Selectable, Identifiable, Insertable, AsChangeset)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(primary_key(id))]
#[diesel(table_name = schema::admins)]
pub struct Admin {
    #[serde(skip_deserializing)]
    #[diesel(deserialize_as = i32)]
    pub id: Option<i32>,
    #[validate(length(min = 3, max = 20))]
    pub username: String,
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 8))]
    pub password: String,
}

impl auth::User for Admin {
    fn id(&self) -> Option<i32> {
        self.id
    }

    fn username(&mut self) -> &mut String {
        &mut self.username
    }

    fn email(&mut self) -> &mut String {
        &mut self.email
    }

    fn password(&mut self) -> &mut String {
        &mut self.password
    }
}