

import { TabListener, BackgroundMessageListener } from './listeners';
import Constants from  '../shared/constants';
import ProgressState from '../shared/model/progressState';
import User from '../shared/model/user';
import Util from '../shared/util';

class LDNClient {

    constructor () {
        console.log('<Info> Starting LDN...');
        this.user = new User(this._provisionClientId(), Constants.Codes.ControllerState.INACTIVE, '', new ProgressState());
        this.tabListener = new TabListener(this);
        this.backgroundMessageListener = new BackgroundMessageListener(this);
        this.viewState = Constants.Codes.ViewState.OUT_LOBBY; // TODO: Check if popup state is necessary in LDN
        this.currentLobby = null;
        this.ws = null;

        console.log('<Info> LDN has been started!');
    }

    // ===============
    // Private Methods
    // ===============

    _provisionClientId () {

        return Util.uuidv4();

        // TODO: local memory storage
        chrome.storage.sync.get('ldnClientId', function (items) {
            const id = items.clientId;
            if (id) {
                return id;
            } else {
                chrome.storage.sync.set({ 'ldnClientId': clientId });
                return Util.uuidv4();
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
        if (!this.ws) {
            try {
                this.ws = new WebSocket(Constants.WS_URL);
                return true;
            } catch (exception) {
                return false;
            }
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

    // TODO: If this is never used, remove it
    updateViewState (data) {
        if (!('viewState' in data)) { // Never reached?
            console.log('<Error> Received corrupt view state data.');
            return false;
        }
        if (this.viewState === data.viewState) {
            console.log('<Error> Received duplicate view state.');
            return false;
        }
        this.viewState = data.viewState;
        return true;
    }
    
}

const ldn = new LDNClient();