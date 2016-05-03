var dept = require("../api/models/departments.js");
var Professor = require("../api/models/professors.js");
var Courses = require("../api/models/courses.js");
var request  = require("request");

function exists(data) {
    return data && data.length > 0;
}

function checkClassTTCourses(req, errors, callback) {
    var courses = JSON.parse(req.body.courses);
    console.log(courses);

    function checkCourses(courses, length, callback, courses_id) {
        Courses.findOne({
            name: courses[length].course_name
        }, function(err, data) {
            if (err) {
                errors.push("Some err hapenned");
            }
            if (data == null) {
                errors.push("Courses not registered");
            } else {
                courses_id.push(data._id);
            }
            length++;
            if (courses.length > length) {
                checkCourses(courses, length, callback, courses_id);
            } else {
                checkProfessors(courses, 0, callback, courses_id, []);
            }
        });
    }

    function checkProfessors(courses, length, callback, courses_id, professors_id) {

        Professor.findOne({
            name: courses[length].professor_name
        }, function(err, data) {
            if (err) {
                errors.push("Some err hapenned");
            }
            if (data == null) {
                errors.push("Professors not registered");
            } else {
                professors_id.push(data._id);
            }
            console.log(data.courses.indexOf(courses_id[length]));
            if (data.courses.indexOf(courses_id[length]) < 0) {
                errors.push(data.name + " is not assigned for " + courses[length].course_name);
            }
            length++;
            if (courses.length > length) {
                checkProfessors(courses, length, callback, courses_id, professors_id);
            } else {
                callback(errors, courses_id, professors_id);
            }
        });

    }

    checkCourses(courses, 0, callback, []);
}

module.exports.exists = exists;

module.exports.checkUserErrors = function(req, callback) {
    var errors = []

    if (!exists(req.body.username)) {
        errors.push("Username not provided");
    }
    if (!exists(req.body.email)) {
        errors.push("Email not provided");
    }
    if (!exists(req.body.password)) {
        errors.push("Password not provided");
    } else {
        if (req.body.password.length > 10) {
            errors.push("Password should be less than 10");
        }
    }
    if (!exists(req.body.name)) {
        errors.push("Name not provided");
    }
    if (!exists(req.body.university)) {
        errors.push("University ID not provided");
    }
    if (!exists(req.body.department)) {
        errors.push("Department not provided");
        callback(errors);
    } else {
        dept.findOne({ name: req.body.department }, function(err, data) {
            if (err) {
                errors.push("Some error has occured");
            }
            if (data == null) {
                console.log("Null department");
                errors.push("Unknown Department");
            }
            callback(errors);
        })
    }
}

module.exports.checkProfessorErrors = function(req, callback) {
    var errors = [];

    if (!exists(req.body.email)) {
        errors.push("Email not provided");
    }
    if (!exists(req.body.name)) {
        errors.push("Name not provided");
    }
    if (!exists(req.body.university)) {
        errors.push("University ID not provided");
    }
    if (!exists(req.body.department)) {
        errors.push("Department not provided");
        if (exists(req.body.courses)) {
            courses = JSON.parse(req.body.courses);
            console.log(courses);

            function checkCourses(courses, length, courses_id, callback) {
                Courses.findOne({
                    name: courses[length].course_name
                }, function(err, data) {
                    if (err) {
                        errors.push("Some err hapenned");
                    }
                    if (data == null) {
                        errors.push("Courses not registered");
                    }
                    courses_id.push(data._id);
                    console.log(courses_id);
                    length++;
                    if (courses.length > length) {
                        checkCourses(courses, length, courses_id, callback);
                    } else {
                        callback(errors, courses_id);
                    }
                });


            }
            checkCourses(courses, 0, [], callback);
            return;
        } else
            callback(errors);
    } else {
        dept.findOne({ name: req.body.department }, function(err, data) {

            if (err) {
                errors.push("Some error has occured");
            }
            if (data == null) {
                errors.push("Unknown Department");
            }

            if (exists(req.body.courses)) {
                var courses = JSON.parse(req.body.courses);


                function checkCourses(courses, length,courses_id, callback) {
                    Courses.findOne({
                        name: courses[length]
                    }, function(err, data) {
                        if (err) {
                            errors.push("Some err hapenned");
                        }
                        if (data == null) {
                            errors.push("Courses not registered");
                        }
                        courses_id.push(data._id);
                        length++;
                        if (courses.length > length) {
                            checkCourses(courses, length,courses_id, callback);
                        } else {
                            callback(errors,courses_id);
                        }
                    });


                }
                checkCourses(courses, 0,[], callback);
                return;
            }
            console.log(errors);
            callback(errors);

        });
    }
}


module.exports.checkDepartmentErrors = function(req) {
    var errors = []

    if (!exists(req.body.name)) {
        errors.push("Name not provided");
    }

    return errors;
}

module.exports.checkCourseErrors = function(req, callback) {
    var errors = []

    if (!exists(req.body.name)) {
        errors.push("Name not provided");
    }
    if (!exists(req.body.id)) {
        errors.push("Course ID not provided");
    }
    if (!exists(req.body.department)) {
        errors.push("Department not provided");
        callback(errors, "");
    } else {
        dept.findOne({ name: req.body.department }, function(err, data) {
            if (err) {
                errors.push("Some error has occured finding the department");
            }
            if (data == null) {
                errors.push("Unknown Department");
                callback(errors, "");
            } else {
                Professor.findOne({ name: req.body.professor }, function(err, data) {
                    if (err) {
                        errors.push("Some error has occured finding the professor");
                    }
                    if (data == null) {
                        errors.push("Unknown Professor");
                        callback(errors, "");
                    } else {
                        callback(errors, data._id);
                    }
                })
            }
        })
    }
}

module.exports.checkClassTTCourses = checkClassTTCourses;


module.exports.checkClassTimetableErrors = function(req, callback) {
    var errors = []

    if (!exists(req.body.year)) {
        errors.push("Year not provided");
    }
    if (!exists(req.body.semester)) {
        errors.push("Semester not provided");
    }
    if (exists(req.body.courses)) {
        //var courses = JSON.parse(JSON.stringify([{course_name:"CSE3100",professor_name:"Ritwik"}]));

        checkClassTTCourses(req, errors, callback);

    }
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
                            var 
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
