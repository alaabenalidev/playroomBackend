var should = require('should');
var hp = require('../index.js');
var client = new hp();

describe('Get Movies', function(){
	it('can get all movies', function(done){
		this.timeout(10000);

		(function(){
			client.getAllMovies(function(error, data){
				if (error) return done(error);
				data.should.not.be.empty;
			});
		}).should.not.throw();
		
		(function(){
			client.getAllMovies();
		}).should.throw();

		(function(){
			client.getAllMovies(null);
		}).should.throw();

		(function(){
			client.getAllMovies(function(error){
				if(error) return done(error);
			});
		}).should.throw();

		done();
	});

	it('can get specific movies', function(done){
		(function(){
			client.getMovieDetails();
		}).should.throw();

		(function(){
			client.getMovieDetails(null);
		}).should.throw();

		(function(){
			client.getMovieDetails(new String("1"), true,
			function(error, data){
				if (error) return done(error);
			});
		}).should.throw();

		(function(){
			client.getMovieDetails(new String("1"), new
			Boolean("true"), function(error, data){
				if (error) return done(error);
			});
		}).should.throw();

		(function(){
			client.getMovieDetails("1", new Boolean("true"),
			function(error, data){
				if (error) return done(error);
			});
		}).should.throw();

		(function(){
			client.getMovieDetails(1, false, function(error, data){
				if (error) return done(error);
			});
		}).should.throw();
		
		(function(){
			client.getMovieDetails(1, true, function(error,
			data){
				if(error) return done(error);
			});
		}).should.throw();

		(function(){
			client.getMovieDetails(1, 'false', function(error,
			data){
				if (error) return done(error);
			});
		}).should.throw();

		(function(){
			client.getMovieDetails(1, 'true', function(error,
			data){
				if (error) return done(error);
			});
		}).should.throw();	

		(function(){
			client.getMovieDetails("1", false, function(error,
			data){
				if (error) return done(error);
			});
		}).should.not.throw();

		(function(){
			client.getMovieDetails("1", true, function(error,
			data){
				if (error) return done(error);
			});
		}).should.not.throw();

		(function(){
			client.getMovieDetails("1", 'true', function(error,
			data){
				if (error) return done(error);
			});
		}).should.throw();
		
		(function(){
			client.getMovieDetails("1", 'false', function(error,
			data){
				if (error) return done(error);
			});
		}).should.throw();

		(function(){
			client.getMovieDetails("1", helloWorld, function(error,
			data){
				if (error) return done(error);
			});
		}).should.throw();
	
		(function(){
			client.getMovieDetails("1", true, null);
		}).should.throw();

		(function(){
			client.getMovieDetails("1", true);
		}).should.throw();

		(function(){
			client.getMovieDetails("1", true, function(error){
				if (error) return done(error);
			});
		}).should.throw();

		(function(){
			client.getMovieDetails("1", function(error, data){
				if (error) return done(error);
			}, false);
		}).should.throw();

		done();
	});
});

describe('Get Employees', function(){
	it('can get all employees', function(done){
		(function(){
			client.getEmployees(function(error, data){
				if (error) return done(error);
			});
		}).should.not.throw();

		(function(){
			client.getEmployees(null);
		}).should.throw();

		(function(){
			client.getEmployees();
		}).should.throw();

		(function(){
			client.getemployees(function(error){
				if (error) return done(error);
			});
		}).should.throw();

		done();
	});

	it('can get specific employees', function(done){
		(function(){
			client.getEmployeeInfo();	
		}).should.throw();

		(function(){
			client.getEmployeeInfo(null);
		}).should.throw();

		(function(){
			client.getEmployeeInfo(null, null);
		}).should.throw();

		(function(){
			client.getEmployeeInfo(null, null, null);
		}).should.throw();

		(function(){
			client.getEmployeeInfo(1, null, null);
		}).should.throw();

		(function(){
			client.getEmployeeInfo("1", null, null);
		}).should.throw();

		(function(){
			client.getEmployeeInfo("1", null, function(error,
			data){
				if (error) return done(error);
			});
		}).should.throw();

		(function(){
			client.getEmployeeInfo("1", null, function(error){
				if (error) return done(error);
			});
		}).should.throw();

		(function(){
			client.getEmployeeInfo("1", "true", function(error,
			data){
				if (error) return done(error);
			});
		}).should.throw();

		(function(){
			client.getEmployeeInfo("1", "true", function(error){
				if (error) return done(error);
			});
		});

		(function(){
			client.getEmployeeInfo("1", true, function(error){
				if (error) return done(error);
			});
		}).should.throw();

		(function(){
			client.getEmployeeInfo("1", true, function(error,
			data){
				if (error) return done(error);
			});
		}).should.not.throw();
		
		(function(){
			client.getEmployeeInfo("1", true, null);
		}).should.throw();

		(function(){
			client.getEmployeeInfo((16).toString(), true,
			function(error, data){
				if (error) return done(error);
			});
		}).should.not.throw();

		(function(){
			client.getEmployeeInfo((16).toString(), new
			Boolean("true"), function(error, data){
				if (error) return done(error);
			});
		}).should.throw();

		(function(){
			client.getEmployeeInfo(new String("1"), true,
			function(error, data){
				if (error) return done(error);
			});
		}).should.throw();
	
		(function(){
			client.getEmployeeInfo(new String("1"), new
			Boolean("true"), function(error, data){
				if (error) return done(error);
			});
		}).should.throw();

		done();	
	});
});
