const path = require('path');
const copy = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        netflix: './src/netflix.js',
        client: './src/client.js',
        popup: './src/popup.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: '/\.js$', use: {
                    loader: 'babel-loader',
                    options: { 
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new copy([
            {from: './src/popup.html', to: 'popup.html'},
            {from: './src/styles.css', to: 'styles.css'},
            {from: './src/manifest.json', to: 'manifest.json'}
        ])
    ]
};