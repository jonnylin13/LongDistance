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

var current_url_params;
var player_port;
var player_state = PLAYER_STATE.Inactive;
var client_id;

function is_watching() {
    if (current_url_params.split('/')[0] === 'watch') return true;
    return false;
}

function param(key, value) {
    var output = key + '=' + value;
    return output;
}

/** Uses for/statement loop because I'm too lazy to change params to JSO */
function create_params(url, params) {
    var output = url + '?';
    for (var i = 0; i < params.length; i++) {
        if (output.substr(output.length - 1) === '?') output += params[i];
        else output += '&' + params[i];
    }   
    return output;
}

/** Generates a unique token id, this will work in practice but it's not very safe lmao */
function uniq_id() {
    return Date.now() + Math.random();
}

/** Generates a client id if one is not found in chrome sync storage */
function update_id(callback) {
    chrome.storage.sync.get('client_id', function(items) {
        var id = items.client_id;
        if (id) {
            client_id = id;
        } else {
            client_id = uniq_id();
            chrome.storage.sync.set({'client_id': client_id});
        }
        callback();
    });
}

/** Starts a lobby with client_id
 * Sends an AJAX request to backend 
 * We could use a JS Object for _params, but this works for now (for/in loop vs numeral loop)
 */
function start_lobby() {
    var req = new XMLHttpRequest();
    var url = 'http://localhost:3000/start_lobby';

    var _params = [];
    _params.push(param('client_id', client_id));
    _params.push(param('player_state', player_state));

    if (player_state && player_state !== PLAYER_STATE.Inactive && is_watching()) {
        params.push(param('url_params', current_url_params));
    }
    req.open('GET', create_params(url, _params), true);

    req.onreadystatechange = function() {
        if (req.readyState == READY_STATE.Done) {
            // Start lobby done
        }
    }
    req.send();
}

/** Called when a chrome tab is updated */
function tab_update_listener(tab_id, change_info, tab) {
    if (tab.url.indexOf('https://www.netflix.com/') == 0) {
        chrome.pageAction.show(tab_id);
        current_url_params = tab.url.split('netflix.com/')[1];
    }
}

/** Triggered when player.js sends messages */
function player_msg_listener(msg) {
    if (msg.type === 'update_player_state') {
        if (!msg.new_state) return;
        player_state = msg.new_state;
    }
}

/** Registers connection with player.js */
function connect_port() {
    player_port = chrome.runtime.connect({name: 'ldn'});
    player_port.onMessage.addListener(player_msg_listener);
}

/** Triggered when popup.js has notified background that it has completed init */
function start_background() {
    update_id(connect_port);
}

/** Triggered with connection-less messages from popup.js */
function msg_listener(req, sender, res) {
    if (req.type === 'ldn_loaded') {
        start_background();
    } else if (req.type === 'start_lobby') {
        start_lobby();
    }
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
