const userModel = require('./routes/users');
const messageModel = require('./routes/message');
const groupModel = require('./routes/group');
const io = require( "socket.io" )();
const socketapi = {
    io: io
};

io.on( "connection", function( socket ) {
    console.log( "A user connected" );

    socket.on('join-server',async username=>{
       await userModel.findOneAndUpdate({username:username},{socketId:socket.id});
    })

    socket.on('user-sent-message',async message=>{
        await messageModel.create(message);
        const reciever = await userModel.findByUsername(message.reciever);
        socket.to(reciever.socketId).emit('user-recieved-message',message);
    })
    socket.on('joinGroup',obj=>{
        socket.join(obj.id);

    })

    socket.on('group-sent-message',async obj=>{
        const group = await groupModel.findOne({groupname:obj.reciever});
        await messageModel.create(obj);
        socket.broadcast.to(group._id.toString()).emit('group-recieved-message',obj);
    })
});

module.exports = socketapi;