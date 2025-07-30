
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: [
      "https://6000-firebase-studio-1753750407830.cluster-isls3qj2gbd5qs4jkjqvhahfv6.cloudworkstations.dev"
    ],
  },
};

export default nextConfig;
