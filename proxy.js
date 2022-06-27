module.exports = {
  '/api': {
    'target': 'http://10.15.112.2:18088',
    'changeOrigin': true,
    'pathRewrite': { '^/api' : '' },
  },
}