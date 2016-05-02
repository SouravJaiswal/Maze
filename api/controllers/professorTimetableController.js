var helpers = require("../../helpers/helper");
var ProfessorTimetable = require("../models/professor-timetables");


module.exports.createProfessorTimetable = function(req, res) {
    function callback(errors) {
        if (errors.length === 0) {
            console.log(JSON.stringify(
                [
                    ["CSE310"]
                ]
            ));
            var pTimeTable = new ProfessorTimetable();
            pTimeTable.professor_id = req.body.professor_name;
            pTimeTable.year = req.body.year;
            pTimeTable.semester = req.body.semester;
            if (helpers.exists(req.body.timetable)) {
                var days = JSON.parse(req.body.timetable);
                for (var i = 0; i < days.length; i++) {
                    pTimeTable.timetable.push([]);
                    for (var j = 0; j < days[i].length; j++) {
                        pTimeTable[i].timetable.push(days[i][j]);
                    }
                }
            }
            console.log(pTimeTable);
            pTimeTable.save(function(err) {
                if (err) {
                    res.json("Some error occured");
                } else {
                    res.json(pTimeTable);
                }
            });
        } else {
            res.json(errors);
        }

    }
    var errors = helpers.checkProfessorTimetableErrors(req, callback);
}

/*
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
*/
