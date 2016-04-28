var dept = require("../api/models/departments.js");
var Professor = require("../api/models/professors.js");

function exists(data) {
    return data && data.length > 0;
}

module.exports.exists = exists;

module.exports.checkUserErrors = function(req, callback) {
    var errors = []

    if (!exists(req.body.username)) {
        errors.push("Username not provided");
    }
    if (!exists(req.body.email)) {
        errors.push("Email not provided");
    }
    if (!exists(req.body.password)) {
        errors.push("Password not provided");
    } else {
        if (req.body.password.length > 10) {
            errors.push("Password should be less than 10");
        }
    }
    if (!exists(req.body.name)) {
        errors.push("Name not provided");
    }
    if (!exists(req.body.university)) {
        errors.push("University ID not provided");
    }
    if (!exists(req.body.department)) {
        errors.push("Department not provided");
        callback(errors);
    } else {
        dept.findOne({ name: req.body.department }, function(err, data) {
            if (err) {
                errors.push("Some error has occured");
            }
            if (data == null) {
                console.log("Null department");
                errors.push("Unknown Department");
            }
            callback(errors);
        })
    }
}

module.exports.checkProfessorErrors = function(req, callback) {
    var errors = []

    if (!exists(req.body.email)) {
        errors.push("Email not provided");
    }
    if (!exists(req.body.name)) {
        errors.push("Name not provided");
    }
    if (!exists(req.body.university)) {
        errors.push("University ID not provided");
    }
    if (!exists(req.body.department)) {
        errors.push("Department not provided");
        callback(errors);
    } else {
        dept.findOne({ name: req.body.department }, function(err, data) {
            if (err) {
                errors.push("Some error has occured");
            }
            if (data == null) {
                errors.push("Unknown Department");
            }
            callback(errors);
        })
    }

}

module.exports.checkDepartmentErrors = function(req) {
    var errors = []

    if (!exists(req.body.name)) {
        errors.push("Name not provided");
    }

    return errors;
}

module.exports.checkCourseErrors = function(req,callback) {
    var errors = []

    if (!exists(req.body.name)) {
        errors.push("Name not provided");
    }
    if (!exists(req.body.id)) {
        errors.push("Course ID not provided");
    }
    if (!exists(req.body.department)) {
        errors.push("Department not provided");
        callback(errors,"");
    } else {
        dept.findOne({ name: req.body.department }, function(err, data) {
            if (err) {
                errors.push("Some error has occured finding the department");
                return;
            }
            if (data == null) {
                errors.push("Unknown Department");
                callback(errors,"");
            } else {
                Professor.findOne({name:req.body.professor}, function(err, data) {
                    if (err) {
                        errors.push("Some error has occured finding the professor");
                        return;
                    }
                    if(data == null){
                    	errors.push("Unknown Professor");
               			callback(errors,"");
                    }else{
                    	callback(errors,data._id);
                    }
                })
            }
        })
    }
}


module.exports.checkClassTimetableErrors = function(req,callback){
	
}