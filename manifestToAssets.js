module.exports = function manifestToAssets(manifest, dest, resolveSource) {
  return Object.keys(manifest).reduce((state, filename) => {
    const file = manifest[filename];
    state[filename.split('.').slice(0, -1).join()] = {
      file,
      filename,
      content: resolveSource ? resolveSource(file) : null,
      url: `${dest}/${file}`
    };
    return state;
  }, {});
};