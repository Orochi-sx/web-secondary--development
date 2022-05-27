module.exports = {
  '/api': {
    'target': 'http://192.168.1.240:43210/',
    'changeOrigin': true,
    'pathRewrite': { '^/api' : '' },
  },
}