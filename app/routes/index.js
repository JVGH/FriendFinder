const routes = require('express').Router();
const survey = require('./survey');
const friends = require('./friends');

// Base route
routes.get('/', (req, res) => {
	res.status(200).sendFile(path.join(__dirname, '../public/home.html'));
});

// Survey page route
routes.use('/survey', survey);

// API route
routes.use('/api/survey', friends);

module.exports = routes;
