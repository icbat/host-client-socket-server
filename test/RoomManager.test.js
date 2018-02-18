const test = require('ava');

const RoomManager = require('../lib/RoomManager');

let testObject;
test.beforeEach(t => {
	testObject = new RoomManager();
});

// TODO add tests for response contract

test('creating room joins the creator to it', t => {
	const expectedClient = 'fake client it is ok';

	const response = testObject.createNewRoom({message: 'unused message'}, expectedClient);
	const newRoomCode = response.room;
	t.is(testObject.rooms[newRoomCode].length, 1);
	t.is(testObject.rooms[newRoomCode][0], expectedClient);
});

test('creating room opens joinable room', t => {
	const creatorClient = 'first!3121!!';
	const joinerClient = 'some friendo';

	const response = testObject.createNewRoom({}, creatorClient);
	const newRoomCode = response.room;
	t.truthy(newRoomCode, 'precheck - no room code given');
	t.is(testObject.rooms[newRoomCode].length, 1);

	const result = testObject.joinRoom({room: newRoomCode}, joinerClient);

	t.is(testObject.rooms[newRoomCode].length, 2);
	t.is(testObject.rooms[newRoomCode][1], joinerClient);
});

test('joining a non-existent room fails', t => {
	const nonExistentRoom = 'Wilkommen';
	t.false(nonExistentRoom in testObject.rooms, 'precheck - room exists');

	const result = testObject.joinRoom({room: nonExistentRoom});

	t.true(Object.keys(testObject.rooms).length === 0, 'there should not be a room');
});

test('sending message to a non-existent room fails gracefully', t => {
	const testFunction = () => {
		const newRoomCode = testObject.createNewRoom({message: 'unused message'}, spiedClient('a message for no one'));

		testObject.sendMessageToRoom({room: newRoomCode, message: 'room scanning spam'});
	}
	t.notThrows(testFunction);
});

test('sending message to room you are not in fails gracefully', t => {
	const unexpectedMessage = 'some rando spam';
	const creatorClient = spiedClient(unexpectedMessage);
	const joinedClient = spiedClient(unexpectedMessage);
	const senderClient = spiedClient(unexpectedMessage);

	const testFunction = () => {
		const newRoomCode = testObject.createNewRoom({}, creatorClient);
		testObject.joinRoom({room: newRoomCode, message: unexpectedMessage}, joinedClient);
		testObject.sendMessageToRoom({room: newRoomCode, message: unexpectedMessage}, senderClient);
	}
	t.notThrows(testFunction);
	t.is(creatorClient.sent, undefined);
	t.is(joinedClient.sent, undefined);
	t.is(senderClient.sent, undefined);
});

test('sending message to a room sends to all folks in that room', t => {
	const expectedMessage = 'super secret my dude';
	const creatorClient = spiedClient(expectedMessage);
	const senderClient = spiedClient(expectedMessage);

	const response = testObject.createNewRoom({message: 'unused message'}, creatorClient);
	const newRoomCode = response.room;
	testObject.joinRoom({room: newRoomCode}, senderClient);

	testObject.sendMessageToRoom({room: newRoomCode, message: expectedMessage}, senderClient);

	t.is(creatorClient.sent, expectedMessage);
	t.is(senderClient.sent, expectedMessage);
});

test('a host disconnecting kills the room', t => {
	const creatorClient = spiedClient();

	const response = testObject.createNewRoom({message: 'unused message'}, creatorClient);
	const newRoomCode = response.room;
	t.true(newRoomCode in testObject.rooms, 'precondition');

	testObject.clientDisconnected(creatorClient);

	t.false(newRoomCode in testObject.rooms);
});

test('a non-host disconnecting does not kill the room', t => {
	const creatorClient = spiedClient();
	const joinerClient = spiedClient();

	const response = testObject.createNewRoom({message: 'unused message'}, creatorClient);
	const newRoomCode = response.room;
	t.true(newRoomCode in testObject.rooms, 'precondition');
	testObject.joinRoom({room: newRoomCode}, joinerClient);

	testObject.clientDisconnected(joinerClient);

	t.true(newRoomCode in testObject.rooms);
});

test('a non-host disconnecting prevents future broadcasts from going to them', t => {
	const expectedMessage = 'Hello fellow children';
	const creatorClient = spiedClient(expectedMessage);
	const joinerClient = spiedClient(expectedMessage);

	const response = testObject.createNewRoom({message: 'unused message'}, creatorClient);
	const newRoomCode = response.room;
	testObject.joinRoom({room: newRoomCode}, joinerClient);
	testObject.clientDisconnected(joinerClient);
	testObject.sendMessageToRoom({room: newRoomCode, message: expectedMessage}, creatorClient);

	t.is(creatorClient.sent, expectedMessage);
	t.is(joinerClient.sent, undefined);
});

test('a room being ended notifies all clients first', t => {
	const expectedMessage = 'Room ended';
	const creatorClient = spiedClient(expectedMessage);
	const joinerClient = spiedClient(expectedMessage);

	const response = testObject.createNewRoom({message: 'unused message'}, creatorClient);
	const newRoomCode = response.room;
	testObject.joinRoom({room: newRoomCode}, joinerClient);

	testObject.clientDisconnected(creatorClient);

	t.is(creatorClient.sent, expectedMessage);
	t.is(joinerClient.sent, expectedMessage);
});

test('a room being ended removes all associated clients from the map', t => {
	const creatorClient = spiedClient();
	const joinerClient = spiedClient();

	const response = testObject.createNewRoom({message: 'unused message'}, creatorClient);
	const newRoomCode = response.room;
	testObject.joinRoom({room: newRoomCode}, joinerClient);
	t.is(testObject.clients.size, 2);

	testObject.clientDisconnected(creatorClient);

	t.is(testObject.clients.size, 0);
});

const spiedClient = expectedMessage => {
	return {
		sent: undefined,
		send: function(response) {
			console.log('sending to fake socket', response);
			this.sent = JSON.parse(response).message;
		}
	};
}
