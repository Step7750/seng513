const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const utils = require('./Utils');
const messages = new (require('./Messages'))(io);

http.listen(port, () => {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));

// listen to 'chat' messages
io.on('connection', (socket) => {
    const nick = utils.getRandomNick();
    socket.nickname = nick;

    socket.emit('nickname', socket.nickname);
    socket.emit('messages', messages.getAll());

    socket.on('message', (msg) => {
        messages.add(socket, msg);
    });
});
