const ManifestPlugin = require('webpack-manifest-plugin');
const MetalsmithPlugin = require('./metalsmithPlugin');

module.exports = {
  type: 'web-app',
  webpack: {
    publicPath: '/assets/',
    extra: {
      plugins: [
        new ManifestPlugin({
          filter: ({path}) => path.endsWith('.map') === false,
        }),
        new MetalsmithPlugin()
      ]
    }
  }
};
