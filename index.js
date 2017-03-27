var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require("mysql");
var options = {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "newpaspass",
        database: "bvij"
        };
var db = mysql.createConnection(options);

var socketSession = require("socket.io-mysql-session");

var Logger = require("filelogger");                  //filelogger is not required, but supported by the middleware
var logger = new Logger("error", "info", "my.log");

var User = require("user-mysql");    



app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


io.use(new socketSession({
    db: db,           //MySQL conneciton - required
    logger: logger,    //filelogger - optional
    expiration: 3600  //expiration time in seconds - optional - defaults to 86400000
}));


io.on('connection', function(socket){
  console.log('a user connected');

  
    socket.emit('chat message','welcome');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        //socket.broadcast.emit('hi');
        io.emit('chat message', msg);
    });
  

    socket.on("user:login", function(data){
        //do login stuff here with params

        console.log(data);

        // params = [
        //     data.email,
        //     data.password
        // ];

        // console.log(params);
        var user = new User(db);

        user.userLogin(data, function(user_data){
            if (user_data==null) {
                // error handling code goes here
                console.log("ERROR : ",user_data);  
                var userId = 'guest';
                socket.session.set("userId", userId);
                socket.emit('user:login','');
                socket.emit('chat message','login error');          
            } else {            
                // code to execute on data retrieval
                console.log("result from db is : ",user_data); 
                var userId = user_data.id;
                socket.session.set("userId", userId);
                socket.emit('user:login',user_data);
                socket.emit('chat message','login success');

            }
        });

        //console.log('user:login: ' + userId);
        console.log('a user login');
    });

    socket.on("user:securedEvent", function(params){
        
        var userId = socket.session.get("userId");

        console.log('a user sec event');
        console.log(params);

        if(userId != ""){
            //do secured user stuff
            console.log('user:securedEvent: ' + userId);

            switch(params.command) {
                case 'logout':
                    
                    socket.emit('user:securedEvent',params);
                    socket.emit('chat message','logout success');

                    break;
                case 'n':
                    //code block
                    break;
                default:
                    //code block
                    //socket.emit('user:securedEvent',params);
                    socket.emit('chat message','unknown command: '+arams.command);
                    
            } //else {

        //     console.log('user:securedEvent: ' + 'err2');
        //     socket.emit('chat message','not autorized user2 ');
        // }


        } else {
            //throw error
            console.log('user:securedEvent: ' + 'err');
            socket.emit('chat message','not autorized user ');
        }
    });

    socket.on("user:signup", function(data){
        //do login stuff here with params

        console.log(data);

        params = [
            data.email
        ];

        console.log(params);
        var user = new User(db);

        user.userExistByEmail(params, function(user_exist){
            if (user_exist==1) {
                // error handling code goes here
                // console.log("ERROR : ",user_data);  
                // var userId = 'guest';
                // socket.session.set("userId", userId);
                socket.emit('user:signup','email exist');
                socket.emit('chat message','signup error-email allready exist');          
            } else {            
                // code to execute on data retrieval
                // console.log("result from db is : ",user_data); 
                // var userId = user_data.id;
                // socket.session.set("userId", userId);
                // socket.emit('user:login',user_data);
                socket.emit('chat message','signup success-validation');

                user.userAdd(data, function(user_add){
                    if (user_add!=1) {
                        // error handling code goes here
                        // console.log("ERROR : ",user_data);  
                        // var userId = 'guest';
                        // socket.session.set("userId", userId);
                        socket.emit('user:signup','error valisation');
                        socket.emit('chat message','signup error-add user after validation');          
                    } else {            
                        // console.log("result from db is : ",user_data); 
                        // var userId = user_data.id;
                        // socket.session.set("userId", userId);
                        socket.emit('user:signup','1');
                        socket.emit('chat message','signup success-user added');

                    }
                });

            }
        });

        console.log('a user register');
    });



});



http.listen(3000, function(){
  console.log('listening on *:3000');
});

