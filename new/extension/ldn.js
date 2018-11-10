
import { NetflixListener } from './netflix.js';
import { BackgroundMessageListener } from './messaging.js';

class LDNBackground {

    constructor() {
        this.urlParams = '';
        this.netflixListener = new NetflixListener();
        this.backgroundMessageListener = BackgroundMessageListener();
    }
    
}