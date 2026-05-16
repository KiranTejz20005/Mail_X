const { google } = require("googleapis");

const GMAIL_SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

function getOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:5000/auth/gmail/callback";

  if (!clientId || !clientSecret) {
    throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required");
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  return oauth2Client;
}

function getAuthUrl(state) {
  const oauth2Client = getOAuthClient();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: GMAIL_SCOPES,
    state,
  });
}

async function exchangeCodeForTokens(code) {
  const oauth2Client = getOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

function setCredentials(tokens) {
  const oauth2Client = getOAuthClient();
  oauth2Client.setCredentials(tokens);
  return oauth2Client;
}

async function listRecentMessages(tokens, maxResults = 20) {
  const auth = setCredentials(tokens);
  const gmail = google.gmail({ version: "v1", auth });
  const list = await gmail.users.messages.list({ userId: "me", maxResults });
  const messageIds = list.data.messages || [];
  const messages = [];

  for (const item of messageIds) {
    const message = await gmail.users.messages.get({ userId: "me", id: item.id, format: "full" });
    const payload = message.data.payload || {};
    const headers = payload.headers || [];
    const headerMap = Object.fromEntries(
      headers.map((header) => [header.name?.toLowerCase(), header.value || ""])
    );

    const bodyText = extractBody(payload);
    messages.push({
      gmail_id: message.data.id,
      thread_id: message.data.threadId,
      from: headerMap.from || "Unknown",
      subject: headerMap.subject || "No Subject",
      snippet: message.data.snippet || bodyText.slice(0, 200),
      content: bodyText || message.data.snippet || "",
      internal_date: message.data.internalDate ? new Date(Number(message.data.internalDate)).toISOString() : new Date().toISOString(),
    });
  }

  return messages;
}

function extractBody(payload) {
  if (!payload) return "";
  if (payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }
  if (payload.parts?.length) {
    for (const part of payload.parts) {
      const partBody = extractBody(part);
      if (partBody) return partBody;
    }
  }
  return "";
}

function decodeBase64Url(data) {
  return Buffer.from(data, "base64url").toString("utf8");
}

module.exports = {
  GMAIL_SCOPES,
  getAuthUrl,
  exchangeCodeForTokens,
  listRecentMessages,
};
