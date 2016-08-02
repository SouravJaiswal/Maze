var classTimetable = require("./classTimetable");
var course = require("./course");
var department = require("./department");
var professor = require("./professor");
var semCourse = require("./semCourses");
var professorTimetable = require("./professorTimetable");
var user = require("./user");
var express = require("express");
var router = express.Router();

//console.log(department);

router.use("/semcourse",semCourse);
router.use("/ctimetable",classTimetable);
router.use("/course",course);
router.use("/department",department);
router.use("/professor",professor);
router.use("/ptimetable",professorTimetable);
router.use("/user",user);


module.exports = router;