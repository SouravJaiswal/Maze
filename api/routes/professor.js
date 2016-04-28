var express = require("express");
var router = express.Router();
var ctrlProfessor = require("../controllers/professorController");


router.get("/:id",ctrlProfessor.getProfessor);
router.post("/",ctrlProfessor.createProfessor);
router.put("/:id",ctrlProfessor.updateProfessor);
router.delete("/:id",ctrlProfessor.deleteProfessor);


module.exports = router;