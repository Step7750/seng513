const socket = io();

function displayMessage(o) {
    const div = $('<div></div>').attr('class', 'message');
    const time = new Date(o.time).toLocaleTimeString();

    div.append(`${time} `);

    const span = $('<span></span>').css('color',  o.colour).text(o.nickname);
    div.append(span);
    div.append(`: ${o.msg}`);

    div.appendTo('.messages');
}

socket.on('nickname', (name) => {
   $('#nickname').text(name);
});

socket.on('message', (message) => {
    displayMessage(message);
});

socket.on('messages', (messages) => {
    for (const message of messages) {
        displayMessage(message);
    }
});

socket.on('users', (users) => {
    for (const user of users) {

    }
});

socket.on('user', (user) => {

});

$('#send-input').on('keydown', function(e) {
    if (e.which == 13) {
        e.preventDefault();
        const msg = $(this).val();

        if (msg.length > 0) {
            socket.emit('message', msg);
        }

        $(this).val('');
    }
});
