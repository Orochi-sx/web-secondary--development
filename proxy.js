module.exports = {
  '/api': {
    'target': 'http://69.230.205.12:18080/',
    'changeOrigin': true,
    'pathRewrite': { '^/api' : '' },
  },
}
