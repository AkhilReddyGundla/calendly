# Calendly API

A TypeScript and Express API for managing users, event types, availability rules, availability exceptions, and scheduling data. It uses PostgreSQL with Prisma and Luxon for time-related operations.

## Features

- User CRUD operations
- Event type CRUD operations
- Weekly availability rules
- Availability exceptions
- Service logic for generating and reconciling future event slots
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
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/defaultdb?schema=public"
PORT=3000
NODE_ENV=development
SLOT_GENERATION_DAYS=30
```

`DATABASE_URL` is required by Prisma and the PostgreSQL adapter. `POSTGRES_USER` and `POSTGRES_PASSWORD` are used by Docker Compose. `PORT`, `NODE_ENV`, and `SLOT_GENERATION_DAYS` have defaults in the application; the slot-generation service uses the latter as its default generation window.
Local PostgreSQL hosts (`localhost`, loopback addresses, or the Compose service name `postgres`) connect without TLS; other hosts use TLS.

### 3. Start local PostgreSQL (optional)

The Compose file can start PostgreSQL for local development:

```bash
docker compose up -d postgres
```

It also defines Temporal and the Temporal UI; those services are not currently used by the API.

### 4. Apply database migrations

For local development, create or update the database and generate the Prisma client:

```bash
pnpm prisma:migrate
pnpm prisma:generate
```

You can also run the combined Prisma workflow:

```bash
pnpm prisma:all
```

### 5. Start the API

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
| `GET` | `/api/users` | List users |
| `GET` | `/api/users/:id` | Get a user |
| `POST` | `/api/users/create` | Create a user |
| `PATCH` | `/api/users/:id/update` | Update a user |
| `DELETE` | `/api/users/:id/delete` | Delete a user |

Create a user:

```bash
curl -X POST http://localhost:3000/api/users/create \
  -H 'Content-Type: application/json' \
  -d '{"email":"alex@example.com","name":"Alex"}'
```

### Event types

All event type endpoints require the `user-id` header.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/event-types` | List the current user's event types |
| `GET` | `/api/event-types/:eventTypeId` | Get an event type |
| `POST` | `/api/event-types` | Create an event type |
| `PATCH` | `/api/event-types/:eventTypeId` | Update an event type |
| `DELETE` | `/api/event-types/:eventTypeId` | Delete an event type |

Create an event type:

```bash
curl -X POST http://localhost:3000/api/event-types \
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
| `GET` | `/api/availability/rules` | List weekly availability rules |
| `POST` | `/api/availability/rules` | Create an availability rule |
| `PATCH` | `/api/availability/rules/:ruleId` | Update an availability rule |
| `DELETE` | `/api/availability/rules/:ruleId` | Delete an availability rule |
| `GET` | `/api/availability/exception` | List availability exceptions |
| `POST` | `/api/availability/exceptions` | Create an availability exception |
| `PATCH` | `/api/availability/exceptions/:exceptionId` | Update an availability exception |
| `DELETE` | `/api/availability/exceptions/:exceptionId` | Delete an availability exception |

Create a weekly rule:

```bash
curl -X POST http://localhost:3000/api/availability/rules \
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
- Booking routes are not currently mounted, and the booking router is incomplete.
- Slot generation is implemented as service logic but is not exposed through an API route or wired to a scheduled job.
