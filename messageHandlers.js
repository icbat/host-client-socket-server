const createNewRoom = message => {
    console.log('Creating new room given', message);
};
const joinRoom = message => {
    console.log('Joining a room given', message);
};
const sendMessageToRoom = message => {
    console.log('Sending message to your room', message);
};

module.exports = {
    newRoom: createNewRoom,
    joinRoom: joinRoom,
    sendToMyRoom: sendMessageToRoom,
};
