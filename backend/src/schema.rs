// @generated automatically by Diesel CLI.

diesel::table! {
    admins (id) {
        id -> Int4,
        #[max_length = 20]
        username -> Varchar,
        #[max_length = 255]
        email -> Varchar,
        #[max_length = 150]
        password -> Varchar,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    admins,
    users,
);

diesel::table! {
    use diesel::sql_types::*;
    use crate::models::types::exports::*;

    users (id) {
        id -> Integer,
        first_name -> Varchar,
        #[max_length = 50]
        last_name -> Varchar,
        #[max_length = 100]
        email -> Varchar,
        #[max_length = 50]
        password -> Varchar,
        #[max_length = 50]
        phone_number -> Varchar,
        #[max_length = 14]
        terms_accepted -> Bool,
        score -> Integer,
        created_at -> Timestamp,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use crate::models::types::exports::*;

    teams (id) {
        id -> Integer,
        teamName -> Varchar,
        #[max_length = 50]
        score -> Integer,
        created_at -> Timestamp,
    }
}
