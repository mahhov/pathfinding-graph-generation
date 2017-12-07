databaseUrl=$(heroku config:get DATABASE_URL)
psql $databaseUrl