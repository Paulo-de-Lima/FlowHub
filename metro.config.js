const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// OneDrive no Windows pode quebrar symlinks/junctions no node_modules.
config.resolver.unstable_enableSymlinks = false;

module.exports = config;
