/**
* @author Jonathan Lin
* @description Used to track the NF player
* Initialized when NF Player is created
*/

/** Wrapped in a function so executeScript knows the script has been run 
 *  https://stackoverflow.com/questions/34528785/chrome-extension-checking-if-content-script-has-been-injected-or-not
*/
(function() {
    if (window.hasRun === true)
        return true;
    window.hasRun = true;

const PLAYER_STATE = Object.freeze({
    "Inactive": -1, // Initialization state
    "Play": 1,
    "Pause": 0
});

var timeout = false;
var lifecycle_interval;

function fire_event(element, event) {
    if (element.fireEvent) {
        element.fireEvent('on' + event);
    } else {
        var event_obj = document.createEvent('Events');
        event_obj.initEvent(type, true, false);
        element.dispatchEvent(event_obj);
    }
}

function update_nf_player_time(progress) {
}

function update_nf_player_state(state) {
    if (req.player_state == PLAYER_STATE.Pause && !get_video().paused) get_video().paused = false;
    else if (req.player_state == PLAYER_STATE.Play && get_video().paused) get_video().play = true;
}

function update_player_state(state) {
    chrome.runtime.sendMessage({
        'type': 'update_player_state',
        'new_state': state,
        'progress': get_progress()
    }, function(response) {
        if (response.success) {
            console.log(response.type);
            console.log("updated player state: " + state);
        }
    });
}

function get_video() {
    return document.getElementsByTagName('video')[0];
}

function get_play() {
    return document.getElementsByClassName('button-nfPlayerPlay')[0].children[0];
}

function play() {
    fire_event(get_play(), 'click');
}

function pause() {
    get_video().pause();
}

/** Returns the progress from NF player */
function get_progress() {
    var video = get_video();
    if (!video) {
        return {
            'elapsed': 0,
            'max': 0
        };
    }
    return {
        'elapsed': video.currentTime,
        'max': video.duration,
    }
}

/** Returns true if NF player is loaded */
function is_loaded() {
    return (get_video() && get_video().readyState == 4);
}

function destroy() {
    get_video().removeEventListener('play', video_play_listener);
    get_video().removeEventListener('pause', video_pause_listener);
    clearInterval(lifecycle_interval);
}

// MAKE THESE LISTENERS IGNORE TIMEOUT PAUSES
function video_play_listener($event) {
    update_player_state(PLAYER_STATE.Play);
}

function video_pause_listener($event) {
    update_player_state(PLAYER_STATE.Pause);
}

function register_DOM_listeners(first_call) {
    check_player_state();
    if (!first_call) destroy();
    get_video().addEventListener('play', video_play_listener);
    get_video().addEventListener('pause', video_pause_listener);
}

function lifecycle() {
    chrome.runtime.sendMessage({
        'type': 'lifecycle',
        'progress': get_progress()
    }, function(response) {
        console.log(response);
        if (response && response.stop) {
            clearInterval(lifecycle_interval);
            lifecycle_interval = null;
        }
    });
}

/** Triggered by messages from background.js */
function msg_listener(req, sender, send_response) {
    if (req.type) {
        console.log(req.type);
        if (req.type === 'register_listeners') {

            var load = setInterval(function() {
                if (is_loaded()) {
                    clearInterval(load);
                    register_DOM_listeners(false);
                    if (!lifecycle_interval) lifecycle_interval = setInterval(lifecycle, 5000);
                    send_response({type: 'register_listeners_ack'});
                }
            }, 500);

        } else if (req.type === 'check_lifecycle') {
            var load = setInterval(function() {
                if (is_loaded()) {
                    clearInterval(load);
                    if (!lifecycle_interval) lifecycle_interval = setInterval(lifecycle, 5000);
                    send_response({type: 'check_lifecycle_ack'});
                }
            }, 500);
        } else if (req.type === 'full_player_update') {
            var load = setInterval(function() {
                var video = get_video();
                if (is_loaded()) { 
                    // FIX THIS
                    clearInterval(load);
                    update_nf_player_time(req.progress);
                    update_nf_player_state(req.player_state);
                    send_response({type: 'full_player_update_ack'});
                }
            }, 500);
        } else if (req.type === 'player_state_update') {
            var load = setInterval(function() {
                var video = get_video();
                if (is_loaded()) { 
                    // FIX THIS
                    update_nf_player_state(req.player_state);
                    send_response({type: 'player_state_update_ack'});
                }
            }, 500);
        } else if (req.type === 'player_time_update') {
            var load = setInterval(function() {
                var video = get_video();
                if (is_loaded()) { 
                    // FIX THIS
                    update_nf_player_time(req.progress);
                    send_response({type: 'player_time_update_ack'});
                }
            }, 500);
        } else if (req.type === 'get_progress') {
                send_response({
                    type: 'get_progress_ack',
                    progress: get_progress()
                });
        } else if (req.type === 'timeout') {
            pause();
            setTimeout(function() {
                play();
            }, 5000);
            send_response({
                type: 'timeout_ack'
            });
        }
    } 
}

/** Register listeners  
 *  Called after the main function determines NF player has been loaded
 */
function register_listeners() {

    register_DOM_listeners(true);
    lifecycle_interval = setInterval(lifecycle, 5000);
    chrome.runtime.onMessage.addListener(msg_listener);

}

function check_player_state() {
    if (get_video().paused) update_player_state(PLAYER_STATE.Pause);
    else if (!get_video().paused) update_player_state(PLAYER_STATE.Play);
}

/** Main function (entry point) */
function main() {
    var load = setInterval(function() {
        if (is_loaded()) {
            clearInterval(load);
            register_listeners();
            console.log('LDN has been loaded!');
        }
    }, 500);
}

main();
})();
