const logger = (req, res, next) => {
	console.log(
		`${req.protocol}://${req.get('host')}${
			req.originalUrl
		}: ${new Date().toUTCString()}`,
	);
	next();
};

module.exports = logger;
