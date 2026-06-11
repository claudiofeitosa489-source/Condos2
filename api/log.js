export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
  if (!WEBHOOK_URL) {
    return res.status(503).json({ error: 'Webhook not configured' });
  }

  const { event, data } = req.body || {};
  if (!event) {
    return res.status(400).json({ error: 'Missing event' });
  }

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  const lang = data?.lang || '—';
  const game = data?.game || '—';
  const ua   = req.headers['user-agent'] || '—';

  const COLOR = {
    visit:    0x3b82f6,
    language: 0x8b5cf6,
    modal:    0x06b6d4,
    token:    0x22c55e,
    access:   0xf59e0b,
  };

  const titles = {
    visit:    '🌐 New Visit',
    language: `🌍 Language Selected — ${lang.toUpperCase()}`,
    modal:    `🎮 Game Opened — ${game}`,
    token:    `🔑 Token Generated — ${game}`,
    access:   `🚀 Access Game — ${game}`,
  };

  const embed = {
    title:     titles[event] ?? `📋 Event — ${event}`,
    color:     COLOR[event] ?? 0x3b82f6,
    timestamp: new Date().toISOString(),
    fields: [
      { name: 'IP',       value: `\`${ip}\``,           inline: true  },
      { name: 'Language', value: `\`${lang}\``,         inline: true  },
      { name: 'Event',    value: `\`${event}\``,        inline: true  },
      { name: 'UA',       value: `\`${ua.slice(0, 80)}\``, inline: false },
    ],
    footer: { text: 'Roblox Condo · Logs' },
  };

  try {
    const r = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });

    if (!r.ok) console.warn('Discord webhook non-ok:', r.status);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Webhook failed:', err);
    return res.status(500).json({ error: 'Webhook request failed' });
  }
}
