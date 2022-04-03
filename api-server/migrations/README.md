Migrations
----------------

This is where migrations live. Migrations currently use Sequelize. For more documentation
see https://stackoverflow.com/questions/27835801/how-to-auto-generate-migrations-with-sequelize-cli-from-sequelize-models

### Creating a migration

`npx sequelize-cli migration:generate --name migration-name`

### Running all migrations

`npm run db:migrate`

### Rolling back most recent migration

`npm run db:migrate:down-one`
