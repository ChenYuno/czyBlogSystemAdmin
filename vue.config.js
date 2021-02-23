module.exports = {
    devServer: {
        port: 8080,
        proxy: {
            '/user': {
                target: 'http://localhost:9000',
                changeOrigin: true
            },
            '/admin': {
                target: 'http://localhost:9000',
                changeOrigin: true
            },
            '/portal': {
                target: 'http://localhost:9000',
                changeOrigin: true
            },
        }
    }
}