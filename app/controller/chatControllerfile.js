var express = require('express');
var chatRouter = express.Router();
var mongoose =require('mongoose')
var fs = require('fs');
var path = require('path');
var chatModel = require('./../model/chatModel');


mongoose.connect('mongodb://localhost/chat-application');

mongoose.connection.once('open', function(err) {
    if (err) throw err;
    console.log("successfully connected to database!");
})

var isloggedin = require('./../middleware/isloggedin.js');


module.exports.controllerFunction = function(app, io) {


    io.on('connection', function(socket) {

        

        socket.on('chat message', function(msg) {
            // add chat db code here ,if requried user promises
            io.emit('chat message', {
                message: msg,
                user: socket.user
            });
            console.log("message is "+msg)
            var chat = new chatModel({
            	message:msg,
            	user:socket.user
            })
            chat.save(function(err,result){
            	if(err)throw err;
            	console.log(result);
            })
        })






        socket.on('user', function(data) {
            socket.broadcast.emit('meta display', data + " came online")
            socket.user = data;
        })


        socket.on('disconnect', function() {
            socket.broadcast.emit('meta display', socket.user + " dissconnected ")
        })
        socket.on('typing', function(data) {

            socket.broadcast.emit('typingState', socket.user + " is typing...")
        })
        socket.on('not typing', function(data) {

            socket.broadcast.emit('delete meta display', "")
        })
    })



    chatRouter.get('/user', function(req, res) {

        res.json(req.session);
    })

    chatRouter.get('/loggout', function(req, res) {
        req.logout();


        res.json({ 'loggout': 'djfd' });
    })
    chatRouter.get('/chats',function(req,res){
    	console.log('/ url was called')
    	chatModel.find({},function(err,chats){
    		if(err)throw err;
    		res.json(chats);


    	})
    })



    chatRouter.use('/', express.static(path.join(__dirname + '/../../frontEnd/chatapp/')))




    app.use('/chat-application', isloggedin.check, chatRouter);

    //error may be here

}
