# Fitness Tracker

A fitness tracking app built as a set of Spring Boot microservices with React frontends. Users can log workouts and meals, see daily nutrition and calorie summaries, and every new workout is passed to a notification service.

## Modules

| Folder | What it is | Port |
|---|---|---|
| [`FitnessTracker/`](FitnessTracker/README.md) | Main service: users, workouts, diet, and daily summaries | 8081 |
| [`notification-service/`](notification-service/README.md) | Receives notification requests from the main service | 8082 |
| [`user-service/`](user-service/README.md) | Stand-alone user management service | 8083 |
| [`frontend/`](frontend/README.md) | React app for workouts, diet and nutrition summaries (talks to 8081) | 5173 |
| [`user-service/frontend/`](user-service/README.md#run-the-frontend) | Startline: React app for managing athletes (talks to 8083) | 5173 |

## Architecture

```
  frontend (5173) ──────────► FitnessTracker (8081) ──────► notification-service (8082)
                                     │                      called after each new workout
                                     ▼
                              MySQL: fitness_tracker
                                     ▲
                                     │
  user-service/frontend ────► user-service (8083)
```

- `FitnessTracker` and `user-service` use the same MySQL database, `fitness_tracker`, and the same `users` table. A user created in one shows up in the other.
- `notification-service` has no database.

## Tech stack

- **Backend:** Java 21, Spring Boot 4, Spring Data JPA, Bean Validation
- **Database:** MySQL
- **Frontend:** React 19, Vite

## Getting started

### Prerequisites

- JDK 21 or newer
- MySQL running on `localhost:3306`
- Node.js 20.19 or newer

### 1. Create the database

```sql
CREATE DATABASE fitness_tracker;
```

Hibernate creates the tables automatically when the services start.

### 2. Start the services

Start each service from its own folder, in a separate terminal (on Windows use `.\mvnw.cmd` instead of `./mvnw`):

```bash
cd notification-service && ./mvnw spring-boot:run
cd FitnessTracker       && ./mvnw spring-boot:run
cd user-service         && ./mvnw spring-boot:run
```

`FitnessTracker` and `user-service` need your MySQL password; see each module's README for how to set it.

### 3. Start a frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

Both frontends use port 5173 by default. If you run both at once, start `frontend/` first: `FitnessTracker` only accepts browser requests from `http://localhost:5173`. Vite then moves Startline to the next free port, such as 5174, and Startline doesn't need CORS because its dev server proxies the API.

## Repository layout

```
fitness-tracker/
├── FitnessTracker/         main Spring Boot service
├── notification-service/   notification Spring Boot service
├── user-service/           user Spring Boot service + Startline frontend
└── frontend/               main React frontend
```
