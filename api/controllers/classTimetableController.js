var helpers = require("../../helpers/helper");
var ClassTimetable = require("../models/class-timetables");


module.exports.initClassTimetable = function(req, res) {
    function callback(errors, courses_id, professors_id) {
        if (errors.length === 0) {
            var cTimeTable = new ClassTimetable();
            cTimeTable.department = req.body.department;
            cTimeTable.year = req.body.year;
            cTimeTable.semester = req.body.semester;
            for (var i = 0; i < courses_id.length; i++) {
                var courseProfessorMap = {};
                courseProfessorMap.course_id = courses_id[i];
                courseProfessorMap.professor_id = professors_id[i];
                cTimeTable.courses.push(courseProfessorMap);
            }
            cTimeTable.save(function(err) {
                if (err) {
                    res.json("Some error occured");
                } else {
                    res.json(cTimeTable);
                }
            });
        } else {
            res.json(errors);
        }

    }

    var errors = helpers.checkClassTimetableErrors(req, callback);

}


module.exports.insertClassTimetable = function(req, res) {

    function callback(errors, courses_id, professors_id) {
        if (errors.length === 0) {

            ClassTimetable.findById(req.params.id, function(err, data) {

                if (err) {
                    res.json("Some error has occured");
                    return;
                }
                if (data == null) {
                    res.json("No such Class timetable exists");
                } else {
                    var is_there;
                    var x = data.courses[0]
                    data.courses = [];
                    data.courses.push(x);
                    for (var i = 0; i < courses_id.length; i++) {
                        var courseProfessorMap = {};
                        is_there = false;
                        for (var j = 0; j < data.courses.length; j++) {
                            if (data.courses[j].course_id.toString() == courses_id[i].toString()) {
                                is_there = true;
                                break;
                            }
                        }
                        if (!is_there) {
                            courseProfessorMap.course_id = courses_id[i];
                            courseProfessorMap.professor_id = professors_id[i];
                            data.courses.push(courseProfessorMap);
                        }
                    }
                    data.save(function(err) {
                        if (err) {
                            res.json("Some error occured");
                        } else {
                            res.json(data);
                        }
                    });
                }

            });
        } else {
            res.json(errors);
        }
    }
    var errors = helpers.checkClassTTCourses(req, [], callback);
}

module.exports.updateClassTimetable = function(req, res) {

    function callback(errors, courses_id, professors_id) {
        if (errors.length === 0) {
            ClassTimetable.findById(req.params.id, function(err, cTimeTable) {
                cTimeTable.department = req.body.department;
                cTimeTable.year = req.body.year;
                cTimeTable.semester = req.body.semester;
                for (var i = 0; i < courses_id.length; i++) {
                    var courseProfessorMap = {};
                    courseProfessorMap.course_id = courses_id[i];
                    courseProfessorMap.professor_id = professors_id[i];
                    cTimeTable.courses.push(courseProfessorMap);
                }
                cTimeTable.save(function(err) {
                    if (err) {
                        res.json("Some error occured");
                    } else {
                        res.json(cTimeTable);
                    }
                });

            });
        } else {
            res.json(errors);
        }

        var errors = helpers.checkClassTimetableErrors(req, callback);
    }
}
module.exports.deleteClassTimetable = function(req, res) {
    ClassTimetable.findByIdAndRemove(req.params.id, function(err, cTimeTable) {
        if (err) {
            res.json("Some error occured");
            return;
        }
        if (cTimeTable !== null) {
            res.json("Class Timetable deleted" + cTimeTable);
            return;
        } else {
            res.json("No such Timetable");
        }
    });
}

module.exports.getClassTimeTable = function(req, res) {
    ClassTimetable.findById(req.params.id, function(err, cTimeTable) {
        if (err) {
            res.json("Some error occured");
            return;
        }
        if (cTimeTable == null) {
            res.json("No such Class timetable");
            return;
        } else {
            res.json(cTimeTable);
            return;
        }
    });
}
