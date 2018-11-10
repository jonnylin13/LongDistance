import { BackgroundProtocol } from '../shared/protocol';

class TabListener {

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

class BackgroundMessageListener {
    constructor () {
        chrome.runtime.onMessage.addListener(this.message);
    }

    message(req, sender, sendResponse) {
        if (!req.type) {
            console.log('LDN received a strange message from content script.');
            return;
        }

        console.log('LDN received message type: ', str(req.type));
        if (req.type === 'ldn_loaded') {
            sendResponse(BackgroundProtocol.ldnLoadedAck());
        }
    }
}