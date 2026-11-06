# FitnessTracker Service

The main backend of the Fitness Tracker project. It manages workouts and meals, calculates daily nutrition and fitness summaries, and calls the [notification service](../notification-service/README.md) whenever a workout is added.

Users are owned by [user-service](../user-service/README.md). This service stores only a user's id on each workout and meal, and asks user-service whether the user exists before saving one.

## Tech stack

Java 21, Spring Boot 4.1 (Web MVC, Data JPA, Validation), MySQL, Lombok.

## Project structure

```
FitnessTracker/src/main/java/org/fitness/FitnessTracker/
├── controller/
│   ├── WorkoutController.java           /api/workouts
│   ├── DietController.java              /api/diets
│   ├── FitnessSummaryController.java    /api/fitness
│   └── NotificationTestController.java  /api/test-notification
├── client/UserClient.java   asks user-service whether a user exists
├── service/                 business logic, plus NotificationClient
├── repository/              Spring Data JPA repositories
├── entity/                  Workout, Diet
├── dto/                     request/response objects with validation rules
├── exception/               GlobalExceptionHandler, ResourceNotFoundException, ServiceUnavailableException
├── config/RestClientConfig.java   RestClient used to call other services
└── CorsConfig.java          allows the frontend at http://localhost:5173
```

## Database

Uses the MySQL database `fitness_tracker` on `localhost:3306`. Hibernate creates and updates these tables:

| Table | Holds | Links |
|---|---|---|
| `workouts` | type, duration, calories burned, date | `user_id`: id of a user in user-service |
| `diet` | meal type, food, calories, protein, carbs, fat, fibre, date | `user_id`: id of a user in user-service |

`user_id` is a plain column, not a foreign key, because the users live in another service.

## Run it

1. Create the database once:

   ```sql
   CREATE DATABASE fitness_tracker;
   ```

2. The username is `root`, set in `application.properties`. The password isn't stored in the repo, so give it through an environment variable:

   ```powershell
   # PowerShell
   $env:SPRING_DATASOURCE_PASSWORD = "your-password"
   ```

   ```bash
   # bash
   export SPRING_DATASOURCE_PASSWORD=your-password
   ```

3. Start the service from the `FitnessTracker` folder:

   ```bash
   ./mvnw spring-boot:run        # Windows: .\mvnw.cmd spring-boot:run
   ```

The API runs on **http://localhost:8081**.

Also start:

- **[user-service](../user-service/README.md) on port 8083.** It is required for adding or updating workouts and meals. Its address is set by `services.user-service.url` in `application.properties`.
- **[notification-service](../notification-service/README.md) on port 8082,** if you want workout notifications. Workouts still save without it.

### Upgrading an existing database

Older versions of this service created foreign keys from `workouts` and `diet` to `users`. Those keys stop user-service from deleting users, so drop them once:

```sql
SELECT TABLE_NAME, CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'fitness_tracker' AND REFERENCED_TABLE_NAME = 'users';

-- then, for each row returned:
ALTER TABLE workouts DROP FOREIGN KEY <constraint name>;
ALTER TABLE diet DROP FOREIGN KEY <constraint name>;
```

## API

Dates use the `YYYY-MM-DD` format, for example `2026-11-06`.

### Workouts — `/api/workouts`

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/workouts` | Add a workout → `201`. Checks the user in user-service first. Also sends a notification. |
| `GET` | `/api/workouts` | List all workouts |
| `GET` | `/api/workouts/{id}` | Get one workout |
| `GET` | `/api/workouts/user/{userId}` | List a user's workouts |
| `PUT` | `/api/workouts/{id}` | Update a workout |
| `DELETE` | `/api/workouts/{id}` | Delete a workout → `204` |

```json
{ "workoutType": "Running", "duration": 30, "caloriesBurned": 280, "workoutDate": "2026-11-06", "userId": 1 }
```

Rules: `workoutType` required, `duration` at least 1 (minutes), `caloriesBurned` 0 or more, `workoutDate` and `userId` required.

### Diet — `/api/diets`

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/diets` | Log a meal → `201`. Checks the user in user-service first. |
| `GET` | `/api/diets` | List all meals |
| `GET` | `/api/diets/{id}` | Get one meal |
| `GET` | `/api/diets/user/{userId}` | List a user's meals |
| `GET` | `/api/diets/user/{userId}/summary?date=2026-11-06` | Total calories, protein, carbs, fat and fibre for one day |
| `PUT` | `/api/diets/{id}` | Update a meal |
| `DELETE` | `/api/diets/{id}` | Delete a meal → `204` |

```json
{
  "mealType": "Lunch", "foodName": "Dal rice", "calories": 450,
  "protein": 18, "carbs": 70, "fat": 9, "fibre": 6,
  "mealDate": "2026-11-06", "userId": 1
}
```

Rules: `mealType` and `foodName` required; `calories`, `protein`, `carbs` and `fat` must be greater than 0; `fibre` 0 or more; `mealDate` and `userId` required.

### Daily fitness summary — `/api/fitness`

`GET /api/fitness/users/{userId}/summary?date=2026-11-06` combines that day's meals and workouts:

```json
{
  "date": "2026-11-06",
  "caloriesConsumed": 1850.0,
  "caloriesBurned": 280.0,
  "netCalories": 1570.0,
  "protein": 72.0, "carbs": 240.0, "fat": 55.0, "fibre": 24.0,
  "workoutDuration": 30
}
```

### Delete a user's data — `/api/fitness`

`DELETE /api/fitness/users/{userId}` deletes every workout and meal of that user and returns `204`. user-service calls it just before deleting a user.

### Notification test — `/api/test-notification`

`POST /api/test-notification` sends a test message through the notification service and returns its response.

## Errors

| Status | When | Body |
|---|---|---|
| `400` | A field fails validation | `{ "field": "message", ... }` |
| `404` | A workout or meal id doesn't exist, or the user doesn't exist in user-service | `{ "error": "User 7 not found" }` |
| `503` | Adding or updating a workout or meal while user-service is down | `{ "error": "User service is unavailable, so user 7 could not be checked" }` |

## Notes

- Notifications always go to the hard-coded address `sheefa@example.com`, and the notification service URL `http://localhost:8082` is also hard-coded in `NotificationClient`.
- If the notification service is down, the workout is still saved and the failure is printed to the console.
- CORS allows only `http://localhost:5173`; change `CorsConfig` if the frontend runs anywhere else.
