/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DEX_SCREENER: process.env.DEX_SCREENER,
    GASPRICE_URL: process.env.GASPRICE_URL,
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    USDC_T0KEN_PAIR: process.env.USDC_T0KEN_PAIR,
    CODE_BYTES: process.env.CODE_BYTES,
  },
};

export default nextConfig;
