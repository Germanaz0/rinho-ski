const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin')
require('@babel/register');

// Webpack Configuration
const config = {

    entry: ['babel-polyfill', './src/index.js'],

    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'app.[contenthash].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.png$/,
                use: ['file-loader'],
            },
        ],
    },

    plugins: [
        new htmlWebpackPlugin({
            title: 'Southteams Ski',
        }),
        new CopyWebpackPlugin([
            {
                //Note:- No wildcard is specified hence will copy all files and folders
                from: 'img', //Will resolve to RepoDir/src/assets
                to: 'img', //Copies all files from above dest to dist/assets
            },
            {
                //Wildcard is specified hence will copy only css files
                from: 'css/*.css', //Will resolve to RepoDir/src/css and all *.css files from this directory
                to: 'css',//Copies all matched css files from above dest to dist/css
            },
        ]),
    ],
};

module.exports = config;