#MAZE

###Pre-requisite Packages  
* Node  
* Mongodb
* NPM
* Nodemon
* Postman

### Running the Application
 Open a terminal and start mongodb using   

	sudo mongod  
 Open another terminal and execute  

	npm install  
	nodemon server.js

All the requests to the application will be logged on to the terminal.

###Restful APIs
 API requests are called using the url 
 `http://localhost:5000/api/` + `classname/operation`  

 For example  

	http://localhost:5000/api/department/5721ebaa589547f60d9e6159
 All the CRUD operations are defined for all below classes
> * Department
 * User
 * Professor
 * Course
 * Class Timetable (ctimetable)
 * Professor Timetable (ptimetable)

##### CRUD Operations:  

 * Create  

  	    POST http://localhost:5000/api/department/  

 * Update  
 
		PUT http://localhost:5000/api/department/5721ebaa589547f60d9e6159  

 * GET
	
	 	GET http://localhost:5000/api/department/5721ebaa589547f60d9e6159  

 * DELETE
	
	 	DELETE http://localhost:5000/api/department/5721ebaa589547f60d9e6159  

### Directory Structure

	api
	├── controllers
	│   ├── classTimetableController.js
	│   ├── courseController.js
	│   ├── departmentController.js
	│   ├── professorController.js
	│   ├── professorTimetableController.js
	│   └── userController.js
	├── models
	│   ├── class-timetables.js
	│   ├── courses.js
	│   ├── dbs.js
	│   ├── departments.js
	│   ├── professors.js
	│   ├── professor-timetables.js
	│   └── users.js
	└── routes
	    ├── classTimetable.js
	    ├── course.js
	    ├── department.js
	    ├── index.js
	    ├── professor.js
	    ├── professorTimetable.js
	    └── user.js
	app_client/
	app_server/
	└── views

