// A fx to build a random integer array with custom min, max, and length options
const buildRandomIntArray = (min, max, length) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return [...Array(length)].map(
		(_) => Math.floor(Math.random() * (max - min + 1)) + min,
	);
};

// A class to be used to populate data
class Friend {
	constructor(indx, scores) {
		this.id = indx;
		this.name = `Anon${indx}`;
		this.photo = `https://randomuser.me/api/portraits/lego/${indx}.jpg`;
		this.scores = buildRandomIntArray(minScore, maxScore, totalQuestions);
	}
}

// Some user defined Constants
const totalFriends = 10;
const minScore = 1;
const maxScore = 5;
const totalQuestions = 10;

// Populate friends data Array
const friends = Array.from(
	Array(totalFriends),
	(x, index) =>
		new Friend(index, buildRandomIntArray(minScore, maxScore, totalQuestions)),
);
//console.log(friends);

// Export as a Module
module.exports = {
	friends,
};
