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
        ws.send(JSON.stringify({
            'msg': 'Error: ' + msg,
            'success': false
        }));
    }
    console.log(msg);
}

function avg_elapsed(lobby_id, client_id) {
    var sum = 0;
    var count = 0;
    if (!lobbies[lobby_id]) return sum;
    for (var cid in lobbies[lobby_id].clients) {
        if (cid != client_id) {
            sum += lobbies[lobby_id].clients[cid].progress.elapsed;
            count++;
        }
    }
    return sum / count;
}

function lobby(id, ctl_id, player_state, url_params) {
    var lobby = {
        'id': id,
        'ctl_id': ctl_id,   
        'clients': {}
    };
    lobby.clients[ctl_id] = {
        'id': ctl_id,
        'player_state': player_state,
        'url_params': url_params,
        'progress': {
            'elapsed': 0,
            'max': 0
        }
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

function broadcast_update() {
    wss.clients.forEach(function each(client) {
        if (client.readyState == WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'update',
                lobbies: lobbies
            }));
        }
    });
}

/** Listen function */
function listen() {
    wss.on('connection', function(ws, req) {

        console.log("Received a connection from: ", req.connection.remoteAddress);

        ws.on('message', function(msg) {

            var data = JSON.parse(msg);
            if (!data) return;
            console.log(data.type);

            // CLIENT MESSAGES
            if (data.type == 'start_lobby') {

                var client_id = data.client_id;

                if (has_lobby(client_id)) {
                    error('Error: client is already in a lobby', ws);
                    return;
                }
    
                // Generate and store
                var lid = short_id.generate();
                lobbies[lid] = lobby(lid, client_id, data.player_state, data.url_params);
                ws.send(JSON.stringify({
                    type: 'start_lobby_ack', 
                    success: true, 
                    lobby: lobbies[lid]
                }));
                console.log(lobbies);

            } else if (data.type == 'disconnect') {

                var client_id = data.client_id;

                for (var lobby_id in lobbies)  {
                    for (var cid in lobbies[lobby_id].clients) {

                        if (cid == client_id) {
                            delete lobbies[lobby_id].clients[cid];
                            if (Object.keys(lobbies[lobby_id].clients).length == 0) delete lobbies[lobby_id];
                            if (lobbies[lobby_id] && client_id == lobbies[lobby_id].ctl_id) 
                                lobbies[lobby_id].ctl_id = Object.keys(lobbies[lobby_id].clients)[0];
                            ws.send(JSON.stringify({
                                type: 'disconnect_ack',
                                success: true
                            }));
                        }

                    }
                }
                console.log(lobbies);

            } else if (data.type == 'lifecycle') {

                if (!lobbies[data.lobby_id]) {
                    ws.send(JSON.stringify({
                        type: 'lifecycle_ack',
                        stop: true
                    }));
                    return;
                }
                
                var client = lobbies[data.lobby_id].clients[data.client_id];
                client.player_state = data.player_state;
                client.url_params = data.url_params;
                client.progress = data.progress;

                if (client.progress.elapsed - avg_elapsed(data.lobby_id, client.id) > 5) {
                    ws.send(JSON.stringify({
                        type: 'lifecycle_ack',
                        stop: false,
                        timeout: true
                    }));
                } else {
                    ws.send(JSON.stringify({
                        type: 'lifecycle_ack',
                        stop: false
                    }));
                }
                console.log(client);

            } else if (data.type == 'connect_lobby') {

                var cid = data.client_id;
                var lid = data.lobby_id;

                if (has_lobby(cid)) {
                    error('client is already in a lobby', ws);
                    return;
                }

                if (lobbies[lid]) {
                    lobbies[lid].clients[cid] = {
                        'id': cid,
                        'url_params': data.url_params,
                        'player_state': data.player_state
                    };
                    ws.send(JSON.stringify({
                        type: 'connect_lobby_ack',
                        lobby: lobbies[lid],
                        success: true
                    }));
                    console.log(lobbies[lid]);  
                } else {
                    error('lobby not found', ws);
                    return;
                }


            } else if (data.type == 'broadcast_update') {

                if (!lobbies[data.lobby_id]) {
                    ws.send(JSON.stringify({
                        type: 'broadcast_update_ack',
                        success: false
                    }));
                    return;
                }
                
                // We know the client is the controller here
                var client = lobbies[data.lobby_id].clients[data.client_id];
                client.player_state = data.player_state;
                client.url_params = data.url_params;
                client.progress = data.progress;

                if (client.id == lobbies[data.lobby_id].ctl_id) {
                    broadcast_update();
                }

                ws.send(JSON.stringify({
                    type: 'broadcast_update_ack',
                    success: true
                }));
                console.log(client);
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
