/**
* @author Jonathan Lin
* @description LDN popup script, drives the functionality of the popup UI
* Initialized in popup.html
*/

import { POPUP_STATE } from './constants';
import { Utility } from './utility';

let views = {};

function init_views() {     

    // Re-update reference 
    views[POPUP_STATE.InLobby] = document.getElementById('in-lobby-container');
    views[POPUP_STATE.OutLobby] = document.getElementById('out-lobby-container');
    views[POPUP_STATE.ConnectLobby] = document.getElementById('connect-lobby-container');
}

function get_lobby_id_text() {
    return document.getElementById('lobby-id-text');
}

function update_state(new_state) {

    chrome.runtime.sendMessage({
        'type': 'update_popup_state', 
        'new_state': new_state
    }, Utility.default_response);

    for (let state in views) {
        if (state == new_state) views[state].style.display = 'block';
        else views[state].style.display = 'none';
    }

    if (new_state == POPUP_STATE.InLobby) {
        chrome.runtime.sendMessage({
            'type': 'get_lobby_id'
        }, function(response) {
            if (response && response.success) get_lobby_id_text().innerHTML = response.lobby_id;
            Utility.default_response(response);
        });
    } else {
        get_lobby_id_text().innerHTML = '';
    }

}

/** Start lobby button event listener
 *  Called when user clicks the 'Start Lobby' button
 */
function start_lobby_click_listener($event) {
    chrome.runtime.sendMessage({type: 'start_lobby'}, function(response) {
        if (response && response.type) {
            if (response.type === 'start_lobby_ack' && response.success) {
                // Update the view
                update_state(POPUP_STATE.InLobby);
            }
        }
        Utility.default_response(response);
    });
}

function disconnect_lobby_click_listener($event) {
    chrome.runtime.sendMessage({type: 'disconnect'}, function(response) {
        if (response && response.type) {
            if (response.type === 'disconnect_ack' && response.success) {
                // Update the view
                update_state(POPUP_STATE.OutLobby);
            }
        }
        Utility.default_response(response);
    });
}

function connect_confirm_click_listener($event) {
    chrome.runtime.sendMessage({
        type: 'connect_lobby',
        lobby_id: document.getElementById('lobby-id').value,
    }, function(response) {
        if (response) {
            if (response.type === 'connect_lobby_ack' && response.success) {
                update_state(POPUP_STATE.InLobby);
            }
        }
    });
}

function connect_click_listener($event) {
    update_state(POPUP_STATE.ConnectLobby);
}

function connect_back_click_listener($event) {
    update_state(POPUP_STATE.OutLobby);
}

function register_listeners() {
    document.addEventListener('DOMContentLoaded', function() {
        init_views();
        chrome.runtime.sendMessage({type: 'get_popup_state'}, function(response) {
            if (response && response.type == 'get_popup_state_ack') update_state(response.state);
        });
        document.getElementById('start-lobby-btn').addEventListener('click', start_lobby_click_listener);
        document.getElementById('disconnect-btn').addEventListener('click', disconnect_lobby_click_listener);
        document.getElementById('connect-btn').addEventListener('click', connect_click_listener);
        document.getElementById('connect-btn-back').addEventListener('click', connect_back_click_listener);
        document.getElementById('connect-confirm-btn').addEventListener('click', connect_confirm_click_listener);
        chrome.runtime.sendMessage({type: 'ldn_loaded'}, Utility.default_response);
    });
}

/** Main function (entry point) */
function main() {
    register_listeners();
}

main();
