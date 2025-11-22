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



#1. Health check
curl https://comp3810sef-group45-lxnz.onrender.com/api/health

#2. CREATE - Register (use unique credentials if "testuser" exists)
curl -X POST https://comp3810sef-group45-lxnz.onrender.com/api/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"liulam1212","password":"liulam1212","email":"liulam1212@example.com"}'
  
#3. READ - User Operations (Login)
# Login
curl -X POST https://comp3810sef-group45-lxnz.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"username":"liulam1212","password":"liulam1212"}'

#  Read - Get current user
curl https://comp3810sef-group45-lxnz.onrender.com/api/current-user \
  -b cookies.txt

# Read - Get all users (admin/testing)
curl https://comp3810sef-group45-lxnz.onrender.com/api/users \
  -b cookies.txt
  
#4. CREATE - Workout Operations
# Create workout
curl -X POST https://comp3810sef-group45-lxnz.onrender.com/api/workouts \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "exerciseType": "cardio",
    "exerciseName": "Morning Run",
    "date": "2024-01-15",
    "duration": 45,
    "caloriesBurned": 350,
    "intensity": "moderate",
    "distance": 5.2,
    "distanceUnit": "km",
    "notes": "Good morning run in the park"
  }'

#5. READ - Workout Operations (get all workouts)
curl https://comp3810sef-group45-lxnz.onrender.com/api/workouts \
  -b cookies.txt
   
#6. UPDATE - Workout Operations
curl -X PUT https://comp3810sef-group45-lxnz.onrender.com/api/workouts/6921c86add68748d8a17e29c \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "exerciseName": "Updated Workout Name",
    "duration": 50,
    "caloriesBurned": 400,
    "intensity": "vigorous",
    "notes": "Updated notes"
  }'
  
#7. READ - Get Recent Activity
curl https://comp3810sef-group45-lxnz.onrender.com/api/workouts/recent \
  -b cookies.txt
  
#8. READ - Get Workout Statistics
bash
curl https://comp3810sef-group45-lxnz.onrender.com/api/workouts/stats \
  -b cookies.txt
  
#9. READ - Get Workout Suggestions
curl https://comp3810sef-group45-lxnz.onrender.com/api/workouts/suggestions \
  -b cookies.txt
  
#10. DELETE - Workout Operations
curl -X DELETE https://comp3810sef-group45-lxnz.onrender.com/api/workouts/6921c86add68748d8a17e29c \
  -b cookies.txt
  
#11. DELETE - User Session Logout
curl https://comp3810sef-group45-lxnz.onrender.com/logout \
  -b cookies.txt

