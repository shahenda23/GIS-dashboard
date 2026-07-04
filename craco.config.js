module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.optimization.minimize = false;

      // Prevent source-map-loader from processing maplibre-gl (causes _toArray error)
      webpackConfig.module.rules = webpackConfig.module.rules.map(rule => {
        if (rule.enforce === 'pre') {
          return { ...rule, exclude: /node_modules/ };
        }
        return rule;
      });

      return webpackConfig;
    },
  },
};
