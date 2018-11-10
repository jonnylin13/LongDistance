var path = require('path');
var webpack = require('webpack');

module.exports = [
    {
       output: {
           path: path.resolve(__dirname, 'new/extension/build'),
           filename: 'ldn.bundle.js'
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
       entry: './new/extension/ldn.js'
    },
    {
        output: {
            path: path.resolve(__dirname, 'new/extension/build'),
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
        entry: './new/extension/popup.js'
     },
     {
        output: {
            path: path.resolve(__dirname, 'new/extension/build'),
            filename: 'controller.bundle.js'
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
        entry: './new/extension/player.js'
     },
     {
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'server.bundle.js'
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
        entry: './new/server.js'
     }
]