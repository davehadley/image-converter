/* config-overrides.js */
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");

module.exports = function override(config, env) {
  // Resolves error:
  // """
  // Module not found: Error: Can't resolve 'path' in
  // '.../image-converter-react/src'
  // BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core
  // modules by default. This is no longer the case. Verify if you need this
  // module and configure a polyfill for it.
  // """
  config.resolve.fallback = { path: require.resolve("path-browserify") };

  // Resolves error:
  // """"
  // Module not found: Error: You attempted to import
  // .../node_modules/path-browserify/index.js which falls outside of the
  // project src/ directory. Relative imports outside of src/ are not
  // supported. You can either move it inside src/, or add a symlink to it
  // from project's node_modules/.
  // """
  // See: https://stackoverflow.com/questions/44114436/the-create-react-app-imports-restriction-outside-of-src-directory
  config.resolve.plugins = config.resolve.plugins.filter(
    (plugin) => !(plugin instanceof ModuleScopePlugin)
  );

  // Suggested by threads.js, however I found that it works without thee plugins
  // see: https://threads.js.org/getting-started
  // config.plugins.push(new ThreadsPlugin());
  // config.module.rules.push({
  //   test: /\.ts$/,
  //   loader: "ts-loader",
  //   options: {
  //     compilerOptions: {
  //       module: "esnext",
  //     },
  //   },
  // });

  return config;
};
