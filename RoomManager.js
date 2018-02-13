class RoomManager {
    constructor() {
        this.rooms = {};
    }

    createNewRoom(message) {
        const roomName = 'asdf';
        console.log('Creating new room called', roomName);
        this.rooms[roomName] = [];
        console.log('Rooms now', this.rooms);
        return roomName;
    }
    joinRoom(message) {
        console.log('Joining a room given', message);
        return message in this.rooms;
    }
    sendMessageToRoom(message) {
        console.log('Sending message to your room', message);
    }
}

module.exports = RoomManager;
