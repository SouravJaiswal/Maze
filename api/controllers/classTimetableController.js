var helpers = require("../../helpers/helper_2");
var ClassTimetable = require("../models/class-timetables");
var semCourses = require("../models/sem-courses");
var async = require("async");


function checkErrors(req,cb){
    var errors = [];
    console.log("checkpoint 1");
    var tests = [
        function(done){

            // Check if all the required fields exists, if not put in the errors array
            console.log("checkpoint 2");
            helpers.exists(req.body,["year","department","semester","section"],function(err){
                errors.push(err);
                console.log("test 1");

                // What happens if the given input is anything other than numbers?

                if( (req.body.year < 1900 || req.body.year > 2100)){
                    errors.push("Year out of bound");
                }
                if((req.body.semester < 1  && req.body.semester > 9)){
                    errors.push("Semester out of bound");
                }
                var sections = ["A","B","C","D","E"];
                if(sections.indexOf(req.body.section) < 0){
                    errors.push("Section out of bound");
                }
                done(null,errors);
            });

        },
        function(errors,done){

            // Check whether the semester has already been created
            if(errors.length == 1 && errors[0].length === 0 ){

                var query = {};
                query["year"] = req.body.year;
                query["semester"] = req.body.semester;
                query["section"] = req.body.section;
                query["department"] = req.body.department;
                //console.log(query); 
                helpers.findInModel(ClassTimetable,"This timetable ",query,["_id"],function(err,data,waste){

                    console.log(data._id);
                    //console.log(err);
                    if(data._id && String(data._id).length > 0){
                        errors.push("The timetable for this section already exists");
                    }
                    done(null, errors);
                });
            }else{
                done(null, errors);
            }
        }
    ];

    async.waterfall(tests,function(err,cerrors){
        //console.log(err);
        cb(cerrors);
    });
}


function checkCourses(req,cData,cb){

    var query = {};
    query["year"] = cData["year"];
    query["department"] = cData["department"];
    query["semester"] = cData["semester"];
    var errors = [];
    helpers.findInModel(semCourses, "This semester data " ,query, ["courses"],function(err,data,waste){

        if(err && err.length > 0){
            errors.push(...err);
        }
        if(data != null){
            var courses = JSON.parse(req.body.courses);
            console.log(data);
            var courses_id = [];
            for(var i=0;i<courses.length;i++){
                var cfound = false;
                for(var j=0;j<data.courses.length;j++){
                    if(String(courses[i].course_id) == String(data.courses[j].course_id)){
                        cfound = true;
                        for(var k=0;k<courses[i].professor_id.length;k++){
                            // var found = false;
                            // for(var l=0;l<data.courses[j].professor_id.length;l++){
                            //     if(String(courses[i].professor_id[k]) == String(data.courses[j].professor_id[l])){
                            //         found = true;
                            //         break;
                            //     }
                            // }

                            if(data.courses[j].professor_id.indexOf(String(courses[i].professor_id[k])) < 0){
                                errors.push("Professor not assigned to teach the course this semester");
                            }
                        }
                        break;
                    }
                }
                if(!cfound){
                    errors.push("Course not assigned this semester for this department");
                }
            }
        }else{
            errors.push("No semester courses defined for this class");
        }
        cb(errors);
    });
}



function create(req,res){


    checkErrors(req,function(errors){
        if(errors.length == 1 && errors[0].length === 0){
            var ctt = new ClassTimetable();
            ctt.year = req.body.year;
            ctt.department = req.body.department;
            ctt.section = req.body.section;
            ctt.semester = req.body.semester;
            ctt.save(function(err){
                if(err){
                    res.json(err);
                    return;
                }else{
                    res.json(ctt);
                }
            })
        }else{
            res.json(errors);
        }
    })

}


function insertCourses(req,res){

    var ctt_id = req.params.id.trim();

    ClassTimetable.findById(ctt_id,function(err,data){
        if(err){
            res.json(err);
        }else{
            if(data == null){
                res.json("No Such timetable");
            }else{
                checkCourses(req,data,function(err){
                    if(err && err.length>0){
                        res.json(err);
                    }else{
                        var courses = JSON.parse(req.body.courses);
                        console.log(courses);   
                        // Bad assumption but simple code for now
                        data.courses = courses;
                        data.save(function(err){
                            if(err){
                                res.json(err);
                            }else{
                                res.json(data);
                            }
                        });
                    }
                });
            }
        }
    });
}


module.exports.create = create;
module.exports.insertcourses = insertCourses;
