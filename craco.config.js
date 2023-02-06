const path = require("path");
const webpack = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  webpack: {
    entry: {
      app: "./index.js",
      "apidom.worker": "@swagger-api/swagger-editor/apidom.worker",
      "editor.worker": "@swagger-api/swagger-editor/editor.worker",
    },
    output: {
      globalObject: "self",
      filename: "[name].js",
      path: path.resolve(__dirname, "dist"),
    },
    resolve: {
      fallback: {
        path: false,
        fs: false,
        http: require.resolve("stream-http"), // required for asyncapi parser
        https: require.resolve("https-browserify"), // required for asyncapi parser
        stream: require.resolve("stream-browserify"),
        util: require.resolve("util"),
        zlib: false,
      },
      alias: {
        // This alias doesn't pull any languages into bundles and works as monaco-editor-core was installed
        "monaco-editor$": "monaco-editor/esm/vs/editor/edcore.main.js",
        // This alias make sure we don't pull two different versions of monaco-editor
        "monaco-editor": "/node_modules/monaco-editor",
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: "process/browser.js",
        Buffer: ["buffer", "Buffer"],
      }),
      new NodePolyfillPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        /**
         * The default way in which webpack loads wasm files won’t work in a worker,
         * so we will have to disable webpack’s default handling of wasm files and
         * then fetch the wasm file by using the file path that we get using file-loader.
         *
         * Resource: https://pspdfkit.com/blog/2020/webassembly-in-a-web-worker/
         *
         * Alternatively, WASM file can be bundled directly into JavaScript bundle as data URLs.
         * This configuration reduces the complexity of WASM file loading
         * but increases the overal bundle size:
         *
         * {
         *   test: /\.wasm$/,
         *   type: 'asset/inline',
         * }
         */
        {
          test: /\.wasm$/,
          loader: "file-loader",
          type: "javascript/auto", // this disables webpacks default handling of wasm
        },
      ],
    },
  },
};
