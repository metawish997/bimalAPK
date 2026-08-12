const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withSplitApk(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      const splitsBlock = `
    splits {
        abi {
            reset()
            enable true
            universalApk false
            include "armeabi-v7a", "x86", "arm64-v8a", "x86_64"
        }
    }
`;
      config.modResults.contents = config.modResults.contents.replace(
        /android\s*\{/,
        `android {${splitsBlock}`
      );
    }
    return config;
  });
};
