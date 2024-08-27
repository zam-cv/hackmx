-- Your SQL goes here
CREATE TYPE CAMPUS AS ENUM ('ccm', 'csf', 'cem', 'toluca');
CREATE TYPE MAJOR AS ENUM ('arq', 'lub', 'lec', 'lri', 'led', 'ltp', 'lc', 'lei', 'lpe', 'lad', 'ldi', 'lle', 'ltm', 'idm', 'ina', 'ial', 'ids', 'irs', 'itd', 'ie', 'iis', 'ifi', 'iag', 'ibt', 'iq', 'ic', 'itc', 'iid', 'im', 'imd', 'imt', 'lae', 'lcpf', 'ldo', 'lin', 'laf', 'lde', 'lem', 'lit', 'lbc', 'lps', 'mo', 'lnb', 'mc');

CREATE TABLE "admins"(
	"id" SERIAL PRIMARY KEY,
	"username" VARCHAR(20) NOT NULL,
	"email" VARCHAR(255) NOT NULL,
	"password" VARCHAR(150) NOT NULL
);

CREATE TABLE "users"(
	"id" SERIAL PRIMARY KEY,
	"username" VARCHAR(20) NOT NULL,
	"firstname" VARCHAR(40) NOT NULL,
	"lastname" VARCHAR(40) NOT NULL,
	"personal_email" VARCHAR(255) NOT NULL,
	"phone" VARCHAR(20) NOT NULL,
	"semester" INT4 NOT NULL,
	"campus" CAMPUS,
	"major" MAJOR,
	"email" VARCHAR(255) NOT NULL,
	"password" VARCHAR(150) NOT NULL
);

CREATE TABLE "events"(
	"id" SERIAL PRIMARY KEY,
	"title" VARCHAR(100) NOT NULL,
	"description" VARCHAR(1000) NOT NULL,
	"quota_per_team" INT4 NOT NULL,
	"start_date" TIMESTAMP NOT NULL,
	"end_date" TIMESTAMP NOT NULL,
	"location" VARCHAR(100) NOT NULL,
	"map_url" VARCHAR(600) NOT NULL
);

CREATE TABLE "event_participants"(
	"user_id" INT4 NOT NULL,
	"event_id" INT4 NOT NULL,
	"confirmed" BOOL NOT NULL,
	"with_bus" BOOL NOT NULL,
	PRIMARY KEY("user_id", "event_id")
);

CREATE TABLE "universities"(
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(100) NOT NULL,
	"image" VARCHAR(200) NOT NULL,
	"description" VARCHAR(500) NOT NULL,
	"email_extension" VARCHAR(50) NOT NULL
);

CREATE TABLE "university_quota"(
	"event_id" INT4 NOT NULL,
	"university_id" INT4 NOT NULL,
	"quota" INT4 NOT NULL,
	PRIMARY KEY("event_id", "university_id")
);

CREATE TABLE "sponsors"(
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(100) NOT NULL,
	"image" VARCHAR(200) NOT NULL,
	"description" VARCHAR(500) NOT NULL,
	"email" VARCHAR(255) NOT NULL
);

CREATE TABLE "event_sponsors"(
	"id" SERIAL PRIMARY KEY,
	"event_id" INT4 NOT NULL,
	"sponsor_id" INT4 NOT NULL,
	FOREIGN KEY ("event_id") REFERENCES "events"("id"),
	FOREIGN KEY ("sponsor_id") REFERENCES "sponsors"("id")
);

CREATE TABLE "awards"(
	"id" SERIAL PRIMARY KEY,
	"event_sponsor_id" INT4 NOT NULL,
	"title" VARCHAR(100) NOT NULL,
	FOREIGN KEY ("event_sponsor_id") REFERENCES "event_sponsors"("id")
);

CREATE TABLE "event_tasks"(
	"id" SERIAL PRIMARY KEY,
	"event_id" INT4 NOT NULL,
	"title" VARCHAR(100) NOT NULL,
	"description" VARCHAR(500) NOT NULL,
	"date" TIMESTAMP NOT NULL,
	FOREIGN KEY ("event_id") REFERENCES "events"("id")
);

CREATE TABLE "teams"(
	"id" SERIAL PRIMARY KEY,
	"event_id" INT4 NOT NULL,
	"name" VARCHAR(100) NOT NULL,
	"description" VARCHAR(500) NOT NULL,
	"user_id" INT4 NOT NULL,
	"code" INT4,
	FOREIGN KEY ("event_id") REFERENCES "events"("id"),
	FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

CREATE TABLE "members"(
	"id" SERIAL PRIMARY KEY,
	"team_id" INT4 NOT NULL,
	"user_id" INT4 NOT NULL,
	FOREIGN KEY ("team_id") REFERENCES "teams"("id"),
	FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

CREATE TABLE "documents"(
	"id" SERIAL PRIMARY KEY,
	"event_id" INT4 NOT NULL,
	"name" VARCHAR(100) NOT NULL,
	FOREIGN KEY ("event_id") REFERENCES "events"("id")
);

CREATE TABLE "publications"(
	"id" SERIAL PRIMARY KEY,
	"event_id" INT4 NOT NULL,
	"title" VARCHAR(100) NOT NULL,
	"description" VARCHAR(500) NOT NULL,
	"date" TIMESTAMP NOT NULL,
	FOREIGN KEY ("event_id") REFERENCES "events"("id")
);

CREATE TABLE "messages"(
	"id" SERIAL PRIMARY KEY,
	"event_id" INT4 NOT NULL,
	"user_id" INT4 NOT NULL,
	"content" VARCHAR(500) NOT NULL,
	"date" TIMESTAMP NOT NULL,
	FOREIGN KEY ("event_id") REFERENCES "events"("id"),
	FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

CREATE TABLE "fqa"(
	"id" SERIAL PRIMARY KEY,
	"event_id" INT4 NOT NULL,
	"question" VARCHAR(500) NOT NULL,
	"answer" VARCHAR(500) NOT NULL,
	FOREIGN KEY ("event_id") REFERENCES "events"("id")
);