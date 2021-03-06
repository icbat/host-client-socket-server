const WebSocketServer = require('uws').Server;
const port = process.env.PORT || 3000;
const server = new WebSocketServer({port: port});
console.log('Socker server running on port', port);

const RoomManager = require('./lib/RoomManager');
const roomManager = new RoomManager();

server.on('connection', client => {

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
            const response = roomManager[message.type](message, client);
            console.log('Successfully handled', message, 'responding with', response);
            client.send(JSON.stringify(response));
        } else {
            console.error('Unexpected message type', message.type);
            return;
        }
    });

    client.on('close', () => {
        console.log('client disconnected', client);
        roomManager.clientDisconnected(client);
    });
});
