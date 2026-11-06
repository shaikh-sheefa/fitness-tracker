# Notification Service

A small Spring Boot microservice that receives notification requests from the other Fitness Tracker services. The [FitnessTracker service](../FitnessTracker/README.md) calls it every time a workout is added.

**Current status:** the service doesn't send real emails or push messages yet. It accepts the request and echoes it back with `"status": "success"`, which makes it a placeholder to plug a real email or SMS provider into later.

## Tech stack

Java 21, Spring Boot 4 (Web MVC). No database.

## Project structure

```
notification-service/
├── notification-test.http        ready-made request for IntelliJ's HTTP client
└── src/main/java/org/fitness/notification/
    ├── NotificationServiceApplication.java
    ├── controller/NotificationController.java
    └── dto/NotificationRequest.java          recipient + message
```

## Run it

From the `notification-service` folder:

```bash
./mvnw spring-boot:run        # Windows: .\mvnw.cmd spring-boot:run
```

The service runs on **http://localhost:8082**. It needs no database or environment variables.

## API

### `GET /api/notifications`

A health check that shows the service is up.

```json
{ "message": "Welcome to Notification Service!" }
```

### `POST /api/notifications`

Sends a notification. Request body:

```json
{
  "recipient": "sheefa@example.com",
  "message": "Your workout is complete!"
}
```

Response:

```json
{
  "status": "success",
  "recipient": "sheefa@example.com",
  "message": "Your workout is complete!"
}
```

Try it with curl:

```bash
curl -X POST http://localhost:8082/api/notifications \
  -H "Content-Type: application/json" \
  -d '{"recipient":"sheefa@example.com","message":"Your workout is complete!"}'
```

You can also open `notification-test.http` in IntelliJ and click **Run**.

## How it's used

When a workout is created through `POST http://localhost:8081/api/workouts`, the FitnessTracker service posts a message like this one to this service:

```
Workout added successfully: Running for 30 minutes.
```

If this service isn't running, the workout is still saved; FitnessTracker only logs that the notification failed.

## Limitations

- No real delivery: nothing is emailed or pushed anywhere.
- Fields aren't validated. A missing `recipient` or `message` makes the response fail with a server error, because the response map can't hold empty values.
- Notifications aren't stored, so there is no history.
