const path = require("path");
const webpack = require("webpack");

module.exports = {
 mode: "development",
 module: {
   rules: [{
     test: /\.(js|jsx)$/,
     exclude: /node_modules/,
     loader: 'babel-loader'}]
    },
  devServer: {
      contentBase: path.join(__dirname,'dist'),
      historyApiFallback: true
  },
};