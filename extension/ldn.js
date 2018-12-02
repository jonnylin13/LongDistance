

import { TabListener, BackgroundMessageListener } from './listeners';
import Constants from  '../shared/constants';
import ProgressState from '../shared/model/progressState';
import User from '../shared/model/user';
import Util from '../shared/util';

class LDNClient {

    constructor () {
        console.log('<Info> Starting LDN...');
        this.user = new User(this._provisionClientId(), Constants.INACTIVE, '', new ProgressState());
        this.tabListener = new TabListener(this);
        this.backgroundMessageListener = new BackgroundMessageListener(this);
        this.popupState = Constants.OUT_LOBBY; // Probably not necessary?
        this.currentLobby = null;
        this.ws = null;

        console.log('<Info> LDN has been started!');
    }

    // ===============
    // Private Methods
    // ===============

    _provisionClientId () {

        // TODO: local memory storage
        return Util.uuidv4();

        chrome.storage.sync.get('ldnClientId', function (items) {
            const id = items.clientId;
            if (id) {
                return id;
            } else {
                chrome.storage.sync.set({ 'ldnClientId': clientId });
                return Util.uuidv4(); // Should be done on server
            }
        });
    
    }

    _hasController (data) {
        if (!data.controlId) {
            console.log();
            return false;
        }
        return data.controlId == this.user.id;
    }

    _connect () {
        try {
            this.ws = new WebSocket(Constants.WS_URL);
            return true;
        } catch (exception) {
            return false;
        }
    }

    // ==============
    // Public Methods
    // ==============

    connected () {
        return this.currentLobby && this.user.id;
    }

    startLobby () {
        this._connect();
    }

    updatePopupState (data) {
        if (!('popupState' in data)) { // Never reached?
            console.log('<Error> Received corrupt popup state data.');
            return false;
        }
        if (this.popupState === data.popupState) {
            console.log('<Error> Received duplicate popup state.');
            return false;
        }
        this.popupState = data.popupState;
        return true;
    }
    
}

const ldn = new LDNClient();