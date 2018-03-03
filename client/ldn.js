/**
* @author Jonathan Lin
* @description LDN background script, drives the functionality of the UI
*/

const ready_state = Object.freeze({
    "Unsent": 0,
    "Opened": 1,
    "Headers": 2,
    "Loaded": 3,
    "Done": 4
});

var client_id;

// Utility

function create_params(url, params) {
    var output = url + "?";
    for (param in params) {
        if (output.substr(output.length - 1) === "?") output += param;
        else output += "&" + param;
    }
    return output;
}

function uniq_id() {
    return Date.now() + Math.random();
}

function check_id() {
    chrome.storage.sync.get("client_id", function(items) {
        var id = items.client_id;
        if (id) {
            client_id = id;
        } else {
            client_id = uniq_id();
            chrome.storage.sync.set({client_id: client_id});
        }
    });
}

// Listeners

/** Start lobby button event listener
 *  Called when user clicks the "Start Lobby" button
 */
function start_lobby_click_listener($event) {
    if (client_id)
        start_lobby();
}

/** Triggered when a message is sent to background */
function msg_listener(req, sender, res) {
    if (req.type === "url_change") {
        // req.url
    }
}

// AJAX entry points

/** Starts a lobby with client_id
 * Sends an AJAX request to backend 
 */
function start_lobby() {
    var req = new XMLHttpRequest();
    var url = "http://localhost:3000/register_client";
    var client_id_param = "client_id=" + client_id;
    req.open("GET", create_params(url, [client_id_param]), true);

    req.onreadystatechange = function() {
        if (req.readyState == ready_state.Done) {
            console.log(req);
        }
    }
    req.send();
}

function register_listeners() {
    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("start-lobby-btn").addEventListener("click", start_lobby_click_listener);
    });
    chrome.runtime.onMessage.addListener(msg_listener);
}

/** Main function (entry point) */
function main() {
    check_id();
    register_listeners();
}

main();
