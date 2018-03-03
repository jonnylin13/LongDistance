/** @author Jonathan Lin
 *  @description Background JS script for LDN
 */

 var previous_url;

/** Called when a chrome tab is updated */
function tab_update_listener(tab_id, change_info, tab) {
    if (tab.url.indexOf("https://www.netflix.com/") == 0) {
        chrome.pageAction.show(tab_id);
        var url = tab.url.split("netflix.com/")[1];
        if (!previous_url) previous_url = url;
        else if (previous_url !== url) {
            chrome.runtime.sendMessage({type: "url_change", url: url});
        }
    }
}

/** Main function (entry point) */
function main() {
    chrome.tabs.onUpdated.addListener(tab_update_listener);
}

main();
