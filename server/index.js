/**
* @author Jonathan Lin
* @description The backend server for LDN
*/

// Constants
const PORT = 3000;

// Imports
var express = require('express');
var app = express();
var cors =  require('cors');
var body_parser = require('body-parser');

// Variables
var lobbies = {
    'ctl_token': null,
    'clients': []
};

/** Returns true if client_id is in a lobby 
 * Uses linear search for now, can be optimized in the future
*/
function has_lobby(client_id) {
    for (var lobby in lobbies)
        for (var client in lobby.clients)
            if (client.id === client_id) return true;
    return false;
}

/** Returns true if client_id has control */
function has_ctl_token(client_id) {
    if (lobbies.ctl_token === client_id) return true;
    return false;
}

/** GET handshake request
 * Receives a client_id token
 * Creates a lobby in lobbies with client_id as control
 */
function start_lobby(req, res) {

    var client_id = req.query.client_id;
    // Validate client id

    if (has_lobby(client_id)) {
        res.json({msg: 'Error: client is already in a lobby'});
        return;
    }

    console.log(req.query.client_id);
    console.log(req.query.player_state);

}

/** Registers REST endpoints */
function register_endpoints() {
    app.get('/start_lobby', start_lobby);
}

/** Listen function */
function listen() {
    console.log('Listening on port ' + PORT + '!');
    // Set API endpoints
    register_endpoints();
}

/** Main function (entry point) */
function start_server() {
    // Middleware
    app.use(body_parser.json());
    app.use(body_parser.urlencoded({extended: true}));
    app.use(cors({origin: '*'}));

    app.listen(PORT, listen);
}

start_server();
