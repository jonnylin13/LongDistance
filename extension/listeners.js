import { BackgroundProtocol } from '../shared/protocol';

export class TabListener {

    constructor() {
        this.search();
        chrome.tabs.onCreated.addListener(this.create);
        chrome.tabs.onUpdated.addListener(this.update);
        chrome.tabs.onRemoved.addListener(this.remove);
        this.tabId = -1; // not found
        
    }

    search() {
        chrome.tabs.query({
            title: 'Netflix'
        }, function(tabs) {
            if (tabs.length === 0) this.tabId = -1;
            else {
                if (!this.netflixOpen()) {
                    this.startController(tabs[0].id);
                }
                return tabs[0];
            }
        });
    }

    startController(tabId) {
        this.tabId = tabId;
        chrome.tabs.executeScript(tabId, {
            file: 'scripts/jquery.js'
        }, function(results) {
            chrome.tabs.executeScript(tabId, {
                file: 'build/controller.js',
                runAt: 'document_idle'
            }, function(results) {

            })
        });
    }

    stopController() {
        this.tabId = -1;
    }

    netflixOpen() {
        return this.tabId !== -1;
    }

    isNetflix(tab) {
        return tab.url.includes('https://netflix.com/');
    }

    create(tab) {
        if (this.isNetflix(tab) && !this.netflixOpen()) {
            this.startController(tab.id);
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
        if (tabId === this.tabId) this.stopController();
    }
}

export class BackgroundMessageListener {
    constructor () {
        chrome.runtime.onMessage.addListener(this.message);
    }

    message(req, sender, sendResponse) {
        if (!req.type) {
            console.log('LDN background received a strange message from content script.');
            return;
        }

        console.log('LDN background received message type: ', str(req.type));
        if (req.type === 'ldn_loaded') {
            sendResponse(BackgroundProtocol.ldnLoadedAck());
        }
    }
}