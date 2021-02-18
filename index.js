const express = require('express');
const http = require('http');
const { userInfo } = require('os');
const path = require('path');
const socketio = require('socket.io');
const strings = require('node-strings');
const content = require('./usefull/formatMessage');
const { userJoin, getUser, leaveUser, getSujetUsers } = require('./usefull/user');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = 'info';

// static folder
app.use(express.static(path.join(__dirname, 'public')));
//Run when client connects
io.on('connection', socket => {
    // joindre un sujet 
    socket.on('joinSujet', ({ user, sujet }) => {
        const userinfo = userJoin(socket.id, user, sujet);
        socket.join(userinfo.sujet);
        // welcome message
        socket.emit('message', content(botName, `"${userinfo.user.toUpperCase()}", Bienvenue dans la Discussion: "${userinfo.sujet.toUpperCase()}"  `));
        //new connection
        socket.broadcast.to(userinfo.sujet).emit('message', content(botName, `"${userinfo.user.toUpperCase()}" a REJOINT la discussion`));
        // Info sur le sujet et les utilisateurs
        io.to(userinfo.sujet).emit('userSujet', {
            sujetname: userinfo.sujet,
            userslist: getSujetUsers(userinfo.sujet)
        });
    });
    //listen for chat message
    socket.on('chatMessage', (msg) => {
        const userinfo = getUser(socket.id);
        io.to(userinfo.sujet).emit('message', content(userinfo.user, msg));
    });
    // disconnection
    socket.on('disconnect', () => {
        const quittant = leaveUser(socket.id);
        if (quittant) {
            io.to(quittant.sujet).emit('message', content(botName, `"${quittant.user.toUpperCase()}" a QUITTER la discussion`));
            // Info sur le sujet et les utilisateurs
            io.to(quittant.sujet).emit('userSujet', {
                sujetname: quittant.sujet,
                userslist: getSujetUsers(quittant.sujet)
            });
        }

    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port : ${PORT}`));