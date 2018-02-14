const User = require('./User');
const utils = require('./Utils');

class Users {
    constructor(io) {
        this.io = io;
        this.users = [];
    }

    createUser(socket) {
        // Check if the user already exists
        const u = this.getUserFromSession(socket.request.cookies.session);

        if (u) {
            u.socket = socket;
            return u;
        }

        const id = this.generateUniqueId();

        const user = new User(this, socket, id);
        this.users.push(user);

        return user;
    }

    getUserFromSession(session) {
        if (!session) return;

        return this.users.find((user) => user.session === session);
    }

    isDuplicateId(id) {
        return this.users.findIndex((user) => user.id === id) > -1;
    }

    generateUniqueId() {
        let id;

        while ((id = utils.genNumericSeq(7)) && this.isDuplicateId(id)) {}

        return id;
    }

    getOnlineUsers() {
        return this.users.filter((user) => user.online).map((user) => user.serialize());
    }

    emitState() {
        this.io.emit('users', this.getOnlineUsers());
    }
}

module.exports = Users;
