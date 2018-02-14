const express = require('express');
const cookieParser = require('socket.io-cookie-parser');
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

io.use(cookieParser());

// listen to 'chat' messages
io.on('connection', (socket) => {
    const user = users.createUser(socket);

    user.online = true;
    socket.emit('messages', messages.getAll());

    socket.on('message', (msg) => {
        messages.add(user, msg);
    });

    socket.on('nick', ([newNick]) => {
        if (!users.isDuplicateName(newNick)) {
            user.nickname = newNick;
        }
        else {
            socket.emit('err', `${newNick} is already taken!`);
        }
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
