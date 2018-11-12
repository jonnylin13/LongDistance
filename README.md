# LDN
> Create lobbies to synchronize Netflix viewing among multiple clients through this Chrome extension
* This project uses Webpack & Babel

# How to contribute
* Suggest new ideas/submit issues
* I will accept pretty much all pull requests if it works and I can make sense of it

# How to deploy/test
* Navigate to chrome://extensions
* Load unpacked extension
* Select the extension folder

Be sure to run `npm install`

To build the extension run `npm run build`

To build the extension and run the server `npm run dev`

# Structure
* extension/ldn.js

Runs in the background of the extension. Controls all WS entrypoints/local state variables/acts as intermediary/master between popup.js and controller.js

* extension/controller.js

Runs when Netflix is open. Will send client state updates to ldn.js based on event listeners

* extension/popup.js

Runs with popup.html, which is only accessible when client's active tab is netflix.com (chrome page action). Controls the UI bindings for popup.html

* server.js

Server endpoints. Controls local state variables on the server-side
