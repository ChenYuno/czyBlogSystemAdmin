module.exports = {
    devServer: {
        port: 8080,
        proxy: {
            '/user': {
                target: 'http://localhost:8231',//TODO:To development environment configuration
                changeOrigin: true
            },
            '/admin': {
                target: 'http://localhost:8231',
                changeOrigin: true
            },
            '/portal': {
                target: 'http://localhost:8231',
                changeOrigin: true
            },
        }
    }
}