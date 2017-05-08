var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
const path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
users = [];
connections = [];

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var port=Number(process.env.PORT || 4141);

app.use(express.static('public'))
app.use('/', require('./routes'));


//Start server
app.listen(port,function () {
    console.log('Server running at port:' + port);
});

io.sockets.on('connection',function (socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected!', connections.length);

    //Disconnect
    connections.splice(connections.indexOf(socket),1);
    console.log('Disconnected: %s sockets disconnected!', connections.length);
})
