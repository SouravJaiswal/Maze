var express = require("express");
var router = express.Router();
var ctrlSemCourses = require("../controllers/semCoursesController");


router.get("/:id",ctrlSemCourses.read);
router.post("/",ctrlSemCourses.create);
router.put("/:id",ctrlSemCourses.update);
router.delete("/:id",ctrlSemCourses.delete);


module.exports = router;