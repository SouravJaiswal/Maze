var mongoose = require("mongoose");
var classTimetableSchema = mongoose.Schema({
	department:{
		type:String,
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
			type:mongoose.Schema.ObjectId,
			ref:"Course"
		}]
	}],
	courses:[{
		course_id:{
			type:mongoose.Schema.ObjectId,
			ref:"Course"
		},
		professor_id:{
			type:mongoose.Schema.ObjectId,
			ref:"Professor"
		}
	}]
});


var ClassTimetable = mongoose.model("ClassTimetable",classTimetableSchema);

module.exports = ClassTimetable;