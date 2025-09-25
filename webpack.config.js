const path = require("path");

const WrapperPlugin = require("wrapper-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env) => {
  const devMode = !env.production;

  let config = {
    mode: env.production ? "production" : "development",
    watch: !env.production,
    devtool: env.production ? false : "eval-cheap-source-map",
    target: ["web", "es2025"],
    entry: {
      app: ["./src/app/polyfill.js", "./src/app/main.js"],
    },

    plugins: [],

    devServer: !env.production
      ? {
          contentBase: path.join(__dirname, "dist"),
          compress: true,
          port: 8001,
        }
      : void 0,

    module: {
      rules: [
        {
          test: /\.s?css$/,
          use: [
            "to-string-loader",
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: ["cssnano"],
                },
              },
            },
            "sass-loader",
          ],
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: {
            loader: "html-loader",
            options: {
              // interpolate: true,
              minimize: true,
            },
          },
        },
        {
          test: /\.js$/,
          loader: "babel-loader",
          options: {
            plugins: ["syntax-dynamic-import"],
            presets: [
              [
                "@babel/preset-env",
                {
                  modules: false,
                },
              ],
            ],
          },
          resolve: {
            extensions: [".js", ".jsx"],
            alias: {
              "@/lib": path.resolve(__dirname, "src/lib/"),
              "@/data": path.resolve(__dirname, "src/data/"),
              "@/components": path.resolve(__dirname, "src/components/"),
              "@/services": path.resolve(__dirname, "src/services/"),
            },
          },
        },
      ],
    },

    output: {
      filename: "app.js",
      path: path.resolve(__dirname, "dist"),
      iife: env.production,
      ignoreBrowserWarnings: env.production,
    },
  };

  if (!env.production) {
    config.plugins.push(
      new WrapperPlugin({
        test: /\.js$/,
        header: "function run() { \n",
        footer: "\n};",
      })
    );

    config.optimization = {
      minimizer: [],
    };
  } else {
    config.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        }),
      ],
    };
  }
  return config;
};
