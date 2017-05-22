var express = require('express');
var chatRouter = express.Router();

var fs = require('fs');
var path = require('path');


var isloggedin = require('./../middleware/isloggedin.js');


module.exports.controllerFunction = function(app,io){


io.on('connection', function(socket){
  console.log('a user connected');
 
  socket.on('chat message',function(msg){
  	// add chat db code here ,if requried user promises
  	io.emit('chat message',{message:msg,
  		user:socket.user});
  	console.log(msg)
  })



  socket.on('user',function(data){
  	socket.broadcast.emit('meta display',data+" came online")
  	socket.user= data;
  })


  socket.on('disconnect',function(){
  	socket.broadcast.emit('meta display',socket.user+" dissconnected ")
  })
})



chatRouter.get('/user',function(req,res){

	res.json(req.session);
})





chatRouter.use('/',express.static(path.join(__dirname+'/../../frontEnd/chatapp/')))




app.use('/chat-application',isloggedin.check,chatRouter);

//error may be here

}