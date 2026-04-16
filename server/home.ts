import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/homes/:zpid", async (req, res) => {
  const { zpid } = req.params;

  const body = new URLSearchParams({
    query: `zpid:${zpid}`,
    context: "FOR_SALE",
    client: "qa",
    limit: "1",
    returnFields: "zpid,address,latLong,price,bedrooms,bathrooms,homeType,description,photos",
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
      console.error("Home detail error", resp.status, text);
      return res.status(502).json({ error: "Home detail error", detail: text.slice(0, 200) });
    }

    const data = await resp.json();
    return res.json(data);
  } catch (err) {
    console.error("Home detail fetch failed", err);
    return res.status(500).json({ error: String(err) });
  }
});

export default router;
