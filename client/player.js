/**
* @author Jonathan Lin
* @description Used to track the NF player
* Initialized when NF Player is created
*/

const PLAYER_STATE = Object.freeze({
    "Inactive": -1, // Initialization state
    "Play": 0,
    "Pause": 1
});

// Script local
var player_state = PLAYER_STATE.Inactive;
var prev_state;
/** var background_port;
var connected = false; */

function update_player_state(state) {
    chrome.runtime.sendMessage({
        'type': 'update_player_state',
        'new_state': state
    }, function(response) {
        if (response.result) {
            console.log(response.type);
            console.log("updated player state: " + state);
        }
    });
}

/** Returns the button control element from NF by class name, undefined if NF player not loaded */
function get_controls() {
    return document.getElementsByClassName('PlayerControls--button-control-row')[0];
}
/** Returns the progress control row element from NF player by class name, undefined if NF player not loaded */
function get_progress_controls() {
    return document.getElementsByClassName('PlayerControls--progress-control-row')[0];
}

/** Returns the progress from NF player */
function get_progress() {
    var data_element = get_progress_controls().children[0].children[0].children[0].children[2];
    var progress = {
        'elapsed': data_element.getAttribute('aria-valuenow'),
        'max': data_element.getAttribute('aria-valuemax'),
    }
    if (!data_element) {
        progress = {
            'elapsed': 0,
            'max': 0
        };
    }
    return progress;
}

/** Returns true if NF player is loaded */
function is_loaded() {
    return document.getElementsByClassName('PlayerControls--button-control-row').length > 0;
}

/** Returns the pause play button element */
function get_pause_play() {
    return get_controls().children[0];
}

/** Triggered when pause play button is clicked
 *  Will set the player state manually as a re-calibration (if keyup fails)
 *  Because the click event is called after the element is changed, Pause when the element is Play
 */
function pause_play_click_listener($event) {
    console.log("click");
    if($event.target.classList.contains('button-nfplayerPlay')) update_player_state(PLAYER_STATE.Pause);
    else if ($event.target.classList.contains('button-nfplayerPause')) update_player_state(PLAYER_STATE.Play);
}

/** Triggered when NF detects a keyup  */
function pause_play_keyup_listener($event) {
    if ($event.keyCode == 32) {
        console.log("space");
        var el = get_pause_play();
        // This will produce duplicate messages, handle this in background.js
        if (el.classList.contains('button-nfplayerPause')) update_player_state(PLAYER_STATE.Pause);
        else if (el.classList.contains('button-nfplayerPlay')) update_player_state(PLAYER_STATE.Play);
    }
}

/** Triggered by messages from background.js */
 function msg_listener(req, sender, send_response) {
     if (msg.type === 'update_player_state_ack') {
         send_response({type:'ay_lmao'});
         console.log(msg.type);
     }
     send_response();
}

/** Register listeners
 *  Called after the main function determines NF player has been loaded
 */
function register_listeners() {

    get_pause_play().addEventListener('click', pause_play_click_listener);
    document.addEventListener('keyup', pause_play_keyup_listener);
    chrome.runtime.onMessage.addListener(msg_listener);

    // connect_port();

}

/** Main function (entry point) */
function main() {
    var load = setInterval(function() {
        if (is_loaded()) {
            clearInterval(load);
            register_listeners();
            console.log('LDN has been loaded!');
        }
    }, 1000);
}

main();
