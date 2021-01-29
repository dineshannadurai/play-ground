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
            title: "Output Management",
            inject: true,
            template: "./index.html",
        }),
    ],
};
