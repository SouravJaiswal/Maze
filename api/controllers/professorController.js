var helpers = require("../../helpers/helper");
var dept = require("../models/departments.js");
var Professor = require("../models/professors.js");


module.exports.createProfessor = function(req, res) {

    function callback(errors) {
        if (errors.length === 0) {
            var professor = new Professor();
            professor.name = req.body.name;
            professor.email = req.body.email;
            professor.university_id = req.body.university;
            professor.department = req.body.department;
            professor.save(function(err) {
                if (err) {
                    res.json("Some error occured");
                } else {
                    res.json(professor);
                }
            });
        } else {
            res.json(errors);
        }
    }

    var errors = helpers.checkProfessorErrors(req, callback);



}

module.exports.updateProfessor = function(req, res) {

    function callback(errors) {
        if (errors.length === 0) {
            Professor.findById(res.params.id, function(err, professor) {
                if (err) {
                    res.json("Some error occured");
                    return;
                }
                professor.name = req.body.name;
                professor.email = req.body.email;
                professor.university_id = req.body.university;
                professor.department = req.body.department;
                professor.save(function(err) {
                    if (err) {
                        res.json("Some error occured");
                    } else {
                        res.json(professor);
                    }
                });
            });

        } else {
            res.json(errors);
        }
    }
    var errors = helpers.checkProfessorErrors(req,callback);

}

module.exports.deleteProfessor = function(req, res) {
    Professor.findByIdAndRemove(res.params.id, function(err, professor) {
        if (err) {
            res.json("Some error occured");
            return;
        } else if (professor !== null) {
            res.json("Professor deleted" + professor);
            return;
        }
    });
}

module.exports.getProfessor = function(req, res) {
    Professor.findById(res.params.id, function(err, professor) {
        if (err) {
            res.json("Some error occured");
            return;
        }
        if (professor !== null) {
            res.json(professor);
            return;
        } else {
            res.json("No such professor");
        }
    });
}
