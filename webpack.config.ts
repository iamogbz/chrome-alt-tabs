import * as CopyWebpackPlugin from "copy-webpack-plugin";
import * as path from "path";
// @ts-expect-error tsc does not play nice with the package
import * as ResponsiveJSONWebpackPlugin from "responsive-json-webpack-plugin";
import { Configuration, WebpackPluginInstance } from "webpack";

const srcFolder = path.resolve("./src");

const configuration: Configuration = {
  devtool: "source-map",
  entry: ["background", "options"].reduce(
    (entries, name) =>
      Object.assign(entries, {
        [name]: ["@babel/polyfill", path.join(srcFolder, name)],
      }),
    {}
  ),
  mode: "production",
  module: {
    rules: [
      {
        exclude: /(node_modules|bower_components)/,
        test: /\.tsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-typescript"],
          },
        },
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "./dist"),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: ["options"].reduce(
        (config, name) => {
          config.push(
            ...["html", "css"].map((ext) => ({
              from: path.join(srcFolder, name, `index.${ext}`),
              to: `${name}.${ext}`,
            }))
          );
          return config;
        },
        [{ from: "./manifest.json" }]
      ),
    }) as unknown as WebpackPluginInstance,
    new ResponsiveJSONWebpackPlugin({
      outputFolder: ".",
      sourceImages: "./assets/images",
      sourceTemplates: "./assets/templates",
    }),
  ],
  resolve: {
    extensions: [".js", ".ts"],
    modules: [srcFolder, path.resolve("./node_modules")],
  },
};

export default configuration;
