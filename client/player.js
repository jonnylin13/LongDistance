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

 const PLAYER_STATE= Object.freeze({
    "Inactive": -1, // Initialization state
    "Play": 1,
    "Pause": 0
});

var timeout = false;
var lifecycle_interval;
var player_controller_active = false;

function update_nf_player_time(progress) {
    seek(progress);
}

function update_nf_player_state(state) {
    console.log(state);
    if (state == PLAYER_STATE.Pause) pause();
    else if (state == PLAYER_STATE.Play) play();
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

function check_player_state() {
    if (get_video()[0]) {
        if (get_video()[0].paused == true) update_player_state(PLAYER_STATE.Paused);
        else if (get_video()[0].paused == false) update_player_state(PLAYER_STATE.Play);
    }
}

function get_video() {
    return $('video');
}

function get_play() {
    return $('.button-nfplayerPlay');
}

function get_player() {
    return $('.nf-player-container');
}

function get_pause() {
    return $('.button-nfplayerPause');
}

function get_scrubber() {
    return $('.scrubber-bar');
}

function seek(progress) {
    player_controller_active = true;
    show_controls(function() {
        var factor = progress.elapsed / progress.max;
        var mouse_x = $('.progress-control')[0].offsetLeft + get_scrubber()[0].offsetWidth * factor;
        var mouse_y = get_scrubber()[0].offsetTop + get_scrubber()[0].offsetHeight / 2;
        var event_options = {
            'bubbles': true,
            'button': 0,
            'screenX': mouse_x - $(window).scrollLeft(),
            'screenY': mouse_y - $(window).scrollTop(),
            'clientX':  mouse_x - $(window).scrollLeft(),
            'clientY': mouse_y - $(window).scrollTop(),
            'offsetX': mouse_x - get_scrubber()[0].offsetLeft,
            'offsetY': mouse_y - get_scrubber()[0].offsetTop,
            'pageX': mouse_x,
            'pageY': mouse_y,
            'currentTarget': get_scrubber()[0]
        };
        get_scrubber()[0].dispatchEvent(new MouseEvent('mouseover', event_options));
        setTimeout(function() {
            get_scrubber()[0].dispatchEvent(new MouseEvent('mousedown', event_options));
            get_scrubber()[0].dispatchEvent(new MouseEvent('mouseup', event_options));
            get_scrubber()[0].dispatchEvent(new MouseEvent('mouseout', event_options));
            setTimeout(function() {
                hide_controls(); // This will set player_controller_active
            }, 1);
        }, 10);
    });

}

function show_controls(callback) {
    player_controller_active = true;
    var event_options = {
        'bubbles': true,
        'button': 0,
        'currentTarget': get_scrubber()[0]
    };
    get_scrubber()[0].dispatchEvent(new MouseEvent('mousemove', event_options));
    setTimeout(
        function() {
            player_controller_active = false;
            if (callback) callback();
        }, 10);

}

function hide_controls(callback) {
    player_controller_active = true;
    var offset = 100;
    var event_options = {
        'bubbles': true,
        'button': 0,
        'screenX': offset - $(window).scrollLeft(),
        'screenY': offset - $(window).scrollTop(),
        'clientX': offset - $(window).scrollLeft(),
        'clientY': offset - $(window).scrollTop(),
        'offsetX': offset - get_player()[0].offsetLeft,
        'offsetY': offset - get_player()[0].offsetTop,
        'pageX': offset,
        'pageY': offset,
        'currentTarget': get_player()[0]
    };
    get_player()[0].dispatchEvent(new MouseEvent('mousemove', event_options));
    setTimeout(function() {
        player_controller_active = false;
        if (callback) callback();
    }, 1);
}

/** Tons of help
 * https://www.stephanboyer.com/post/105/netflix-party-synchronize-netflix-video-playback <-
 * https://github.com/avigoldman/netflix.js
 * https://stackoverflow.com/questions/27927950/controlling-netflix-html5-playback-with-tampermonkey-javascript/39703888#39703888
*/
function play() {
    execute_safely(function() {
        if (get_video()[0].paused) {
            console.log('play update');
            player_controller_active = true;
            get_play().click();
            setTimeout(function() {
                hide_controls();
            }, 1);
        }
    });
}

function pause() {
    execute_safely(function() {
        if (!get_video()[0].paused) {
            console.log('pause update');
            player_controller_active = true;
            get_pause().click();
            setTimeout(function() {
                hide_controls();
            }, 1);
        }
    });
}

/** Returns the progress from NF player */
function get_progress() {
    if (!get_video()[0]) {
        return {
            'elapsed': 0,
            'max': 0
        };
    }
    return {
        'elapsed': get_video()[0].currentTime,
        'max': get_video()[0].duration,
    }
}

function loaded() {
    return (get_video()[0] && get_video()[0].readyState == 4);
}

/** Callback if NF player is loaded */
function execute_safely(callback) {
    var temp = setInterval(function() {
        if (loaded()) {
            clearInterval(temp);
            callback();
        }
    }, 500);
}

function destroy() {
    get_video().off('play', video_play_listener);
    get_video().off('pause', video_pause_listener);
    clearInterval(lifecycle_interval);
}

// MAKE THESE LISTENERS IGNORE TIMEOUT PAUSES
function video_play_listener($event) {
    if (!player_controller_active) update_player_state(PLAYER_STATE.Play);
}

function video_pause_listener($event) {
    if (!player_controller_active) update_player_state(PLAYER_STATE.Pause);
}

function register_DOM_listeners(first_call) {
    // Initial update
    check_player_state();
    if (!first_call) destroy();
    get_video().on('play', video_play_listener);
    get_video().on('pause', video_pause_listener);
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

            execute_safely(function() {
                register_DOM_listeners(false);
                if (!lifecycle_interval) lifecycle_interval = setInterval(lifecycle, 5000);
                send_response({type: 'register_listeners_ack'});
            });

        } else if (req.type === 'check_lifecycle') {

            execute_safely(function() {
                if (!lifecycle_interval) lifecycle_interval = setInterval(lifecycle, 5000);
                send_response({type: 'check_lifecycle_ack'});
            });

        } else if (req.type === 'full_player_update') {

            execute_safely(function() {
            
                update_nf_player_time(req.progress);
                update_nf_player_state(req.player_state);
                send_response({type: 'full_player_update_ack'});
            });

        } else if (req.type === 'player_state_update') {

            execute_safely(function() {
                update_nf_player_state(req.player_state);
                send_response({type: 'player_state_update_ack'});

            });

        } else if (req.type === 'player_time_update') {

            execute_safely(function() {
                update_nf_player_time(req.progress);
                send_response({type: 'player_time_update_ack'});
                
            });
        } else if (req.type === 'get_progress') {
                send_response({
                    type: 'get_progress_ack',
                    progress: get_progress()
                });
        } else if (req.type === 'timeout') {
            /**pause();
            setTimeout(function() {
                play();
            }, 5000);
            send_response({
                type: 'timeout_ack'
            });**/
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

/** Main function (entry point) */
function main() {

    execute_safely(function() {
        register_listeners();
        console.log('LDN has been loaded!');
    });
}

$(document).ready(main);
})();
