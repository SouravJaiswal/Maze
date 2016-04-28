var mongoose = require("mongoose");
var courseSchema = mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	course_id: {
		type:String,
		required:true
	},
	department:{
		type:String,
		required:true
	},
	professors:[{
		type:mongoose.Schema.ObjectId,
		ref:"professor"
	}],
	sem_offered:[String]
});


var Course = mongoose.model("Course",courseSchema);

module.exports = Course;