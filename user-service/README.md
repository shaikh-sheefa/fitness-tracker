# User Service

The user microservice of the Fitness Tracker project. It stores athlete profiles (name, email, age, height, weight) in MySQL and exposes them through a REST API. It ships with **Startline**, a React frontend for browsing and managing athletes.

## Tech stack

| Part | Technology |
|---|---|
| Backend | Java 21, Spring Boot 4 (Web MVC, Data JPA, Validation) |
| Database | MySQL |
| Frontend | React 19, Vite |

## Project structure

```
user-service/
├── pom.xml
├── src/main/java/org/fitness/userservice/
│   ├── controller/UserController.java    REST endpoints
│   ├── service/UserService.java          business logic
│   ├── repository/UserRepository.java    JPA repository
│   ├── entity/User.java                  database table "users"
│   ├── dto/UserDTO.java                  request body + validation rules
│   └── GlobalExceptionHandler.java       turns validation errors into JSON
├── src/main/resources/application.properties
└── frontend/                             Startline React app
    ├── vite.config.js                    proxies /api to port 8083
    └── src/
        ├── App.jsx                       app state and layout
        ├── api.js                        calls to the REST API
        ├── bmi.js                        BMI maths and classes
        └── components/                   UI pieces
```

## Prerequisites

- JDK 21 or newer
- MySQL running on `localhost:3306`
- Node.js 20.19 or newer (for the frontend)

## Run the backend

1. Create the database once. Hibernate creates the `users` table itself.

   ```sql
   CREATE DATABASE fitness_tracker;
   ```

2. Set your MySQL login. Both variables are optional: the username defaults to `root` and the password to empty.

   ```powershell
   # PowerShell
   $env:DB_USERNAME = "root"
   $env:DB_PASSWORD = "your-password"
   ```

   ```bash
   # bash
   export DB_USERNAME=root
   export DB_PASSWORD=your-password
   ```

3. Start the service from the `user-service` folder:

   ```bash
   ./mvnw spring-boot:run        # Windows: .\mvnw.cmd spring-boot:run
   ```

The API is now on **http://localhost:8083**.

## Run the frontend

In a second terminal, while the backend is running:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. The Vite dev server forwards every `/api` request to port 8083, so no CORS setup is needed during development.

**Features:**

- Athlete roster shown as race bibs or as a table, with search and sorting
- Body map: a height vs. weight chart with BMI zones; click a dot to open that athlete
- BMI class breakdown and age distribution
- Add, edit and delete athletes, with the server's validation messages shown on each field
- Light and dark themes, and a mobile layout

BMI classes use the WHO adult cut-offs. BMI is only a rough screen and doesn't apply directly to under-18s.

## API

Base URL: `http://localhost:8083/api/users`

| Method | Path | Description | Success |
|---|---|---|---|
| `GET` | `/api/users` | List all users | `200` with an array of users |
| `GET` | `/api/users/{id}` | Get one user | `200` with the user, `404` if not found |
| `POST` | `/api/users` | Create a user | `200` with the saved user |
| `PUT` | `/api/users/{id}` | Replace a user's details | `200` with the updated user, `404` if not found |
| `DELETE` | `/api/users/{id}` | Delete a user | `200` with an empty body, `404` if not found |

### Request body (POST and PUT)

```json
{
  "name": "Aarav Mehta",
  "email": "aarav.mehta@example.com",
  "age": 24,
  "height": 178,
  "weight": 72
}
```

`height` is in centimetres and `weight` in kilograms.

### Validation rules

| Field | Rule | Error message |
|---|---|---|
| `name` | required | Name is required |
| `email` | required, valid email | Email is required / Please provide a valid email |
| `age` | required, 13–100 | Age is required / Age must be at least 13 / Age must not exceed 100 |
| `height` | required, at least 50 | Height is required / Height must be at least 50 cm |
| `weight` | required, at least 20 | Weight is required / Weight must be at least 20 kg |

An invalid request returns `400` with a map of field to message:

```json
{
  "email": "Please provide a valid email",
  "age": "Age must be at least 13"
}
```

### Example

```bash
curl -X POST http://localhost:8083/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Priya Nair","email":"priya.nair@example.com","age":29,"height":163,"weight":55}'
```

## Deploying the frontend

`npm run build` writes a static site to `frontend/dist`. The dev proxy doesn't exist in production, so pick one of these:

- **Serve it from Spring Boot:** copy the contents of `frontend/dist` into `src/main/resources/static/` and rebuild the service. The page and the API then share one origin, so no CORS setup is needed.
- **Host it separately:** add a CORS configuration to the service that allows the frontend's origin.

## Known limitations

- Email addresses aren't unique, so two users can share one.
- There is no authentication; anyone who can reach port 8083 can change data.
