/**
 * Optional Express proxy (SEARCH_API_BASE_URL). The Vite app in src/ does not use these routes;
 * it uses /api/propertysearch via vite.config.ts instead. See workshop-slides.html at repo root.
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import express from "express";
import searchRouter from "./search.js";
import homeRouter from "./home.js";

const app = express();
const PORT = 3001;

app.use("/api", searchRouter);
app.use("/api", homeRouter);

app.listen(PORT, () => {
  console.log(`Express proxy listening on http://localhost:${PORT}`);
  console.log(`  SEARCH_API_BASE_URL = ${process.env.SEARCH_API_BASE_URL ?? "(not set)"}`);
});
