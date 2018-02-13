const WebSocketServer = require('uws').Server;
const port = 3000;
const server = new WebSocketServer({port: port});
console.log('Socker server running on port', port);

server.on('connection', client => {
    console.log('Someone connected', client);
    client.on('message', message => {
        console.log('We received', message);
        client.send('You sent' + message);
    });
    client.send('Hello, you are connected!');
});
