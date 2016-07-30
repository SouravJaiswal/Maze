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
		type:Number,
		required:true,
		min:1,
		max:8
	},
	timetable:[[
		{
			name : {
				type : String,
			},
			_id : {
				type : mongoose.Schema.Types.ObjectId,
				ref : "courses"
			}
		}
	]],
	courses:[{
		course_id:{
			type:mongoose.Schema.ObjectId,
			ref:"Course"
		},
		professor_id:[{
			type:mongoose.Schema.ObjectId,
			ref:"Professor"
		}]
	}]
});


var ClassTimetable = mongoose.model("ClassTimetable",classTimetableSchema);

module.exports = ClassTimetable;