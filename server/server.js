const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const supabase = require("./lib/supabase");
const requireAuth = require("./middleware/requireAuth");
const Router = require("./routes.js");
const { chatCompletion } = require("./lib/nvidia");
const { classifyEmailCategory } = require("./lib/classify");

const app = express();
const port = process.env.PORT || 5000;

const VALID_CATEGORIES = ["urgent", "positive", "neutral", "calendar", "spam"];

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "https://automailx.vercel.app",
      "https://mail-x.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "MailX server running", database: "supabase", ai: "nvidia-nim" });
});

async function classifyEmail(emailContent) {
  return classifyEmailCategory(emailContent);
}

function mapEmailRow(row) {
  return {
    id: row.id,
    _id: row.id,
    emailId: row.email_id,
    source: row.source || "seed",
    from: row.from,
    subject: row.subject,
    content: row.content,
    category: row.category || "neutral",
    summary: row.ai_summary,
    saved_response: row.saved_response,
    created_at: row.created_at,
  };
}

app.get("/get-emails", requireAuth, async (req, res) => {
  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("gmail_connected")
      .eq("id", req.user.id)
      .maybeSingle();
    if (profileError) throw profileError;

    const useGmailOnly = Boolean(profile?.gmail_connected);
    const { data: emails, error } = await supabase
      .from("emails")
      .select("*")
      .eq("user_id", req.user.id)
      .eq("source", useGmailOnly ? "gmail" : "seed")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const classified = await Promise.all(
      (emails || []).map(async (email) => {
        if (email.category) return mapEmailRow(email);

        const combined = `${email.subject} ${email.content}`;
        const category = await classifyEmail(combined);

        await supabase
          .from("emails")
          .update({ category })
          .eq("id", email.id)
          .eq("user_id", req.user.id);

        return mapEmailRow({ ...email, category });
      })
    );

    res.json({ emails: classified });
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({ error: "Failed to fetch emails." });
  }
});

app.post("/summarize", requireAuth, async (req, res) => {
  try {
    const { emailContent } = req.body;
    if (!emailContent) {
      return res.status(400).json({ message: "Email content is required" });
    }

    const summary = await chatCompletion(
      `Provide a concise summary of the following email:\n\n${emailContent}`,
      { system: "Summarize emails clearly in 2-4 sentences.", maxTokens: 512 }
    );

    res.json({ summary });
  } catch (error) {
    console.error("Summarize error:", error.message);
    res.status(500).json({ message: "Error summarizing email" });
  }
});

app.post("/generate-response", requireAuth, async (req, res) => {
  try {
    const { emailContent } = req.body;
    if (!emailContent) {
      return res.status(400).json({ message: "Email content is required" });
    }

    const responseText = await chatCompletion(
      `Write a professional, concise email reply to the following message. Return only the reply body:\n\n${emailContent}`,
      { system: "Write polite professional email replies.", maxTokens: 1024 }
    );

    res.json({ response: responseText });
  } catch (error) {
    console.error("Generate response error:", error.message);
    res.status(500).json({ message: "Error generating response", error: error.message });
  }
});

app.post("/save-response", requireAuth, async (req, res) => {
  try {
    const { emailId, response } = req.body;
    if (!emailId || !response) {
      return res.status(400).json({ message: "emailId and response are required" });
    }

    const { data, error } = await supabase
      .from("emails")
      .update({ saved_response: response })
      .eq("user_id", req.user.id)
      .or(`id.eq.${emailId},email_id.eq.${emailId}`)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ message: "Email not found" });
    }

    res.json({ message: "Response saved successfully" });
  } catch (error) {
    console.error("Save response error:", error);
    res.status(500).json({ message: "Failed to save response" });
  }
});

app.use(Router);

app.listen(port, () => {
  console.log(`MailX server running on port ${port}`);
  if (!process.env.SUPABASE_URL) {
    console.warn("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Mail_X/.env");
  }
  if (!process.env.NVIDIA_API_KEY) {
    console.warn("Set NVIDIA_API_KEY in Mail_X/.env for AI features");
  }
});
