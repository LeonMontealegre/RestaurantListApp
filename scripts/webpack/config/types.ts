import type {Configuration} from "webpack";


export type Config = {
    isProd: boolean;
    isDev:  boolean;

    publicRoot: string;
    publicPath: string;
    rootDir:    string;
    buildDir:   string;

    target: Configuration["target"];
    entry:  Configuration["entry"];
    mode:   Configuration["mode"];
    stats:  Configuration["stats"];

    env: Record<string, string>;

    tsOnly?: boolean;
    outputFile?: string;
}
