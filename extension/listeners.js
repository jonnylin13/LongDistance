import BackgroundProtocol from '../shared/protocol/bg_protocol';

export class TabListener {


    constructor () {
        this.search();
        chrome.tabs.onCreated.addListener((tab) => {
            this.create(tab);
        });
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            this.update(tabId, changeInfo, tab);
        });
        chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
            this.remove(tabId, removeInfo);
        });
        this.tabId = -1; // not found
        console.log('Tab listener started!');
    }

    search () {
        chrome.tabs.query({
            title: 'Netflix'
        }, (tabs) => {
            if (tabs.length === 0) this.tabId = -1;
            else {
                if (!this.netflixOpen()) {
                    this.startController(tabs[0].id);
                }
                return tabs[0];
            }
        });
    }

    startController (tabId) {
        this.tabId = tabId;
        chrome.tabs.executeScript(tabId, {
            file: 'scripts/jquery.min.js'
        }, (results) => {
            if (!results || results[0]) {
                chrome.tabs.executeScript(tabId, {
                    file: 'controller.bundle.js',
                    runAt: 'document_idle'
                }, (results) => {
                    if (!results || results[0]) {
                        console.log('Controller started!');
                        chrome.pageAction.show(tabId, undefined);
                    } else {
                        console.log('Failed to start controller!');
                    }
                })
            } else {
                console.log('Failed to start jQuery!');
            }
            
        });
    }

    stopController () {
        this.tabId = -1;
    }

    netflixOpen () {
        return this.tabId !== -1;
    }

    isNetflix (tab) {
        if (!tab) return false;
        return tab.url.includes('https://www.netflix.com/');
    }

    create (tab) {
        console.log('Created: ', tab.url);
        if (this.isNetflix(tab) && !this.netflixOpen()) {
            startController(tab.id);
        }
    } 

    update (tabId, changeInfo, tab) {
        console.log('Updated: ', tab.url);
        if (!changeInfo.status || changeInfo.status !== 'complete') return;
        chrome.tabs.query({
            currentWindow: true, active: true
        }, (tabs) => {
            const activeTab = tabs[0];
            if (this.isNetflix(activeTab) && !this.netflixOpen()) {
                this.startController(activeTab.id);
            }
        });
    }

    remove(tabId, removeInfo) {
        if (tabId === this.tabId) this.stopController();
    }
}

export class BackgroundMessageListener {
    constructor (ldn) {
        this.ldn = ldn;
        chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
            this.message(req, sender, sendResponse);
        });
    }

    message (req, sender, sendResponse) {
        if (!req.type) {
            console.log('LDN background received a broken message from a content script.');
            return;
        }

        console.log('LDN background received message type: ', req.type);
        if (req.type === 'POPUP_LOADED') {
            this.wrappedSendResponse(sendResponse, BackgroundProtocol.POPUP_LOADED_ACK);
        } else if (req.type === 'UPDATE_POPUP_STATE') {
            this.wrappedSendResponse(sendResponse, BackgroundProtocol.UPDATE_POPUP_STATE_ACK(this.ldn.updatePopupState(req)));
        } else if (req.type === 'GET_LOBBY_ID') {
            this.wrappedSendResponse(sendResponse, BackgroundProtocol.GET_LOBBY_ID_ACK(this.ldn.currentLobby));
        }
    }

    wrappedSendResponse (sendResponse, data) {
        console.log('Sending the following response: ');
        console.log(data);
        sendResponse(data);
    }
}