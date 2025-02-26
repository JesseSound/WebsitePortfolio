const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './main.js', // Your entry JavaScript file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // Your HTML template
    }),
  ],
  devServer: {
    contentBase: './dist',
    open: true,
    hot: true,
  },
  mode: 'production', // Change to 'development' for dev mode
  stats: {
    children: true, // Removed the semicolon here, it should be a comma.
  },
};
