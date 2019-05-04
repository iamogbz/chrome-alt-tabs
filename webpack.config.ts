import * as CopyWebpackPlugin from "copy-webpack-plugin";
import * as path from "path";
// import ResponsiveJSONWebpackPlugin from "responsive-json-webpack-plugin";
import { Configuration } from "webpack";

const srcFolder = path.resolve("./src");
const outputFolder = path.resolve(__dirname, "./dist");

const configuration: Configuration = {
    devtool: "source-map",
    entry: ["background", "options"].reduce(
        (entries, name) =>
            Object.assign(entries, {
                [name]: ["@babel/polyfill", path.join(srcFolder, name)],
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
        path: outputFolder,
    },
    plugins: [
        new CopyWebpackPlugin(
            ["options"].reduce(
                (config, name) => {
                    config.push(
                        ...["html", "css"].map(ext => ({
                            from: path.join(srcFolder, name, `index.${ext}`),
                            to: `${name}.${ext}`,
                        })),
                    );
                    return config;
                },
                [{ from: "./manifest.json" }],
            ),
        ),
        // new ResponsiveJSONWebpackPlugin({ outputFolder }),
    ],
    resolve: {
        extensions: [".js", ".ts"],
        modules: [srcFolder, path.resolve("./node_modules")],
    },
};

export default configuration; // tslint:disable-line
