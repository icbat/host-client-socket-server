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
	t.false(creatorClient.sent);
	t.false(joinedClient.sent);
	t.false(senderClient.sent);
});

test('sending message to a room sends to all folks in that room', t => {
	const expectedMessage = 'super secret my dude';
	const creatorClient = spiedClient(expectedMessage);
	const senderClient = spiedClient(expectedMessage);

	const response = testObject.createNewRoom({message: 'unused message'}, creatorClient);
	const newRoomCode = response.room;
	testObject.joinRoom({room: newRoomCode}, senderClient);

	testObject.sendMessageToRoom({room: newRoomCode, message: expectedMessage}, senderClient);

	t.true(creatorClient.sent);
	t.true(senderClient.sent);
});

const spiedClient = expectedMessage => {
	return {
		sent: false,
		send: function(response) {
			console.log('sending to fake socket', response);
			if (JSON.parse(response).message === expectedMessage) {
				this.sent = true;
			}
		}
	};
}
