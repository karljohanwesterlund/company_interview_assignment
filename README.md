# Development assignment

> Create an application which manages messages and provides details about those messages,
> specifically whether or not a message is a palindrome. Your application should support the
> following operations:
>
> -   Create, retrieve, update, and delete a message
> -   List messages
>
> These operations should follow proper RESTful design.

## Setup

### Prerequisits

The following installed:

-   Docker
-   Node 24.8.0

### Environment files

First, set up the three needed env files:

```bash
cp .env.example .env && cp .env.example .env.dc && cp database.env.example database.env
```

The `.env` file is used for development when running the server not in a container (such as `npm run development` or knex migrations). The `.env.dc` and `database.env` file is used for docker compose using "production".

An example of an `.env` file would be

```
PORT=8080
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=localhost
DATABASE_NAME=message_database
DATABASE_PORT=5432
```

The major change in a `.env.dc` file would be, a part from the username/passwords, that the _DATABASE_HOST_ should point to the service name ("database" according to `docker-compose.yml`).

### Installation & running

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

## Documentation

The API has a swagger documentation that is hosted on (http://localhost:8080/api-docs)[http://localhost:8080/api-docs] when the service is running.

## Tests

Tests are run via `npm run test` - this runs both jest unit tests and supertest integration/endpoint tests.

To test only unit or integration test, run `npm run test:unit` / `npm run test:integration`.
