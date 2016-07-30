var mongoose = require("mongoose");
var async = require("async");
var Courses = require("./courses");
var professorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    university_id: {
        type: String,
        required: true,
        unique:true
    },
    department: {
        type: String,
        required: true
    },
    courses: [{
        type : mongoose.Schema.Types.ObjectId,
        ref:"courses"
    }]
});


var Professor = mongoose.model("Professor", professorSchema);

module.exports = Professor;
