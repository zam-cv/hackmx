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

diesel::table! {
    use diesel::sql_types::*;
    use crate::models::types::exports::*;

    users (id) {
        id -> Int4,
        #[max_length = 20]
        username -> Varchar,
        #[max_length = 40]
        firstname -> Varchar,
        #[max_length = 40]
        lastname -> Varchar,
        #[max_length = 255]
        personal_email -> Varchar,
        #[max_length = 20]
        phone -> Varchar,
        semester -> Int4,
        campus -> Nullable<Campus>,
        major -> Nullable<Major>,
        #[max_length = 255]
        email -> Varchar,
        #[max_length = 150]
        password -> Varchar,
    }
}

diesel::table! {
    events (id) {
        id -> Int4,
        #[max_length = 100]
        title -> Varchar,
        #[max_length = 500]
        description -> Varchar,
        quota_per_team -> Int4,
        start_date -> Timestamp,
        end_date -> Timestamp,
        #[max_length = 100]
        location -> Varchar,
        #[max_length = 600]
        map_url -> Varchar,
    }
}

diesel::table! {
    event_participants (user_id, event_id) {
        user_id -> Int4,
        event_id -> Int4,
        confirmed -> Bool,
        with_bus -> Bool,
    }
}

diesel::table! {
    universities (id) {
        id -> Int4,
        #[max_length = 100]
        name -> Varchar,
        #[max_length = 300]
        image -> Varchar,
        #[max_length = 500]
        description -> Varchar,
        #[max_length = 50]
        email_extension -> Varchar,
    }
}

diesel::table! {
    university_quota (event_id, university_id) {
        event_id -> Int4,
        university_id -> Int4,
        quota -> Int4,
    }
}

diesel::table! {
    sponsors (id) {
        id -> Int4,
        #[max_length = 100]
        name -> Varchar,
        #[max_length = 300]
        image -> Varchar,
        #[max_length = 500]
        description -> Varchar,
        #[max_length = 255]
        email -> Varchar,
    }
}

diesel::table! {
    event_sponsors (id) {
        id -> Int4,
        event_id -> Int4,
        sponsor_id -> Int4,
    }
}

diesel::table! {
    awards (id) {
        id -> Int4,
        event_sponsor_id -> Int4,
        #[max_length = 100]
        title -> Varchar,
    }
}

diesel::table! {
    event_tasks (id) {
        id -> Int4,
        event_id -> Int4,
        #[max_length = 100]
        title -> Varchar,
        #[max_length = 500]
        description -> Varchar,
        date -> Timestamp,
    }
}

diesel::table! {
    teams (id) {
        id -> Int4,
        event_id -> Int4,
        #[max_length = 100]
        name -> Varchar,
        #[max_length = 500]
        description -> Varchar,
        user_id -> Int4,
        code -> Nullable<Int4>,
    }
}

diesel::table! {
    projects (id) {
        id -> Int4,
        #[max_length = 100]
        name -> Varchar,
        #[max_length = 500]
        url -> Varchar,
        sponsor_id -> Int4,
        team_id -> Int4,
        #[max_length = 200]
        zip -> Varchar,
        #[max_length = 1000]
        description -> Varchar,
    }
}

diesel::table! {
    members (id) {
        id -> Int4,
        team_id -> Int4,
        user_id -> Int4,
    }
}

diesel::table! {
    documents (id) {
        id -> Int4,
        event_id -> Int4,
        #[max_length = 100]
        name -> Varchar,
    }
}

diesel::table! {
    gallery (id) {
        id -> Int4,
        event_id -> Int4,
        #[max_length = 100]
        name -> Varchar,
    }
}

diesel::table! {
    publications (id) {
        id -> Int4,
        event_id -> Int4,
        #[max_length = 100]
        title -> Varchar,
        #[max_length = 500]
        description -> Varchar,
        date -> Timestamp,
    }
}

diesel::table! {
    messages (id) {
        id -> Int4,
        event_id -> Int4,
        user_id -> Int4,
        #[max_length = 500]
        content -> Varchar,
        date -> Timestamp,
    }
}

diesel::table! {
    fqa (id) {
        id -> Int4,
        event_id -> Int4,
        #[max_length = 500]
        question -> Varchar,
        #[max_length = 500]
        answer -> Varchar,
    }
}

diesel::joinable!(event_participants -> users (user_id));
diesel::joinable!(event_participants -> events (event_id));
diesel::joinable!(university_quota -> events (event_id));
diesel::joinable!(university_quota -> universities (university_id));
diesel::joinable!(event_sponsors -> events (event_id));
diesel::joinable!(event_sponsors -> sponsors (sponsor_id));
diesel::joinable!(awards -> event_sponsors (event_sponsor_id));
diesel::joinable!(event_tasks -> events (event_id));
diesel::joinable!(teams -> events (event_id));
diesel::joinable!(teams -> users (user_id));
diesel::joinable!(projects -> teams (team_id));
diesel::joinable!(projects -> sponsors (sponsor_id));
diesel::joinable!(members -> teams (team_id));
diesel::joinable!(members -> users (user_id));
diesel::joinable!(documents -> events (event_id));
diesel::joinable!(gallery -> events (event_id));
diesel::joinable!(publications -> events (event_id));
diesel::joinable!(messages -> events (event_id));
diesel::joinable!(messages -> users (user_id));
diesel::joinable!(fqa -> events (event_id));

diesel::allow_tables_to_appear_in_same_query!(
    admins,
    users,
    event_participants,
    events,
    universities,
    university_quota,
    sponsors,
    event_sponsors,
    awards,
    event_tasks,
    teams,
    projects,
    members,
    documents,
    gallery,
    publications,
    messages,
    fqa,
);
