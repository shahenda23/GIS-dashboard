module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.optimization.minimize = false;

      webpackConfig.module.rules = webpackConfig.module.rules.map(rule => {
        // Prevent source-map-loader from processing node_modules
        if (rule.enforce === 'pre') {
          return { ...rule, exclude: /node_modules/ };
        }

        // Prevent Babel from transforming maplibre-gl (it ships pre-built ESM)
        if (rule.oneOf) {
          return {
            ...rule,
            oneOf: rule.oneOf.map(oneOfRule => {
              if (
                oneOfRule.loader &&
                oneOfRule.loader.includes('babel-loader') &&
                !oneOfRule.include
              ) {
                const original = oneOfRule.exclude;
                return {
                  ...oneOfRule,
                  exclude: (path) => {
                    if (/node_modules[\\/]maplibre-gl/.test(path)) return true;
                    if (typeof original === 'function') return original(path);
                    if (original instanceof RegExp) return original.test(path);
                    return false;
                  },
                };
              }
              return oneOfRule;
            }),
          };
        }

        return rule;
      });

      return webpackConfig;
    },
  },
};
