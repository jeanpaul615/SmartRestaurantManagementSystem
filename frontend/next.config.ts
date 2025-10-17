import path from 'path';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Explicitly set Turbopack root to this frontend folder so Next doesn't
  // infer the workspace root incorrectly when multiple lockfiles exist.
  turbopack: {
    // use an absolute path - Turbopack requires an absolute root on Windows
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
