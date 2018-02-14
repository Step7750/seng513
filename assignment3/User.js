const utils = require('./Utils');

class User {
    set nickname(nickname) {
        this.nickname_ = nickname;

        this.emitState();
    }

    get nickname() {
        return this.nickname_ || `USER-${this.id}`;
    }

    set colour(colour) {
        colour = colour || '#FFFFFF';

        if (colour[0] === '#') {
            this.colour_ = colour;
        }
        else {
            this.colour_ = `#${colour}`;
        }

        this.emitState();
    }

    set online(o) {
        const prev = this.online_ || false;
        this.online_ = o;

        // Broadcast new state to all clients
        if (this.online_ !== prev) {
            this.users.emitState();
        }
    }

    get colour() {
        return this.colour_ || '#FFFFFF';
    }

    constructor(users, socket, id) {
        this.users = users;
        this.socket = socket;
        this.id = id;
        this.cookie = utils.genAlphanumericSeq(32);

        // Emit this new state to the user
        this.emitState(true);
    }

    emitState(cookie = false) {
        this.socket.emit('nick', this.serialize(cookie));
    }

    serialize(cookie = false) {
        return {
            id: this.id,
            nickname: this.nickname,
            colour: this.colour,
            cookie: (cookie) ? this.cookie : ''
        }
    }
}

module.exports = User;