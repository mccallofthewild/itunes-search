// REQUIREMENTS

let express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    routes = require('./server-assets/routes/index'),
    handlers = require('./utils/handlers')


// SERVER SETUP

let server = express(),
    port = process.env.PORT || 2560,
    http = require('http').Server(server);
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended:true}));
server.use('/api', cors(handlers.corsOptions), routes.router);
server.use('/', express.static(`${__dirname}/public/`));
server.use('/playlists/:id', express.static(`${__dirname}/public/`));

// Initialize Server
server.listen(port, function () {
  console.log(`Creating worlds on port: ${port}`);
})