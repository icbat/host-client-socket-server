const WebSocketServer = require('uws').Server;
const port = 3000;
const server = new WebSocketServer({port: port});
console.log('Socker server running on port', port);

const createNewRoom = message => {
    console.log('Creating new room given', message);
};
const joinRoom = message => {
    console.log('Joining a room given', message);
};
const sendMessageToRoom = message => {
    console.log('Sending message to your room', message);
};

const messageTypeHandlers = {
    newRoom: createNewRoom,
    joinRoom: joinRoom,
    sendToMyRoom: sendMessageToRoom,
};

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
        if (message.type in messageTypeHandlers) {
            messageTypeHandlers[message.type](message.text);
        } else {
            console.error('Unexpected message type', message.type);
            return;
        }
    });
});
