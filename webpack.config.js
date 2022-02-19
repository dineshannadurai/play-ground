const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    entry: "./src/index.js",
    devServer: {
        static: {
            directory: path.join(__dirname, "public"),
        },
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
