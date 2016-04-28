var express = require("express");
var router = express.Router();
var ctrlCourse = require("../controllers/courseController");


router.get("/:id",ctrlCourse.getCourse);
router.post("/",ctrlCourse.createCourse);
router.put("/:id",ctrlCourse.updateCourse);
router.delete("/:id",ctrlCourse.deleteCourse);


module.exports = router;