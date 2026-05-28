# Database exam project(Choose your fate)

## Running the databases

Start the database containers in detached mode:

```bash
docker compose up -d
```

If you need a clean MySQL reseed, recreate the Docker volumes:

All our SQL scripts are in rpg_mysql folder
## Dump files
```bash
docker compose down -v
docker compose up -d
```
## Running the backend
With the database containers running, start the Spring Boot application locally from the backend project.
Swagger UI is available at:
[http://localhost:8080/swagger-ui/index.html#/](http://localhost:8080/swagger-ui/index.html#/)
Deployed Swagger UI is available at:
https://rpg-choose-your-fate.onrender.com/swagger-ui/index.html#/

Database dump files should be placed in the [database_backups](C:\Users\pf\Desktop\Skole\Databases\projects\mandetory\RPG_Choose_Your_Fate\database_backups) folder.

- MongoDB dump path: [database_backups/mongo](C:\Users\pf\Desktop\Skole\Databases\projects\mandetory\RPG_Choose_Your_Fate\database_backups\mongo)
- Neo4j dump path: [database_backups/neo4j](C:\Users\pf\Desktop\Skole\Databases\projects\mandetory\RPG_Choose_Your_Fate\database_backups\neo4j)

How ever we do not use them. We run the migration process to populate mongoDB and neo4j
with data. The files are only include because they are part the required deliverables.

## SQL scripts

All SQL scripts are located in the [rpg_mysql](C:\Users\pf\Desktop\Skole\Databases\projects\mandetory\RPG_Choose_Your_Fate\rpg_mysql) folder.

The local Docker MySQL setup runs the scripts in this order:

1. `01_create_schema.sql`
2. `02_procedures.sql`
3. `03_functions.sql`
4. `04_triggers.sql`
5. `05_seed_data.sql`
6. `06_seed_mock_data.sql`
7. `07_seed_scene_choice_expansion.sql`
8. `08_security_roles.sql`
9. `09_events.sql`
