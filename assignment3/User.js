const utils = require('./Utils');

class User {
    set nickname(nickname) {
        this.nickname_ = nickname;

        this.emitState();
        this.users.emitState();
    }

    get nickname() {
        return this.nickname_ || `USER-${this.id}`;
    }

    set socket(s) {
        // New socket
        this.socket_ = s;
        this.emitState(true);
    }

    get socket() {
        return this.socket_;
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
        this.users.emitState();
    }

    set online(o) {
        const prev = this.online_ || false;
        this.online_ = o;

        // Broadcast new state to all clients
        if (this.online_ !== prev) {
            this.users.emitState();
        }
    }

    get online() {
        return this.online_ || false;
    }

    get colour() {
        return this.colour_ || '#FFFFFF';
    }

    constructor(users, socket, id) {
        this.users = users;
        this.id = id;
        this.session = utils.genAlphanumericSeq(32);
        this.socket = socket;
    }

    emitState(session = false) {
        this.socket.emit('nick', this.serialize(session));
    }

    serialize(session = false) {
        return {
            id: this.id,
            nickname: this.nickname,
            colour: this.colour,
            session: (session) ? this.session : ''
        }
    }
}

module.exports = User;