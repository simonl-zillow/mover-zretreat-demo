import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/search", async (req, res) => {
  const { city = "SEATTLE,WA", limit = "30" } = req.query as Record<string, string>;

  const body = new URLSearchParams({
    query: `location=city:${city}`,
    context: "FOR_SALE",
    client: "qa",
    limit: String(limit),
    returnFields: "zpid,address,latLong,price,bedrooms,bathrooms,homeType,photos",
  });

  try {
    const resp = await fetch(
      `${process.env.SEARCH_API_BASE_URL}/api/v1/search`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      }
    );

    if (!resp.ok) {
      const text = await resp.text();
      console.error("Search API error", resp.status, text);
      return res.status(502).json({ error: "Search API error", detail: text.slice(0, 200) });
    }

    const data = await resp.json();
    return res.json(data);
  } catch (err) {
    console.error("Search API fetch failed", err);
    return res.status(500).json({ error: String(err) });
  }
});

export default router;
