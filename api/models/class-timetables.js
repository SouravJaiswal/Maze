var mongoose = require("mongoose");
var classTimetableSchema = mongoose.Schema({
	department:{
		type:ObjectId,
		ref:"Departments",
		required:true
	},
	year:{
		type:String,
		required:true,
	},
	semester:{
		type:String,
		required:true
	},
	timetable:[{
		day:[{
			type:Schema.ObjectId,
			ref:"Course"
		}]
	}],
	courses:[{
		course_id:{
			type:Schema.ObjectId,
			ref:"Course"
		},
		professor_id:{
			type:Schema.ObjectId,
			ref:"Professor"
		}
	}]
});


var ClassTimetable = mongoose.model("ClassTimetable",classTimetable);

module.exports = ClassTimetable;