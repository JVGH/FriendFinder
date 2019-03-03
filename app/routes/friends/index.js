const friends = require('express').Router();
const data = require('../../data/friends');
const all = require('./all');
const single = require('./single');

// get-all route
friends.get('/', all);

// get-single route
friends.get('/:friendId', single);

// post route
friends.post('/', function(req, res) {
	const newFriend = {
		id: parseInt(friends.length) + 1,
		name: req.body.name,
		photo: req.body.photo,
		scores: req.body['scores[]'],
	};
	const bestFriend = findFriend(newFriend);
	data.friends.push(newFriend);
	res.status(200).json({ id: bestFriend });
});

// middleware to show err msg for invalid param
friends.param('friendId', (req, res, next, value) => {
	const friend = data.friends.find((f) => f.id === value * 1);

	if (friend) {
		req['friend'] = friend;
		next();
	} else {
		res.status(404).send('Invalid Param!');
	}
});

// fx to return abs diff
const calcDifference = (a, b) => {
	return Math.abs(a - b);
};

// fx to calculate best friend
const findFriend = (self) => {
	const selfScores = self.scores;
	let bestFriendId = -1;
	let bestFriendMatchScore = Number.MAX_SAFE_INTEGER;
	data.friends.forEach((element) => {
		let friendId = element.id;
		let score = 0;
		element.scores.forEach((e, index) => {
			score += calcDifference(e, selfScores[index]);
		});

		if (score < bestFriendMatchScore) {
			bestFriendId = friendId;
			bestFriendMatchScore = score;
		}
	});

	return bestFriendId;
};

module.exports = friends;
