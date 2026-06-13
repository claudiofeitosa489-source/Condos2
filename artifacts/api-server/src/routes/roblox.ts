import { Router } from "express";

const router = Router();

router.get("/roblox-check", async (req, res) => {
  const username = ((req.query.username as string) || "").trim();
  if (!username) {
    res.status(400).json({ valid: false, error: "missing_username" });
    return;
  }

  try {
    const usersRes = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
    });

    if (!usersRes.ok) {
      res.json({ valid: false, error: "api_error" });
      return;
    }

    const usersData = await usersRes.json() as { data: { id: number; name: string }[] };

    if (!usersData.data || usersData.data.length === 0) {
      res.json({ valid: false, error: "user_not_found" });
      return;
    }

    const { id: userId, name: resolvedName } = usersData.data[0];

    const userRes = await fetch(`https://users.roblox.com/v1/users/${userId}`, {
      headers: { "Accept": "application/json" },
    });

    if (!userRes.ok) {
      res.json({ valid: false, error: "api_error" });
      return;
    }

    const userData = await userRes.json() as { created?: string; name?: string };

    if (!userData.created) {
      res.json({ valid: false, error: "api_error" });
      return;
    }

    const days = Math.floor(
      (Date.now() - new Date(userData.created).getTime()) / 86_400_000
    );

    res.json({
      valid: days >= 800,
      days,
      username: resolvedName,
      error: days < 800 ? "account_too_new" : null,
    });
  } catch {
    res.status(500).json({ valid: false, error: "api_error" });
  }
});

export default router;
