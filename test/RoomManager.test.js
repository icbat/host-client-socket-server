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

test('sending message to a non-existent room fails gracefully', t => {
	const testFunction = () => {
		const newRoomCode = testObject.createNewRoom({text: 'unused message'}, spiedClient('a message for no one'));

		testObject.sendMessageToRoom({room: newRoomCode, text: 'room scanning spam'});
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
		testObject.joinRoom({room: newRoomCode, text: unexpectedMessage}, joinedClient);
		testObject.sendMessageToRoom({room: newRoomCode, text: unexpectedMessage}, senderClient);
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

	const newRoomCode = testObject.createNewRoom({text: 'unused message'}, creatorClient);
	testObject.joinRoom({text: newRoomCode}, senderClient);

	testObject.sendMessageToRoom({room: newRoomCode, text: expectedMessage}, senderClient);

	t.true(creatorClient.sent);
	t.true(senderClient.sent);
});

const spiedClient = expectedMessage => {
	return {
		sent: false,
		send: function(message) {
			if (message === expectedMessage) {
				this.sent = true;
			}
		}
	};
}
