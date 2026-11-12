const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './main.js', // Your entry JavaScript file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[name][ext][query]', // To specify how to name and place assets
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
      {
        test: /\.(glb|gltf)$/i, // Match .glb and .gltf files
        type: 'asset/resource', // Treat these files as static assets
        generator: {
          filename: 'Models/[name][ext][query]', // Place them in the Models folder
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
    children: true, // Enable stats for child compilations
  },
};
