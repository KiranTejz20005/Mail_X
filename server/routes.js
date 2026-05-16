const express = require("express");
const supabase = require("./lib/supabase");
const requireAuth = require("./middleware/requireAuth");
const {
  getAuthUrl,
  exchangeCodeForTokens,
  listRecentMessages,
} = require("./lib/gmail");
const { classifyEmailCategory } = require("./lib/classify");

const router = express.Router();

function ensureProfileQuery(userId) {
  return supabase.from("profiles").select("id, gmail_connected, gmail_email, gmail_last_synced_at").eq("id", userId).maybeSingle();
}

router.get("/auth/gmail/status", requireAuth, async (req, res) => {
  try {
    const { data, error } = await ensureProfileQuery(req.user.id);
    if (error) throw error;
    res.json({
      connected: Boolean(data?.gmail_connected),
      gmailEmail: data?.gmail_email || null,
      lastSyncedAt: data?.gmail_last_synced_at || null,
    });
  } catch (err) {
    console.error("Gmail status error:", err);
    res.status(500).json({ message: "Failed to load Gmail status" });
  }
});

router.get("/auth/gmail/url", requireAuth, async (req, res) => {
  try {
    const authUrl = getAuthUrl(req.user.id);
    res.json({ url: authUrl });
  } catch (err) {
    console.error("Gmail auth url error:", err);
    res.status(500).json({ message: err.message || "Failed to create Gmail auth URL" });
  }
});

router.get("/auth/gmail/callback", async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code || !state) {
      return res.status(400).send("Missing Gmail OAuth code or state");
    }

    const tokens = await exchangeCodeForTokens(code);
    const userId = String(state);

    const { error } = await supabase
      .from("profiles")
      .update({
        gmail_connected: true,
        gmail_last_synced_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) throw error;

    await supabase.from("gmail_tokens").upsert({
      user_id: userId,
      access_token: tokens.access_token || null,
      refresh_token: tokens.refresh_token || null,
      scope: Array.isArray(tokens.scope) ? tokens.scope.join(" ") : tokens.scope || null,
      token_type: tokens.token_type || null,
      expiry_date: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
    });

    res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/content?gmail=connected`);
  } catch (err) {
    console.error("Gmail callback error:", err);
    res.status(500).send("Failed to complete Gmail connection");
  }
});

router.post("/auth/gmail/disconnect", requireAuth, async (req, res) => {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        gmail_connected: false,
        gmail_email: null,
        gmail_last_synced_at: null,
      })
      .eq("id", req.user.id);
    if (error) throw error;

    await supabase.from("gmail_tokens").delete().eq("user_id", req.user.id);
    res.json({ message: "Gmail disconnected" });
  } catch (err) {
    console.error("Gmail disconnect error:", err);
    res.status(500).json({ message: "Failed to disconnect Gmail" });
  }
});

router.post("/auth/gmail/sync", requireAuth, async (req, res) => {
  try {
    const { data: tokenRow, error: tokenError } = await supabase
      .from("gmail_tokens")
      .select("*")
      .eq("user_id", req.user.id)
      .maybeSingle();
    if (tokenError) throw tokenError;
    if (!tokenRow) {
      return res.status(400).json({ message: "Gmail is not connected" });
    }

    const messages = await listRecentMessages({
      access_token: tokenRow.access_token,
      refresh_token: tokenRow.refresh_token,
      token_type: tokenRow.token_type,
      expiry_date: tokenRow.expiry_date ? new Date(tokenRow.expiry_date).getTime() : undefined,
      scope: tokenRow.scope,
    }, 50);

    const rows = [];
    for (const message of messages) {
      const category = await classifyEmailCategory(`${message.subject}\n\n${message.content}`);
      rows.push({
        user_id: req.user.id,
        source: "gmail",
        email_id: message.gmail_id,
        "from": message.from,
        subject: message.subject,
        content: message.content,
        category,
        ai_summary: message.snippet,
      });
    }

    if (rows.length) {
      const { error } = await supabase.from("emails").upsert(rows, { onConflict: "email_id" });
      if (error) throw error;
    }

    await supabase
      .from("profiles")
      .update({ gmail_connected: true, gmail_last_synced_at: new Date().toISOString() })
      .eq("id", req.user.id);

    res.json({ synced: rows.length });
  } catch (err) {
    console.error("Gmail sync error:", err);
    res.status(500).json({ message: "Failed to sync Gmail" });
  }
});

router.post("/auth/profile", requireAuth, async (req, res) => {
  try {
    const { username } = req.body;
    if (!username?.trim()) {
      return res.status(400).json({ message: "Username is required" });
    }

    const { error } = await supabase
      .from("profiles")
      .update({ username: username.trim() })
      .eq("id", req.user.id);

    if (error) throw error;
    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
});

module.exports = router;
