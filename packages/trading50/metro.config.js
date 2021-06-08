// Export External module..
// React native doesnt support npm link https://medium.com/@slavik_210/symlinks-on-react-native-ae73ed63e4a7
// So this is a workaround.

const path = require("path");
const extraNodeModules = {
  core: path.resolve(__dirname + "/../core/"),
  // add here a new module.
};
const watchFolders = [
  path.resolve(__dirname + "/../core/"),
  // add here the new module
];

module.exports = {
  transformer: {
    assetPlugins: ["expo-asset/tools/hashAssetFiles"],
  },
  resolver: {
    extraNodeModules,
  },
  watchFolders,
};
