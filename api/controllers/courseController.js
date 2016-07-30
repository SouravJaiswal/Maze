var helpers = require("../../helpers/helper_2");
var dept = require("../models/departments.js");
var Course = require("../models/courses.js");
var Professors = require("../models/professors.js");
var async = require("async");

function checkErrors(req, cb, ufields) {

    var errors = [];
    var uFields = ufields || ["course_id"];
    //console.log(uFields);
    var tests = [
        function(done) {

            // Check if all the required fields exists, if not put in the errors array
            console.log("Not working");
            helpers.exists(req.body,["name","course_id","department"],function(err){
                errors.push(err);
                console.log("test 1");
                done(null,errors);
            });

        },
        function(errors,done){

            // Check if all the unique fields are unique

            helpers.checkUnique("courses",req.body,uFields,function(err){
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
        function(errors,done){
            if(errors[0].indexOf("semesters") < 0){
                var sem = JSON.parse(req.body.semesters);
                for(var i=0;i<sem.length;i++){
                    if(sem[i] < 1 || sem[i] > 8){
                        errors.push("Semester out of bound");
                    }
                }
            }
            done(null,errors);
        },
        function(errors, done) {
            var results = [];
            if (req.body.professors && req.body.professors.length > 0) {
                var professors = JSON.parse(req.body.professors);
                console.log(professors);
                helpers.getData(professors,"professors","university_id",["_id"],populate);
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

function populateProfessor(courses,cb){
    var self = courses;
    async.eachSeries(self.professors,function(professor,done){
        Professors.findById(professor,function(err,data){
            if(err){
                console.log(err);
            }else{
                var e = true;
                for(var i=0;i<data.courses.length;i++){
                    if(String(data.courses[i]) == String(self._id)){
                        e = false;
                    }
                }
                if(e){
                    console.log(self._id);
                    data.courses.push(self._id);
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


module.exports.createCourse = function(req, res) {

    function callback(errors,professor) {
        if (errors.length === 1 && errors[0].length === 0) {
            var course = new Course();
            course.name = req.body.name;
            course.course_id = req.body.course_id
            course.department = req.body.department;
            var sem = JSON.parse(req.body.semesters);
            course.sem_offered = [];
            for(var i=0;i<sem.length;i++){
                if(course.sem_offered.indexOf(sem[i]) < 0){
                    course.sem_offered.push(sem[i]);
                }
            }
            course.professors = [];
            course.professors.push(...professor);
            course.save(function(err) {
                if (err) {
                    res.json(err);
                } else {
                    populateProfessor(course,function(err){
                        if(err){
                            console.log(err);
                            course.remove();
                            res.json("Couldn't add professors, so reverted back");
                        }else{
                            res.json(course);
                        } 
                    });
                }
            });
        } else {
            res.json(errors);
        }
    }

    checkErrors(req, callback);

}

module.exports.updateCourse = function(req, res) {
    var fields = ["course_id"];
    var fieldsCheck = [];
    var course;
    console.log(req.params.id);
    Course.findById(ObjectID(req.params.id), function(err, data) {
        if (err) {
            res.json(err);
            return;
        }
        if(data == null){
            res.json("Course not found");
            return;
        }
        for(var i=0;i<fields.length;i++){
            //console.log(professor[fields[i]] + " : " + req.body[fields[i]]);
            if(data[fields[i]] != req.body[fields[i]]){
                //console.log("Working");
                fieldsCheck.push(fields[i]);
            }
        }
        //console.log(fieldsCheck);
        course = data;
        checkErrors(req, cb,fieldsCheck);
    });

    function cb(errors,results){
        if(errors.length === 1 && errors[0].length === 0 ){
            console.log(course);
            course.name = req.body.name;
            course.course_id = req.body.course_id;
            course.department = req.body.course;
            //console.log(req.body.courses);
            if (req.body.professors && req.body.professors.length > 0){
                var cdata = results;
                for(var i=0;i<results.length;i++){
                    //console.log(prof.courses.indexOf(results[i]));
                    var e = true;
                    for(var j=0;j<course.professors.length;j++){
                        if(String(course.professors[j]) == String(results[i])){
                            e = false;
                        }
                    }

                    if(e){
                        course.professors.push(results[i]);
                    }
                }

            }
            course.save(function(err) {
                if (err) {
                    res.json(err);
                } else {
                    populateProfessor(course,function(err){
                        if(err){
                            console.log(err);
                            course.remove();
                            res.json("Couldn't add professors, so reverted back");
                        }else{
                            res.json(course);
                        } 
                    });
                }
            });
        }else{
            res.json(errors);
        }
    }
}
module.exports.deleteCourse = function(req, res) {
    Course.findByIdAndRemove(req.params.id, function(err, course) {
        if (err) {
            res.json("Some error occured");
            return;
        }
        if (course !== null) {
            res.json("course deleted" + course);
            return;
        } else {
            res.json("No such course");
        }
    });
}

module.exports.getCourse = function(req, res) {
    Course.findById(req.params.id, function(err, course) {
        if (err) {
            res.json("Some error occured");
            return;
        }
        if(course == null){
            res.json("No such course");
            return;
        }else{
            res.json(course);
            return;
        }
    });
}
