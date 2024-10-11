import {rmSync} from "fs";
import chalk from "chalk";
import startWebpack from "./webpack/index.js";


// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";


// CLI
(async () => {
    // Clear build directory first
    rmSync("build/site", { recursive: true, force: true });

    console.log();
    await startWebpack(".", "production", true, "/RestaurantListApp/");
    console.log(`${chalk.greenBright("Done!")}`);
})();
