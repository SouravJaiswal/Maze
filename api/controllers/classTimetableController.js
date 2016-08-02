var helpers = require("../../helpers/helper_2");
var ClassTimetable = require("../models/class-timetables");
var semCourses = require("../models/sem-courses");
var async = require("async");
var ProfessorTimetable = require("../models/professor-timetables");


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

function insertTT(req,res){

    var ctt_id = req.params.id.trim();

    ClassTimetable.findById(ctt_id,function(err,data){
        if(err){
            res.json(err);
        }else{
            if(data == null){
                res.json("No Such timetable");
            }else{
                var courses = data.courses;
                console.log(courses); 
                var course_id = [];
                var errors = [];
                var courseMap = {};
                var deleteMap = {};
                for(var i=0;i<courses.length;i++){
                    if( course_id.indexOf(String(courses[i].course_id)) < 0){
                        course_id.push(String(courses[i].course_id));
                        courseMap[String(courses[i].course_id)] = [];
                        deleteMap[String(courses[i].course_id)] = [];
                    }
                }  
                var tt = JSON.parse(req.body.timetable);
                // if(tt.length != 5){
                //     errors.push("Timetable not in valid format");
                //     res.json(errors);
                //     return;
                // }
                for(var i=0;i<tt.length;i++){
                    for(var j=0;j<tt[i].length;j++){
                        if(String(tt[i][j]).trim().length > 0 && course_id.indexOf(String(tt[i][j])) < 0){
                            errors.push("Course used in timetable not assigned this semester");
                        }else if(String(tt[i][j]).trim().length > 0 && course_id.indexOf(String(tt[i][j])) >= 0){
                            courseMap[String(tt[i][j]).trim()].push([i,j]);
                        }
                    }
                    // if(tt[i].length != 6){
                    //     errors.push("Timetable not in valid format");
                    //     break;
                    // }
                }
                console.log(courseMap); 
                if(errors && errors.length > 0){
                    res.json(errors);
                    return;
                }
                //console.log(tt);
                // Professor timetable has to be updated.
                
                if(data.timetable != null){
                    for(var i = 0;i<5;i++){
                        for(var j=0;j<6;j++){
                            if(String(data.timetable[i][j]).trim().length > 0 &&  data.timetable[i][j] != tt[i][j]){
                                deleteMap[String(data.timetable[i][j])].push([i,j]);
                            }
                        }
                    }
                }
                console.log(deleteMap);
                data.timetable = tt;
                
                data.save(function(err){
                    if(err){
                        res.json(err);
                    }else{
                        async.eachSeries(course_id,function(cid,next){
                            if(courseMap[cid].length > 0){
                                var pids = [];
                                for(var i=0;i<data.courses.length;i++){
                                    if(String(data.courses[i].course_id) == String(cid)){
                                        pids.push(...data.courses[i].professor_id);
                                        break;
                                    }
                                }
                                async.eachSeries(pids,function(pid,done){
                                    //console.log(pid);
                                    var query = {};
                                    //console.log(data);
                                    query["professor_id"] = String(pid);
                                    query["year"] = data.year;
                                    query["semester"] = data.semester % 2 == 0 ? "even" : "odd";
                                    console.log(query);
                                    ProfessorTimetable.findOne(query,function(err,prof){
                                        console.log(prof);
                                        if(err){
                                            res.json(err);
                                        }else if(prof != null){
                                            if(prof.timetable && prof.timetable.length>0){
                                                for(var i=0;i<courseMap[cid].length;i++){
                                                    prof.timetable[courseMap[cid][i][0]][courseMap[cid][i][1]] = cid;
                                                }
                                            }else{
                                                prof.timetable = [];
                                                for(var i=0;i<5;i++){
                                                    var temp = [];
                                                    for(var j=0;j<6;j++){
                                                        temp.push("");
                                                    }
                                                    prof.timetable.push(temp);
                                                }
                                                for(var i=0;i<courseMap[cid].length;i++){
                                                    prof.timetable[courseMap[cid][i][0]][courseMap[cid][i][1]] = cid;
                                                }
                                            }
                                            console.log(prof);
                                            prof.save(function(err){
                                                if(err){
                                                    res.json(err);
                                                    return;
                                                }else{
                                                    done();
                                                    return;
                                                }
                                            });
                                        }else{
                                            res.json("No Such professor Timetable");
                                            return;
                                        }
                                       done();
                                    });
                                },function(err){
                                    if(err){
                                        res.json(err);
                                        return;
                                    }
                                    next();
                                });
                            }else{
                                next();
                            }
                        },function(err){
                            if(err){
                                res.json(err);
                                return;
                            }
                            res.json(data);
                        });
                    }
                });
            }
        }
    });
}

/*

    Things to complete here

    Changes in class timetable should reflect in Professor's Timetable

*/


module.exports.create = create;
module.exports.insertcourses = insertCourses;
module.exports.insertTT = insertTT;
