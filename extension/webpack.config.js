const path = require('path');
const copy = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        netflix: './src/content/netflix.js',
        background: './src/background.js',
        popup: './src/content/popup.js'
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
            {from: './src/content/popup.html', to: 'popup.html'},
            {from: './src/content/styles.css', to: 'styles.css'},
            {from: './src/content/manifest.json', to: 'manifest.json'}
        ])
    ]
};