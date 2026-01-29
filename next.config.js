/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Optional: Change this if you deploy to a subdirectory (e.g. /impresul-core)
    // basePath: '/impresul-core',
};

module.exports = nextConfig;
