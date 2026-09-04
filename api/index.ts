import { buildApp } from "../server.js";

// Vercel Serverless Function 入口：@vercel/node 检测到 Express 默认导出后自动接管路由
export default buildApp();
