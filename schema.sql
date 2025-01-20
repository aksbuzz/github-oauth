DROP TABLE IF EXISTS "session";
DROP SEQUENCE IF EXISTS session_id_seq;
CREATE SEQUENCE session_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."session" (
    "id" character varying(255) DEFAULT 'nextval(''session_id_seq'')' NOT NULL,
    "user_id" integer NOT NULL,
    "expires" date NOT NULL,
    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
) WITH (oids = false);


DROP TABLE IF EXISTS "users";
DROP SEQUENCE IF EXISTS users_id_seq;
CREATE SEQUENCE users_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."users" (
    "id" integer DEFAULT nextval('users_id_seq') NOT NULL,
    "user_id" integer NOT NULL,
    "username" character varying(255) NOT NULL,
    "email" character varying(255) NOT NULL,
    CONSTRAINT "users_id_key" UNIQUE ("id"),
    CONSTRAINT "users_user_id" PRIMARY KEY ("user_id")
) WITH (oids = false);


ALTER TABLE ONLY "public"."session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) NOT DEFERRABLE;