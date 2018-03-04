/** @author Jonathan Lin
 *  @description Background JS script for LDN
 */

const ready_state = Object.freeze({
    "Unsent": 0,
    "Opened": 1,
    "Headers": 2,
    "Loaded": 3,
    "Done": 4
});

var previous_url;
var client_port;
var client_id;


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

function update_id(callback) {
    chrome.storage.sync.get("client_id", function(items) {
        var id = items.client_id;
        if (id) {
            client_id = id;
        } else {
            client_id = uniq_id();
            chrome.storage.sync.set({"client_id": client_id});
        }
        callback();
    });
}

function connect_port() {
    client_port = chrome.runtime.connect({name: client_id});
}

/** Triggered when ldn.js has notified background that it has completed init */
function start_background() {
    update_id(connect_port);
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

/** Called when a chrome tab is updated */
function tab_update_listener(tab_id, change_info, tab) {
    if (tab.url.indexOf("https://www.netflix.com/") == 0) {
        chrome.pageAction.show(tab_id);
        /** var url = tab.url.split("netflix.com/")[1];
        if (!previous_url) previous_url = url;
        else if (previous_url !== url) {
            chrome.runtime.sendMessage({type: "url_change", url: url});
        } */
    }
}

function msg_listener(req, sender, res) {
    console.log(req);
    if (req.type === "ldn_loaded") {
        start_background();
    } else if (req.type === "start_lobby") {
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
