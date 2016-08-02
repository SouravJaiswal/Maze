var mongoose = require("mongoose");
var professorTimetableSchema = mongoose.Schema({
    professor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"professors",
        required: true
    },
    year: {
        type : Number,
        min : 1900,
        max : 2100,
        default : 2016
    },
    semester: {
        type: String,
        required: true,
        enum : ["odd","even"],
        default : "odd"
    },
    timetable: [[{
        type:String,
        default:""
    }]]
});


var ProfessorTimetable = mongoose.model("ProfessorTimetable", professorTimetableSchema);

module.exports = ProfessorTimetable;
