var express = require('express');
var app = express();


require('../models/Users.js');
var mongoose = require('mongoose');
var userModel = mongoose.model('User')


var path =require('path');

module.exports.controllerFunction = function(app , passport){
    //all
    app.get('/all', function(req,res){
    	userModel.find({}, function(err, result){
    		if(err){
    			res.send(err);
    		}
    		else{
    			res.send(result);
    		}
    	});
    });
	//route to display home page
	app.get('/' , function(req ,res){
		//res.render('index');
		res.sendFile(path.join(__dirname + '/../views/index.html'))
	});
	
	//route to get signup page
	app.get('/signup/screen' , function(req, res){
        res.render('signup' , {message : req.flash('signupMessage')});
	});

	//route to process signup
	app.post('/signup' , passport.authenticate('local-signup',{
		successRedirect : '/profile',
		failureRedirect : '/signup/screen',
		failureFlash    : true
	}));

	//route to get login page
	app.get('/login/screen' , function(req, res){
		res.render('login.jade' , {message : req.flash('loginMessage')});
	});

	//route to process login
	app.post('/login' , passport.authenticate('local-login' , {
		successRedirect : '/profile',
		failureRedirect : '/login/screen',
		failureFlash    : true
	}));


	//route to get profile page ,provided user is logged in,using router level middleware
	app.get('/profile' ,isLoggedIn, function(req, res){
        //console.log(req.user + "/profile")
        //console.log("render at /profile")
		res.render('profile' , {user : req.user});
		
	});

	//logout route
	app.get('/logout' , function(req , res){
		//console.log("logout");
		req.logout();
		res.redirect('/');
	});
};

//router level middleware to check if user is logged in
function isLoggedIn(req, res, next){
	if(req.isAuthenticated())
		{next();}
    else{
	res.redirect('/');
}
}