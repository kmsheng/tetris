'use strict';

const path = require("path");

module.exports = {
    devtool: 'inline-source-map',
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
            {
              test: /\.css$/,
              use: ['style-loader', 'css-loader']
            }
        ]
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      publicPath: "/dist/",
      filename: "bundle.js"
    },
    resolve: {
        extensions: [ '.ts', '.tsx', '.js' ]
    }
};
