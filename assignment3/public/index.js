const socket = io();

let id;

const commands = {
    'nick': [
        'new nickname'
    ],
    'nickcolour': [
        'rrggbb'
    ]
};

function serializeCommand(name, params) {
    let s = `/${name}`;

    for (const param of params) {
        s += ` <${param}>`;
    }

    return s;
}

// Adapted from https://stackoverflow.com/a/24103596
function setCookie(name,value,days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ''}${expires}; path=/`;
}


function displayInfo(text) {
    const div = $('<div></div>').attr('class', 'info-message').text(text);
    div.appendTo('.messages');
}

function displayError(err) {
    const div = $('<div></div>').attr('class', 'error-message').text(err);
    div.appendTo('.messages');
}

function displayMessage(o) {
    const div = $('<div></div>').attr('class', 'message');
    const time = new Date(o.time).toLocaleTimeString();

    div.append(`${time} `);

    const span = $('<span></span>').css('color',  o.colour).text(o.nickname);

    div.append(span);
    div.append(': ');

    const msg = $('<span></span>').text(o.msg);

    // Bold the username and text if this is our message
    if (o.id === id) {
        msg.css('font-weight', 'bold');
        span.css('font-weight', 'bold');
    }

    div.append(msg);
    div.appendTo('.messages');

    // Scroll to bottom of messages
    const messages = $('.messages');
    messages.scrollTop(messages.prop('scrollHeight'));
}

socket.on('nick', (nick) => {
    id = nick.id;
    $('#nickname').text(nick.nickname);

    // Append to messages
    const div = $('<div></div>').attr('class', 'secondary-text').append('You are now ');
    const span = $('<span></span>').attr('class', 'primary-text').css('color', nick.colour).text(nick.nickname);
    div.append(span);
    $('.messages').append(div);

    if (nick.session) {
        setCookie('session', nick.session);
    }
});

socket.on('message', (message) => {
    displayMessage(message);
});

socket.on('messages', (messages) => {
    for (const message of messages) {
        displayMessage(message);
    }
});

socket.on('info', (info) => {
    displayInfo(info);
});

socket.on('err', (err) => {
    console.log('got error');
    displayError(err);
});

socket.on('users', (users) => {
    $('.users').empty();

    for (const user of users) {
        const u = $('<div></div>').css('color', user.colour).text(user.nickname);
        $('.users').append(u);
    }
});

socket.on('connect', () => {
    displayInfo('Connected, available commands: ');
    for (const command of Object.keys(commands)) {
        displayInfo(serializeCommand(command, commands[command]));
    }
});

$('#send-input').on('keydown', function(e) {
    if (e.which == 13) {
        e.preventDefault();
        const msg = $(this).val();

        if (msg.length > 0) {
            if (msg[0] === '/') {
                // process command
                const s = msg.slice(1).split(' ');
                const command = s[0];
                const params = commands[command];

                if (params && s.length - 1 === params.length) {
                    displayInfo(msg);
                    socket.emit(command, s.slice(1));
                }
                else {
                    displayError(`Invalid Command: ${command}`);
                }
            }
            else {
                socket.emit('message', msg);
            }
        }

        $(this).val('');
    }
});

displayInfo('Connecting...');
