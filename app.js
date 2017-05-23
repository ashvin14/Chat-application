var express = require('express');

var app = express();


var bodyParser = require('body-parser');
var fs = require('fs');

var server = require('http').Server(app);
var io = require('socket.io')(server);
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var googleStrategy = require('passport-google-oauth2').Strategy;

var GOOGLE_CLIENT_ID = '1016693053335-pphlg5jiec60gpb5kn51ka9367no7s88.apps.googleusercontent.com';
var GOOGLE_SECRET_ID = 'l90ykRUStSut3VixhbGTNiZ6';










app.use(require('cookie-parser')())

app.use(bodyParser());
app.use(bodyParser.json({ extended: true }));
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

app.use('/', express.static(__dirname + '/frontEnd/'));


passport.use(new Strategy({
    clientID: '280707322373735',
    clientSecret: '00976b861ad56cbdb82fa3e20a61ecf9',
    callbackURL: 'http://localhost:3000/login/successful/facebook'

}, function(accessToken, refreshToken, profile, cb) {
   



    return cb(null, profile);
}))


passport.use(new googleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_SECRET_ID,
    callbackURL: 'http://localhost:3000/login/successful/google'
}, function(accessToken, refreshToken, profile, cb) {
    process.nextTick(function() {




        cb(null, profile)
    });
}))

passport.serializeUser(function(user, cb) {

        cb(null, user);
    })
    //here you are telling node that session has ended
passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
})

app.use(passport.initialize())
app.use(passport.session())

app.get('/login/facebook', passport.authenticate('facebook'), function(req, res) {
	req.user = 'loggedin';
    console.log(req.passport)
})

app.get('/login/successful/facebook', passport.authenticate('facebook', { failedRedirect: '/', successRedirect: '/chat-application' }), function(req, res) {
    res.redirect('./chat-application')
})
app.get('/login/google',passport.authenticate('google',{scope:['email','profile']}))


app.get('/login/successful/google',passport.authenticate('google',{failedRedirect:'/'}),function(req,res){
	req.user = "loggedIn";

	res.redirect('/chat-application')
})


fs.readdirSync('./app/controller').forEach(function(file) {
    if (file.indexOf('.js'))
        var route = require('./app/controller/' + file);
    route.controllerFunction(app, io);

});
fs.readdirSync('./app/model').forEach(function(file) {
    if (file.indexOf('.js'))
        require('./app/model/' + file);

});





server.listen(3000, function() {
    console.log("app successfully listening to port 3000");
})
