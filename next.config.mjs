/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*",
				// probably not a good idea but good for dev time ig
			},
		],
	},
};

export default nextConfig;
