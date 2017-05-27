var app = angular.module('myApp', []);

app.directive('onKeydown', function() {


    return {
        restirct: 'A',
        link: function(scope, elem, attrs) {

            var functionToCall = scope.$eval(attrs.onKeydown);




            elem.on('keydown', function(e) {



                functionToCall(e)

            })
            elem.on('keyup', function(e) {
                functionToCall(e)
            })




        }
    }















})


app.controller('chatController', ['socket', '$http', function(socket, $http) {
    var main = this;
    this.text = "";
    this.messages = [];
    this.prechatdisplay = [];
    this.user;
    this.keyup = false;
    this.typingText = "";
    $http.get('./user').then(function(response) {

        main.user = (response.data.passport.user.displayName).split(' ')[0];
        socket.emit('user', main.user)

    })
    $http({
        method: 'GET',
        url: './chats'
    }).then(function(response) {
        main.messages = response.data;
    })



    this.sendmsg = function() {
        console.log(socket)
        socket.emit('chat message', main.text);

        main.text = "";

    }
    this.scrolled = false;

    socket.on('chat message', function(msg) {
        console.log(msg)
        main.messages.push(msg);
        console.log(main.messages);




    })
    socket.on('chat message', function(msg) {
       var element = document.getElementById("msg");
           element.scrollTop = element.scrollHeight;
        



    })
    socket.on('typingState', function(data) {
        main.typingText = data;
        console.log(main.typingText)
    })
    socket.on('delete meta display', function(msg) {
        main.typingText = ""
    })
    socket.on('meta display', function(msg) {
        main.prechatdisplay.push(msg);
    })
    this.ifUser = function(a, b) {
        return a === b;

    }
    this.iskeydown = function(e) {
        if (e.type == 'keydown') {

            socket.emit('typing', true)
        }
        if (e.type == 'keyup') {

            socket.emit('not typing', true)

        }
    }


    this.loggout = function() {
        $http({
            method: 'GET',
            url: './loggout'

        }).then(function(response) {
            window.location = "/"
        })

    }
    setInterval(function() {
        main.prechatdisplay.pop()
    }, 10000)













}])
