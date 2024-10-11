import MiniCssExtractPlugin from "mini-css-extract-plugin";

import type {Config}        from "./types";
import type {Configuration, RuleSetRule} from "webpack";


/**
 * Creates the webpack configuration for CSS.
 *
 * @param config            The current configuration.
 * @param config.isProd     Indicates whether or not this config is for prod.
 * @param config.isDev      Indicates whether or not this config is for dev.
 * @param config.publicPath The public path.
 * @returns                 The webpack configuration for the CSS-specific rules.
 */
export default ({ isProd, isDev, publicPath }: Config): Configuration => {
    const getStyleLoaders = (cssOptions: { [index: string]: any }): RuleSetRule["use"] => ([
        // Reads right to left
        // So first processes it w/ sass-loader, which turns it into css
        //  then it gets processed into postcss-loader which makes it browser-compatible
        //  and then it goes through css-loader to actually load it into the jsbundle
        //  then shoots it into mini-css-extract-plugin to extract it out of the bundle and into a separate file
        isDev && "style-loader",
        isProd && {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath, },
        },
        {
            loader: "css-loader",
            options: cssOptions,
        },
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        "postcss-preset-env",
                    ],
                },
            },
        },
        "sass-loader",
    ].filter(Boolean));

    return {
        module: {
            rules: [
                // SCSS/CSS i.e. global CSS files
                {
                    // Test for: .sass, .scss, or .css
                    test: /\.(s[ac]|c)ss$/i,
                    exclude: /\.module\.(s[ac]|c)ss$/i,
                    use: getStyleLoaders({
                        importLoaders: 2,
                        modules:       {
                            mode: "icss",
                        },
                    })
                },
                // SCSS/CSS MODULES i.e. CSS with classnames that are referenced
                {
                    // Test for: .module.sass, .module.scss, or .module.css
                    test: /\.module\.(s[ac]|c)ss$/i,
                    use: getStyleLoaders({
                        importLoaders: 2,
                        modules: {
                            mode: "local",
                            exportLocalsConvention: "as-is",
                        },
                        esModule: false,  // This is the magic that got it to export in default somehow
                    })
                }
            ]
        },

        plugins: [
            isProd && new MiniCssExtractPlugin({
                // Extract the css to /static/css/
                filename:      "static/css/[name].[contenthash:8].css",
                chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
            }),
        ].filter(Boolean),
    };
}
