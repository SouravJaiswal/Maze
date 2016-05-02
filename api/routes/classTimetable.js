var express = require("express");
var router = express.Router();
var ctrlClassTimetable = require("../controllers/classTimetableController");


router.get("/:id",ctrlClassTimetable.getClassTimeTable);
router.post("/",ctrlClassTimetable.initClassTimetable);
router.post("/:id",ctrlClassTimetable.insertClassTimetable);
router.put("/:id",ctrlClassTimetable.updateClassTimetable);
router.delete("/:id",ctrlClassTimetable.deleteClassTimetable);


module.exports = router;