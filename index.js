const port = process.env.PORT || 10035;
const server = require("http").Server();

var io = require("socket.io")(server);

var allqs = {};

io.on("connection", function(socket){
    
    socket.on("joinroom", function(data){
        console.log('joining room', data);
        
        socket.join(data);
        socket.myRoom = data;
        
        if(!allqs[data]){
            allqs[data] = {
                qobj:{}
            }
        }
    })
    
    socket.on('answer', function(data){
        var msg = "That's the wrong one!";
        if(data == allqs[socket.myRoom].qobj.a){
            msg = "You've got it!";
        }
        
        socket.emit('result', msg);
    })
    
    socket.on("qsumbit", function(data){
        allqs[socket.myRoom].qobj = data;
        socket.to(socket.myRoom).emit("newq", data);
    })
    
    socket.on("disconnect", function(){
      
    })
})

server.listen(port,(err)=>{
    if(err){
        console.log(err);
        return false;
    }
    
    console.log("Port is runnning");
})