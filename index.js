const WebSocketServer = require('uws').Server;
const port = 3000;
const server = new WebSocketServer({port: port});
console.log('Socker server running on port', port);

const RoomManager = require('./RoomManager');
const roomManager = new RoomManager();

server.on('connection', connection => {

    console.log('Someone connected', client);
    client.on('message', rawMessage => {
        let message;
        try {
            message = JSON.parse(rawMessage);
        } catch (parseError) {
            console.error('Sent not-JSON wut do');
            return;
        }
        if (message.type in roomManager) {
            roomManager[message.type](message, client);
        } else {
            console.error('Unexpected message type', message.type);
            return;
        }
    });
});
