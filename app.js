var express = require('express');

var app = express();
var fs = require('fs');
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(server);




app.use(bodyParser());
app.use(bodyParser.json({extended:true}));


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message',function(msg){
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
});




app.use('/chat-application',express.static(__dirname + '/frontEnd/'));
server.listen(3000,function(){
	console.log("app successfully listening to port 3000");
})
