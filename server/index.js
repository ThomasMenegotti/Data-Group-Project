require('dotenv').config();
console.log(process.env.HARPERDB_URL);
const express = require('express');
const app = express();
http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const harperSaveMessage = require('./services/harper-save-message');
const harperGetMessages = require('./services/harper-get-messages');
const harperSaveUser = require('./services/harper-save-user');
const leaveRoom = require('./utils/leave-room');

app.use(cors());

const server = http.createServer(app);

//Create an io server and allow for CORS from where server is running with GET and POST methods
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});
const CHAT_BOT = 'ChatBot';
let chatRoom = '';
let allUsers = [];
//Listen for when the client connects via socket.io-client
io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);

    //Once a socket 'hears' that someone is joining a room, run this below
    socket.on('join_room', (data) => {
        const { username, room } = data;
        socket.join(room);

        let __createdtime__ = Date.now();
        socket.to(room).emit('receive_message', {
            message: `${username} has joined the chat room`,
            username: CHAT_BOT,
            __createdtime__,
            bot: true,
        });

        harperSaveUser(username, room)
            .then((response) => console.log(response))
            .catch((err) => console.log(err));

        //This will emit the receive_message for another function to 'hear' it
        socket.emit('receive_message', {
            message: `Welcome ${username}`,
            username: CHAT_BOT,
            __createdtime__,
            bot: true,
        });

        chatRoom = room;
        allUsers.push({ id: socket.id, username, room });
        chatRoomUsers = allUsers.filter((user) => user.room === room);
        socket.to(room).emit('chatroom_users', chatRoomUsers);
        socket.emit('chatroom_users', chatRoomUsers);

        harperGetMessages(room)
            .then((last100Messages) => {
                socket.emit('last_100_messages', last100Messages);
            })
            .catch((err) => console.log(err));

    });

    socket.on('send_message', (data) => {
        const { message, username, room, __createdtime__, bot } = data;
        io.in(room).emit('receive_message', data);
        harperSaveMessage(message, username, room, __createdtime__, bot)
            .then((response) => console.log(response))
            .catch((err) => console.log(err));
    });


    socket.on('leave_room', (data) => {
        const { username, room } = data;
        socket.leave(room);
        const __createdtime__ = Date.now();
        //Removes user from memory
        allUsers = leaveRoom(socket.id, allUsers);
        socket.to(room).emit('chatroom_users', allUsers);
        socket.to(room).emit('bot_receive_message', {
            username: CHAT_BOT,
            message: `${username} has left the chat`,
            __createdtime__,
            bot: true,
        });
        console.log(`${username} has left the chat`);
    });

    socket.on('disconnect', () => {
        console.log('User has disconnected from the chat.');
        const user = allUsers.find((user) => user.id == socket.id);
        if (user?.username) {
            allUsers = leaveRoom(socket.id, allUsers);
            socket.to(chatRoom).emit('chatroom_users', allUsers);
            socket.to(chatRoom).emit('bot_receive_message', {
                message: `${user.username} has disconnected from the chat.`,
            });
        }
    });

});

server.listen(4000, () => 'Server is runnin on port 3000');