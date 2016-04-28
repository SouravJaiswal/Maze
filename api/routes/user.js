var express = require("express");
var router = express.Router();
var ctrlUser = require("../controllers/userController");


router.get("/:id",ctrlUser.getUser);
router.post("/",ctrlUser.createUser);
router.put("/:id",ctrlUser.updateUser);
router.delete("/:id",ctrlUser.deleteUser);


module.exports = router;