const survey = require('express').Router(),
	path = require('path');

// survey page router
survey.get('/', function(req, res) {
	res.status(200).sendFile(path.join(__dirname, '../../public/survey.html'));
});

module.exports = survey;
