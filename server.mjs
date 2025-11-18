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
    : path.join(__dirname, "dist");

const app = express();

app.use(compression());
app.use(history());
app.use(express.static(DIST_PATH));

const PORT = 4100;

app.listen(PORT, () => {
  console.log(
    `Server running at ${process.env.NODE_ENV === "development" ? `http://localhost:${PORT}` : `http://${ip.address()}:${PORT}`}`
  );
});
