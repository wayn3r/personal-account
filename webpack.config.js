const path = require('path')
const fs = require('fs')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const NodemonPlugin = require('nodemon-webpack-plugin')

// excluyendo todos los paquetes en node_modules del empaquetado de webpack
const externals = {}
fs.readdirSync(path.resolve(__dirname, 'node_modules'))
    .filter(x => ['.bin'].indexOf(x) === -1)
    .forEach(mod => {
        externals[mod] = `commonjs ${mod}`
    })

module.exports = {
    entry: path.resolve(__dirname, 'src', 'app.ts'),
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [{ test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ }],
    },
    mode: 'development',
    target: 'node',
    externals,
    resolve: {
        extensions: ['.js', '.ts', '.json'],
        plugins: [new TsconfigPathsPlugin()],
    },
    plugins: [new NodemonPlugin()],
}
