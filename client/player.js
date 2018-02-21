/**
* @author Jonathan Lin
* Used to track the NF player
*/

// Constants

const PLAYER_STATE = Object.freeze({
    "Play": 0,
    "Pause": 1
});
const debug = true;

// Globals
var player_state;

// Utility

function contains(arr, item) { // Uses linear search for now...
    for (var i = 0; i < arr.length; i++)
        if (item == arr[i]) return true;
    return false;
}

function get_controls() {
    return document.getElementsByClassName("PlayerControls--button-control-row")[0];
}

function get_progress_controls() {
    return document.getElementsByClassName("PlayerControls--progress-control-row")[0];
}

function get_progress() {
    var dataElement = get_progress_controls().children[0].children[0].children[0].children[2];
    var progress = {
        "elapsed": dataElement.getAttribute("aria-valuenow"),
        "max": dataElement.getAttribute("aria-valuemax"),
    }
    return progress;
}

function is_loaded() {
    return document.getElementsByClassName("PlayerControls--button-control-row").length > 0;
}

function get_pause_play() {
    return get_controls().children[0];
}

// NF Listeners

function pause_play_click_listener($event) { // This function sets player state manually as a re-calibration feature
    if(contains($event.target.classList, "button-nfplayerPlay")) player_state = PLAYER_STATE.Pause;
    else if (contains($event.target.classList, "button-nfplayerPause")) player_state = PLAYER_STATE.Play;
}

function pause_play_keyup_listener($event) {
    if ($event.keyCode == 32) {
        var el = get_pause_play();
        if (contains(el.classList, "button-nfplayerPlay")) player_state = PLAYER_STATE.Play;
        else if (contains(el.classList, "button-nfplayerPause")) player_state = PLAYER_STATE.Pause;
    }
}

function start() {

    // Register listeners for NF
    get_pause_play().addEventListener("click", pause_play_click_listener);
    document.addEventListener("keyup", pause_play_keyup_listener);

}

function main() {

    var load = setInterval(function() {
        if (is_loaded()) {
            if (debug)
                console.log("LDN has been loaded!");
            clearInterval(load);
            start();
        }
    }, 1000);
}

main();
