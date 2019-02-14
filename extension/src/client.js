class NetflixTabListener {

    constructor(clientController) {

        this._clientController = clientController;

        this._uncacheTab();
        this._queryNetflixTab();

        chrome.tabs.onCreated.addListener((tab) => { this._onCreated(tab) });
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => { this._onUpdated(tabId, changeInfo, tab) });
        chrome.tabs.onRemoved.addListener((tabId, removeInfo) => { this._onRemoved(tabId, removeInfo) });

    }

    _onCreated(tab) {
        console.log('<LDN> Created: ', tab.url);
        if (NetflixTabListener.isNetflix(tab) && !this._isTabCached()) {
            this._startNetflixScript(tab.id);
        }
    }

    _onUpdated(tabId, changeInfo, tab) {
        // Tracks URL params
        if (tab.url === this._clientController.clientState.urlParams) return;
        if (!changeInfo.status || changeInfo.status !== 'complete') return;
        
        console.log('<LDN> Updated tab: ', tab.url);
        if (NetflixTabListener.isNetflix(tab)) {
            if (!this._isTabCached()) {
                this._startNetflixScript(tab.id);
            }
            const urlParams = NetflixTabListener.getUrlParams(tab);
            if (this._clientController.clientState.urlParams !== urlParams) {
                this._clientController.clientState.urlParams = urlParams;
            }
        }
    }

    _onRemoved(tabId, removeInfo) {
        if (this._tabId === tabId) {
            this._uncacheTab();
            console.log('<LDN> Removed :(');
        }
    }

    _queryNetflixTab() {
        chrome.tabs.query(
            {title: 'Netflix'},
            (tabs) => {
                if (tabs.length === 0) this._uncacheTab();
                else {
                    if (!this._isTabCached()) {
                        // Todo: Fix this
                        this._startNetflixScript(tabs[0].id);
                    }
                }
            }
        );
    }

    _startNetflixScript(tabId) {
        this._tabId = tabId;
        console.log('<LDN> Starting Netflix script...');
        chrome.tabs.executeScript(tabId, {
            file: 'netflix.bundle.js',
            runAt: 'document_idle'
        }, (err) => {
            if (!err || err[0]) {
                console.log('<LDN> Controller started!');
                chrome.pageAction.show(tabId, undefined);
            } else {
                console.log('<LDN> Failed to start netflix.bundle.js!');
            }
        });
    }

    _uncacheTab() {
        this._tabId = -1;
    }

    _isTabCached () {
        return this._tabId !== -1;
    }

    get clientController() {
        return this._clientController;
    }

    static isNetflix(tab) {
        return tab.url.includes('netflix.com/');
    }

    static getUrlParams(tab) {
        if (!tab) return '';
        return tab.url.split('netflix.com/')[1].split('?')[0];
    }

}

class ClientState {
    constructor() {
        this._urlParams = '';
    }

    get urlParams() {
        return this._urlParams;
    }

    set urlParams(params) {
        this._urlParams = params;
    }

}

class ClientResponse {

    static validateFields(data, send) {
        // Todo: Implement
    }
}
 
class ClientController {
    constructor(clientState) {
        this._clientState = clientState;
        chrome.runtime.onMessage.addListener((req, sender, send) => {
            this._onMessage(req, sender, send);
        });
    }

    _onMessage(req, sender, send) {
        const data = JSON.parse(req);

        if (!data || !data.type) {
            console.log('<LDN> Background script received broken message from a content script.');
            return;
        }
        const payload = {
            type: data.type + '_ack'
        };

        console.log('<LDN> Backgrount script received message of type: ', data.type);
        if (data.type === 'popup_loaded') {

        } else if (data.type === 'get_lobby_id') {

        } else if (data.type === 'start_lobby') {

        }
        console.log('<LDN> Sending payload: ');
        console.log(payload);
        send(payload);
    }

    get clientState() {
        return this._clientState;
    }
}

class Client {

    constructor() {
        console.log('<LDN> Starting client extension');
        new NetflixTabListener(new ClientController(new ClientState()));
        console.log('<LDN> Background script started!');
    }

}

new Client();