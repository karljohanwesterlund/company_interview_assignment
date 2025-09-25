# [Development assignment](#assignment)

> Create an application which manages messages and provides details about those messages,
> specifically whether or not a message is a palindrome. Your application should support the
> following operations:
>
> -   Create, retrieve, update, and delete a message
> -   List messages
>
> These operations should follow proper RESTful design.

## [Setup](#setup)

### [Prerequisits](#prerequisits)

The following installed:

-   Docker
-   Node 24.8.0

### [Environment files](#env)

First, set up the three needed env files:

```bash
cp .env.example .env && cp database.env.example database.env
```

The `.env` file is used for development when running the server not in a container (such as `npm run development` or knex migrations). The `database.env` file is used for docker compose using "production".

An example of an `.env` file would be

```
PORT=8080
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=localhost
DATABASE_NAME=message_database
DATABASE_PORT=5432
```

The docker-compose YML-files share this configuration, the main difference is that **DATABASE_HOST** is set to the service name.

### [Installation & running](#install)

Run npm install

```
npm install
```

As the application uses a database (PostgreSQL) for demoing, we need to buld & start the docker services:

```
docker compose build && docker compose up -d
```

This will initialize a new databse and star the application. We need to run the knex migration to set up the database:

```
npm run knex:migrate
```

**NOTE:** The `.env` file needs to point to localhost/127.0.0.1 for this to work.

Now the application is running and can take requests. Either use the swagger UI (See [Documentation](#documentation)) or CURL:

```bash
# Create entry
curl -X POST http://localhost:8080/messages \
  -H "Content-Type: application/json" \
  -d '{"message":"My message"}'

# Update message on entry with ID 4
curl -X PATCH http://localhost:8080/messages/4 \
  -H "Content-Type: application/json" \
  -d '{"message":"abcba"}'

# Retreive message with ID 4
curl http://localhost:8080/messages/4

# Delete message with ID 4
curl -X DELETE http://localhost:8080/messages/4

# List all messages
curl http://localhost:8080/messages
```

### [Development](#development)

Hot reload is setup if there is a need for it while running the server. Build/run with the `docker-compose-dev.yml` file:

```
docker compose -f docker-compose-dev.yml build && docker compose -f docker-compose-dev.yml up
```

## [Documentation](#documentation)

The API has a swagger documentation that is hosted on [http://localhost:8080/api-docs](http://localhost:8080/api-docs) when the service is running.

## [Tests](#tests)

Tests are run via `npm run test` - this runs both jest unit tests and supertest integration/endpoint tests.

To test only unit or integration test, run `npm run test:unit` / `npm run test:integration`.
