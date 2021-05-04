const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./index.js",
    devServer: {
        contentBase: "./",
        compress: true,
        port: 9000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            base:"https://dineshannadurai.github.io/play-ground/",
            template: "./index.html",
        }),
    ],
};
