<img width="552" height="377" alt="image" src="https://github.com/user-attachments/assets/8a06e34d-8a86-432a-9420-f73bbb4538db" />#1 Project Info

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

#2 Project File Intro

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


#3 The cloud-based server URL：
https://comp3810sef-group45-lxnz.onrender.com/  

#4 Operation guides
User flow:



-Use of Login/Logout pages
In the login page, you can login if you already registered. Click create one here to do the registration. 
Firstly, input the username(3-30 characters)
Next, input your email with @
After that, input your password(min 6characters) for security reasons
Then, input your password again to comfirm the password is same
Finally, click the create account.
-Logout button is a button to end an authericated session

Valid login information: 
Username: liulam123456  
Password: 123456 
Or register a new account


-Use of your CRUD web pages
In the index page, there are quick actions that provied to user to click.
-Create New Workout is a button to create new workout
-View My Workouts is a button to read the workout
	-Search Exercise(String)
	-Exercise Type(drop down list)
	-Date(Date)
 Edit and Delete funcitons are also available in read page
-Upate Workouts is a button to update workout
-Delete Workout is a button to delete workout
-Recent Activity, Workout Summary and Workout Suggestions are the UI that provided to user to read. Workout Summary summarize the avg duration, avg calories that user spent in the workouts.



-Use of your RESTful CRUD services:
#4.1. Health check
curl https://comp3810sef-group45-lxnz.onrender.com/api/health

#4.2. CREATE - Register (use unique credentials if "testuser" exists)
curl -X POST https://comp3810sef-group45-lxnz.onrender.com/api/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"amy121234","password":"amy121234","email":"amy121234@example.com"}'
  
#4.3. READ - User Operations (Login)
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

************Must login first, else cannot do the CRUD services********************
#4.4. CREATE - Workout Operations
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

#4.5. READ - Workout Operations (get all workouts)
curl https://comp3810sef-group45-lxnz.onrender.com/api/workouts \
  -b cookies.txt
   
#4.6. UPDATE - Workout Operations
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
  
#4.7. READ - Get Recent Activity
curl https://comp3810sef-group45-lxnz.onrender.com/api/workouts/recent \
  -b cookies.txt
  
#4.8. READ - Get Workout Statistics
curl https://comp3810sef-group45-lxnz.onrender.com/api/workouts/stats \
  -b cookies.txt
  
#4.9. READ - Get Workout Suggestions
curl https://comp3810sef-group45-lxnz.onrender.com/api/workouts/suggestions \
  -b cookies.txt
  
#4.10. DELETE - Workout Operations
curl -X DELETE https://comp3810sef-group45-lxnz.onrender.com/api/workouts/692009f19f89749242620250 \
  -b cookies.txt
  
#4.11. DELETE - User Session Logout
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

