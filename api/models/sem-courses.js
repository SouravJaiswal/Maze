var mongoose = require("mongoose");

var semCourseSchema = mongoose.Schema({
	year : {
		type : Number,
		min : 1900,
		max : 2100,
		default : 2016
	},
	department : {
		type : String,
		required : true
	},
	semester : {
		type:Number,
		required:true,
		min:1,
		max:8
	},
	courses : [{
		course_id : {
			type : mongoose.Schema.Types.ObjectId,
			ref : "courses"
		},
		professor_id : [{
			type : mongoose.Schema.Types.ObjectId,
			ref : "professors"
		}]
	}]
})
var semCourse = mongoose.model("SemCourses",semCourseSchema);

module.exports = semCourse;