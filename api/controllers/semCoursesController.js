var helpers = require("../../helpers/helper_2");
var dept = require("../models/departments.js");
var User = require("../models/users.js");
var semCourses = require("../models/sem-courses");
var async = require("async");


function checkErrors(req,cb,ufields){

    var errors = [];
    var tests = [
        function(done){

            // Check if all the required fields exists, if not put in the errors array

            helpers.exists(req.body,["year","department","semester"],function(err){
                errors.push(err);
                console.log("test 1");

                // What happens if the given input is anything other than numbers?

                if( (req.body.year < 1900 || req.body.year > 2100)){
                    errors.push("Year out of bound");
                }
                if((req.body.semester < 1 || req.body.semester > 8)){
                    errors.push("Semester out of bound");
                }
                done(null,errors);
            });

        },
        function(errors, done){

            // Check If department is present

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

            // Check whether the semester has already been created
            if(errors.length == 1 && errors[0].length === 0 && ufields == 1){

                var query = {};
                query["year"] = req.body.year;
                query["department"] = req.body.department;
                query["semester"] = req.body.semester;
                //console.log(query);
                helpers.findInModel(semCourses,"This semester ",query,["_id"],function(err,data,waste){

                    console.log(data);
                    if(data && data._id && String(data._id).length > 0 ){
                        errors.push("This semester has already been created for the supplied department");
                    }
                    done(null, errors);
                });
            }else{
                done(null, errors);
            }

        },
        function(errors,done){

            // Check if the courses and professors associated are properly assigned and exists

            if(errors.length == 1 && errors[0].length === 0 && req.body.courses && req.body.courses.length > 0){

                var courses_id = [];
                var courses = JSON.parse(req.body.courses);
                console.log(courses);
                var csize = courses.length;
                for(var i=0;i<csize;i++){
                    if(courses[i].course_id && courses[i].course_id.length > 0 && courses[i].professor_id && courses[i].professor_id.length > 0){
                        var valid = true;
                        for(var j=0;j<courses[i].professor_id.length;j++){
                            if(courses[i].professor_id[j].length == 0){
                                valid = false;
                                break;
                            }
                            if(!valid){
                                errors.push("Enter valid professor ID");
                            }else{
                                courses_id.push(courses[i].course_id);
                            }
                        }
                    }else{
                        errors.push("Supply proper course id and professor id");
                    }
                }
                if(errors.length  > 1 ){
                    done(null,errors);
                    return;
                }   
                helpers.getData(courses_id,"courses","_id",["name","professors","semesters"],function(err,data){

                    var dsize = data.length;
                    //console.log(err);
                    //console.log(data);
                    if(err.length > 0){
                        errors.push(...err);
                        done(null,errors);
                        return;
                    }
                    for(var i=0;i<dsize;i++){
                        for(var j=0;j<courses[i].professor_id.length;j++){
                            if(data[i].professors.indexOf(String(courses[i].professor_id[j])) < 0){
                                errors.push(data.name + " is not taught by the professor you have provided");
                            }
                        }
                    }
                    var ssize = req.body.semesters;
                    for(var i=0;i<ssize;i++){
                        if(data[i].semesters.indexOf(req.body.semesters[i]) < 0 ){
                            errors.push(data.name + " is not taught during the " + req.body.semesters[i] + " semester");
                        }
                    }
                    done(null,errors);
                });
            }else{
                done(null, errors);
            }

        }
    ];

    async.waterfall(tests,function(err,cerrors){
        if(err)     
            console.log(err);
        cb(errors);
    });
}


// function createSemCourses(req,res){

//     function create(errors){
//         if(errors.length == 1 && errors[0].length ===0){
//             var semCourse = new semCourses();
//             semCourse.year = req.body.year;
//             semCourse.department = req.body.department;
//             semCourse.semester = req.body.semester;
//             if(req.body.courses && req.body.courses.length > 0){
//                 semCourse.courses = JSON.parse(req.body.courses);
//             }
//             semCourse.save(function(err){
//                 if(err){
//                     res.json(err);
//                 }else{
//                     res.json(semCourse);
//                 }
//             });
//         }else{
//             res.json(errors);
//         }
//     }
//     checkErrors(req,create,1);
// }

function createSemCourses(req,res){

    function create(errors){
        if(errors.length == 1 && errors[0].length ===0){
            var semCourse = new semCourses();
            semCourse.year = req.body.year;
            semCourse.department = req.body.department;
            semCourse.semester = req.body.semester;
            if(req.body.courses && req.body.courses.length > 0){
                semCourse.courses = JSON.parse(req.body.courses);
            }
            semCourse.save(function(err){
                if(err){
                    res.json(err);
                }else{
                    res.json(semCourse);
                }
            });
        }else{
            res.json(errors);
        }
    }
    checkErrors(req,create,1);
}

function updateSemCourses(req,res){

    function update(errors){
        if(errors.length == 1 && errors[0].length ===0){
            semCourses.findById(req.params.id,function(err,data){
                if(err){
                    res.json(err);
                }else if(data != null){
                    if(data.year != req.body.year || data.semester != req.body.semester || data.department != req.body.department){
                        errors.push("Changing the Year, Semester or the Department is forbidden");
                        res.json(errors);
                        return;
                    }
                    if(req.body.courses && req.body.courses.length > 0){
                        data.courses = JSON.parse(req.body.courses);
                    }
                    data.save(function(err){
                        if(err){
                            res.json(err);
                        }else{
                            res.json(data);
                        }
                    });
                }else{
                    res.json("Semester has not been created");
                }
            })
        }else{
            res.json(errors);
        }
    }
    checkErrors(req,update,0);
}

function deleteSemCourses(req,res){

    semCourses.findById(req.params.id,function(err,data){
        if(err){
            console.log(err);
        }
        if(data == null){
            res.json("This semester id is not valid");
            return;
        }
        data.remove();
        res.json(data);
    });
}

function getSemCourses(req,res){

    semCourses.findById(req.params.id,function(err,data){
        if(err){
            console.log(err);
        }
        if(data == null){
            res.json("This semester id is not valid");
            return;
        }
        res.json(data);
    });
}


module.exports.create = createSemCourses;
module.exports.update = updateSemCourses;
module.exports.delete = deleteSemCourses;
module.exports.read = getSemCourses;