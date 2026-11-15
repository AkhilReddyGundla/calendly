# Calendly API

A TypeScript and Express API for managing users, event types, availability rules, availability exceptions, and scheduling data. It uses PostgreSQL with Prisma and Luxon for time-related operations.

## Features

- User CRUD operations
- Event type CRUD operations
- Weekly availability rules
- Availability exceptions
- PostgreSQL persistence through Prisma
- Health check endpoint

## Requirements

- Node.js 20 or newer
- pnpm 10+
- PostgreSQL database

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure the environment

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
PORT=3000
NODE_ENV=development
SLOT_GENERATION_DAYS=30
```

`DATABASE_URL` is required by Prisma and the PostgreSQL adapter. `PORT`, `NODE_ENV`, and `SLOT_GENERATION_DAYS` have defaults in the application.
Local PostgreSQL hosts (`localhost`, loopback addresses, or the Compose service name `postgres`) connect without TLS; other hosts use TLS.

### 3. Apply database migrations

For local development, create or update the database and generate the Prisma client:

```bash
pnpm prisma:migrate
pnpm prisma:generate
```

You can also run the combined Prisma workflow:

```bash
pnpm prisma:all
```

### 4. Start the API

Development mode watches the `src` directory and restarts on TypeScript changes:

```bash
pnpm dev
```

The API is available at `http://localhost:3000` by default.

## API

### Health check

```http
GET /health
```

Example:

```bash
curl http://localhost:3000/health
```

### Users

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/users` | List users |
| `GET` | `/users/:id` | Get a user |
| `POST` | `/users/create` | Create a user |
| `PATCH` | `/users/:id/update` | Update a user |
| `DELETE` | `/users/:id/delete` | Delete a user |

Create a user:

```bash
curl -X POST http://localhost:3000/users/create \
  -H 'Content-Type: application/json' \
  -d '{"email":"alex@example.com","name":"Alex"}'
```

### Event types

All event type endpoints require the `user-id` header.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/event-types` | List the current user's event types |
| `GET` | `/event-types/:eventTypeId` | Get an event type |
| `POST` | `/event-types` | Create an event type |
| `PATCH` | `/event-types/:eventTypeId` | Update an event type |
| `DELETE` | `/event-types/:eventTypeId` | Delete an event type |

Create an event type:

```bash
curl -X POST http://localhost:3000/event-types \
  -H 'Content-Type: application/json' \
  -H 'user-id: 1' \
  -d '{
    "title":"Intro call",
    "description":"A short introductory meeting",
    "durationMinutes":30,
    "locationType":"online",
    "locationValue":"https://meet.example.com/intro"
  }'
```

### Availability

All availability endpoints require the `user-id` header.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/availability/rules` | List weekly availability rules |
| `POST` | `/availability/rules` | Create an availability rule |
| `PATCH` | `/availability/rules/:ruleId` | Update an availability rule |
| `DELETE` | `/availability/rules/:ruleId` | Delete an availability rule |
| `GET` | `/availability/exception` | List availability exceptions |
| `POST` | `/availability/exceptions` | Create an availability exception |
| `PATCH` | `/availability/exceptions/:exceptionId` | Update an availability exception |
| `DELETE` | `/availability/exceptions/:exceptionId` | Delete an availability exception |

Create a weekly rule:

```bash
curl -X POST http://localhost:3000/availability/rules \
  -H 'Content-Type: application/json' \
  -H 'user-id: 1' \
  -d '{
    "weekday":1,
    "startTime":"09:00",
    "endTime":"17:00",
    "timezone":"UTC"
  }'
```

Supported availability exception types are `BLOCK_FULL_DAY`, `BLOCK_PARTIAL`, and `ADD_AVAILABLE_WINDOW`.

## Project Structure

```text
src/
  controllers/   HTTP request handlers
  dtos/          Zod request validation schemas
  middleware/    validation, user context, and error handling
  repositories/  database access
  router/        Express route definitions
  services/      application logic
  utils/         shared API and slot helpers
prisma/
  schema.prisma  database schema
  migrations/    database migrations
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm prisma:format` | Format the Prisma schema |
| `pnpm prisma:migrate` | Create/apply a development migration |
| `pnpm prisma:generate` | Generate the Prisma client |
| `pnpm prisma:all` | Format, migrate, and generate |

## Current Limitations

- The `user-id` header is used as request context; authentication and authorization are not implemented.
- Booking routes are not currently mounted in `src/app.ts`, and the booking router is incomplete.
- The checked-in `docker-compose.yml` contains configuration typos and should be corrected before using it as the local infrastructure setup.
