var mongoose = require("mongoose");
var professorTimetableSchema = mongoose.Schema({
    professor_id: {
        type: String,
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
    timetable: [{
        type: mongoose.Schema.ObjectId,
        ref: "Course"
    }]
});


var ProfessorTimetable = mongoose.model("ProfessorTimetable", professorTimetableSchema);

module.exports = ProfessorTimetable;
