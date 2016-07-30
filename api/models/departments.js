var mongoose = require("mongoose");
var departmentSchema = mongoose.Schema({
	name:{
		type:String,
		required:true,
		unique:true
	}
});


var Department = mongoose.model("Department",departmentSchema);

module.exports = Department;