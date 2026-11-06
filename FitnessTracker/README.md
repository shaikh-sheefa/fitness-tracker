# FitnessTracker Service

The main backend of the Fitness Tracker project. It manages users, workouts and meals, calculates daily nutrition and fitness summaries, and calls the [notification service](../notification-service/README.md) whenever a workout is added.

## Tech stack

Java 21, Spring Boot 4.1 (Web MVC, Data JPA, Validation), MySQL, Lombok.

## Project structure

```
FitnessTracker/src/main/java/org/fitness/FitnessTracker/
├── controller/
│   ├── UserController.java              /api/users
│   ├── WorkoutController.java           /api/workouts
│   ├── DietController.java              /api/diets
│   ├── FitnessSummaryController.java    /api/fitness
│   └── NotificationTestController.java  /api/test-notification
├── service/                 business logic, plus NotificationClient
├── repository/              Spring Data JPA repositories
├── entity/                  User, Workout, Diet
├── dto/                     request/response objects with validation rules
├── exception/               GlobalExceptionHandler, ResourceNotFoundException
├── config/RestClientConfig.java   RestClient used to call other services
└── CorsConfig.java          allows the frontend at http://localhost:5173
```

## Database

Uses the MySQL database `fitness_tracker` on `localhost:3306`. Hibernate creates and updates these tables:

| Table | Holds | Links |
|---|---|---|
| `users` | name, email, age, height, weight | shared with `user-service` |
| `workouts` | type, duration, calories burned, date | `user_id` → `users` |
| `diet` | meal type, food, calories, protein, carbs, fat, fibre, date | `user_id` → `users` |

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

The API runs on **http://localhost:8081**. Start the notification service on port 8082 as well if you want workout notifications; workouts still save without it.

## API

Dates use the `YYYY-MM-DD` format, for example `2026-11-06`.

### Users — `/api/users`

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/users` | Create a user → `201` |
| `GET` | `/api/users` | List all users |
| `GET` | `/api/users/{id}` | Get one user |
| `GET` | `/api/users/{userId}/workouts` | List a user's workouts |
| `PUT` | `/api/users/{id}` | Update a user |
| `DELETE` | `/api/users/{id}` | Delete a user → `204` |

```json
{ "name": "Priya Nair", "email": "priya@example.com", "age": 29, "height": 163, "weight": 55 }
```

Rules: `name` and `email` required, `email` must be valid, `age` 13–100, `height` at least 50 (cm), `weight` at least 20 (kg).

### Workouts — `/api/workouts`

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/workouts` | Add a workout → `201`, or `404` if the user doesn't exist. Also sends a notification. |
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
| `POST` | `/api/diets` | Log a meal → `201`, or `404` if the user doesn't exist |
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

### Notification test — `/api/test-notification`

`POST /api/test-notification` sends a test message through the notification service and returns its response.

## Errors

| Status | When | Body |
|---|---|---|
| `400` | A field fails validation | `{ "field": "message", ... }` |
| `404` | A user, workout or meal id doesn't exist | `{ "error": "Workout 7 not found" }` |
| `404` | Creating a workout or meal for an unknown user | empty body |

## Notes

- Notifications always go to the hard-coded address `sheefa@example.com`, and the notification service URL `http://localhost:8082` is also hard-coded in `NotificationClient`.
- If the notification service is down, the workout is still saved and the failure is printed to the console.
- CORS allows only `http://localhost:5173`; change `CorsConfig` if the frontend runs anywhere else.
