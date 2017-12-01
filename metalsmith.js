const makeMetalsmithConfig = require('./makeMetalsmithConfig');

const metalsmith = makeMetalsmithConfig(__dirname);

metalsmith.build(err => {
  if (err) {
    throw err;
  }
});