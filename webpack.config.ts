import * as CopyWebpackPlugin from "copy-webpack-plugin";
import * as path from "path";
import { Configuration } from "webpack";

const configuration: Configuration = {
    devtool: "source-map",
    entry: ["background", "options"].reduce(
        (entries, name) =>
            Object.assign(entries, {
                [name]: ["@babel/polyfill", `./src/${name}`],
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
        new CopyWebpackPlugin(
            ["options"].reduce(
                (config, name) => {
                    config.push(
                        ...["html", "css"].map(ext => ({
                            from: `./src/${name}/index.${ext}`,
                            to: `${name}.${ext}`,
                        })),
                    );
                    return config;
                },
                [
                    { from: "./manifest.json" },
                    { from: "./assets/images/icon.*.png", to: "[name].[ext]" },
                ],
            ),
        ),
    ],
    resolve: {
        extensions: [".js", ".ts"],
        modules: [path.resolve("./src"), path.resolve("./node_modules")],
    },
};

export default configuration; // tslint:disable-line
