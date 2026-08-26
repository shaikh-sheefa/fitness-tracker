
import { useState, useEffect } from 'react'

function App() {
    // =========================
    // WORKOUT STATE
    // =========================
    const [workoutType, setWorkoutType] = useState('')
    const [duration, setDuration] = useState('')
    const [calories, setCalories] = useState('')
    const [workoutDate, setWorkoutDate] = useState('')
    const [userId, setUserId] = useState('')
    const [workouts, setWorkouts] = useState([])
    const [editingWorkout, setEditingWorkout] = useState(null)
    const [nutritionSummary, setNutritionSummary] = useState(null)
    const [summaryUserId, setSummaryUserId] = useState('')
    const [summaryDate, setSummaryDate] = useState('')

    // =========================
    // DIET STATE
    // =========================
    const [mealType, setMealType] = useState('')
    const [foodName, setFoodName] = useState('')
    const [dietCalories, setDietCalories] = useState('')
    const [protein, setProtein] = useState('')
    const [carbs, setCarbs] = useState('')
    const [fat, setFat] = useState('')
    const [fibre, setFibre] = useState('')
    const [mealDate, setMealDate] = useState('')
    const [dietUserId, setDietUserId] = useState('')
    const [diets, setDiets] = useState([])
    const [editingDiet, setEditingDiet] = useState(null)
    // =========================
    // GET ALL WORKOUTS
    // =========================
    useEffect(() => {
        fetch('http://localhost:8081/api/workouts')
            .then((response) => response.json())
            .then((data) => {
                setWorkouts(data)
            })
            .catch((error) => {
                console.error('Error fetching workouts:', error)
            })
    }, [])

    // =========================
    // GET ALL DIETS
    // =========================
    useEffect(() => {
        fetch('http://localhost:8081/api/diets')
            .then((response) => response.json())
            .then((data) => {
                setDiets(data)
            })
            .catch((error) => {
                console.error('Error fetching diets:', error)
            })
    }, [])

    // =========================
    // ADD WORKOUT
    // =========================
    const addWorkout = async () => {
        const workoutData = {
            workoutType: workoutType,
            duration: Number(duration),
            caloriesBurned: Number(calories),
            workoutDate: workoutDate,
            userId: Number(userId)
        }

        try {
            const response = await fetch(
                'http://localhost:8081/api/workouts',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(workoutData)
                }
            )

            if (response.ok) {
                const data = await response.json()

                setWorkouts([...workouts, data])

                alert('Workout added successfully! 💪')
            } else {
                alert('Failed to add workout')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Could not connect to Spring Boot')
        }
    }

    // =========================
    // DELETE WORKOUT
    // =========================
    const deleteWorkout = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:8081/api/workouts/${id}`,
{
    method: 'DELETE'
}
)

if (response.ok) {
    setWorkouts(
        workouts.filter((workout) => workout.id !== id)
    )

    alert('Workout deleted successfully! 🗑️')
} else {
    alert('Failed to delete workout')
}
} catch (error) {
    console.error('Error deleting workout:', error)
    alert('Could not connect to Spring Boot')
}
}

// =========================
// UPDATE WORKOUT
// =========================
const updateWorkout = async () => {
    try {
        const response = await fetch(
            `http://localhost:8081/api/workouts/${editingWorkout.id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...editingWorkout,
                    duration: Number(editingWorkout.duration),
                    caloriesBurned: Number(editingWorkout.caloriesBurned)
                })
            }
        )

        if (response.ok) {
            const updatedWorkout = await response.json()

            setWorkouts(
                workouts.map((workout) =>
                    workout.id === updatedWorkout.id
                        ? updatedWorkout
                        : workout
                )
            )

            setEditingWorkout(null)

            alert('Workout updated successfully! ✅')
        } else {
            alert('Failed to update workout')
        }
    } catch (error) {
        console.error('Error updating workout:', error)
        alert('Could not connect to Spring Boot')
    }
}

// =========================
// ADD DIET
// =========================
const addDiet = async () => {
    const dietData = {
        mealType: mealType,
        foodName: foodName,
        calories: Number(dietCalories),
        protein: Number(protein),
        carbs: Number(carbs),
        fat: Number(fat),
        fibre: Number(fibre),
        mealDate: mealDate,
        userId: Number(dietUserId)
    }

    try {
        const response = await fetch(
            'http://localhost:8081/api/diets',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dietData)
            }
        )

        if (response.ok) {
            const data = await response.json()

            setDiets([...diets, data])

            alert('Diet added successfully! 🍎')

            setMealType('')
            setFoodName('')
            setDietCalories('')
            setProtein('')
            setCarbs('')
            setFat('')
            setFibre('')
            setMealDate('')
            setDietUserId('')
        } else {
            alert('Failed to add diet')
        }
    } catch (error) {
        console.error('Error adding diet:', error)
        alert('Could not connect to Spring Boot')
    }
}

// DELETE DIET

const deleteDiet = async (id) => {
    try {
        const response = await fetch(
            `http://localhost:8081/api/diets/${id}`,
            {
                method: 'DELETE'
            }
        )

        if (response.ok) {
            setDiets(
                diets.filter((diet) => diet.id !== id)
            )

            alert('Diet deleted successfully! 🗑️')
        } else {
            alert('Failed to delete diet')
        }
    } catch (error) {
        console.error('Error deleting diet:', error)
        alert('Could not connect to Spring Boot')
    }
}

// UPDATE DIET
    const updateDiet = async () => {
        try {
            const response = await fetch(
                `http://localhost:8081/api/diets/${editingDiet.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...editingDiet,
                        calories: Number(editingDiet.calories),
                        protein: Number(editingDiet.protein),
                        carbs: Number(editingDiet.carbs),
                        fat: Number(editingDiet.fat),
                        fibre: Number(editingDiet.fibre),
                        userId: Number(editingDiet.userId)
                    })
                }
            )

            if (response.ok) {
                const updatedDiet = await response.json()

                setDiets(
                    diets.map((diet) =>
                        diet.id === updatedDiet.id
                            ? updatedDiet
                            : diet
                    )
                )

                setEditingDiet(null)

                alert('Diet updated successfully! ✅')
            } else {
                alert('Failed to update diet')
            }
        } catch (error) {
            console.error('Error updating diet:', error)
            alert('Could not connect to Spring Boot')
        }
    }
// GET DAILY NUTRITION SUMMARY
    const getNutritionSummary = async () => {
        try {
            const response = await fetch(
                `http://localhost:8081/api/diets/user/${summaryUserId}/summary?date=${summaryDate}`
            )

            if (response.ok) {
                const data = await response.json()

                setNutritionSummary(data)

                alert('Nutrition summary loaded! 📊')
            } else {
                alert('Failed to get nutrition summary')
            }
        } catch (error) {
            console.error('Error getting nutrition summary:', error)
            alert('Could not connect to Spring Boot')
        }
    }
// PAGE

return (
    <div>
        <h1>Fitness Tracker</h1>

        {/* =========================
                WORKOUT SECTION
            ========================= */}

        <h2>Add Workout</h2>

        <input
            type="text"
            placeholder="Workout Type"
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
        />

        <br /><br />

        <input
            type="number"
            placeholder="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
        />

        <br /><br />

        <input
            type="number"
            placeholder="Calories Burned"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
        />

        <br /><br />

        <input
            type="date"
            value={workoutDate}
            onChange={(e) => setWorkoutDate(e.target.value)}
        />

        <br /><br />

        <input
            type="number"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
        />

        <br /><br />

        <button onClick={addWorkout}>
            Add Workout
        </button>

        {/* EDIT WORKOUT */}

        {editingWorkout && (
            <div>
                <h2>Edit Workout</h2>

                <input
                    type="text"
                    value={editingWorkout.workoutType}
                    onChange={(e) =>
                        setEditingWorkout({
                            ...editingWorkout,
                            workoutType: e.target.value
                        })
                    }
                />

                <br /><br />

                <input
                    type="number"
                    value={editingWorkout.duration}
                    onChange={(e) =>
                        setEditingWorkout({
                            ...editingWorkout,
                            duration: e.target.value
                        })
                    }
                />

                <br /><br />

                <input
                    type="number"
                    value={editingWorkout.caloriesBurned}
                    onChange={(e) =>
                        setEditingWorkout({
                            ...editingWorkout,
                            caloriesBurned: e.target.value
                        })
                    }
                />

                <br /><br />

                <input
                    type="date"
                    value={editingWorkout.workoutDate}
                    onChange={(e) =>
                        setEditingWorkout({
                            ...editingWorkout,
                            workoutDate: e.target.value
                        })
                    }
                />

                <br /><br />

                <button onClick={updateWorkout}>
                    Update Workout
                </button>

                <button onClick={() => setEditingWorkout(null)}>
                    Cancel
                </button>
            </div>
        )}

        {/* WORKOUT LIST */}

        <h2>My Workouts</h2>

        {workouts.map((workout) => (
            <div key={workout.id}>
                <p>Workout: {workout.workoutType}</p>
                <p>Duration: {workout.duration} minutes</p>
                <p>Calories: {workout.caloriesBurned}</p>
                <p>Date: {workout.workoutDate}</p>

                <button
                    onClick={() => setEditingWorkout(workout)}
                >
                    Edit
                </button>

                <button
                    onClick={() => deleteWorkout(workout.id)}
                >
                    Delete
                </button>

                <hr />
            </div>
        ))}

        {/* =========================
                DIET SECTION
            ========================= */}

        <h2>Add Diet</h2>

        <input
            type="text"
            placeholder="Meal Type"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
        />

        <br /><br />

        <input
            type="text"
            placeholder="Food Name"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
        />

        <br /><br />

        <input
            type="number"
            placeholder="Calories"
            value={dietCalories}
            onChange={(e) => setDietCalories(e.target.value)}
        />

        <br /><br />

        <input
            type="number"
            placeholder="Protein"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
        />

        <br /><br />

        <input
            type="number"
            placeholder="Carbs"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
        />

        <br /><br />

        <input
            type="number"
            placeholder="Fat"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
        />

        <br /><br />

        <input
            type="number"
            placeholder="Fibre"
            value={fibre}
            onChange={(e) => setFibre(e.target.value)}
        />

        <br /><br />

        <input
            type="date"
            value={mealDate}
            onChange={(e) => setMealDate(e.target.value)}
        />

        <br /><br />

        <input
            type="number"
            placeholder="User ID"
            value={dietUserId}
            onChange={(e) => setDietUserId(e.target.value)}
        />

        <br /><br />

        <button onClick={addDiet}>
            Add Diet
        </button>

        {/* EDIT DIET */}

        {editingDiet && (
            <div>
                <h2>Edit Diet</h2>

                <input
                    type="text"
                    placeholder="Meal Type"
                    value={editingDiet.mealType}
                    onChange={(e) =>
                        setEditingDiet({
                            ...editingDiet,
                            mealType: e.target.value
                        })
                    }
                />

                <br /><br />

                <input
                    type="text"
                    placeholder="Food Name"
                    value={editingDiet.foodName}
                    onChange={(e) =>
                        setEditingDiet({
                            ...editingDiet,
                            foodName: e.target.value
                        })
                    }
                />

                <br /><br />

                <input
                    type="number"
                    placeholder="Calories"
                    value={editingDiet.calories}
                    onChange={(e) =>
                        setEditingDiet({
                            ...editingDiet,
                            calories: e.target.value
                        })
                    }
                />

                <br /><br />

                <input
                    type="number"
                    placeholder="Protein"
                    value={editingDiet.protein}
                    onChange={(e) =>
                        setEditingDiet({
                            ...editingDiet,
                            protein: e.target.value
                        })
                    }
                />

                <br /><br />

                <input
                    type="number"
                    placeholder="Carbs"
                    value={editingDiet.carbs}
                    onChange={(e) =>
                        setEditingDiet({
                            ...editingDiet,
                            carbs: e.target.value
                        })
                    }
                />

                <br /><br />

                <input
                    type="number"
                    placeholder="Fat"
                    value={editingDiet.fat}
                    onChange={(e) =>
                        setEditingDiet({
                            ...editingDiet,
                            fat: e.target.value
                        })
                    }
                />

                <br /><br />

                <input
                    type="number"
                    placeholder="Fibre"
                    value={editingDiet.fibre}
                    onChange={(e) =>
                        setEditingDiet({
                            ...editingDiet,
                            fibre: e.target.value
                        })
                    }
                />

                <br /><br />

                <input
                    type="date"
                    value={editingDiet.mealDate}
                    onChange={(e) =>
                        setEditingDiet({
                            ...editingDiet,
                            mealDate: e.target.value
                        })
                    }
                />

                <br /><br />

                <input
                    type="number"
                    placeholder="User ID"
                    value={editingDiet.userId}
                    onChange={(e) =>
                        setEditingDiet({
                            ...editingDiet,
                            userId: e.target.value
                        })
                    }
                />

                <br /><br />

                <button onClick={updateDiet}>
                    Update Diet
                </button>

                <button onClick={() => setEditingDiet(null)}>
                    Cancel
                </button>
            </div>
        )}

        {/* DIET LIST */}

        <h2>My Diet</h2>

        {diets.map((diet) => (
            <div key={diet.id}>
                <p>Meal: {diet.mealType}</p>
                <p>Food: {diet.foodName}</p>
                <p>Calories: {diet.calories} kcal</p>
                <p>Protein: {diet.protein} g</p>
                <p>Carbs: {diet.carbs} g</p>
                <p>Fat: {diet.fat} g</p>
                <p>Fibre: {diet.fibre} g</p>
                <p>Date: {diet.mealDate}</p>
                <p>User ID: {diet.userId}</p>
                <button onClick={() => setEditingDiet(diet)}>
                    Edit
                </button>
                <button onClick={() => deleteDiet(diet.id)}>
                    Delete
                </button>

                <hr />
            </div>
        ))}
        {/* DAILY NUTRITION SUMMARY */}

        <h2>Daily Nutrition Summary</h2>

        <input
            type="number"
            placeholder="User ID"
            value={summaryUserId}
            onChange={(e) => setSummaryUserId(e.target.value)}
        />

        <br /><br />

        <input
            type="date"
            value={summaryDate}
            onChange={(e) => setSummaryDate(e.target.value)}
        />

        <br /><br />

        <button onClick={getNutritionSummary}>
            Get Nutrition Summary
        </button>

        {nutritionSummary && (
            <div>
                <h3>Nutrition Summary</h3>

                <p>Date: {nutritionSummary.date}</p>

                <p>
                    Calories: {nutritionSummary.totalCalories} kcal
                </p>

                <p>
                    Protein: {nutritionSummary.totalProtein} g
                </p>

                <p>
                    Carbs: {nutritionSummary.totalCarbs} g
                </p>

                <p>
                    Fat: {nutritionSummary.totalFat} g
                </p>

                <p>
                    Fibre: {nutritionSummary.totalFibre} g
                </p>
            </div>
        )}
    </div>
)
}

export default App

