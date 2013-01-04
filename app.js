var port = Number(process.argv[2]);
if(port<1||port>65534)port = 9990;
var express = require('express')
  , routes = require('./routes')
  , connect = require('connect')
  , path = require('path')
  , socketio = require('socket.io')
  , php = require('./lib/php')

var app = express();

app.configure(function(){
  app.set('port', port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

var server = connect.createServer(app).listen(app.set('port'),function(){
  console.log("Server Running - port : "+app.set('port'));
});
var io = socketio.listen(server);
var nick = new Array();
var connection = 0;
io.set('log level',2);
io.sockets.on('connection',function(socket){
  nick[socket.id] = socket.id.substr(0,5);
  connection++;
  io.sockets.emit('alert',eval("[{type:true,nick:'"+nick[socket.id]+"',count:"+connection+"}]"));
  socket.on('send',function(data){
    var val = new Array();
    for(var i in data){
      switch(data[i].name){
        case 'text':
        val['text'] = data[i].value;
        default:
      }
    }
    if(val['text']=='')return;
    val['text'] = php.htmlspecialchars(val['text']);
    var data = eval('[{nick:"'+nick[socket.id]+'",text:"'+(val['text'])+'"}]');
    var me = false;
    socket.broadcast.emit('send',me,data);
    me = true;
    io.sockets.sockets[socket.id].emit('send',me,data);
  });
  socket.on('disconnect',function(){
    connection--;
    socket.broadcast.emit('alert',eval("[{type:false,nick:'"+nick[socket.id]+"',count:"+connection+"}]")); 
    delete nick[socket.id];
  });
});
