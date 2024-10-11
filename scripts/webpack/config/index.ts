import FriendlyErrorsWebpackPlugin from "friendly-errors-webpack-plugin";
import WorkboxWebpackPlugin        from "workbox-webpack-plugin";
import webpack                     from "webpack";
import fs                          from "fs";

import mergeDeep from "../../utils/merge.js";

import CSSConfig  from "./css.js";
import HTMLConfig from "./html.js";
import IMGConfig  from "./img.js";
import TSConfig   from "./ts.js";

import type {Config}        from "./types";
import type {Configuration} from "webpack";


/**
 * Creates the webpack configuration.
 *
 * @param config The current configuration.
 * @returns      The webpack configuration.
 */
export default (config: Config): Configuration => {
    const { entry, isDev, isProd, mode, target, publicRoot, buildDir, rootDir, stats, env, tsOnly, outputFile } = config;

    const swSrc = `${rootDir}/src/service-worker.ts`;

    const outputName = (outputFile ?? "static/js/[name].[contenthash:8]");

    return mergeDeep(
        {
            mode, target, entry, stats,

            output: {
                path: buildDir,
                publicPath: publicRoot,

                // Extract the JS to /static/js/
                filename:      (isProd ? `${outputName}.js`       : undefined),
                chunkFilename: (isProd ? `${outputName}.chunk.js` : undefined),
            },

            plugins: [
                new FriendlyErrorsWebpackPlugin(),

                // Stringify environment variables
                new webpack.DefinePlugin({
                    "process.env": Object.fromEntries(
                        Object.entries(env).map(
                            ([key, val]) => [key, JSON.stringify(val)]
                        )
                    )
                }),

                isProd && fs.existsSync(swSrc) && new WorkboxWebpackPlugin.InjectManifest({
                    swSrc,
                    exclude: [/\.map$/, /LICENSE/],
                })
            ],

            infrastructureLogging: {
                level: "error",
            },

            devtool: (isDev || tsOnly ? "source-map" : undefined),
        },
        !tsOnly ? IMGConfig(config) : {},
        !tsOnly ? CSSConfig(config) : {},
          TSConfig(config),
        !tsOnly ? HTMLConfig(config) : {},
    );
}
