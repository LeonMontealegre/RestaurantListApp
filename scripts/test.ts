import yargs from "yargs/yargs";
import jest from "jest";
import getEnv from "./utils/env";
import getAliases from "./utils/getAliases";
import path from "path";


// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "test";
process.env.NODE_ENV = "test";


// CLI
(async () => {
    const argv = await yargs(process.argv.slice(2))
        .boolean("ci")
        .argv;

    const ci = argv.ci;

    const dirs = argv._.map(v => `${v}`);
    const flags = {
        ci, watch: (dirs.length === 1 && !ci)
    };

    // Ensure all environment variables are read
    getEnv(".", "");

    console.log();
    await jest.runCLI({
        ...argv,
        ...flags,
        config: JSON.stringify({
            "preset": "ts-jest",
            "testEnvironment": "jsdom",
            "moduleNameMapper": getAliases(path.resolve(process.cwd(), "tests"), "jest"),
        }),
    }, dirs);
})();
