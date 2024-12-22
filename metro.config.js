const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
config.resolver.extraNodeModules = {
  stream: require.resolve("readable-stream"),
  crypto: require.resolve("crypto-browserify"),
};

module.exports = withNativeWind(config, { input: './global.css' });
