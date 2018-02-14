const User = require('./User');
const utils = require('./Utils');

class Users {
    constructor(io) {
        this.io = io;
        this.users = [];
    }

    createUser(socket) {
        const id = this.generateUniqueId();

        const user = new User(this, socket, id);
        this.users.push(user);

        return user;
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
