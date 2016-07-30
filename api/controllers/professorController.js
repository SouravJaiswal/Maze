var helpers = require("../../helpers/helper_2");
var dept = require("../models/departments.js");
var Professor = require("../models/professors.js");
var async = require("async");
var Courses = require("../models/courses");
var ObjectID = require("mongoose").Types.ObjectId;


function checkErrors(req, cb, ufields) {

    var errors = [];
    var uFields = ufields || ["university_id","email"];
    //console.log(uFields);
    var tests = [
        function(done) {

            // Check if all the required fields exists, if not put in the errors array

            helpers.exists(req.body,["name","university_id","department","email"],function(err){
                errors.push(err);
                console.log("test 1");
                done(null,errors);
            });

        },
        function(errors,done){

            // Check if all the unique fields are unique

            helpers.checkUnique("professors",req.body,uFields,function(err){
                errors.push(...err);
                console.log("test 2");
                done(null,errors);
            })
                
        },
        function(errors,done){
            if(errors[0].indexOf("departments") < 0){
                var query = {};
                query["name"] = req.body.department;
                helpers.existInDB("departments",req.body.department,query,function(err,data){
                        errors.push(...err);
                        console.log("test 3");
                        done(null,errors);
                    }
                );
            }else{
                done(null,errors);
            }
        },
        function(errors, done) {
            var results = [];
            if (req.body.courses && req.body.courses.length > 0) {
                courses = JSON.parse(req.body.courses);
                helpers.getData(courses,"courses","course_id",["_id"],populate);
                function populate(err,data){
                    errors.push(...err);
                    for(var i=0;i<data.length;i++){
                        results.push(data[i]._id);
                    }
                    done(null,errors,results);
                }
            } else {
                done(null,errors,results);
            }
        }
    ];
    async.waterfall(tests, function(err, errors, results) {
        if (err) {
            errors.push(err);
        }
        cb(errors,results);
        
    });
}


function populateCourses(professor,cb){
    var self = professor;
    async.eachSeries(self.courses,function(course,done){
        Courses.findById(course,function(err,data){
            if(err){
                console.log(err);
            }else{
                var e = true;
                for(var i=0;i<data.professors.length;i++){
                    if(String(data.professors[i]) == String(self._id)){
                        e = false;
                    }
                }
                if(e){
                    console.log(self._id);
                    data.professors.push(self._id);
                }
                data.save(function(err){
                    if(err){
                        console.log(err);
                    }
                    done();
                });
            }
        });
    },function(err){
        if(err){
            console.log(err);
        }
        cb(err);
    });
}



module.exports.createProfessor = function(req, res) {

    function cb(errors,data) {
        if (errors.length === 1 && errors[0].length === 0) {

            var professor = new Professor();
            professor.name = req.body.name;
            professor.email = req.body.email;
            professor.university_id = req.body.university_id;
            professor.department = req.body.department;
            if (req.body.courses && req.body.courses.length > 0)
                professor.courses = data;
            professor.save(function(err) {
                if (err) {
                    //console.log(err.toJSON());
                    res.json(err);
                } else {
                    populateCourse(professor,function(err){
                        if(err){
                            console.log(err);
                            professor.remove();
                            res.json("Couldn't add courses, so reverted back");
                        }else{
                            res.json(professor);
                        } 
                    });
                }
            });
        } else {
            res.json(errors);
        }
    }

    var errors = checkErrors(req, cb);



}

module.exports.updateProfessor = function(req, res) {

    var fields = ["university_id","email"];
    var fieldsCheck = [];
    var prof;
    console.log(req.params.id);
    Professor.findById(ObjectID(req.params.id), function(err, professor) {
        if (err) {
            res.json(err);
            return;
        }
        if(professor == null){
            res.json("Professor not found");
            return;
        }
        for(var i=0;i<fields.length;i++){
            //console.log(professor[fields[i]] + " : " + req.body[fields[i]]);
            if(professor[fields[i]] != req.body[fields[i]]){
                //console.log("Working");
                fieldsCheck.push(fields[i]);
            }
        }
        //console.log(fieldsCheck);
        prof = professor;
        checkErrors(req, cb,fieldsCheck);
    });

    function cb(errors,results){
        if(errors.length === 1 && errors[0].length === 0 ){
            console.log(prof);
            prof.name = req.body.name;
            prof.email = req.body.email;
            prof.university_id = req.body.university_id;
            prof.department = req.body.department;
            //console.log(req.body.courses);
            if (req.body.courses && req.body.courses.length > 0){
                var cdata = results;
                for(var i=0;i<results.length;i++){
                    //console.log(prof.courses.indexOf(results[i]));
                    var e = true;
                    for(var j=0;j<prof.courses.length;j++){
                        if(String(prof.courses[j]) == String(results[i])){
                            e = false;
                        }
                    }

                    if(e){
                        prof.courses.push(results[i]);
                    }
                }

            }
            prof.save(function(err) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(prof);
                }
            });
        }else{
            res.json(errors);
        }
    }
}

module.exports.deleteProfessor = function(req, res) {
    Professor.findByIdAndRemove(req.params.id, function(err, professor) {
        if (err) {
            res.json(err);
            return;
        } else if (professor !== null) {
            res.json("Professor deleted" + professor);
            return;
        }
    });
}

module.exports.getProfessor = function(req, res) {
    Professor.findById(req.params.id, function(err, professor) {
        if (err) {
            res.json(err);
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
