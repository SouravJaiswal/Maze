var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var logger = require('morgan');
var path = require("path");
var app = express();
require('./api/models/dbs');

var api = require("./api/routes/index.js");

app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
    res.send("Don't fool around");
})
app.use("/api", api);

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    console.log("Server running on " + app.get('port'));
});



module.exports = app;
