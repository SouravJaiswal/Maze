var express = require("express");
var router = express.Router();
var ctrlProfessorTimetable = require("../controllers/professorTimetableController");


//router.get("/:id",ctrlProfessorTimetable.getClassTimeTable);
router.post("/",ctrlProfessorTimetable.create);
//router.post("/:id",ctrlProfessorTimetable.insertClassTimetable);
//router.put("/:id",ctrlProfessorTimetable.updateClassTimetable);
//router.delete("/:id",ctrlProfessorTimetable.deleteClassTimetable);


module.exports = router;