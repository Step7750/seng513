const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const messages = new (require('./Messages'))(io);
const users = new (require('./Users'))(io);

http.listen(port, () => {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));

// listen to 'chat' messages
io.on('connection', (socket) => {
    const user = users.createUser(socket);

    user.online = true;

    socket.emit('messages', messages.getAll());

    socket.on('message', (msg) => {
        messages.add(user, msg);
    });

    socket.on('nick', ([newNick]) => {
        user.nickname = newNick;
    });

    socket.on('nickcolour', ([colour]) => {
        user.colour = colour;
    });

    socket.on('disconnect', () => {
        user.online = false;
    });

    socket.on('error', () => {
        user.online = false;
    })
});
