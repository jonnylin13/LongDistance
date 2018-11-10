
import { BackgroundProtocol } from '../shared/protocol';
import { TabListener, BackgroundMessageListener } from './listeners';

class LDNClient {

    constructor() {
        this.urlParams = '';
        this.tabListener = new TabListener();
        this.backgroundMessageListener = BackgroundMessageListener();
    }
    
}