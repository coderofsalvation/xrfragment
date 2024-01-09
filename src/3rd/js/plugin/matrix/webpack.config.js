module.exports = {
  entry: './lib.js',
  output: {
    library: {
      type: "umd",
      name: "Matrix"
    },
    filename: "matrix-crdt.js",
    path: require('path').resolve(__dirname, '.')
  }
};
