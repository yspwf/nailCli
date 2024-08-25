const path = require('node:path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: "production",
  target: "node",
  entry:{
    app: "./src/entry.js"
  },
  output:{
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.js"
  },
  module:{
    rules:[
      {
        test: /\.js$/,
        loader: "babel-loader"
      }
    ]
  },
  externals: [nodeExternals()]
}