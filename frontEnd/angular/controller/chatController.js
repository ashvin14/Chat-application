var app = angular.module('myApp', []);


app.controller('chatController', ['socket','$http' ,function(socket,$http) {
    var main = this;
    this.text = "";
    this.messages=[{}];
	this.prechatdisplay=[];
    this.user;
    
    $http.get('./user').then(function(response){

     main.user = (response.data.passport.user.displayName).split(' ')[0];
     socket.emit('user',main.user)

    })

    
   	
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
