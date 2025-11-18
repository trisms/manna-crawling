import express from "express";
import * as path from "path";
import history from "connect-history-api-fallback";
import compression from "compression";
import ip from "ip";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.resolve();
const DIST_PATH =
  process.env.NODE_ENV === "development"
    ? path.join(__dirname, "dist")
    : path.join(__dirname, "manna-crawling", "dist");

const DIST_INDEX_PATH =
  process.env.NODE_ENV === "development"
    ? path.join(__dirname, "dist", "index.html")
    : path.join(__dirname, "manna-crawling", "dist", "index.html");

const app = express();

app.use(compression());
app.use(
  history({
    rewrites: [
      {
        from: /^\/(?!assets\/).*/, // /assets/로 시작하지 않는 모든 요청만 index.html로 rewrite
        to: "/index.html",
      },
    ],
  })
);
app.use(
  express.static(DIST_PATH, {
    maxAge: "7d", // 캐싱 적용
    etag: true,
    index: false,
  })
);

app.get(/.*/, (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("max-age", "60");
  res.sendFile(DIST_INDEX_PATH);
});

const PORT = 4100;

app.listen(PORT, () => {
  console.log(
    `Server running at ${process.env.NODE_ENV === "development" ? `http://localhost:${PORT}` : `http://${ip.address()}:${PORT}`}`
  );
});
