var express = require("express");
var router = express.Router();
var ctrlClassTimetable = require("../controllers/classTimetableController");


//ßßrouter.get("/:id",ctrlClassTimetable.getClassTimeTable);
router.post("/",ctrlClassTimetable.create);
router.post("/courses/:id",ctrlClassTimetable.insertcourses);
router.post("/timetable/:id",ctrlClassTimetable.insertTT);
// router.post("/:id",ctrlClassTimetable.insertClassTimetable);
// router.put("/:id",ctrlClassTimetable.updateClassTimetable);
// router.delete("/:id",ctrlClassTimetable.deleteClassTimetable);


module.exports = router;