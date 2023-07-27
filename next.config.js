/** @type {import('next').NextConfig} */

const path = require('path')
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    fiber: false,
    includePaths: [path.join(__dirname, 'styles')],
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.glsl$/,
      loader: 'webpack-glsl-loader'
    })

    return config
  },
}

module.exports = nextConfig