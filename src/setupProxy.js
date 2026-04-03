const { createProxyMiddleware } = require("http-proxy-middleware");

const target = process.env.REACT_APP_API_TARGET || "https://localhost:8443";

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        "^/api": "",
      },
    }),
  );
};
