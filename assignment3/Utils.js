exports.getRandomNick = function() {
    let digits = 7;

    let nick = 'USER-';

    while (digits > 0) {
        nick += Math.floor(Math.random()*10);

        digits -= 1;
    }

    return nick;
};

exports.serializeSocket = function(s) {
    return {
        nickname: s.nickname,
        colour: s.colour || '#ffffff'
    }
};
