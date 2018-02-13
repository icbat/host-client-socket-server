const test = require('ava');

const RoomManager = require('../RoomManager');

let testObject;
test.beforeEach(t => {
	testObject = new RoomManager();
});

test('creating room joins the creator to it', t => {
	const expectedClient = 'fake client it is ok';

	const newRoomCode = testObject.createNewRoom({text: 'unused message'}, expectedClient);
	t.is(testObject.rooms[newRoomCode].length, 1);
	t.is(testObject.rooms[newRoomCode][0], expectedClient);
});

test('creating room opens joinable room', t => {
	const creatorClient = 'first!3121!!';
	const joinerClient = 'some friendo';

	const newRoomCode = testObject.createNewRoom({}, creatorClient);
	t.truthy(newRoomCode, 'precheck - no room code given');

	const result = testObject.joinRoom({text: newRoomCode}, joinerClient);

	t.is(testObject.rooms[newRoomCode].length, 2);
	t.is(testObject.rooms[newRoomCode][1], joinerClient);
	t.true(result, 'response message should be boolean true');
});

test('joining a non-existent room fails', t => {
	const nonExistentRoom = 'Wilkommen';
	t.false(nonExistentRoom in testObject.rooms, 'precheck - room exists');

	const result = testObject.joinRoom({text: nonExistentRoom});

	t.false(result, 'we were allowed to join a room that does not exist');
});
