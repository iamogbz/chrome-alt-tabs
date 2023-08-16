import CopyWebpackPlugin from "copy-webpack-plugin";
import * as path from "path";
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";
import { Configuration, WebpackPluginInstance } from "webpack";
import imagesJson from "./assets/templates/images.json";

const srcFolder = path.resolve("./src");

const configuration: Configuration = {
  devtool: "source-map",
  entry: ["background", "options"].reduce(
    (entries, name) =>
      Object.assign(entries, {
        [name]: [
          "core-js/stable",
          "regenerator-runtime/runtime",
          path.join(srcFolder, name),
        ],
      }),
    {},
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
            })),
          );
          return config;
        },
        [
          { from: "./manifest.json" },
          ...Object.keys(imagesJson).map((from) => ({ from })),
        ],
      ),
    }) as unknown as WebpackPluginInstance,
  ],
  optimization: {
    minimizer: [
      ...Object.entries(imagesJson).map(([imgSrc, imgConfig]) => {
        const fileType = path.extname(imgSrc).substring(1);
        return new ImageMinimizerPlugin<unknown>({
          generator: imgConfig.sizes.map((size) => ({
            type: "asset",
            implementation: async (original, options) => {
              const result = await ImageMinimizerPlugin.sharpGenerate(
                original,
                options,
              );
              const fileExt = path.extname(result.filename);
              result.filename = `${imgConfig.name}${size}${fileExt}`;
              return result;
            },
            options: {
              encodeOptions: {
                [fileType]: {
                  quality: 100,
                },
              },
              resize: {
                enabled: true,
                height: size,
                width: size,
              },
            },
          })),
        });
      }),
    ],
  },
  resolve: {
    extensions: [".js", ".ts"],
    modules: [srcFolder, path.resolve("./node_modules")],
  },
};

export default configuration;
