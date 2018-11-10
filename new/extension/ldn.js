
import { NetflixListener } from './netflix.js';
import { LDNBackgroundMessageListener } from './messaging.js';

class LDNClient {

    constructor() {
        this.urlParams = '';
        this.netflixListener = new NetflixListener();
        this.backgroundMessageListener = LDNBackgroundMessageListener();
    }
    
}