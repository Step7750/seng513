exports.genNumericSeq = function(digits) {
    let seq = '';

    while (digits > 0) {
        seq += Math.floor(Math.random()*10);

        digits -= 1;
    }

    return seq;
};

exports.genAlphanumericSeq = function(amt) {
    let alphanum = '';

    for (let i = 0; i < amt; i++) {
        alphanum += Math.random().toString(36).substr(2, 1)
    }

    return alphanum;
};

exports.serializeSocket = function(s) {
    return {
        nickname: s.nickname,
        colour: s.colour || '#ffffff'
    }
};
