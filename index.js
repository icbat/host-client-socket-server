const WebSocketServer = require('uws').Server;
const port = 3000;
const server = new WebSocketServer({port: port});
console.log('Socker server running on port', port);

const messageHandlers = require('./messageHandlers');

server.on('connection', connection => {
    console.log('Someone connected', connection);
    connection.on('message', rawMessage => {
        let message;
        try {
            message = JSON.parse(rawMessage);
        } catch (parseError) {
            console.error('Sent not-JSON wut do');
            return;
        }
        if (message.type in messageHandlers) {
            messageHandlers[message.type](message.text);
        } else {
            console.error('Unexpected message type', message.type);
            return;
        }
    });
});
