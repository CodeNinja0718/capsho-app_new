module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/',

  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },

  transpileDependencies: [
    'quasar'
  ]
}
