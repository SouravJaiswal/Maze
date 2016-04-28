var helpers = require("../../helpers/helper");
var dept = require("../models/departments.js");
var User = require("../models/users.js");


module.exports.createUser = function(req, res) {

    function callback(errors) {
        if (errors.length === 0) {
            var user = new User();
            user.username = req.body.username;
            user.name = req.body.name;
            user.email = req.body.email;
            user.password = req.body.password;
            user.university_id = req.body.university;
            user.department = req.body.department;
            user.save(function(err) {
                if (err) {
                    res.json("Some error occured");
                } else {
                    res.json(user);
                }
            });
        } else {
            res.json(errors);
        }
    }

    var errors = helpers.checkUserErrors(req, callback);

}

module.exports.updateUser = function(req, res) {

    function callback(errors) {
        if (errors.length === 0) {
            User.findById(res.params.id, function(err, user) {
                if (err) {
                    res.json("Some error occured");
                    return;
                }
                if (user == null) {
                    res.json("No such user");
                    return;
                }
                user.username = req.body.username;
                user.name = req.body.name;
                user.email = req.body.email;
                user.password = req.body.password;
                user.university_id = req.body.university;
                user.department = req.body.department;
                user.save(function(err) {
                    if (err) {
                        res.json("Some error occured");
                    } else {
                        res.json(user);
                    }
                });
            });

        } else {
            res.json(errors);
        }
    }
    var errors = helpers.checkUserErrors(req,callback);

}

module.exports.deleteUser = function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err, user) {
        if (err) {
            res.json("Some error occured");
            return;
        }
        if (user !== null) {
            res.json("User deleted" + user);
            return;
        } else {
            res.json("No such user");
        }
    });
}

module.exports.getUser = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            res.json("Some error occured");
            return;
        }
        if (user !== null) {
            res.json("No such user");
            return;
        } else {
            res.json(user);
            return;
        }
    });
}
