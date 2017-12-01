const metalsmith = require('metalsmith');
const inPlace = require('metalsmith-in-place');
const beautify = require('metalsmith-beautify');
const layout = require('metalsmith-layouts');
const readFileSync = require('jsonfile').readFileSync;
const fs = require('fs');
const manifestToAssets = require('./manifestToAssets');

module.exports = function makeMetalsmithConfig(dir, userConfig) {
  const configuration = Object.assign({
    source: `${dir}/src/views`,
    destination: `${dir}/dist`,
    assetDir: `${dir}/dist/assets`,
  }, userConfig || {});

  if (!configuration.assets) {
    const manifestPath = `${dir}/dist/assets/manifest.json`;
    try {
      const manifest = readFileSync(manifestPath);
      configuration.assets = manifestToAssets(manifest, `${dir}/dist/assets`, (file) => {
        return () => fs.readFileSync(`${dir}/dist/assets/${file}`).toString()
      });
    } catch (e) {}
  }

  return metalsmith(dir,)
      .source(configuration.source)
      .destination(`${dir}/dist`)
      .use(inPlace({
        engineOptions: {
          path: configuration.source
        }
      }))
      .clean(false)
      .use((files) => {
        if (configuration.assets) {
          for (const file in files) {
            files[file].assets = configuration.assets
          }
        }
      })
      .use(layout({
        engine: 'nunjucks',
        default: `${configuration.source}/lib/layouts/default.njk`
      }))
      .use(beautify())
      .ignore(`${configuration.source}/lib/**`);
}