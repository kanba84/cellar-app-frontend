const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://cellar-app.local:8080",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "",
      },
    }),
  );
};
