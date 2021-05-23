\echo 'Delete and recreate commerce db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE commerce;
CREATE DATABASE commerce;
\connect commerce;

\i commerce-schema.sql;
\i commerce-seed.sql;

\echo 'Delete and recreate jobly_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE commerce_test;
CREATE DATABASE commerce_test;
\connect commerce_test;

\i commerce-schema.sql;
