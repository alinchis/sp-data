
-- create sources table
CREATE TABLE "aa_metadata"."Sources" (
  id            SERIAL        PRIMARY KEY,
  source_id     VARCHAR(20)   NOT NULL,
  name_short    VARCHAR(30)   NULL,
  name_long     VARCHAR(100)  NOT NULL,
  lang_code     CHAR(3)       NOT NULL,
  lang_default  CHAR(3)       NOT NULL,
  description   VARCHAR(255)  NOT NULL,
  url           VARCHAR(255)  NULL);
