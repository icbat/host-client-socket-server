const test = require('ava');

const RoomManager = require('../RoomManager');

test('creating room opens joinable room', t => {
	const testObject = new RoomManager();

	const newRoomCode = testObject.createNewRoom();
	t.truthy(newRoomCode, 'precheck - room code was no good');

	const result = testObject.joinRoom(newRoomCode);

	t.truthy(result, 'nothing good handed back from joinRoom');
	t.true(result);
});

test('joining a non-existent room fails', t => {
	const testObject = new RoomManager();
	const nonExistentRoom = 'Wilkommen';
	t.false(nonExistentRoom in testObject.rooms, 'precheck - room exists');

	const result = testObject.joinRoom(nonExistentRoom);

	t.false(result, 'we were allowed to join a room that does not exist');
});
