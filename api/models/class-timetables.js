var mongoose = require("mongoose");
var classTimetableSchema = mongoose.Schema({
	department:{
		type:String,
		required:true
	},
	year:{
		type : Number,
		min : 1900,
		max : 2100,
		default : 2016
	},
	semester:{
		type:Number,
		required:true,
		min:1,
		max:8
	},
	section:{

		type : String,
		required : true,
		enum : ["A","B","C","D","E"] 

	},	
	timetable:[[
		{
			course_id : {
				type : mongoose.Schema.Types.ObjectId,
				ref : "courses"
			},
			professor_id : [{
				type : mongoose.Schema.Types.ObjectId,
				ref : "professors"
			}]
		}
	]],
	courses:[{
		course_id:{
			type:mongoose.Schema.ObjectId,
			ref:"courses"
		},
		professor_id:[{
			type:mongoose.Schema.ObjectId,
			ref:"professors"
		}]
	}]
});


var ClassTimetable = mongoose.model("ClassTimetable",classTimetableSchema);

module.exports = ClassTimetable;