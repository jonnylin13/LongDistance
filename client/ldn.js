/**
* @author Jonathan Lin
* LDN background script, drives the functionality of the UI
*/

function start_lobby_click_listener($event) {
    start_lobby();
}


function start_lobby() {

}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("start-lobby-btn").addEventListener("click", start_server_click_listener);
});
