-- Your SQL goes here

CREATE TABLE "admins"(
	"id" SERIAL PRIMARY KEY,
	"username" VARCHAR(20) NOT NULL,
	"email" VARCHAR(255) NOT NULL,
	"password" VARCHAR(150) NOT NULL
);

