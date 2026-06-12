import { Router, type IRouter } from "express";

const router: IRouter = Router();

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

const COLOR: Record<string, number> = {
  visit:    0x3b82f6,
  language: 0x8b5cf6,
  modal:    0x06b6d4,
  token:    0x22c55e,
  access:   0xf59e0b,
};

/* ── In-memory counters ─────────────────────────────── */
const counters = {
  visits:  Math.floor(Math.random() * 3000) + 8000, // start realistic
  tokens:  0,
  access:  0,
};

router.post("/log", async (req, res) => {
  if (!WEBHOOK_URL) {
    res.status(503).json({ error: "Webhook not configured" });
    return;
  }

  const { event, data } = req.body as { event: string; data: Record<string, string> };

  if (!event) {
    res.status(400).json({ error: "Missing event" });
    return;
  }

  /* Increment counters */
  if (event === "visit")  counters.visits++;
  if (event === "token")  counters.tokens++;
  if (event === "access") counters.access++;

  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "unknown";

  const lang = data?.lang || "—";
  const game = data?.game || "—";
  const ua   = req.headers["user-agent"] || "—";

  const titles: Record<string, string> = {
    visit:    "🌐 New Visit",
    language: `🌍 Language Selected — ${lang.toUpperCase()}`,
    modal:    `🎮 Game Opened — ${game}`,
    token:    `🔑 Token Generated — ${game}`,
    access:   `🚀 Access Game — ${game}`,
  };

  const embed = {
    title:       titles[event] ?? `📋 Event — ${event}`,
    color:       COLOR[event] ?? 0x3b82f6,
    timestamp:   new Date().toISOString(),
    fields: [
      { name: "IP",         value: `\`${ip}\``,              inline: true  },
      { name: "Language",   value: `\`${lang}\``,            inline: true  },
      { name: "Event",      value: `\`${event}\``,           inline: true  },
      { name: "Total Visits", value: `\`${counters.visits}\``, inline: true },
      { name: "UA",         value: `\`${ua.slice(0, 80)}\``, inline: false },
    ],
    footer: { text: "Roblox Condo · Logs" },
  };

  try {
    const r = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });

    if (!r.ok) {
      req.log.warn({ status: r.status }, "Discord webhook returned non-ok");
    }

    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Discord webhook request failed");
    res.status(500).json({ error: "Webhook request failed" });
  }
});

/* ── GET /api/stats ─────────────────────────────────── */
router.get("/stats", (_req, res) => {
  res.json({
    visits: counters.visits,
    tokens: counters.tokens,
    access: counters.access,
  });
});

export default router;
