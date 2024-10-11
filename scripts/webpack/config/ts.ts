import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import ReactRefreshTypescript    from "react-refresh-typescript";
import Asdf from "babel-preset-react-app/webpack-overrides";

import getAliases from "../../utils/getAliases.js";

import type {Config}        from "./types.js";
import type {Configuration} from "webpack";
import webpack from "webpack";


/**
 * Returns the typescript webpack configuration.
 *
 * @param config         The current configuration.
 * @param config.rootDir The current root directory.
 * @param config.isDev   Whether or not this is running in a development environment.
 * @returns              The webpack configuration for the TypeScript-specific rules.
 */
export default ({ rootDir, isDev }: Config): Configuration => ({
    module: {
        rules: [{
            // Test for: .ts, .tsx, .js, .jsx
            test: /\.[jt]sx?$/,

            // Do not want to process anything from node_modules
            exclude: /node_modules/,

            // Loads from bottom to top:
            //  So it first goes through the ts-loader to become js
            //  and then goes through babel-loader to transpile it
            //
            //  Babel: the defacto-standard for compiling JS to support older versions with newer syntax
            use: [
                {
                    loader: "babel-loader",

                    // Configuration for babel
                    options: {
                        // customize: require.resolve(
                        //   'babel-preset-react-app/webpack-overrides'
                        // ),
                        presets: [
                            "@babel/preset-env",
                            // runtime: automatic => makes it so you don't have to `import React` in every tsx file
                            ["@babel/preset-react", { runtime: "automatic" }],
                            "@babel/typescript",
                        ],
                        plugins: [
                            ...(isDev ? ["react-refresh/babel"] : []),
                        ],
                    },
                },
                // {
                //     loader:  "ts-loader",
                //     options: {
                //         getCustomTransformers: () => ({
                //             before: (isDev ? [ReactRefreshTypescript()] : []),
                //         }),
                //     },
                // },
            ],
        }],
    },

    plugins: [
        // Setup hot-module refreshing
        ...(isDev ? [
            new webpack.HotModuleReplacementPlugin(),
            new ReactRefreshWebpackPlugin(),
        ] : []),
    ],

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],

        // Retrieve the TypeScript paths
        alias: getAliases(rootDir),
    },
});
