var helpers = require("../../helpers/helper_2");
var ProfessorTimetable = require("../models/professor-timetables");
var mongoose = require("mongoose");
var async = require("async");
var Professors = require("../models/professors");

function checkErrors(req,cb,ufields){
    var errors = [];
    var tests = [
        function(done){

            // Check if all the required fields exists, if not put in the errors array

            helpers.exists(req.body,["year","professor_id","semester"],function(err){
                errors.push(err);
                console.log("test 1");

                // What happens if the given input is anything other than numbers?

                if( (req.body.year < 1900 || req.body.year > 2100)){
                    errors.push("Year out of bound");
                }
                if((req.body.semester !="odd" && req.body.semester != "even")){
                    errors.push("Semester out of bound");
                }
                done(null,errors);
            });

        },
        function(errors,done){

            if(errors.length == 1 && errors[0].length === 0 && ufields == 1){

                var query = {};
                query["_id"] = req.body.professor_id;
                //console.log(query); 
                helpers.findInModel(Professors,"This professor ",query,["_id"],function(err,data,waste){

                    // console.log(err);
                    // console.log("doesn't works");
                    if(err.length > 0 ){
                        errors.push("This professor does not exists");
                    }
                    done(null, errors);
                });
            }else{
                done(null, errors);
            }

        },
        function(errors,done){

            // Check whether the semester has already been created
            if(errors.length == 1 && errors[0].length === 0 && ufields == 1){

                var query = {};
                query["year"] = req.body.year;
                query["semester"] = req.body.semester;
                query["professor_id"] = req.body.professor_id;
                //console.log(query); 
                helpers.findInModel(ProfessorTimetable,"This timetable ",query,["_id"],function(err,data,waste){

                    //console.log(data._id);
                    //console.log(err);
                    if(data._id && String(data._id).length > 0){
                        errors.push("This semester has already been created for the supplied professor");
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
        cb(errors);
    });
}




function create(req,res){

    checkErrors(req,function(errors){

        if(errors.length == 1 && errors[0].length === 0){
            var ptt = new ProfessorTimetable();
            ptt.year = req.body.year;
            ptt.semester = req.body.semester;
            ptt.professor_id = req.body.professor_id;
            var tt = [];
            for(var i=0;i<5;i++){
                var temp = [];
                for(var j=0;j<6;j++){
                    temp.push(new mongoose.Types.ObjectId);
                }
                tt.push(temp);
            }
            ptt.timetable = tt;
            ptt.save(function(err){
                if(err){
                    res.json(err);
                }else{
                    res.json(ptt);
                }
            });
        }else{
            res.json(errors);
        }
    },1);
}



/*
module.exports.createProfessorTimetable = function(req, res) {
    function callback(errors) {
        if (errors.length === 0) {
            console.log(JSON.stringify(
                [
                    ["CSE310"]
                ]
            ));
            var pTimeTable = new ProfessorTimetable();
            pTimeTable.professor_id = req.body.professor_name;
            pTimeTable.year = req.body.year;
            pTimeTable.semester = req.body.semester;
            if (helpers.exists(req.body.timetable)) {
                var days = JSON.parse(req.body.timetable);
                for (var i = 0; i < days.length; i++) {
                    pTimeTable.timetable.push([]);
                    for (var j = 0; j < days[i].length; j++) {
                        pTimeTable[i].timetable.push(days[i][j]);
                    }
                }
            }
            console.log(pTimeTable);
            pTimeTable.save(function(err) {
                if (err) {
                    res.json("Some error occured");
                } else {
                    res.json(pTimeTable);
                }
            });
        } else {
            res.json(errors);
        }

    }
    var errors = helpers.checkProfessorTimetableErrors(req, callback);
}
*/

/*
module.exports.insertClassTimetable = function(req, res) {

    function callback(errors, courses_id, professors_id) {
        if (errors.length === 0) {

            ClassTimetable.findById(req.params.id, function(err, data) {

                if (err) {
                    res.json("Some error has occured");
                    return;
                }
                if (data == null) {
                    res.json("No such Class timetable exists");
                } else {
                    var is_there;
                    var x = data.courses[0]
                    data.courses = [];
                    data.courses.push(x);
                    for (var i = 0; i < courses_id.length; i++) {
                        var courseProfessorMap = {};
                        is_there = false;
                        for (var j = 0; j < data.courses.length; j++) {
                            if (data.courses[j].course_id.toString() == courses_id[i].toString()) {
                                is_there = true;
                                break;
                            }
                        }
                        if (!is_there) {
                            courseProfessorMap.course_id = courses_id[i];
                            courseProfessorMap.professor_id = professors_id[i];
                            data.courses.push(courseProfessorMap);
                        }
                    }
                    data.save(function(err) {
                        if (err) {
                            res.json("Some error occured");
                        } else {
                            res.json(data);
                        }
                    });
                }

            });
        } else {
            res.json(errors);
        }
    }
    var errors = helpers.checkClassTTCourses(req, [], callback);
}

module.exports.updateClassTimetable = function(req, res) {

    function callback(errors, courses_id, professors_id) {
        if (errors.length === 0) {
            ClassTimetable.findById(req.params.id, function(err, cTimeTable) {
                cTimeTable.department = req.body.department;
                cTimeTable.year = req.body.year;
                cTimeTable.semester = req.body.semester;
                for (var i = 0; i < courses_id.length; i++) {
                    var courseProfessorMap = {};
                    courseProfessorMap.course_id = courses_id[i];
                    courseProfessorMap.professor_id = professors_id[i];
                    cTimeTable.courses.push(courseProfessorMap);
                }
                cTimeTable.save(function(err) {
                    if (err) {
                        res.json("Some error occured");
                    } else {
                        res.json(cTimeTable);
                    }
                });

            });
        } else {
            res.json(errors);
        }

        var errors = helpers.checkClassTimetableErrors(req, callback);
    }
}
module.exports.deleteClassTimetable = function(req, res) {
    ClassTimetable.findByIdAndRemove(req.params.id, function(err, cTimeTable) {
        if (err) {
            res.json("Some error occured");
            return;
        }
        if (cTimeTable !== null) {
            res.json("Class Timetable deleted" + cTimeTable);
            return;
        } else {
            res.json("No such Timetable");
        }
    });
}

module.exports.getClassTimeTable = function(req, res) {
    ClassTimetable.findById(req.params.id, function(err, cTimeTable) {
        if (err) {
            res.json("Some error occured");
            return;
        }
        if (cTimeTable == null) {
            res.json("No such Class timetable");
            return;
        } else {
            res.json(cTimeTable);
            return;
        }
    });
}
*/

module.exports.create = create;
