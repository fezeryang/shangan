import { buildApp } from "./server";

// Vercel 函数入口源码：由 esbuild 打包为 api/index.cjs（见 package.json build:api）
export default buildApp();
