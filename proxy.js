module.exports = {
  '/api': {
    'target': 'http://10.15.111.9:12892/',
    'changeOrigin': true,
    'pathRewrite': { '^/api' : '' },
  },
}
