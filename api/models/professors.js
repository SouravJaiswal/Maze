var mongoose = require("mongoose");
var professorSchema = mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	university_id: {
		type:String,
		required:true
	},
	department:{
		type:String,
		required:true
	},
	courses:[{
		course_id:{
			type:mongoose.Schema.ObjectId,
			ref:"Course"
		}
	}]
});


var Professor = mongoose.model("Professor",professorSchema);

module.exports = Professor;