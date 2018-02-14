const utils = require('./Utils');

class Messages {
    constructor(io) {
        this.io = io;
        this.messages = [];
    }

    add(socket, msg) {
        const obj = Object.assign(utils.serializeSocket(socket), {time: Date.now(), msg});
        this.messages.push(obj);
        this.io.emit('message', obj);
    }

    getAll() {
        return this.messages;
    }
}

module.exports = Messages;
