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
var short_id = require('shortid');

// Variables
var lobbies = {};

function lobby(ctl_id, player_state) {
    var lobby = {
        'ctl_id': ctl_id,
        'clients': {
        }
    };
    lobby.clients[ctl_id] = {
        'player_state': player_state
    };
    return lobby;
}

/** Returns true if client_id is in a lobby 
 * Uses linear search for now, can be optimized in the future
*/
function has_lobby(client_id) {
    for (var lobby_id in lobbies)
        for (var cid in lobbies[lobby_id].clients)
            if (cid == client_id) return true;
    return false;
}

/** Returns true if client_id has control */
function has_ctl_token(lobby, client_id) {
    return (lobby.ctl_id === client_id);
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
        console.log('Error: client is already in a lobby');
        return;
    }

    // Generate and store
    var lid = short_id.generate();
    lobbies[lid] = lobby(client_id, req.query.player_state);
    res.json(lobbies[lid]);
    console.log('Created lobby: ');
    console.log(lobbies);

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
