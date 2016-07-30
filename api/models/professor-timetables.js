var mongoose = require("mongoose");
var professorTimetableSchema = mongoose.Schema({
    professor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Professor",
        required: true
    },
    year: {
        type: String,
        required: true,
    },
    semester: {
        type: String,
        required: true
    },
    timetable: [[{
        name : {
            type:String
        },
        _id : {
            type: mongoose.Schema.ObjectId,
            ref: "Course"
        }
    }]]
});


var ProfessorTimetable = mongoose.model("ProfessorTimetable", professorTimetableSchema);

module.exports = ProfessorTimetable;
