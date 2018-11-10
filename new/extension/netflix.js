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