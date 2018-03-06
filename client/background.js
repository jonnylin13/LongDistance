/** @author Jonathan Lin
 *  @description Background JS script for LDN
 */

const PLAYER_STATE = Object.freeze({
    "Inactive": -1, // Initialization state
    "Play": 0,
    "Pause": 1
});

const READY_STATE = Object.freeze({
    "Unsent": 0,
    "Opened": 1,
    "Headers": 2,
    "Loaded": 3,
    "Done": 4
});

const POPUP_STATE = Object.freeze({
    "OutLobby": 0,
    "InLobby": 1,
    "ConnectLobby": 2,
});

const ws_url = 'ws://jlin.club:3000/ldn';

var current_url_params;
var player_port;
var player_state = PLAYER_STATE.Inactive;
var popup_state = POPUP_STATE.OutLobby;
var client_id;
var current_lobby; 
var ws;

function default_response(response) {
    if (response && response.type) console.log(response.type);
}

function is_watching(params) {
    if (params.includes('watch')) return true;
    return false;
}

/** Generates UUIDv4 token character 
 * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
*/
function v4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

/** Generates a UUIDv4 compliant random UUID */
function uuidv4() {
    return v4()+v4()+'-'+v4()+'-'+v4()+'-'+v4()+'-'+v4()+v4()+v4();
}

/** Generates a client id if one is not found in chrome sync storage */
function update_id() {
    chrome.storage.sync.get('client_id', function(items) {
        var id = items.client_id;
        if (id) {
            client_id = id;
        } else {
            client_id = uuidv4();
            chrome.storage.sync.set({'client_id': client_id});
        }
    });
}

function connect_lobby(lobby_id, done) {
    if (!ws) {
        ws = new WebSocket(ws_url);
        ws.onopen = function() {
            ws.send(
                JSON.stringify({
                    'type': 'connect_lobby',
                    'lobby_id': lobby_id,
                    'client_id': client_id,
                })           
            );
        }
    } else {
        ws.send(
            JSON.stringify({
                'type': 'connect_lobby',
                'lobby_id': lobby_id,
                'client_id': client_id,
            })           
        );
    }

    ws.onmessage = function(event) {
        var data = JSON.parse(event.data);
        if (data.type == 'connect_lobby_ack') {
            if (data.success) {
                current_lobby = data.lobby;
                var controller = current_lobby.clients[current_lobby.ctl_id];
                if (controller.player_state == PLAYER_STATE.Pause 
                    || controller.player_state == PLAYER_STATE.Play) {
                        // Assuming only one tab of Netflix
                        chrome.tabs.query({title: 'Netflix'}, function(tabs) {
                            chrome.tabs.update(tabs[0].id, {url: 'https://netflix.com/' + controller.url_params}, function() {
                                chrome.tabs.sendMessage(tabs[0].id, {
                                    type: 'player_update',
                                    player_state: controller.player_state,
                                    progress: controller.progress
                                }, function(response) {
                                    default_response(response);
                                });
                            });
                        });
                }
                done(true);
            } else done(false);
        }
    };
}

function lifecycle_ping(done) {
    if (!ws) {
        ws = new WebSocket(ws_url);
        ws.onopen = function() {
            ws.send(
                JSON.stringify({
                    'type': 'lifecycle',
                    'lobby_id': current_lobby.id,
                    'client_id': client_id,
                    'player_state': player_state,
                    'url_params': current_url_params,
                    'progress': current_lobby.clients[client_id].progress
                })
            );
        }
    } else {
        ws.send(
            JSON.stringify({
                'type': 'lifecycle',
                'lobby_id': current_lobby.id,
                'client_id': client_id,
                'player_state': player_state,
                'url_params': current_url_params,
                'progress': current_lobby.clients[client_id].progress
            })
        );
    }
    
    ws.onmessage = function(event) {
        var data = JSON.parse(event.data);
        if (data.type == 'lifecycle_ack') {
            done(data.stop);
        }
    }
}

function disconnect(done) {
    if (!ws) {
        ws = new WebSocket(ws_url);
        ws.onopen = function() {
            ws.send(
                JSON.stringify({
                    'type': 'disconnect',
                    'client_id': client_id
                })
            );
        };
    } else {
        ws.send(
            JSON.stringify({
                'type': 'disconnect',
                'client_id': client_id
            })
        );
    }

    ws.onmessage = function(event) {
        var data = JSON.parse(event.data);
        if (data.type == 'disconnect_ack') {
            if (data.success) {
                current_lobby = null;
                console.log('exited lobby');
                done();
            }
        }
    };

}

/** Starts a lobby with client_id
 * We could use a JS Object for _params, but this works for now (for/in loop vs for/statement loop)
 */
function start_lobby(done) {

    if (!ws) {
        ws = new WebSocket(ws_url);

        // When the socket is initially opened
        ws.onopen = function() {
            ws.send(JSON.stringify({
                'type': 'start_lobby',
                'client_id': client_id, 
                'player_state': player_state, 
                'url_params': current_url_params
            }));
        };
    } else {
        ws.send(JSON.stringify({
            'type': 'start_lobby',
            'client_id': client_id, 
            'player_state': player_state, 
            'url_params': current_url_params
        }));
    }

    ws.onmessage = function(event) {
        var data = JSON.parse(event.data);
        if (!data) return;
        if (data.type == 'start_lobby_ack') {
            if (data.success) {
                current_lobby = data.lobby;
                console.log(current_lobby);
                done();
            } else if (!data.success) {
                console.log(data.msg);
            }
        }
    };

    ws.ondisconnect = function() {
        alert('WEBSOCKET DISCONNECTED');
        ws = null;
    }
}

/** Called when a chrome tab is updated */
function tab_update_listener(tab_id, change_info, tab) {
    if (tab.url.indexOf('https://www.netflix.com/') == 0) {
        chrome.pageAction.show(tab_id);

        var new_url_params = tab.url.split('netflix.com/')[1];
        if (current_url_params != new_url_params) {
            current_url_params = new_url_params;

            if (is_watching(new_url_params)) {

                chrome.tabs.executeScript(tab_id, {file: 'player.js', runAt: 'document_idle'}, function(results) {
                    if (chrome.runtime.lastError || !results || !results.length) return;
                    chrome.tabs.sendMessage(tab_id, {type: 'register_listeners'}, default_response);    
                });

            } else {
                player_state = PLAYER_STATE.Inactive;
            }

            if (current_lobby) {
                current_lobby.clients[client_id].url_params = new_url_params;
            }
        }
            
    }
}

/** Triggered when popup.js has notified background that it has completed init */
function start_background() {
    update_id();
}

/** Triggered with messages from content scripts */
function msg_listener(req, sender, send_response) {
    if (req.type) {
        console.log(req.type);
        if (req.type === 'ldn_loaded') {
            start_background();
            send_response({
                type: 'start_background_ack'
            });
        } else if (req.type === 'start_lobby') {
            start_lobby(function() {
                // This makes assumption that only 1 Netflix tab is open...
                chrome.tabs.query({title: 'Netflix'}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        type: 'check_lifecycle'
                    }, function(response) {
                        default_response(response);
                    });
                });
                send_response({type:'start_lobby_ack', success: true});
            });

        } else if (req.type === 'update_player_state') {
            var result = false;
            if (player_state != req.new_state)  { // Handle duplicate messages
                player_state = req.new_state;
                result = true;
            }

            send_response({
                type: 'update_player_state_ack',
                success: result
            });
        } else if (req.type === 'disconnect') {

            disconnect(function() {
                send_response({
                    type: 'disconnect_ack',
                    success: true
                });
            });
            
        } else if (req.type === 'update_popup_state') {
            if (popup_state == req.new_state) return;
            console.log('popup_state: ', popup_state, ' -> ', req.new_state);
            popup_state = req.new_state;
            send_response({
                type: 'update_popup_state_ack',
                success: true
            });
        } else if (req.type === 'get_popup_state') {
            send_response({
                type: 'get_popup_state_ack',
                state: popup_state
            });
        } else if (req.type === 'get_lobby_id') {
            send_response({
                type: 'get_lobby_id_ack',
                lobby_id: current_lobby.id
            });
        } else if (req.type === 'lifecycle') {
            if (!current_lobby) {
                send_response({
                    'type': 'lifecycle_ack',
                    'stop': true
                });
                return;
            }
            current_lobby.clients[client_id].progress = req.progress;
            lifecycle_ping(function(stop) {
                send_response({
                    'type': 'lifecycle_ack',
                    'stop': stop
                });
            });
        } else if (req.type === 'connect_lobby') {
            connect_lobby(function(success) {
                send_response({
                    'type': 'connect_lobby_ack',
                    'success': success
                });
            });
        }
    }
    return true;
}

function register_listeners() {
    chrome.tabs.onUpdated.addListener(tab_update_listener);
    chrome.runtime.onMessage.addListener(msg_listener);
}

/** Main function (entry point) */
function main() {
    register_listeners();
}

main();
