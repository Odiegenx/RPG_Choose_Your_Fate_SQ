# Mandatory-one-database

To run the container detached

docker compose up -d

With the spring application running: http://localhost:8080/swagger-ui/index.html#/

All our SQL scripts are in rpg_mysql folder

MySQL seed data is available in `rpg_mysql/06_seed_data.sql`.
If the MySQL Docker volume already exists, reload the schema and seed data with:

To run the application with databases use "docker compose up -d" and make sure the needed ports (They can be found in the docker compose file) are open.
Then simply run the Spring Boot application

docker compose down -v
docker compose up -d

