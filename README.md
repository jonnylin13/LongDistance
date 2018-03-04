# LDN
Long Distance Netflix Chrome extension to replace Showgoers

# How to contribute
* Suggest new ideas/submit issues
* I will accept pretty much all pull requests if it works and I can make sense of it

# How to deploy/test
* Navigate to chrome://extensions
* Load unpacked extension
* Select the client folder

Be sure to run `npm install` in `server/`

# Structure
* client/background.js

Runs in the background of the extension. Controls all AJAX entrypoints/local state variables/acts as intermediary/master between popup.js and player.js

* client/player.js

Runs when Netflix player is running (when client is watching something). Will send client state updates to background.js based on event listeners

* client/popup.js

Runs with popup.html, which is only accessible when client's active tab is netflix.com. Controls the UI bindings for popup.html

* server/index.js

Server endpoints. Controls local state variables on the server-side
