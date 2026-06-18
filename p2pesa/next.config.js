// Next.js config (JavaScript)
const webpack = require('webpack');

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allow any HTTPS image (Nostr profile pictures)
      },
    ],
  },
  // bitcoinjs-message (Story 1.2 wallet verification) relies on the Node `Buffer`
  // global, which webpack 5 / Next.js does not provide in the browser by default.
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve('buffer/'),
    };
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    );
    return config;
  },
};

module.exports = nextConfig;
