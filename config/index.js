// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../docs/index.html'),
    assetsRoot: path.resolve(__dirname, '../docs'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/qrelation/',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 9005,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: { 
			
						'/utopia/': {     
								// target: 'http://172.16.238.129:8080/case',
								target: 'http://47.105.36.183:8088/utopia',
								// target: 'http://192.168.31.213:8080/case',
								
								// target: 'http://172.24.78.68:8085/offices/api',

								 changeOrigin: true,//（允许跨域，如果这不写，调用接口接口时会有跨域错误说缺少请求头）
						
						pathRewrite: {'^/utopia/': '' } //（路由规则下面详细介绍）
						},
                        '/upload/': {     
                                // target: 'http://172.16.238.129:8080/case',
                                target: 'http://47.105.36.183:8888/upload',
                                // target: 'http://192.168.31.213:8080/case',
                                
                                // target: 'http://172.24.78.68:8085/offices/api',

                                 changeOrigin: true,//（允许跨域，如果这不写，调用接口接口时会有跨域错误说缺少请求头）
                        
                        pathRewrite: {'^/upload/': '' } //（路由规则下面详细介绍）
                        }
						
		},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
