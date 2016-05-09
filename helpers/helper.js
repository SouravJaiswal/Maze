var dept = require("../api/models/departments.js");
var Professor = require("../api/models/professors.js");
var Courses = require("../api/models/courses.js");
var request = require("request");
var async = require('async');

function exists(data) {
    return data && data.length > 0;
}



module.exports.exists = exists;

module.exports.checkUserErrors = function(req, callback) {

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

module.exports.checkProfessorErrors = function(req, callback) {

    async.waterfall([
        function(done) {
            if (!exists(req.body.email)) {
                errors.push("Email not provided");
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
                        errors.push("Unknown Department");
                    }
                });
            }
            done(null, errors);
        },
        function(errors, done) {
            var results = [];
            if (exists(req.body.courses)) {
                courses = JSON.parse(req.body.courses);
                console.log(courses);
                async.eachSeries(courses, function(course, done) {
                    Courses.findOne({
                        name: course.course_name
                    }, function(err, data) {
                        if (err) {
                            errors.push("Some err hapenned");
                        }
                        if (data == null) {
                            errors.push("Courses not registered");
                        } else {
                            results.push(data._id);
                        }
                        done();
                    });
                }, function(err) {
                    console.log(results);
                    done(results);
                });
            } else {
                done(results);
            }
        }
    ], function(err, results) {
        if (err) {
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

module.exports.checkCourseErrors = function(req, callback) {
    var errors = [];

    async.waterfall([
        function(done) {
            if (!exists(req.body.name)) {
                errors.push("Name not provided");
            }
            if (!exists(req.body.id)) {
                errors.push("Course ID not provided");
            }
            done(null, errors);
        },
        function(errors, done) {
            if (!exists(req.body.department)) {
                errors.push("Department not provided");
            } else {
                dept.findOne({ name: req.body.department }, function(err, data) {
                    if (err) {
                        errors.push("Some error has occured finding the department");
                    }
                    if (data == null) {
                        errors.push("Unknown Department");
                    }
                });
            }
            done(null, errors);
        },
        function(errors, done) {
            Professor.findOne({ name: req.body.professor }, function(err, data) {
                if (err) {
                    errors.push("Some error has occured finding the professor");
                }
                if (data == null) {
                    errors.push("Unknown Professor");
                } else {
                    done(null, errors, data._id);
                }
            });
        }
    ], function(err, results, data) {
        if (err) {
            callback(err);
        } else {
            callback(results, data);
        }
    });
}



module.exports.checkClassTimetableErrors = function(req, callback) {
    var courses = [];
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
                var courses = JSON.parse(req.body.courses);
                console.log(courses);
                async.each(courses, function(course, done) {
                    async.waterfall([
                        function(doneCourse) {
                            Courses.findOne({
                                name: course.course_name
                            }, function(err, data) {
                                if (err) {
                                    errors.push("Some err hapenned");
                                }
                                if (data == null) {
                                    errors.push("Courses not registered");
                                } else {
                                    doneCourse(null, errors, data);
                                }
                                doneCourse(null, errors, "");
                            });
                        },
                        function(errors, courseData, doneCourse) {
                            if (data == "") {
                                doneCourse(null, errors);
                                //errors.push()
                            } else {
                                Professor.findOne({
                                    name: course.professor_name
                                }, function(err, data) {
                                    if (err) {
                                        errors.push("Some err hapenned");
                                    }
                                    if (data == null) {
                                        errors.push("Professors not registered");
                                    } else {
                                        courses.push([courseData._id, data._id]);
                                    }

                                    if (data.courses.indexOf(courseData._id) < 0) {
                                        errors.push(data.name + " is not assigned for " + courseData.name);
                                    }
                                    doneCourse();
                                });
                            }
                        }
                    ], function(err) {
                        if (err) {

                        } else {
                            done();
                        }
                    });
                }, function(err) {
                    if (err) {
                        done(err);
                    } else {
                        done(errors);
                    }
                });

            }

        }
    ], function(err, errors) {
        if (err) {

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
