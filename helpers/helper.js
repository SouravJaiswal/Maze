var dept = require("../api/models/departments.js");
var Professor = require("../api/models/professors.js");
var Courses = require("../api/models/courses.js");
var helpers = require("./helper_2.js");
var request = require("request");
var async = require('async');

function exists(data) {
    return data && data.length > 0;
}



module.exports.exists = exists;

module.exports.checkUserErrors = function(req, callback) {

    var errors = [];

    async.waterfall([
        function(done) {
            if (!exists(req.body.username)) {
                errors.push("Username not provided");
            }
            if (!exists(req.body.email)) {
                errors.push("Email not provided");
            }
            if (!exists(req.body.password)) {
                errors.push("Password not provided");
            } else {
                if (req.body.password.length > 20) {
                    errors.push("Password should be less than 10");
                }
            }
            if (!exists(req.body.name)) {
                errors.push("Name not provided");
            }
            if (!exists(req.body.university)) {
                errors.push("University ID not provided");
            }
            done(null, errors);
        },
        function(errors, done) {
            if (!exists(req.body.department)) {
                errors.push("Department not provided");
            } else {
                dept.findOne({ name: req.body.department }, function(err, data) {
                    if (err) {
                        errors.push("Some error has occured");
                    }
                    if (data == null) {
                        console.log("Null department");
                        errors.push("Unknown Department");
                    }
                });
            }
            done(null, errors);
        }
    ], function(err, results) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            callback(results);
        }
    });

}



module.exports.checkDepartmentErrors = function(req) {
    var errors = []

    if (!exists(req.body.name)) {
        errors.push("Name not provided");
    }

    return errors;
}


module.exports.checkClassTimetableErrors = function(req, callback) {
    var courses;
    async.waterfall([
        function(done) {
            if (!exists(req.body.year)) {
                errors.push("Year not provided");
            }
            if (!exists(req.body.semester)) {
                errors.push("Semester not provided");
            }
            done(null, errors);
        },
        function(errors, done) {
            if (exists(req.body.courses)) {
                courses = JSON.parse(req.body.courses);
                //Course structure will be as follows
                // [{course_id:"",_id:"",professors:[{names,id}]}] 
                console.log(courses);
                async.each(courses,function(course,done){
                    Courses.findOne({course_id:course.course_id}).
                    where("semester").equals(req.body.semester).
                    exec(function(err,data){
                        if(err){
                            errors.push("Error : "+err.errmsg);
                        }else if(data == null){
                            errors.push("Course " + data.name + " either doesnt exists or is not registered for this semester");
                        }else{
                            var professors = data.professors;
                            course.professors.forEach(function(professor){
                                if(professors.indexOf(professor.id) < 0){
                                    errors.push("Professor " + professor.name + " is not registered with this courses for this semester");
                                }
                            });
                        }
                    })
                });
                done(null,errors);
            }
        }
    ], function(err, errors) {
        if (err) {
            console.log(err);
            callback()
        } else {
            callback(errors, courses);
        }
    });
}


module.exports.checkProfessorTimetableErrors = function(req, callback) {
    var errors = []

    if (!exists(req.body.year)) {
        errors.push("Year not provided");
    }
    if (!exists(req.body.semester)) {
        errors.push("Semester not provided");
    }
    if (exists(req.body.professor_name)) {
        //var courses = JSON.parse(JSON.stringify([{course_name:"CSE3100",professor_name:"Ritwik"}]));

        Professor.findOne({
            name: req.body.professor_name
        }, function(err, professor) {
            if (err) {
                errors.push("Some error has occured");
            }
            if (professor == null) {
                errors.push("Professor is not defined");
                callback(errors);
            } else {
                if (exists(req.body.timetable)) {
                    var timetable = JSON.parse(req.body.timetable);
                    for (var i = 0; i < timetable.length; i++) {
                        for (var j = 0; j < timetable[i].length; j++) {
                            if (professor.courses.indexOf(timetable[i][j]) < 0) {
                                errors.push(professor.name + " does not teach " + timetable[i][j]);
                            }
                        }
                    }
                    callback(errors);
                } else {
                    callback(errors);
                }
            }
        });

    }
}
