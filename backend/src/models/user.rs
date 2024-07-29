use crate::{utils::auth, schema, models::types::*};
use serde::{Deserialize, Serialize};
use validator::Validate;
use diesel::prelude::*;
use once_cell::sync::Lazy;

static PHONE_REGEX: Lazy<regex::Regex> = Lazy::new(|| {
    regex::Regex::new(r"^(\+?[0-9]{1,3}[-\s]?)?(\(?[0-9]{1,4}\)?[-\s]?)*[0-9]{1,4}[-\s]?[0-9]{1,4}$").unwrap()
});

#[derive(Deserialize, Serialize, Validate, Debug)]
#[derive(Queryable, Selectable, Identifiable, Insertable, AsChangeset)]
#[diesel(check_for_backend(diesel::pg::Pg))]
#[diesel(primary_key(id))]
#[diesel(table_name = schema::users)]
#[diesel(treat_none_as_null = true)]
pub struct User {
    #[serde(skip_deserializing)]
    #[diesel(deserialize_as = i32)]
    pub id: Option<i32>,
    #[validate(length(min = 1, max = 20))]
    pub username: String,
    #[validate(length(min = 0, max = 40))]
    pub firstname: String,
    #[validate(length(min = 0, max = 40))]
    pub lastname: String,
    #[validate(email)]
    pub personal_email: String,
    #[validate(regex(path = *PHONE_REGEX))]
    pub phone: String,
    #[validate(range(min = 1, max = 10))]
    pub semester: i32,
    pub campus: Option<Campus>,
    pub major: Option<Major>,
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 8))]
    #[serde(skip_serializing)]
    pub password: String,
}

impl auth::User for User {
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