const manifestToAssets = require('./manifestToAssets');

function MetalsmithPlugin(opts, makeMetalsmithConfig) {
  this.opts = Object.assign({
    metalsmithDest: '/assets',
  }, opts);
  this.makeMetalsmithConfig = makeMetalsmithConfig ? makeMetalsmithConfig : require('./makeMetalsmithConfig');
}

MetalsmithPlugin.prototype.apply = function(compiler) {
  compiler.plugin('after-emit', (compilation, callback) => {
    if (compilation.assets && compilation.assets['manifest.json']) {
      const manifest = JSON.parse(compilation.assets['manifest.json'].source());
      const assets = manifestToAssets(manifest, this.opts.metalsmithDest, (file) => () => {
        return compilation.assets[file] ? compilation.assets[file].source().toString() : null;
      });

      this.makeMetalsmithConfig(__dirname, {assets, callback}).build(function (err) {
        if (err) throw err;
        callback();
      });
    } else {
      console.warn('Metalsmith Plugin requires ManifestPlugin, try running $ npm install webpack-manifest-plugin --save-dev');
    }
  });
};

module.exports = MetalsmithPlugin;