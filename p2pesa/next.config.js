// Next.js config (JavaScript)
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allow any HTTPS image (Nostr profile pictures)
      },
    ],
  },
};

module.exports = nextConfig;
