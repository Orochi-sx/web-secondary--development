module.exports = {
  '/api': {
    'target': 'http://10.15.111.9:65003/',
    // 'target': 'http://10.15.111.9:12667/',
    'changeOrigin': true,
    'pathRewrite': { '^/api' : '' },
  },
}