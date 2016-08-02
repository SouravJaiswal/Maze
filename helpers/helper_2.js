var dept = require("../api/models/departments.js");
var Professor = require("../api/models/professors.js");
var Courses = require("../api/models/courses.js");
var semCourses = require("../api/models/sem-courses");
var request = require("request");
var async = require('async');
var models = {
	professors : Professor,
	courses : Courses,
	departments : dept,
	semcourses : semCourses
}
/*
	Given a model, query, and what details to find,
	it calls the cb with the errors and data.
	Still have to figureout how to properly return errors
*/

function findInModel(model,cname,query,details,populate,done){
	var data = [];
	var errors = [];
	var temp = {};
	//console.log(model);
	//console.log(query);
	model.findOne(query,function(err,mdata){
		if(err){
			errors.push(err);
		}else{
			if(mdata == null){
				errors.push(cname + " does not exists ");
			}else{
				for(var i=0;i<details.length;i++){
					temp[details[i]] = mdata[details[i]];
				}		
			}
		}
		populate(errors,temp,done);
	});
}

/*
	Calls an callback with an array of Course / Professor details along with 
	their _id when called with array of Course / Professor id and 
	the fields required
*/

function getData(names,model,fieldName,details,cb){
	var mData = [];
	var errors = [];
	var query = {};
	query[fieldName] = "";
	var unames = [];
	for(var i=0;i<names.length;i++){
		if(unames.indexOf(names[i]) < 0){
			unames.push(names[i]);
		}
	}
	// Populates the data and errors using the data by async function
	function populate(perrors,data,done){
		mData.push(data);
		//Insert all the errors in the errors array
		errors.push(...perrors);
		done();
	}
	function findModel(cname,done){
		query[fieldName] = cname;
		findInModel(models[model],cname,query,details,populate,done);
	}
	async.eachSeries(unames,findModel,function(err){
		if(err){
			errors.push("Error occured when retreiving the" + model + " Details");
		}
		cb(errors,mData);
	});
}


function existInDB(model,name,query,cb){
	//console.log(models);
	findInModel(models[model],name,query,["_id"],function(errors,temp){
		//console.log(temp);
		cb(errors,temp);
	});
}


function checkUnique(model,req,fields,cb){
	var errors = [];
	function unique(field,next){
        var query = {};
        query[field] = req[field];
        //console.log(query);
        existInDB(model,req[field],query,function(err,data){
            if(data._id)
                errors.push(req[field] + " has been already registered");
            next();
        });
    }
    async.eachSeries(fields,unique,function(err){
        if(err){
            errors.push("Error occured while retriveing data from the database");
        }
        cb(errors);
    });
}

/*
	
	Given the fields to check if they exists in data object given,
	returns the names of the fields not existing

*/

function exists(data,fields,cb){
	var errors = [];
	for(var i=0;i<fields.length;i++){
		if(data[fields[i]]){
			data[fields[i]] = data[fields[i]].trim();
			if(data[fields[i]].length == 0){
				errors.push(fields[i]);
			}
		}else{
			errors.push(fields[i]);
		}
	}
	cb(errors);
}



// Making the required functions public 
module.exports.findInModel = findInModel;
module.exports.checkUnique = checkUnique;
module.exports.existInDB  = existInDB;
module.exports.getData = getData;
module.exports.exists = exists;
