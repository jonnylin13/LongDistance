

import { TabListener, BackgroundMessageListener } from './listeners';
import Constants from  '../shared/constants';
import ProgressState from '../shared/model/progress_state';

class LDNClient {

    constructor () {
        console.log('Starting LDN...');
        this.urlParams = '';
        this.tabListener = new TabListener();
        this.backgroundMessageListener = new BackgroundMessageListener(this);
        this.popupState = Constants.OUT_LOBBY;
        this.progress = new ProgressState();
        this.currentLobby = null;
        this.clientId = null;

        console.log('LDN has been started!');
    }

    // Must be connected
    hasController (data) {
        if (!data.controlId) {
            console.log();
            return false;
        }
        return data.controlId == this.clientId;
    }

    connected () {
        return this.currentLobby && this.clientId;
    }

    updatePopupState (data) {
        if (!('popupState' in data)) { // Never reached?
            console.log('Received corrupt popup state data.');
            return false;
        }
        if (this.popupState === data.popupState) {
            console.log('Received duplicate popup state.');
            return false;
        }
        this.popupState = data.popupState;
        return true;
    }
    
}

const ldn = new LDNClient();