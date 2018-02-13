class RoomManager {
    constructor() {
        this.rooms = {};
    }

    createNewRoom(message, client) {
        const roomName = 'asdf';
        console.log('Creating new room called', roomName);
        this.rooms[roomName] = [];
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
    }
}

module.exports = RoomManager;
