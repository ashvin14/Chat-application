var app = angular.module('myApp', []);


app.controller('chatController', ['socket', function(socket) {
    var main = this;
    this.text = "";
    this.messages=[{}];
	this.prechatdisplay=[];
    this.user;
    do{
    	main.user = prompt("who are you?")
    }while(main.user==null)
    socket.emit('user',main.user)
   	
    this.sendmsg = function() {
        console.log(socket)
        socket.emit('chat message', main.text);
        main.text = "";

    }
    socket.on('chat message',function(msg){
    	console.log(msg)
    	main.messages.push(msg);
    


    })
    socket.on('meta display',function(msg){
    	main.prechatdisplay.push(msg);
    })
    this.ifUser= function(a,b){
    	return a===b;

    }















}])
