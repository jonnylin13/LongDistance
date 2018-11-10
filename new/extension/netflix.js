class NCBackgroundMessenger {
    
}

class NetflixController {

    constructor() {
        this._get_video().on('play', this.play);
        this._get_video().on('pause', this.pause);
        this.state = 0;
        this.sync();
    }

    _get_video() {
        return $('video');
    }

    _get_play() {
        return $('.button-nfplayerPlay');
    }

    _get_player() {
        return $('.nf-player-container');
    }

    _get_pause() {
        return $('.button-nfplayerPause');
    }

    _get_scrubber() {
        return $('.scrubber-bar');
    }

    play() {

    }

    pause() {

    }

    sync() {
        if (this._get_video()[0]) {
            if (this._get_video()[0].paused == true) this.state = 0;
            else this.state = 1;
        } else this.state = -1;
    }
}

class NetflixListener {

    constructor() {
        chrome.tabs.onCreated.addListener(this.create);
        chrome.tabs.onUpdated.addListener(this.update);
        chrome.tabs.onRemoved.addListener(this.remove);
        this.tabId = -1; // not found
        
    }

    netflixOpen() {
        return this.tabId !== -1;
    }

    isNetflix(tab) {
        return tab.url.includes('https://netflix.com/');
    }

    create(tab) {
        if (this.isNetflix(tab)) {
            this.tabId = tab.id;
        }
    } 

    update(tabId, changeInfo, tab) {
        if (!changeInfo.status || changeInfo.status !== 'complete') return;
        chrome.tabs.query({
            currentWindow: true, active: true
        }, function(tabs) {
            const activeTab = tabs[0];
            if (this.isNetflix(activeTab)) {

            }
        });
    }

    remove(tabId, removeInfo) {
        if (tabId === this.tabId) this.tabId = -1;
    }
}