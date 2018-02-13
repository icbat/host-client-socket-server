class RoomManager {
    constructor() {
        this.rooms = {};
    }

    createNewRoom(message, client) {
        // TODO more than one room =P
        const roomName = 'asdf';
        console.log('Creating new room called', roomName);
        this.rooms[roomName] = [client];
        console.log('Rooms now', this.rooms);
        return buildResponse(true, roomName, 'Created');
    }

    joinRoom(message, client) {
        console.log('Joining a room given', message);
        const roomName = message.room;
        if (roomName in this.rooms) {
            this.rooms[roomName].push(client);
            return buildResponse(true, roomName, 'Joined');
        }
        // TODO put a cap on room size
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
            // TODO should you broadcast to yourself, or check for that?
            member.send(JSON.stringify(buildResponse(true, roomName, message.message)));
        }
        console.log('message sent');
        return buildResponse(true, roomName, 'Message sent');
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
