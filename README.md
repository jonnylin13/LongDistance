# LongDistance

> Create lobbies to synchronize Netflix viewing among multiple clients through this Chrome extension

- This project uses Webpack & Babel

# How to contribute

- Suggest new ideas/submit issues
- I will accept pretty much all pull requests if it works and I can make sense of it

# How to deploy/test

- Navigate to chrome://extensions
- Load unpacked extension
- Select the extension folder

Be sure to run `npm install`

To build the extension run `npm run build`

To build the extension and run the server `npm run dev`

# Structure

- extension/ldn.js

Runs in the background of the extension persistently. Controls all WS entrypoints/local state of the extension. For persistent scripts, this can be accessed using `LDNClient.getInstance()`. For non-persistent scripts, a reference is attached to the window context `window.ldn`.

- extension/controller.js

Runs when Netflix is open (?) non-persistently. Will update the local state of `ldn.js` based on the Netflix player (seek, pause, play, etc).

- extension/popup.js

Runs with popup.html non-persistently, which is only accessible when client's active tab is netflix.com (chrome page action). Controls the UI bindings for popup.html.

- server.js

Server API. Controls local state variables on the server-side.
