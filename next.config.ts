import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Bundle the CSV data files with the /api/lotteries serverless function
   * so that process.cwd()-based reads work in Netlify / Vercel Lambda.
   */
  outputFileTracingIncludes: {
    "/api/lotteries": ["./data/**/*"],
  },
};

export default nextConfig;
