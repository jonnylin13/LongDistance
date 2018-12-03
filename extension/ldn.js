/** 
 * @author Jonathan Lin
 * @description Background script for LDN Chrome extension
 */

import TabListener from './listeners/tabListener';
import LDNMessageListener from './listeners/ldnListener';
import Constants from  '../shared/constants';
import ProgressState from '../shared/model/progressState';
import User from '../shared/model/user';
import Util from '../shared/util';

import StartLobbyMessage from '../shared/protocol/startLobby';

class LDNClient {

    constructor () {
        console.log('<Info> Starting LDN...');

        this.user = new User(this._provisionClientId(), Constants.Codes.ControllerState.INACTIVE, '', new ProgressState());
        // this.currentLobby = null;
        this.ws = null;

        this.tabListener = new TabListener(this);
        this.messageListener = new LDNMessageListener(this);


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
                const clientId = Util.uuidv4();
                chrome.storage.sync.set({ 'ldnClientId': clientId });
                return clientId;
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
        if (!this.isSocketConnected()) {
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

    startLobby (startLobbyMessage) {
        this._connect();
        return new Promise(resolve => {
            this.ws.onopen = () => {

                this.ws.send(startLobbyMessage.toJson());
                this.ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    if (data.type === 'START_LOBBY_ACK') {
                        // TODO: Update user
                        this.ldn.user.updateFromJson(event.data);
                        // TODO: Update lobby ID in popup?
                        resolve(data);
                    }
                }
            }
        });
        
        
    }

    isConnected () {
        return this.user.currentLobby && this.user.id;
    }

    isSocketConnected () {
        return this.ws && this.ws.readyState === this.ws.OPEN;
    }

    // ===============
    // Handler Methods
    // ===============
    
}

const ldn = new LDNClient();