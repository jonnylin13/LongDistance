var path = require('path');
var webpack = require('webpack');

module.exports = [
    {
       output: {
           path: path.resolve(__dirname, 'extension/build'),
           filename: 'background.bundle.js'
       },
       module: {
           rules: [
               {  
                    test: '/\.js$/',
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
               }
               
           ]
       },
       entry: './extension/background.js'
    },
    {
        output: {
            path: path.resolve(__dirname, 'extension/build'),
            filename: 'popup.bundle.js'
        },
        module: {
            rules: [
                {  
                     test: '/\.js$/',
                     exclude: /(node_modules)/,
                     use: { 
                         loader: 'babel-loader',
                         options: {
                             presets: ['@babel/preset-env']
                         }
                     }
                }
                
            ]
        },
        entry: './extension/popup.js'
     },
     {
        output: {
            path: path.resolve(__dirname, 'extension/build'),
            filename: 'player.bundle.js'
        },
        module: {
            rules: [
                {  
                     test: '/\.js$/',
                     exclude: /(node_modules)/,
                     use: {
                         loader: 'babel-loader',
                         options: {
                             presets: ['@babel/preset-env']
                         }
                     }
                }
                
            ]
        },
        entry: './extension/player.js'
     },
]