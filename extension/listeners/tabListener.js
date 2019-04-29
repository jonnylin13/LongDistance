import LDNClient from '../ldn';
import Constants from '../../shared/constants';

export default class TabListener {
  // TODO: Should we execute the script when popup.js is instantiated?
  constructor() {
    // TODO: Check implementation
    this._queryNetflixTab();
    chrome.tabs.onCreated.addListener(tab => {
      this.onCreate(tab);
    });
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.onUpdate(tabId, changeInfo, tab);
    });
    chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
      this.onRemove(tabId, removeInfo);
    });
    this.tabId = -1; // not found
    console.log('<TabListener> Tab listener started!');
  }

  // ===============
  // Private Methods
  // ===============
  _queryNetflixTab() {
    // This is unsafe but works for now
    chrome.tabs.query(
      {
        title: 'Netflix'
      },
      tabs => {
        if (tabs.length === 0) this.tabId = -1;
        else {
          this._update(tabs[0]);
          return tabs[0];
        }
      }
    );
  }

  // TODO: How do we remove the controller script?
  _startControllerScript(tabId) {
    // TODO: Reimplement
    LDNClient.getInstance().user.controllerState =
      Constants.ControllerState.PENDING;

    chrome.tabs.executeScript(
      tabId,
      {
        file: 'scripts/jquery.min.js'
      },
      results => {
        if (results[0]) {
          chrome.tabs.executeScript(
            tabId,
            {
              file: 'controller.bundle.js',
              runAt: 'document_idle'
            },
            results => {
              if (results[0]) {
                console.log('<TabListener> Controller script executed!');
              } else throw new Error('Failed to start controller script.');
            }
          );
        } else throw new Error('Failed to start jQuery!');
      }
    );
  }

  _uncacheTab() {
    console.log('<TabListener> Removing tab id: ' + this.tabId);
    this.tabId = -1;
  }

  _cacheTab(tabId) {
    console.log('<TabListener> Setting tab id: ' + tabId);
    this.tabId = tabId;
  }

  _update(tab) {
    if (TabListener.isNetflix(tab)) {
      chrome.pageAction.show(tab.id, undefined);
      console.log('<TabListener> Updated: ', tab.url);
      if (!this.isTabCached()) this._cacheTab(tab.id);
      if (
        tab.url.includes('watch') &&
        LDNClient.getInstance().user.controllerState ===
          Constants.ControllerState.INACTIVE
      )
        this._startControllerScript(tab.id);

      const urlParams = TabListener.getUrlParams(tab);
      if (LDNClient.getInstance().user.urlParams !== urlParams) {
        console.log('<TabListener> Updated user url parameters: ' + urlParams);
        LDNClient.getInstance().setUrlParams(urlParams);
      }
    }
  }

  // ==============
  // Public Methods
  // ==============

  isTabCached() {
    return this.tabId !== -1;
  }

  // ===============
  // Handler Methods
  // ===============

  onCreate(tab) {
    console.log('<TabListener> Created: ', tab.url);
    this._update(tab);
  }

  onUpdate(tabId, changeInfo, tab) {
    // TODO: Reimplement
    if (tab.url === LDNClient.getInstance().user.urlParams) return;
    if (!changeInfo.status || changeInfo.status !== 'complete') return;
    this._update(tab);
  }

  onRemove(tabId, removeInfo) {
    if (tabId === this.tabId) this._uncacheTab();
  }

  // ==============
  // Static Methods (can be removed)
  // ==============

  static isNetflix(tab) {
    if (!tab) return false;
    return tab.url.includes('https://www.netflix.com/');
  }

  static getUrlParams(tab) {
    if (!tab) return '';
    // TODO: Reimplement
    return tab.url.split('netflix.com/')[1].split('?')[0];
  }
}
