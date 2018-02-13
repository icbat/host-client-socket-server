const test = require('ava');

const RoomManager = require('../RoomManager');

test('creating room opens joinable room', t => {
	const expectedClient = 'fake client it is ok';
	const testObject = new RoomManager();

	const newRoomCode = testObject.createNewRoom();
	t.truthy(newRoomCode, 'precheck - room code was no good');
	t.is(testObject.rooms[newRoomCode].length, 0);

	const result = testObject.joinRoom({text: newRoomCode}, expectedClient);
	t.is(testObject.rooms[newRoomCode].length, 1);
	t.is(testObject.rooms[newRoomCode][0], expectedClient);
	t.true(result, 'response message should be boolean true');
});

test('joining a non-existent room fails', t => {
	const testObject = new RoomManager();
	const nonExistentRoom = 'Wilkommen';
	t.false(nonExistentRoom in testObject.rooms, 'precheck - room exists');

	const result = testObject.joinRoom({text: nonExistentRoom});

	t.false(result, 'we were allowed to join a room that does not exist');
});
