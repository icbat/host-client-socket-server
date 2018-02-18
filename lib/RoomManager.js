class RoomManager {
    constructor() {
        this.rooms = {};
        this.clients = new Map();
    }

    createNewRoom(message, client) {
        // TODO more than one room =P
        const roomName = 'asdf';
        console.log('Creating new room called', roomName);
        this.rooms[roomName] = [client];
        this.clients.set(client, roomName);
        console.log('Rooms now', this.rooms);
        return buildResponse(true, roomName, 'Created');
    }

    joinRoom(message, client) {
        console.log('Joining a room given', message);
        const roomName = message.room;
        if (roomName in this.rooms) {
            this.rooms[roomName].push(client);
            this.clients.set(client, roomName);
            return buildResponse(true, roomName, 'Joined');
        }
        return buildResponse(false, roomName, 'No room found');
    }

    sendMessageToRoom(message, client) {
        console.log('Sending message to your room', message);

        const roomName = message.room;
        if (!(roomName in this.rooms)) {
            console.warn('Someone tried to send to room that does not exist', message, client);
            return buildResponse(false, roomName, 'No room found');
        }

        const room = this.rooms[roomName];
        if (room.indexOf(client) === -1) {
            console.warn('Someone tried to send to a room they are not a member of', message, client);
            return buildResponse(false, roomName, 'You are not a member');
        }

        for (const member of room) {
            member.send(JSON.stringify(buildResponse(true, roomName, message.message)));
        }
        console.log('message sent');
        return buildResponse(true, roomName, 'Message sent');
    }

    clientDisconnected(client) {
        if (!this.clients.has(client)) {
            console.warn('client disconnected that we were not tracking...', client);
            return;
        }

        const roomName = this.clients.get(client);
        const room = this.rooms[roomName];

        if (this.isHost(client, roomName)) {
            for (const member of room) {
                member.send(JSON.stringify(buildResponse(true, roomName, 'Room ended')));
                this.clients.delete(member);
            }

            delete this.rooms[roomName];
        } else {
            const index = room.indexOf(client);
            room.splice(index, 1);

            this.clients.delete(client);
        }
    }

    isHost(client, roomName) {
        const room = this.rooms[roomName];
        return room[0] === client;
    }
}



const buildResponse = (success, roomName, message) => {
    return {
        success: success,
        room: roomName,
        message: message,
    };
};

module.exports = RoomManager;
