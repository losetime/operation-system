let path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const {
  override,
  overrideDevServer,
  fixBabelImports,
  addWebpackModuleRule,
  addWebpackAlias,
  addWebpackPlugin,
} = require('customize-cra')
process.env.GENERATE_SOURCEMAP = 'false' // 去掉static文件内的map文件

const env = process.env.REACT_APP_ENV // 当前环境

// const timeStamp = new Date().getTime()

const addCustomize = () => (config) => {
  config.entry = {
    index:
      env === 'development'
        ? [require.resolve('react-dev-utils/webpackHotDevClient'), './src/index.js']
        : './src/index.js',
    mobile:
      env === 'development'
        ? [require.resolve('react-dev-utils/webpackHotDevClient'), './src/mobile/index.js']
        : './src/mobile/index.js',
  }
  config.output = {
    path: __dirname + '/build',
    filename: `static/js/[name].[hash:8].js`,
    chunkFilename: `static/js/[name].[contenthash:8].chunk.js`,
  }
  return config
}

// 设置网站标题和图标
let documentTitle = ''
let documentFavicon = ''
if (env === 'qa') {
  documentTitle = '测试 | 运营操作平台'
  documentFavicon = path.resolve(__dirname, 'public/favicon_beta.ico')
} else {
  documentTitle = '货当当 | 运营操作平台'
  documentFavicon = path.resolve(__dirname, 'public/favicon.ico')
}

// 移除HtmlWebpackPlugin(必须先移除，不然不能使用addWebpackPlugin去修改)
const removeHtmlWebpackPlugin = () => {
  return (config) => {
    config.plugins = config.plugins.filter(
      (p) => p.constructor.name !== 'HtmlWebpackPlugin' && p.constructor.name !== 'ManifestPlugin'
    )
    return config
  }
}

// 修改devServer
const changeDevServer = () => (config) => {
  config.historyApiFallback = {
    disableDotRule: true,
    rewrites: [
      { from: /^\/index.html/, to: '/build/index.html' },
      { from: /^\/mobile.html/, to: '/build/mobile.html' },
    ],
  }
  return config
}

module.exports = {
  webpack: override(
    removeHtmlWebpackPlugin(),
    // 针对antd 实现按需打包：根据import来打包 (使用babel-plugin-import)
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      // 自动打包相关的样式 默认为 style:'css'
      // 当为css时，加载的是编译后的css文件，不能使用主题的变化
      // 当为ture时，则加载less文件
      style: true,
    }),
    // fixBabelImports('import', {
    //   libraryName: 'antd-mobile',
    //   libraryDirectory: 'es',
    //   // 自动打包相关的样式 默认为 style:'css'
    //   // 当为css时，加载的是编译后的css文件，不能使用主题的变化
    //   // 当为ture时，则加载less文件
    //   style: true,
    // }),
    // 配置路径别名
    addWebpackAlias({
      '@': path.join(__dirname, 'src'),
    }),
    // 使用less-loader对源码重的less的变量进行重新制定，设置antd自定义主题
    // addLessLoader({
    //     lessOptions: {
    //         // less3.0之后，默认为false，所以需要手动开启
    //         javascriptEnabled: true,
    //         modifyVars: { '@primary-color': '#E92712' }
    //     }
    // })
    addWebpackPlugin(
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, 'public/index.html'),
        title: documentTitle,
        favicon: documentFavicon,
        chunks: ['index'],
      })
    ),
    addWebpackPlugin(
      new HtmlWebpackPlugin({
        filename: 'mobile.html',
        template: path.resolve(__dirname, 'public/mobile.html'),
        title: documentTitle,
        favicon: documentFavicon,
        chunks: ['mobile'],
      })
    ),
    addWebpackModuleRule({
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              // less3.0之后，默认为false，所以需要手动开启
              javascriptEnabled: true,
              dark: false, // 暗黑模式
              modifyVars: { '@primary-color': '#5178DF' },
            },
          },
        },
        {
          loader: 'style-resources-loader',
          options: {
            patterns: [path.resolve(__dirname, './src/style/global.less')],
          },
        },
      ],
    }),
    addCustomize()
  ),
  devServer: overrideDevServer(changeDevServer()),
}
