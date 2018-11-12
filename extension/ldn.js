

import { TabListener, BackgroundMessageListener } from './listeners';

class LDNClient {

    constructor() {
        console.log('Starting LDN...');
        this.urlParams = '';
        this.tabListener = new TabListener();
        this.backgroundMessageListener = new BackgroundMessageListener();
        console.log('LDN has been started!');
    }
    
}

const ldn = new LDNClient();