module.exports = {
  '/api': {
    'target': 'http://10.15.111.12:12201/',
    'changeOrigin': true,
    'pathRewrite': { '^/api' : '' },
    logLevel: 'debug'
  },
}
