const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    entry: "./src/index.js",
    devServer: {
        contentBase: "./",
        compress: true,
        port: 9000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
    ],
    mode: "development",
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.svg/,
                type: "asset",
            },
        ],
    },
    resolve: {
        modules: [
            path.resolve(__dirname, "src/Features/Upcoming/ImportMaps"),
            path.resolve(__dirname, "src"),
            "node_modules",
        ],
    },
};
