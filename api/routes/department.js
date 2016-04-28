var express = require("express");
var router = express.Router();
var ctrlDepartment = require("../controllers/departmentController");


router.get("/",ctrlDepartment.getDepartments);
router.post("/",ctrlDepartment.createDepartment);
router.put("/:id",ctrlDepartment.updateDepartment);
router.delete("/:id",ctrlDepartment.deleteDepartment);


module.exports = router;