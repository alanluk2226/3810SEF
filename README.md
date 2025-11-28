# Project Info

**Project Name**: 
Server-Side Application --- **Fitness App**

**Group info**: 
3810SEF --- ***Group 45***

**Groupmate**:  
Zeng Yi Fan 		13977239  
Luk Ho Lung 		14007349  
NG CHUN LOK JACKY 	13901349  
Hong Yu Ye 			14029692  
Hon Chi Tung 		12945822  
  
A fitness app that allows a logged-in user to manage their own workout.

---

# Project File Intro

**server.js**:  
-Authentication to connect to the user account.  
-Express for redirecting the client to different pages.  
-CRUD API for managing workout records.  
-Connect to MongoDB for the database service.  
**package.json**:  
-Express for the web server framework  
-EJS for template rendering  
-Passport for authentication  
-Express-session for user session management  
**public**:  
Contains two files  
-style.css to style the website  
-script.js allows the user to delete the form by clicking the button  
**views**:  
-create.ejs: A form for user to mark their workout record  
-delete.ejs: Deletion that requires the user to confirm  
-index.ejs: Display and summarize the workout  
-login.ejs: Authentication using cookies
-read.ejs: Allow user to view, search, filter, and manage their exercise records  
-register.ejs: New user can create a new account  
-update.ejs: User can modify their record by the edit function  
**models**:  
Contains two files  
-user.js: Defines the User model with fields for username, password, email, and joinDate. 
  Ensures data integrity with validation like uniqueness and minimum lengths.
-workout.js: Workout model which includes details like exerciseType, timing, caloriesBurned, sets/reps, and is linked to a User. 
	Features custom methods for calculating totals, date range queries, and automatic duration calculation.

---


# The cloud-based server URL：
https://comp3810sef-group45-lxnz.onrender.com/  
Test acc:  
Username: liulam123456  
Password: 123456

#1. Health check
curl https://comp3810sef-group45-lxnz.onrender.com/api/health

#2. CREATE - Register (use unique credentials if "testuser" exists)
curl -X POST https://comp3810sef-group45-lxnz.onrender.com/api/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"amy121234","password":"amy121234","email":"amy121234@example.com"}'
  
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
curl -X PUT https://comp3810sef-group45-lxnz.onrender.com/api/workouts/692009f19f89749242620250 \
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
curl https://comp3810sef-group45-lxnz.onrender.com/api/workouts/stats \
  -b cookies.txt
  
#9. READ - Get Workout Suggestions
curl https://comp3810sef-group45-lxnz.onrender.com/api/workouts/suggestions \
  -b cookies.txt
  
#10. DELETE - Workout Operations
curl -X DELETE https://comp3810sef-group45-lxnz.onrender.com/api/workouts/692009f19f89749242620250 \
  -b cookies.txt
  
#11. DELETE - User Session Logout
curl https://comp3810sef-group45-lxnz.onrender.com/logout \
  -b cookies.txt


#Extra id testing for UPDATE&DELETE
curl -X PUT https://comp3810sef-group45-lxnz.onrender.com/api/workouts/692009f19f89749242620252 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "exerciseName": "Updated Workout Name",
    "duration": 50,
    "caloriesBurned": 400,
    "intensity": "vigorous",
    "notes": "Updated notes"
  }'
  
curl -X DELETE https://comp3810sef-group45-lxnz.onrender.com/api/workouts/692009f19f89749242620252 \
-b cookies.txt

Anyother workout id for testing update and delete
692009f19f89749242620254
69200b059f8974924262025d
69200b169f8974924262025f
