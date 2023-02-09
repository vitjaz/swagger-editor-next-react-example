const path = require("node:path");
const webpack = require("webpack");

module.exports = {
  webpack: {
    plugins: {
      add: [
        new webpack.ProgressPlugin({
          activeModules: false,
          entries: true,
          handler(percentage, message, ...args) {
            console.info(percentage, message, ...args);
          },
          modules: true,
          modulesCount: 5000,
          profile: false,
          dependencies: true,
          dependenciesCount: 10000,
          percentBy: null,
        }),
        new webpack.ProvidePlugin({
          process: "process/browser.js",
          Buffer: ["buffer", "Buffer"],
        }),
      ]
    },
    configure: (webpackConfig, { env, paths }) => {
      const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

      webpackConfig.entry = {
        main: paths.appIndexJs,
        "apidom.worker": "@swagger-api/swagger-editor/apidom.worker",
        "editor.worker": "@swagger-api/swagger-editor/editor.worker",
      };

      // needed because we use multiple entries
      webpackConfig.output.filename = env === "production"
          ? "static/js/[name].[contenthash:8].js"
          : env === "development" && "static/js/[name].js";

      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        path: false,
        fs: false,
        http: require.resolve("stream-http"), // required for asyncapi parser
        https: require.resolve("https-browserify"), // required for asyncapi parser
        stream: require.resolve("stream-browserify"),
        util: require.resolve("util"),
        zlib: false,
      };

      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        // This alias doesn't pull any languages into bundles and works as monaco-editor-core was installed
        "monaco-editor$": "monaco-editor/esm/vs/editor/edcore.main.js",
        // This alias make sure we don't pull two different versions of monaco-editor
        "monaco-editor": "/node_modules/monaco-editor",
      };

      webpackConfig.module.rules.push(
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
      );

      if (shouldUseSourceMap) {
        webpackConfig.module.rules[0].exclude = [
          /@babel(?:\/|\\{1,2})runtime/,
          /vscode-languageclient/,
          /vscode-languageserver-protocol/,
          /vscode-jsonrpc/,
          /unraw/,
          /autolinker/,
          /@jsdevtools\/ono/,
        ];
      }

      return webpackConfig;
    },
  },
};
