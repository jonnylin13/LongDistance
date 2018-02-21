/**
* @author Jonathan Lin
* @description LDN background script, drives the functionality of the UI
*/

/** Start lobby button event listener
 *  Called when user clicks the "Start Lobby" button
 */
function start_lobby_click_listener($event) {
    start_lobby();
}

/** Sends an AJAX request to backend */
function start_lobby() {

}

/** Main function (entry point) */
function main() {
    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("start-lobby-btn").addEventListener("click", start_server_click_listener);
    });
}

main();
