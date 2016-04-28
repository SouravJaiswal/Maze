var helpers = require("../../helpers/helper");
var dept = require("../models/departments.js");
var Course = require("../models/courses.js");


module.exports.createCourse = function(req, res) {

    function callback(errors,professor) {
        if (errors.length === 0) {
            var course = new Course();
            course.name = req.body.name;
            course.course_id = req.body.id
            course.department = req.body.department;
            course.professors.push(professor);
            course.save(function(err) {
                if (err) {
                    res.json("Some error occured");
                } else {
                    res.json(course);
                }
            });
        } else {
            res.json(errors);
        }
    }

    var errors = helpers.checkCourseErrors(req, callback);

}

module.exports.updateCourse = function(req, res) {
    function callback(errors) {
        if (errors.length === 0) {
            Course.findById(res.params.id, function(err, course) {
                if (err) {
                    res.json("Some error occured");
                    return;
                }
                course.name = req.body.name;
                course.course_id = req.body.id
                course.department = req.body.department;
                course.professor = req.body.professor;
                course.save(function(err) {
                    if (err) {
                        res.json("Some error occured");
                    } else {
                        res.json(course);
                    }
                });
            });

        } else {
            res.json(errors);
        }
    }
    var errors = helpers.checkcourseErrors(req, callback);

}
module.exports.deleteCourse = function(req, res) {
    Course.findByIdAndRemove(req.params.id, function(err, course) {
        if (err) {
            res.json("Some error occured");
            return;
        }
        if (course !== null) {
            res.json("course deleted" + course);
            return;
        } else {
            res.json("No such course");
        }
    });
}

module.exports.getCourse = function(req, res) {
    Course.findById(req.params.id, function(err, course) {
        if (err) {
            res.json("Some error occured");
            return;
        }
        if(course == null){
            res.json("No such course");
            return;
        }else{
            res.json(course);
            return;
        }
    });
}
