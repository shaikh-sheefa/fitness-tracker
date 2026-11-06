# Fitness Tracker Frontend

The main React frontend of the Fitness Tracker project. It talks to the [FitnessTracker service](../FitnessTracker/README.md) on port 8081 to manage workouts and meals and to show daily nutrition summaries.

## Features

- **Workouts:** add a workout (type, duration, calories burned, date, user id), list all workouts, edit, and delete
- **Diet:** log a meal (meal type, food, calories, protein, carbs, fat, fibre, date, user id), list all meals, edit, and delete
- **Daily nutrition summary:** enter a user id and a date to see that day's total calories, protein, carbs, fat and fibre

## Tech stack

React 19, Vite, ESLint.

## Project structure

```
frontend/
├── index.html
├── vite.config.js
└── src/
    ├── main.jsx      entry point
    ├── App.jsx       the whole app: forms, lists and API calls
    ├── App.css       component styles
    └── index.css     global styles
```

## Run it

1. Start the [FitnessTracker service](../FitnessTracker/README.md) on port 8081. Start the [notification service](../notification-service/README.md) too if you want workout notifications.
2. Install and start the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Open **http://localhost:5173**.

The app must run on port 5173, because that is the only origin the backend's CORS settings allow. If Vite says it picked another port, stop whatever is already using 5173 and start the frontend again.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Build a production bundle into `dist/` |
| `npm run preview` | Serve the `dist/` build locally |
| `npm run lint` | Check the code with ESLint |

## API calls

The app calls `http://localhost:8081` directly:

| Feature | Endpoint |
|---|---|
| Load workouts | `GET /api/workouts` |
| Add / edit / delete a workout | `POST /api/workouts`, `PUT /api/workouts/{id}`, `DELETE /api/workouts/{id}` |
| Load meals | `GET /api/diets` |
| Add / edit / delete a meal | `POST /api/diets`, `PUT /api/diets/{id}`, `DELETE /api/diets/{id}` |
| Nutrition summary | `GET /api/diets/user/{userId}/summary?date=YYYY-MM-DD` |

The backend URL is written directly in `src/App.jsx`. To point the app at another server, change `http://localhost:8081` there.

## Notes

- Workouts and meals are linked to a user by id, so the user must already exist. Users are managed by [`user-service`](../user-service/README.md): create them with its Startline app or `POST http://localhost:8083/api/users`. user-service must be running when you add or edit workouts and meals.
