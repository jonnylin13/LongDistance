/**
* @author Jonathan Lin
* @description LDN background script, drives the functionality of the UI
*/

const ready_state = Object.freeze({
    "UNSENT": 0,
    "OPENED": 1,
    "HEADERS": 2,
    "LOADED": 3,
    "DONE": 4
});

var client_id;

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

/** Start lobby button event listener
 *  Called when user clicks the "Start Lobby" button
 */
function start_lobby_click_listener($event) {
    if (client_id)
        start_lobby();
}

/** Sends an AJAX request to backend */
function start_lobby() {
    var req = new XMLHttpRequest();
    var url = "http://localhost:3000/register_client";
    var params = "client_id=" + client_id;
    req.open("GET", url+"?"+params, true);

    req.onreadystatechange = function() {
        if (req.readyState == ready_state.DONE) {
            console.log(req);
        }
    }
    req.send();
}

/** Main function (entry point) */
function main() {
    check_id();
    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("start-lobby-btn").addEventListener("click", start_lobby_click_listener);
    });
}

main();
