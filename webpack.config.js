const path = require('path')

module.exports = {
    entry:{ 
      'components': './src/views/components.js',
      'homepage': './src/views/homepage.js',
      'index-records': './src/views/index-records.js',
      'index-statistics': './src/views/index-statistics.js',
    },
    mode: 'development',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: './js/[name].bundle.js',
    },
    devtool: 'eval-source-map',
    devServer: {
      allowedHosts: 'all',
      static: {
        directory: path.join(__dirname, 'dist'),
        publicPath: "http://localhost:8080/dist/",
      },
      compress: true,
      port: 8080,
      liveReload: true,
      hot: false,
    },
}