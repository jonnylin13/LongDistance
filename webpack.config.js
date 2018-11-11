const path = require('path');
const copy = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        controller: './extension/controller.js',
        ldn: './extension/ldn.js',
        popup: './extension/popup.js'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {test: /\.js$/, use: 'babel-loader'}
        ]
    },
    plugins: [
        new copy([
            {from: 'extension/popup.html', to: 'popup.html'},
            {from: 'extension/manifest.json', to: 'manifest.json'},
            {from: 'extension/styles', to: 'styles'}
        ])
    ]
};