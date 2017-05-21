const express = require('express');
const path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];

//const apiAdmin = require('./routes/admin');

var port=Number(process.env.PORT || 4000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//Body parser middleware
// parse application/x-www-form-urlencoded.

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// ROUTES FOR OUR API
app.use('/', require('./routes'));
app.use(express.static(path.join(__dirname, 'public')));

//Start server
server.listen(port,function () {
  console.log('Server running at port:' + port);
});

io.sockets.on('connection', function (socket) {
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  //Disconnect
  socket.on('disconnect',function (data) {
   // if(!socket.username) return;
    users.splice(users.indexOf(socket),1);
    updateUsername();
    connections.splice(connections.indexOf(socket),1)
    console.log('Disconnected: %s sockets disconnected', connections.length);
  });

  //Send message
  socket.on('send message',function (data) {
    console.log(data);
    io.sockets.emit('new message',{msg:data, user:socket.username});
  });
  
  //New User 
  socket.on('new user',function (data,callback) {
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsername();
  });
  
  function updateUsername() {
    io.sockets.emit('get users',users);
  }
});