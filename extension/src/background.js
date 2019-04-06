const SocketController = require("./socket");
const ClientState = require("./models/client-state");

class BackgroundResponse {
  static validateFields(data, send) {
    // Todo: Implement
  }
}

class Background {
  constructor() {
    console.log("<LDN> Starting client extension");
    this._clientState = new ClientState();
    this._tabs = new BackgroundTabListener(this._clientState);
    this._socketController = new SocketController(this._tabs);
    chrome.runtime.onMessage.addListener((msg, sender, send) => {
      this._onMessage(msg, sender, send);
    });
    console.log("<LDN> Background script started!");
  }

  _onMessage(data, sender, send) {
    if (!data || !data.type) {
      console.log(
        "<LDN> Background script received broken message from a content script."
      );
      return;
    }
    const payload = {
      type: data.type + "_ack"
    };

    console.log(
      "<LDN> Background script received message of type: ",
      data.type
    );
    if (data.type === "popup_loaded") {
    } else if (data.type === "get_lobby_id") {
    } else if (data.type === "start_lobby") {
      this._socketController.createLobby();
      // This one sends a special response
    } else if (data.type === "disconnect") {
      // Todo: Handle disconnect #31
      // Send a disconnect to server?
    }
    console.log("<LDN> Background script sending response to content script: ");
    console.log(payload);
    send(payload);
  }
}

class BackgroundTabListener {
  constructor(clientState) {
    this._clientState = clientState;

    this._uncacheTab();
    this._queryNetflixTab();

    chrome.tabs.onCreated.addListener(tab => {
      this._onCreated(tab);
    });
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this._onUpdated(tabId, changeInfo, tab);
    });
    chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
      this._onRemoved(tabId, removeInfo);
    });
  }

  _onCreated(tab) {
    console.log("<LDN> Created: ", tab.url);
    if (BackgroundTabListener.isNetflix(tab) && !this._isTabCached()) {
      this._startNetflixScript(tab.id);
    }
  }

  _onUpdated(tabId, changeInfo, tab) {
    // Tracks URL params
    if (tab.url === this._clientState.urlParams) return;
    if (!changeInfo.status || changeInfo.status !== "complete") return;

    console.log("<LDN> Updated tab: ", tab.url);
    if (BackgroundTabListener.isNetflix(tab)) {
      if (!this._isTabCached()) {
        this._startNetflixScript(tab.id);
      }
      const urlParams = BackgroundTabListener.getUrlParams(tab);
      if (this._clientState.urlParams !== urlParams) {
        this._clientState.urlParams = urlParams;
      }
    }
  }

  _onRemoved(tabId, removeInfo) {
    if (this._tabId === tabId) {
      this._uncacheTab();
      console.log("<LDN> Removed :(");
    }
  }

  _queryNetflixTab() {
    chrome.tabs.query({ title: "Netflix" }, tabs => {
      if (tabs.length === 0) this._uncacheTab();
      else {
        if (!this._isTabCached()) {
          // Todo: Fix this
          this._startNetflixScript(tabs[0].id);
        }
      }
    });
  }

  _startNetflixScript(tabId) {
    this._tabId = tabId;
    console.log("<LDN> Starting Netflix script...");
    chrome.tabs.executeScript(
      tabId,
      {
        file: "netflix.bundle.js",
        runAt: "document_idle"
      },
      err => {
        if (!err || err[0]) {
          console.log("<LDN> Controller started!");
          chrome.pageAction.show(tabId, undefined);
        } else {
          console.log("<LDN> Failed to start netflix.bundle.js!");
        }
      }
    );
  }

  _uncacheTab() {
    this._tabId = -1;
  }

  _isTabCached() {
    return this._tabId !== -1;
  }

  get tabId() {
    return this._tabId;
  }

  get clientState() {
    return this._clientState;
  }

  static isNetflix(tab) {
    return tab.url.includes("netflix.com/");
  }

  static getUrlParams(tab) {
    if (!tab) return "";
    return tab.url.split("netflix.com/")[1].split("?")[0];
  }
}

new Background();
