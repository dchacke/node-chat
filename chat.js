net = require('net');

// Store people connected to chat
var sockets = [];

var s = net.Server(function(socket){
  // Connect participant
  sockets.push(socket);

  // Show number of participants
  socket.write("Hi!\n" + sockets.length + " participants connected.\n");

  // Tell others someone joined
  for(var i = 0; i < sockets.length; i++){
    // Don't tell the one who just joined
    if(sockets[i] == socket) continue;

    // Tell others
    sockets[i].write("Someone just joined.\n");
  }

  // Chat
  socket.on('data', function(d){
    for(var i = 0; i < sockets.length; i++){
      // Don't echo to sender
      if(sockets[i] == socket) continue;

      // Send message
      sockets[i].write(d);
    }
  });

  // Remove disconnected sockets
  socket.on('end', function(){
    var i = sockets.indexOf(socket);
    sockets.splice(i, 1);

    for(var i = 0; i < sockets.length; i++){
      // Let others know someone just left
      sockets[i].write("Someone just left.\n");
    }
  });
});

s.listen(8000);