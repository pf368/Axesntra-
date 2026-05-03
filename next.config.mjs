/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/resources/what-is-carrier-risk-intelligence', destination: '/resources', permanent: true },
      { source: '/resources/crash-history-vs-inspection-history', destination: '/resources', permanent: true },
      { source: '/resources/how-to-evaluate-whether-a-carrier-is-safe', destination: '/resources', permanent: true },
      { source: '/resources/why-one-time-carrier-screening-is-not-enough', destination: '/resources', permanent: true },
      { source: '/resources/how-to-read-a-carrier-risk-report', destination: '/resources', permanent: true },
      { source: '/resources/what-does-out-of-service-mean-in-trucking', destination: '/resources', permanent: true },
    ];
  },
};

export default nextConfig;
