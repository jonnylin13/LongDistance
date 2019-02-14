const path = require('path');
const copy = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        controller: './controller.js',
        ldn: './ldn.js',
        popup: './popup.js'
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
            {from: 'popup.html', to: 'popup.html'},
            {from: 'styles.css', to: 'styles.css'},
            {from: 'manifest.json', to: 'manifest.json'}
        ])
    ]
};