# LongDistance

> Create lobbies to synchronize Netflix viewing among multiple clients through this Chrome extension

## How to contribute

- Suggest new ideas/submit issues
- I will accept pretty much all pull requests initially

## How to build

- Be sure to run `npm install`
- To build the extension run `npm run build`
- To build the extension and run the server `npm run dev`
- To run the server exclusively `npm run start`

## How to configure the server

- `constants.js` contains a variable `WS_URL` that represents your websocket server URL
- Modify that variable, then re-build the extension
- You should be able to deploy the server and extension now

## How to deploy/test

- Navigate to chrome://extensions
- Click on "Load unpacked extension"
- Select the `build/` folder after building the extension

## Wiki

Check out the [WIKI](https://github.com/jonnylin13/LongDistance/wiki) for more help!
