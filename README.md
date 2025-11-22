## Project Info

**Project Name**: 
Server-Side Application --- **Fitness App**

**Group info**: 
3810SEF --- ***Group 45***

**Groupmates**: 
Zeng Yi Fan 		    13977239
Luk Ho Lung 		    14007349
NG CHUN LOK JACKY 	13901349
Hong Yu Ye 			    14029692
Hon Chi Tung 		    12945822 

A fitness app that allows a logged-in user to manage their own workout.

---

## Project File Intro

- **server.js**: a brief summary of the functionalities it provides
Authentication to connect to the user account. 
Express for redirecting the client to different pages. 
CRUD API for managing workout records.
Connect to MongoDB for the database service.



1. Health check
curl https://comp3810sef-group45.onrender.com/api/health

2. CREATE-Register (use unique credentials if "testuser" exists)
curl -X POST https://comp3810sef-group45.onrender.com/api/signup -H "Content-Type: application/json" -d '{"username":"hello123","password":"hello123","email":"hello@example.com"}'

3. READ-User Operations (Login)
curl -X POST https://comp3810sef-group45.onrender.com/api/login -H "Content-Type: application/json" -c cookies.txt -d '{"username":"testuser123","password":"testpass123"}'

Get current user
curl https://comp3810sef-group45.onrender.com/api/current-user -b cookies.txt

Read - Get all users (admin/testing)
curl https://comp3810sef-group45.onrender.com/api/users \ -b cookies.txt

#4. CREATE - Workout Operations create cardio workout curl -X POST https://comp3810sef-group45.onrender.com/api/workouts
-H "Content-Type: application/json"
-b cookies.txt
-d '{ "exerciseType": "cardio", "exerciseName": "Morning Run", "date": "2024-01-15", "duration": 45, "caloriesBurned": 350, "intensity": "moderate", "distance": 5.2, "distanceUnit": "km", "notes": "Good morning run in the park" }' create strength workout curl -X POST https://comp3810sef-group45.onrender.com/api/workouts
-H "Content-Type: application/json"
-b cookies.txt
-d '{ "exerciseType": "strength", "exerciseName": "Chest Day", "date": "2024-01-15", "duration": 60, "caloriesBurned": 280, "intensity": "vigorous", "sets": 4, "reps": 12, "weight": 65.5, "notes": "Bench press and dumbbell flies" }'

#5. READ - Workout Operations (get all workouts) curl https://comp3810sef-group45.onrender.com/api/workouts
-b cookies.txt

#6 Update-Workout Operations curl -X PUT https://comp3810sef-group45.onrender.com/api/workouts/69206411aecf0ead0937ecc5\ -H "Content-Type: application/json"
-b cookies.txt
-d '{ "exerciseName": "Updated Workout Name", "duration": 50, "caloriesBurned": 400, "intensity": "vigorous", "notes": "Updated notes" }'

#7 Read - Get Recent Activity curl https://comp3810sef-group45.onrender.com/api/workouts/recent
-b cookies.txt

#8 Read - Get Workout Statistics curl https://comp3810sef-group45.onrender.com/api/workouts/stats
-b cookies.txt

#9 Read - Get Workout Suggestions curl https://comp3810sef-group45.onrender.com/api/workouts/suggestions
-b cookies.txt

#10 DELETE - Workout Operations curl -X DELETE https://comp3810sef-group45.onrender.com/api/workouts/671f58a9d3f4b8a1e4f5c678\ -b cookies.txt

#11 DELETE-User Session Logout curl https://comp3810sef-group45.onrender.com/logout -b cookies.txt
