import startWebpack from "./webpack/index.js";

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

// CLI
(async () => {
    startWebpack(".", "development", true);
})();
