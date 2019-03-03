const express = require('express'),
	path = require('path');

// Init express
const app = express();

// Use logging (middleware)
app.use(require('./app/middleware/logger'));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(path.join(__dirname, './app/public')));

// Routes
app.use('/', require('./app/routes'));

// Set PORT
const PORT = process.env.PORT || 8080;

// Init Server instance
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
