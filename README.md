#1 Project Info

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
<img width="398" height="704" alt="image" src="https://github.com/user-attachments/assets/32bc6e9b-8d6c-4d0b-b406-dd9a5571fbde" />


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
<img width="1113" height="1294" alt="image" src="https://github.com/user-attachments/assets/9b93c263-2661-455b-83b4-e5a6e4016833" />


In the index page, there are quick actions that provied to user to click.
-Create New Workout is a button to create new workout
<img width="1106" height="1021" alt="image" src="https://github.com/user-attachments/assets/f9087856-1bcc-4c64-a012-bd44da88a8d1" />


-View My Workouts is a button to read the workout
	-Search Exercise(String)
	-Exercise Type(drop down list)
	-Date(Date)
 Edit and Delete funcitons are also available in read page
 <img width="1096" height="795" alt="image" src="https://github.com/user-attachments/assets/6f5f6df6-74e5-4eac-87e1-3a52b26ee50a" />
 

-Upate Workouts is a button to update workout
<img width="1094" height="276" alt="image" src="https://github.com/user-attachments/assets/17cdbb49-d6a2-4b12-b6df-176cffed1078" />


-Delete Workout is a button to delete workout
<img width="1084" height="686" alt="image" src="https://github.com/user-attachments/assets/b5b2f178-9871-46a7-89a8-d3648d5efd71" />


-Recent Activity, Workout Summary and Workout Suggestions are the UI that provided to user to read. Workout Summary summarize the avg duration, avg calories that user spent in the workouts.
<img width="535" height="612" alt="image" src="https://github.com/user-attachments/assets/11f6ab39-1cd8-48c3-84fc-e2af782342f7" />


<img width="1094" height="246" alt="image" src="https://github.com/user-attachments/assets/ffe857a2-b6aa-4cf2-a1af-eea1c7126d6e" />




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

