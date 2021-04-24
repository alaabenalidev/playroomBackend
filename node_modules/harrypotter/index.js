// Dependency
var request = require('request');

// Endpoints
var baseURL = "https://harrypotterapi.herokuapp.com/";
var endpoints = {
       	'movies' : baseURL + 'movies/',
       	'employees' : baseURL + 'employees/'
};

// Errors
var invalidMovieIDType = new TypeError("'movieID' must be of type string");
var invalidEmpType = new TypeError("'dispEmp' must be of type boolean");
var invalidEmpIDType = new TypeError("'empID' must be of type string");
var invalidDispType = new TypeError("'dispDetailed' must be of type boolean");
var invalidCallbackType  = new TypeError("'callback' must be a function");

var undefMovieID = new Error("'movieID' must be defined");
var undefDispEmp = new Error("'dispEmp' must be defined");
var undefEmpID = new Error("'empID' must be defined");
var undefDispType = new Error("'dispDetailed' must be defined");
var undefCallback = new Error("'callback' is not defined");

var invalidArgs = new Error("Invalid 'callback' args");

var client = function () {};

client.prototype.getAllMovies = function(callback) {
	if (callback == undefined){
		throw undefCallback;
		return;
	} else if (typeof callback !== 'function'){
		throw invalidCallbackType;
		return;
	} else if (callback.length != 2){
		throw invalidArgs;
		return;
	}

       	request({url: endpoints.movies, json:true}, function(err, resp, data){
       		callback(err, data);
       	});
};

client.prototype.getMovieDetails = function(movieID, dispEmp, callback){
       	// Error Checking
       	if (movieID == undefined){
       		throw undefMovieID;
       		return;
       	} else if (typeof movieID !== 'string'){
       		throw invalidMovieIDType;
       		return;
       	}

       	if (dispEmp == undefined){
       		throw undefDispEmp;
       		return;
       	} else if (typeof dispEmp !== 'boolean'){
       		throw invalidEmpType;
       		return;
       	}

	if (callback == undefined){
		throw undefCallback;
		return;
	} else if (typeof callback !== 'function'){
		throw invalidCallbackType;
		return;
	} else if (callback.length != 2){
		throw invalidArgs;
		return;
	}

       	if (dispEmp){ // Full Details
       		var url = endpoints.movies + movieID + "/employees";
       		request({url:url, json:true}, function(err, resp, data){
       			callback(err, data);
       		});
       	}else{
       		var url = endpoints.movies + movieID;
       		request({url:url, json:true}, function(err, resp, data){
       			callback(err, data);
       		});
       	}
};

client.prototype.getEmployees = function(callback){
	// Error Checking
	if (callback == undefined){
		throw undefCallback;
		return;
	} else if (typeof callback !== 'function'){
		throw invalidCallbackType;
		return;
	} else if (callback.length != 2){
		throw invalidArgs;
		return;
	}

	request({url: endpoints.employees, json:true}, function(err, resp,
	data){
		callback(err, data);
	});
};

client.prototype.getEmployeeInfo = function(empID, dispDetailed, callback){
	// Error Checking
	if (empID == undefined){
		throw undefempID;
		return;
	} else if (typeof empID !== 'string'){
		throw invalidEmpIDType;
		return;
	}

	if (dispDetailed == undefined){
		throw undefDispType;
		return;
	}else if (typeof dispDetailed !== 'boolean'){	
		throw invalidDispType;
		return;
	}

	if (callback == undefined){
		throw undefCallback;
		return;
	} else if (typeof callback !== 'function'){
		throw invalidCallbackType;
		return;
	} else if (callback.length != 2){
		throw invalidArgs;
		return;
	}

	if (dispDetailed){ // Full Details
		var url = endpoints.employees + empID + "/movies";
		request({url:url, json:true}, function(err, resp, data){
			callback(err, data);
		});
	}else {
		var url = endpoints.employees + empID;
		request({url:url, json:true}, function(err, resp, data){
			callback(err, data);
		});
	}
};


module.exports = client;
