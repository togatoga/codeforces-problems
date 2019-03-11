const path = require("path");
const jsyaml = require("js-yaml");
const webpack = require("webpack");
const fs = require("fs");

var conf = {
  api_url: ""
};
try {
  c = jsyaml.safeLoad(fs.readFileSync("../setting/config.yml", "utf8"));
  const server = c[process.env.NODE_ENV].server;
  if (process.env.NODE_ENV == "production") {
    conf.api_url = server.host;
  } else if (process.env.NODE_ENV == "development") {
    conf.api_url = server.host + ":" + server.port;
  }
} catch (e) {
  console.log(e);
}

module.exports = {
  mode: process.env.NODE_ENV,
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      API_URL: JSON.stringify(conf.api_url)
    })
  ]
};
