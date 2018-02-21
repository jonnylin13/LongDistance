function tab_update_listener(tab_id, change_info, tab) {
    if (tab.url.indexOf("https://www.netflix.com/watch/") == 0) {
        chrome.pageAction.show(tab_id);
    }
}

chrome.tabs.onUpdated.addListener(tab_update_listener);
