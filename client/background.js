/** @author Jonathan Lin
 *  @description Background JS script for LDN
 */

/** Called when a chrome tab is updated */
function tab_update_listener(tab_id, change_info, tab) {
    if (tab.url.indexOf("https://www.netflix.com/") == 0) {
        chrome.pageAction.show(tab_id);
    }
}

/** Main function (entry point) */
function main() {
    chrome.tabs.onUpdated.addListener(tab_update_listener);
}

main();
