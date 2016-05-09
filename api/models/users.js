var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = mongoose.Schema({
	username:{
		type:String,
		required:true,
		unique:true,
		trim: true
	},
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true,
		unique:true,
		trim: true
	},
	university_id: {
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true
	},
	department:{
		type:String,
		required:true
	},
	role:{
		type:String,
		required:true,
		default:"editor"
	},
	register_date:{
		type:Date,
		default:Date.now
	},
	salt:String,

});


userSchema.methods.savePassword = function(password) {
	var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
	this.password =  bcrypt.hashSync(password,salt);
	this.salt = salt;
}

userSchema.methods.checkPassword = function(password){
	return (bcrypt.hashSync(password,this.salt) == this.hash);
}

userSchema.plugin(uniqueValidator);

var User = mongoose.model("User",userSchema);

module.exports = User;