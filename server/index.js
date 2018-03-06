/**
* @author Jonathan Lin
* @description The backend server for LDN
*/

// Constants
const PORT = 3000;

// Imports
var WebSocket = require('ws');
var short_id = require('shortid');

// Variables
var lobbies = {};
var wss;

function error(msg, ws) {
    if (ws) {
        ws.send({
            'msg': msg,
            'success': false
        });
    }
    console.log(msg);
}

function lobby(ctl_id, player_state, url_params) {
    var lobby = {
        'ctl_id': ctl_id,   
        'clients': {}
    };
    lobby.clients[ctl_id] = {
        'player_state': player_state,
        'url_params': url_params
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

    

}

/** Listen function */
function listen() {
    wss.on('connection', function(ws, req) {

        console.log("Received a connection from: ", req.connection.remoteAddress);

        ws.on('message', function(msg) {

            var data = JSON.parse(msg);
            if (!data) return;

            if (data.type == 'start_lobby') {

                var client_id = data.client_id;

                if (has_lobby(client_id)) {
                    error('Error: client is already in a lobby', ws);
                    return;
                }
    
                // Generate and store
                var lid = short_id.generate();
                lobbies[lid] = lobby(client_id, data.player_state, data.url_params);
                ws.send(JSON.stringify({type: 'start_lobby_ack', success: true, lobby: lobbies[lid]}));
                console.log(JSON.stringify(lobbies));
            }

        });
    });
    console.log('Listening on port ' + PORT + '!');
}

/** Main function (entry point) */
function start_server() {
    wss = new WebSocket.Server({port: PORT, path: '/ldn'});
    listen();
}

start_server();
