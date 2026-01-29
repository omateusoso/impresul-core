/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    // Optional: Change this if you deploy to a subdirectory (e.g. /impresul-core)
    // basePath: '/impresul-core',
};

module.exports = nextConfig;
