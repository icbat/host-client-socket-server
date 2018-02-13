class RoomManager {
    constructor() {
        this.rooms = {};
    }

    createNewRoom(message, client) {
        const roomName = 'asdf';
        console.log('Creating new room called', roomName);
        this.rooms[roomName] = [client];
        console.log('Rooms now', this.rooms);
        return roomName;
    }

    joinRoom(message, client) {
        console.log('Joining a room given', message);
        const roomName = message.text;
        if (roomName in this.rooms) {
            this.rooms[roomName].push(client);
            return true;
        }
        return false;
    }

    sendMessageToRoom(message, client) {
        console.log('Sending message to your room', message);

        const roomName = message.room;
        if (!(roomName in this.rooms)) {
            console.warn('Someone tried to send to room that does not exist', message, client);
            return false;
        }

        const room = this.rooms[roomName];
        if (room.indexOf(client) === -1) {
            console.warn('Someone tried to send to a room they are not a member of', message, client);
            return false;
        }

        for (const member of room) {
            member.send(message.text);
        }
    }
}

module.exports = RoomManager;
