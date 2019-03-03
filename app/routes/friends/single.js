const data = require('../../data/friends');

// get-single router
module.exports = (req, res) => {
	const friendId = req.params.friendId * 1;
	const friend = data.friends.find((f) => f.id === friendId);

	res.status(200).json({ data: friend });
};
