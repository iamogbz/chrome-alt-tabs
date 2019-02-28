import * as path from "path";
import { Configuration } from "webpack";
import * as CopyWebpackPlugin from "copy-webpack-plugin";

const config: Configuration = {
    mode: "production",
    entry: ["background", "options"].reduce(
        (entries, name) =>
            Object.assign(entries, {
                [name]: ["@babel/polyfill", `./src/${name}`],
            }),
        {},
    ),
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "./dist"),
    },
    resolve: {
        extensions: [".js", ".ts"],
        modules: [path.resolve("./src"), path.resolve("./node_modules")],
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
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-typescript"],
                    },
                },
            },
        ],
    },
    devtool: "source-map",
};

export default config;
