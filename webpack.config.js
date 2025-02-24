const path = require('path');

module.exports = {
  entry: './main.js',  // Adjust this if your entry file is different
  output: {
    filename: 'bundle.js',  // Output JavaScript file
    path: path.resolve(__dirname, 'dist'),  // Output directory
  },
  devServer: {
    static: './dist',  // Serve the `dist` directory
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',  // Use Babel to transpile JS (if you're using ES6+)
        },
      },
    ],
  },
};
