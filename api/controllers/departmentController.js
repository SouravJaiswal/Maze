var helpers = require("../../helpers/helper");
var Dept = require("../models/departments");


module.exports.createDepartment = function(req, res) {

    var errors = helpers.checkDepartmentErrors(req);

    if (errors.length === 0) {
        var dept = new Dept();
        dept.name = req.body.name;
        dept.save(function(err) {
            if (err) {
                res.json("Error : "+err.errmsg);
            } else {
                res.json(dept);
            }
        });
    } else {
        res.json(errors);
    }

}

module.exports.updateDepartment = function(req, res) {
	console.log(req.params.id);
    var errors = helpers.checkDepartmentErrors(req);
    if (errors.length === 0) {
        Dept.findById(req.params.id, function(err, dept) {
            if (err) {
                res.json("Some error occured");
                return;
            }
            dept.name = req.body.name;
            dept.save(function(err) {
                if (err) {
                    res.json("Some error occured");
                } else {
                    res.json(dept);
                }
            });
        });

    } else {
        res.json(errors);
    }
}

module.exports.deleteDepartment = function(req, res) {
    Dept.findByIdAndRemove(req.params.id, function(err, dept) {
        if (err) {
            res.json("Some error occured");
            return;
        } else {
            res.json("Department deleted" + dept);
            return;
        }
    });
}

module.exports.getDepartments = function(req, res) {
    Dept.find({}, function(err, dept) {
        if (err) {
            res.json("Some error occured");
            return;
        }
        res.json(dept);
    });
}
