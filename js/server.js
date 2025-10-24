

// server.js
import express from "express";

const app = express();

// 1) Servera statiska filer från projektroten (där index.html ligger)
app.use(express.static("./"));

// 2) Hälsokoll
app.get("/api/ping", (req, res) => {
  console.log("[ping] hit");
  res.json({ ok: true, ts: new Date().toISOString() });
});

// 3) Proxy: stop-finder
app.get("/api/stop-finder", async (req, res) => {
  try {
    const url =
      "https://journeyplanner.integration.sl.se/v2/stop-finder?" +
      new URLSearchParams(req.query);
    console.log("[proxy] GET", url);

    const r = await fetch(url);
    const body = await r.arrayBuffer(); // läs in buffert en gång

    // Vidarebefordra status + content-type
    res.status(r.status);
    const ct = r.headers.get("content-type");
    if (ct) res.setHeader("content-type", ct);

    res.send(Buffer.from(body));
  } catch (e) {
    console.error("[proxy] stop-finder error:", e);
    res.status(500).json({ error: "Proxy error", detail: String(e) });
  }
});

// 4) Proxy: trips
app.get("/api/trips", async (req, res) => {
  try {
    const url =
      "https://journeyplanner.integration.sl.se/v2/trips?" +
      new URLSearchParams(req.query);
    console.log("[proxy] GET", url);

    const r = await fetch(url);
    const body = await r.arrayBuffer();

    res.status(r.status);
    const ct = r.headers.get("content-type");
    if (ct) res.setHeader("content-type", ct);

    res.send(Buffer.from(body));
  } catch (e) {
    console.error("[proxy] trips error:", e);
    res.status(500).json({ error: "Proxy error", detail: String(e) });
  }
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`🔌 Server på http://localhost:${PORT}  (Ctrl+C för att stoppa)`)
);
