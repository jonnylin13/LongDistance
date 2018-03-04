/**
* @author Jonathan Lin
* @description LDN popup script, drives the functionality of the popup UI
* Initialized in popup.html
*/

// Listeners

/** Start lobby button event listener
 *  Called when user clicks the 'Start Lobby' button
 */
function start_lobby_click_listener($event) {
    chrome.runtime.sendMessage({type: 'start_lobby'}, function(response) {
        console.log(response.type);
        console.log('lobby started');
    });
}

function register_listeners() {
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('start-lobby-btn').addEventListener('click', start_lobby_click_listener);
        chrome.runtime.sendMessage({type: 'ldn_loaded'}, function(response) {
            console.log(response.type);
            console.log('ldn loaded');
        });
    });
}

/** Main function (entry point) */
function main() {
    register_listeners();
}

main();
