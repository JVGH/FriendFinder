const data = require('../../data/friends');

// get-all router
module.exports = (req, res) => {
	const friends = data;

	res.status(200).json({ data: friends });
};
