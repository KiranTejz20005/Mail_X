import { useState, useEffect, useCallback } from 'react';
import {
  Inbox, AlertTriangle, Menu, X, Calendar, Loader2, MessageSquare,
  ThumbsUp, Meh, Search, Edit, Copy, Save, XCircle, Mail, Sparkles,
  RefreshCw, InboxIcon, AlertCircle, LogOut,
  ShieldAlert,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api, apiFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Email {
  id: string;
  _id?: string;
  emailId?: string;
  from: string;
  sender?: string;
  subject: string;
  summary?: string;
  content: string;
  category: string;
}

const FILTERS = [
  { id: 'all', label: 'All', icon: Inbox },
  { id: 'urgent', label: 'Urgent', icon: AlertTriangle, color: 'text-red-400' },
  { id: 'spam', label: 'Spam', icon: ShieldAlert, color: 'text-fuchsia-400' },
  { id: 'positive', label: 'Positive', icon: ThumbsUp, color: 'text-emerald-400' },
  { id: 'neutral', label: 'Neutral', icon: Meh, color: 'text-amber-400' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, color: 'text-blue-400' },
] as const;

const categoryDot: Record<string, string> = {
  urgent: 'bg-red-400',
  spam: 'bg-fuchsia-400',
  positive: 'bg-emerald-400',
  neutral: 'bg-amber-400',
  calendar: 'bg-blue-400',
};

function Content() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEmailListOpen, setIsEmailListOpen] = useState(true);
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [responseLoading, setResponseLoading] = useState(false);
  const [responseSaved, setResponseSaved] = useState(false);
  const [responseSaving, setResponseSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editableResponse, setEditableResponse] = useState<string | null>(null);
  const [emailsLoading, setEmailsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [summaryError, setSummaryError] = useState(false);
  const [contentExpanded, setContentExpanded] = useState(false);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailLoading, setGmailLoading] = useState(true);
  const [gmailError, setGmailError] = useState<string | null>(null);
  const [gmailEmail, setGmailEmail] = useState<string | null>(null);
  const [gmailSyncedAt, setGmailSyncedAt] = useState<string | null>(null);

  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const token = session?.access_token;

  const getEmailKey = (email: Email) => email.id || email._id || email.emailId || '';

  const fetchEmails = useCallback(async () => {
    if (!token) return;
    setEmailsLoading(true);
    setFetchError(null);
    try {
      const res = await apiFetch(api.getEmails(), token, { method: 'GET' });
      if (!res.ok) throw new Error('Failed to fetch emails');
      const data = await res.json();
      if (Array.isArray(data.emails)) {
        setEmails([...data.emails].reverse());
      } else {
        setEmails([]);
      }
    } catch {
      setFetchError('Could not load emails. Check your connection and try again.');
      setEmails([]);
    } finally {
      setEmailsLoading(false);
    }
  }, [token]);

  const fetchGmailStatus = useCallback(async () => {
    if (!token) return;
    setGmailLoading(true);
    setGmailError(null);
    try {
      const res = await apiFetch(api.gmailStatus(), token, { method: 'GET' });
      if (!res.ok) throw new Error('Failed to load Gmail status');
      const data = await res.json();
      setGmailConnected(Boolean(data.connected));
      setGmailEmail(data.gmailEmail || null);
      setGmailSyncedAt(data.lastSyncedAt || null);
    } catch {
      setGmailConnected(false);
      setGmailError('Gmail sync is not available yet.');
    } finally {
      setGmailLoading(false);
    }
  }, [token]);

  const connectGmail = useCallback(async () => {
    if (!token) return;
    try {
      const res = await apiFetch(api.gmailAuthUrl(), token, { method: 'GET' });
      if (!res.ok) throw new Error('Failed to start Gmail OAuth');
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch {
      setGmailError('Could not start Gmail connection.');
    }
  }, [token]);

  const syncGmail = useCallback(async () => {
    if (!token) return;
    try {
      const res = await apiFetch(api.gmailSync(), token, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to sync Gmail');
      await fetchGmailStatus();
      await fetchEmails();
    } catch {
      setGmailError('Could not sync Gmail right now.');
    }
  }, [token, fetchEmails, fetchGmailStatus]);

  useEffect(() => {
    fetchGmailStatus();
    fetchEmails();
  }, [fetchEmails, fetchGmailStatus]);

  useEffect(() => {
    if (!gmailConnected) return;

    syncGmail();
    const interval = window.setInterval(() => {
      syncGmail();
    }, 120000);

    return () => window.clearInterval(interval);
  }, [gmailConnected, syncGmail]);

  const fetchAndSummarize = async (emailContent: string) => {
    setSummaryLoading(true);
    setSummary(null);
    setSummaryError(false);
    try {
      const res = await apiFetch(api.summarize(), token, {
        method: 'POST',
        body: JSON.stringify({ emailContent }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Summarize failed');
      }
      const data = await res.json();
      setSummary(data.summary);
    } catch {
      setSummaryError(true);
      setSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  };

  const selectEmail = (email: Email) => {
    setSelectedEmail(email);
    setSummary(null);
    setSummaryError(false);
    setContentExpanded(false);
    setResponse(null);
    setResponseSaved(false);
    setIsEditing(false);
    setCopied(false);
    fetchAndSummarize(email.content);
    if (window.innerWidth < 768) setIsEmailListOpen(false);
  };

  const handleGenerateResponse = async () => {
    if (!selectedEmail) return;
    setResponseLoading(true);
    setResponse(null);
    setResponseSaved(false);
    setIsEditing(false);
    try {
      const res = await apiFetch(api.generateResponse(), token, {
        method: 'POST',
        body: JSON.stringify({ emailContent: selectedEmail.content }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Generate failed');
      }
      const data = await res.json();
      setResponse(data.response);
      setEditableResponse(data.response);
    } catch {
      setResponse('Failed to generate response. Please try again.');
    } finally {
      setResponseLoading(false);
    }
  };

  const handleSaveResponse = async () => {
    if (!selectedEmail || !response) return;
    setResponseSaving(true);
    try {
      const emailId = selectedEmail.id || selectedEmail._id || selectedEmail.emailId;
      const res = await apiFetch(api.saveResponse(), token, {
        method: 'POST',
        body: JSON.stringify({ emailId, response }),
      });
      if (!res.ok) throw new Error('Save failed');
      setResponseSaved(true);
    } catch {
      setResponseSaved(false);
    } finally {
      setResponseSaving(false);
    }
  };

  const filteredEmails = emails.filter((email) => {
    if (activeFilter !== 'all' && email.category !== activeFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (email.subject?.toLowerCase() || '').includes(q) ||
      (email.sender?.toLowerCase() || '').includes(q) ||
      (email.from?.toLowerCase() || '').includes(q) ||
      (email.content?.toLowerCase() || '').includes(q)
    );
  });

  const cleanContent = (text: string) =>
    text.replace(/https?:\/\/\S+/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

  const formatBodyParagraphs = (text: string) => {
    const cleaned = cleanContent(text);
    const chunks = cleaned.split(/(?<=[.!?])\s+(?=[A-Z])/);
    if (chunks.length <= 1) return [cleaned];
    return chunks.filter((c) => c.length > 20);
  };

  const senderName = (from: string) => (from || 'Unknown').replace(/<.*?>/, '').trim();

  const handleReply = () => {
    if (!selectedEmail) return;
    const fromMatch = selectedEmail.from.match(/<([^>]+)>/);
    const senderEmail = fromMatch ? fromMatch[1] : selectedEmail.from;
    const body = editableResponse || response || '';
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(senderEmail)}&su=${encodeURIComponent(`Re: ${selectedEmail.subject}`)}&body=${encodeURIComponent(body)}`;
    window.open(url, '_blank');
  };

  const handleCopy = async () => {
    const text = editableResponse || response;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <motion.div className="page-bg flex h-screen flex-col overflow-hidden">
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex shrink-0 items-center justify-between gap-2 border-b border-violet-500/15 bg-mail-bg/80 px-3 py-3 backdrop-blur-xl sm:gap-4 sm:px-6"
      >
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-300 hover:bg-violet-500/10 md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle filters"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="font-display text-xl font-bold text-white transition-opacity hover:opacity-80"
          >
            MailX
          </button>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:max-w-md sm:gap-3">
          {gmailError && (
            <span className="hidden rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-200 sm:inline-flex">
              {gmailError}
            </span>
          )}
          {gmailLoading ? null : gmailConnected ? (
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-200 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {gmailEmail ? `Connected: ${gmailEmail}` : 'Gmail connected'}
              {gmailSyncedAt ? <span className="text-emerald-300/80">Updated {new Date(gmailSyncedAt).toLocaleTimeString()}</span> : null}
              <button type="button" onClick={syncGmail} className="ml-2 font-medium text-emerald-100 underline underline-offset-4">
                Sync now
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={connectGmail}
              className="hidden rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-2 text-xs font-medium text-violet-200 hover:bg-violet-500/15 sm:inline-flex"
            >
              Connect Gmail
            </button>
          )}
          <div className="flex min-w-0 max-w-[9rem] flex-1 items-center gap-2 rounded-xl border border-violet-500/20 bg-mail-surface/80 px-2 py-2 sm:max-w-none sm:px-3">
            <Search className="h-4 w-4 shrink-0 text-violet-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-w-0 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none"
            />
          </div>
          <motion.button
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.4 }}
            type="button"
            onClick={fetchEmails}
            disabled={emailsLoading}
            className="rounded-xl border border-violet-500/20 p-2 text-violet-300 hover:bg-violet-500/10 disabled:opacity-50"
            aria-label="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${emailsLoading ? 'animate-spin' : ''}`} />
          </motion.button>
          <button
            type="button"
            onClick={async () => {
              await signOut();
              navigate('/login');
            }}
            className="rounded-xl border border-violet-500/20 p-2 text-violet-300 hover:bg-violet-500/10"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </motion.header>

      <div className="flex min-h-0 flex-1">
        {/* Filters sidebar */}
        <nav
          className={`fixed left-0 top-[57px] z-40 flex h-[calc(100dvh-57px)] w-56 flex-col border-r border-violet-500/15 bg-mail-surface/95 p-4 backdrop-blur-xl transition-transform duration-300 ease-out md:static md:top-auto md:z-0 md:h-auto md:w-52 md:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
              <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Filters</p>
              {FILTERS.map((f) => (
                <motion.button
                  key={f.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => { setActiveFilter(f.id); setIsSidebarOpen(false); }}
                  className={`mb-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    activeFilter === f.id
                      ? 'bg-violet-600/30 text-white'
                      : 'text-slate-400 hover:bg-violet-500/10 hover:text-slate-200'
                  }`}
                >
                  <f.icon className={`h-4 w-4 ${'color' in f ? f.color : 'text-violet-400'}`} />
                  {f.label}
                </motion.button>
              ))}
        </nav>

        {isSidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          />
        )}

        {/* Email list */}
        <div
          className={`flex w-full shrink-0 flex-col border-r border-violet-500/15 bg-mail-surface/50 md:w-80 ${
            !isEmailListOpen ? 'hidden md:flex' : 'flex'
          }`}
        >
          <motion.div className="border-b border-violet-500/10 px-4 py-3">
            <p className="text-xs font-medium text-slate-500">
              {filteredEmails.length} email{filteredEmails.length !== 1 ? 's' : ''}
            </p>
          </motion.div>
          <div className="flex-1 overflow-y-auto">
            {emailsLoading ? (
              <motion.div className="flex flex-col items-center justify-center gap-3 p-12 text-slate-500">
                <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
                <span className="text-sm">Loading inbox...</span>
              </motion.div>
            ) : fetchError ? (
              <div className="p-6 text-center">
                <p className="text-sm text-red-300">{fetchError}</p>
                <button type="button" onClick={fetchEmails} className="btn-primary mt-4 text-sm">
                  Retry
                </button>
              </div>
            ) : filteredEmails.length === 0 ? (
              <div className="flex flex-col items-center gap-3 p-8 text-center text-slate-500 sm:p-12">
                <InboxIcon className="h-10 w-10 text-violet-500/50" />
                <p className="text-sm font-medium text-slate-400">
                  {emails.length === 0 ? 'Your inbox is empty' : 'No emails in this view'}
                </p>
                {gmailConnected ? (
                  <p className="max-w-xs text-xs leading-relaxed text-slate-500">
                    Gmail is connected. Sync now to load your latest emails.
                  </p>
                ) : (
                  <>
                    <p className="max-w-xs text-xs leading-relaxed text-slate-500">
                      Connect Gmail to load real emails instead of demo data.
                    </p>
                    <button type="button" onClick={connectGmail} className="btn-primary mt-2 text-sm">
                      Connect Gmail
                    </button>
                  </>
                )}
              </div>
            ) : (
              filteredEmails.map((email, i) => {
                const key = getEmailKey(email);
                const selected = selectedEmail && getEmailKey(selectedEmail) === key;
                return (
                  <motion.button
                    key={key}
                    type="button"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    onClick={() => selectEmail(email)}
                    className={`w-full border-b border-violet-500/10 p-4 text-left transition-colors ${
                      selected
                        ? 'bg-violet-600/20 border-l-2 border-l-violet-400'
                        : 'hover:bg-violet-500/10'
                    }`}
                  >
                    <motion.div className="mb-1 flex items-center justify-between gap-2">
                      <span className="truncate font-medium text-slate-200">{senderName(email.from)}</span>
                      <span className={`h-2 w-2 shrink-0 rounded-full ${categoryDot[email.category] || 'bg-slate-500'}`} />
                    </motion.div>
                    <p className="truncate text-sm text-slate-400">{email.subject || 'No subject'}</p>
                  </motion.button>
                );
              })
            )}
          </div>
        </div>

        {/* Detail panel */}
        <motion.div
          className={`min-w-0 flex-1 overflow-y-auto p-4 md:p-6 ${isEmailListOpen && !selectedEmail ? 'hidden md:block' : ''}`}
        >
          <AnimatePresence mode="wait">
            {!selectedEmail ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full flex-col items-center justify-center gap-4 text-slate-500"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-500/10">
                  <Mail className="h-10 w-10 text-violet-400/60" />
                </div>
                <p className="text-lg font-medium text-slate-400">Select an email</p>
                <p className="max-w-sm text-center text-sm">Choose a message to view AI summary and generate a smart reply</p>
              </motion.div>
            ) : (
              <motion.div
                key={getEmailKey(selectedEmail)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mx-auto max-w-3xl space-y-5"
              >
                <button
                  type="button"
                  className="mb-2 flex items-center gap-1 text-sm text-violet-400 md:hidden"
                  onClick={() => setIsEmailListOpen(true)}
                >
                  ← Back to inbox
                </button>

                <div className="glass-card p-5">
                  <h2 className="font-display text-lg font-semibold text-white">{selectedEmail.subject}</h2>
                  <p className="mt-1 text-sm text-slate-500">From {senderName(selectedEmail.from)}</p>
                </div>

                <div className="glass-card p-5">
                  <motion.div className="mb-3 flex items-center justify-between gap-2">
                    <motion.div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-violet-400" />
                      <h3 className="font-semibold text-white">AI Summary</h3>
                    </motion.div>
                    {!summaryLoading && summaryError && (
                      <button type="button" onClick={() => fetchAndSummarize(selectedEmail.content)} className="text-xs font-medium text-violet-400 hover:text-violet-300">
                        Retry
                      </button>
                    )}
                  </motion.div>
                  {summaryLoading ? (
                    <div className="flex items-center gap-3 rounded-xl bg-mail-surface/60 py-6">
                      <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
                      <span className="text-sm text-slate-400">Generating summary...</span>
                    </div>
                  ) : summaryError ? (
                    <motion.div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                      <motion.div>
                        <p className="text-sm font-medium text-red-200">Couldn&apos;t generate summary</p>
                        <p className="mt-1 text-xs text-red-300/80">The AI service may be unavailable. Try again in a moment.</p>
                        <button type="button" onClick={() => fetchAndSummarize(selectedEmail.content)} className="mt-3 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-500">
                          Try again
                        </button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <p className="text-sm leading-relaxed text-slate-300">{summary}</p>
                  )}
                </div>

                <div className="glass-card p-5">
                  <h3 className="mb-3 font-semibold text-white">Message</h3>
                  <motion.div className={`space-y-3 overflow-hidden text-sm leading-relaxed text-slate-400 ${!contentExpanded ? 'max-h-48' : ''}`}>
                    {formatBodyParagraphs(selectedEmail.content).map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </motion.div>
                  {cleanContent(selectedEmail.content).length > 280 && (
                    <button type="button" onClick={() => setContentExpanded(!contentExpanded)} className="mt-3 text-xs font-medium text-violet-400 hover:text-violet-300">
                      {contentExpanded ? 'Show less' : 'Read full message'}
                    </button>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleGenerateResponse}
                  disabled={responseLoading}
                  className="btn-primary flex items-center gap-2 disabled:opacity-60"
                >
                  {responseLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4" />
                      Generate Response
                    </>
                  )}
                </motion.button>

                <AnimatePresence>
                  {response && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="glass-card p-5"
                    >
                      <h3 className="mb-3 font-semibold text-white">Suggested Reply</h3>
                      {isEditing ? (
                        <>
                          <textarea
                            value={editableResponse || ''}
                            onChange={(e) => setEditableResponse(e.target.value)}
                            className="input-field min-h-[120px] resize-y"
                            rows={5}
                          />
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button type="button" onClick={() => { setResponse(editableResponse); setIsEditing(false); }} className="flex items-center gap-1.5 rounded-lg bg-emerald-600/80 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
                              <Save className="h-4 w-4" /> Save
                            </button>
                            <button type="button" onClick={() => setIsEditing(false)} className="flex items-center gap-1.5 rounded-lg bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-600">
                              <XCircle className="h-4 w-4" /> Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="mb-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{response}</p>
                          <motion.div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => { setIsEditing(true); setEditableResponse(response); }} className="flex items-center gap-1.5 rounded-lg border border-violet-500/30 px-4 py-2 text-sm text-violet-200 hover:bg-violet-500/10">
                              <Edit className="h-4 w-4" /> Edit
                            </button>
                            <button type="button" onClick={handleCopy} className="flex items-center gap-1.5 rounded-lg border border-violet-500/30 px-4 py-2 text-sm text-violet-200 hover:bg-violet-500/10">
                              <Copy className="h-4 w-4" /> {copied ? 'Copied!' : 'Copy'}
                            </button>
                            <button type="button" onClick={handleReply} className="btn-primary flex items-center gap-1.5 py-2 text-sm">
                              <Mail className="h-4 w-4" /> Reply in Gmail
                            </button>
                          </motion.div>
                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={handleSaveResponse}
                              disabled={responseSaving}
                              className="flex items-center gap-1.5 rounded-lg bg-emerald-600/80 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                            >
                              {responseSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                              Save Response
                            </button>
                            {responseSaved && (
                              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-emerald-400">
                                Saved successfully
                              </motion.span>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Content;
