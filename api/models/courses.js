var mongoose = require("mongoose");
var Professors = require("./professors");
var async = require("async");
var courseSchema = mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	course_id: {
		type:String,
		required:true,
		unique:true
	},
	department:{
		type:String,
		required:true
	},
	professors:[{
		type : mongoose.Schema.Types.ObjectId,
		ref:"professor"
	}],
	sem_offered:[{
		type:Number,
		min:1,
		max:8
	}]
});


var Course = mongoose.model("Course",courseSchema);

module.exports = Course;