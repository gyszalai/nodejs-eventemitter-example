var net = require('net');
var events = require("events");

var channel = new events.EventEmitter();

channel.addListener('message', function (msg) {
   console.log('Message: ' + msg.text);
});

var server = net.createServer(function(socket) {
    
    var id = socket.remoteAddress + ":" + socket.remotePort;
    
    socket.on('connect', function() {
        channel.emit('message', {text: "Client connected: " + id});
        socket.write('Árvíztűrő tükörfúrógép from ' + id + '\n\r', 'utf8');
    });
    
    socket.on('close', function() {
        channel.emit('message', {text: 'Client disconnected: ' + id});
        channel.emit('shutdown');
    });
    
    socket.on('data', function(data) {
        channel.emit('message', {text: data});
        var msg = data.toString();
        if (msg.match(/shutdown.*/g)) {
            socket.destroy();
        }
    });
});

channel.on('shutdown', function () {
    this.removeAllListeners();
    console.log('Channel shutting down');
    server.close();
});

server.listen(8888);
