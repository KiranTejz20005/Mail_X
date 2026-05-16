import { Sparkles, Inbox, AlertTriangle, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';

export function ProductPreview() {
  return (
    <motion.div
      id="demo"
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-lg scroll-mt-24"
    >
      <div className="absolute -inset-4 rounded-3xl bg-violet-600/10 blur-2xl" aria-hidden />
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="relative overflow-hidden rounded-2xl border border-violet-500/25 bg-mail-surface shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-violet-500/15 bg-mail-card px-4 py-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 truncate text-xs text-slate-500">mailx.app/inbox</span>
        </div>

        <div className="flex h-[300px] sm:h-[360px]">
          <div className="hidden w-28 shrink-0 border-r border-violet-500/15 bg-mail-bg/80 p-3 sm:block">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">Filters</p>
            {[
              { icon: Inbox, label: 'All', active: true },
              { icon: AlertTriangle, label: 'Urgent' },
              { icon: ThumbsUp, label: 'Positive' },
            ].map((f) => (
              <div
                key={f.label}
                className={`mb-1 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] ${
                  f.active ? 'bg-violet-600/30 text-violet-200' : 'text-slate-500'
                }`}
              >
                <f.icon className="h-3 w-3 shrink-0" />
                {f.label}
              </div>
            ))}
          </div>

          <div className="w-[38%] min-w-[120px] shrink-0 border-r border-violet-500/15 bg-mail-card/50 sm:w-36">
            {['Team update', 'Welcome', 'Reminder'].map((sender, i) => (
              <div
                key={sender}
                className={`border-b border-violet-500/10 px-3 py-2.5 ${
                  i === 0 ? 'border-l-2 border-l-violet-400 bg-violet-600/15' : ''
                }`}
              >
                <p className="truncate text-[11px] font-medium text-slate-200">{sender}</p>
                <p className="truncate text-[10px] text-slate-500">New update available...</p>
              </div>
            ))}
          </div>

          <div className="min-w-0 flex-1 p-3">
            <div className="mb-2 flex items-center gap-1.5 rounded-lg bg-violet-600/15 px-2 py-1">
              <Sparkles className="h-3 w-3 shrink-0 text-violet-400" />
              <span className="text-[10px] text-violet-300">AI Summary</span>
            </div>
            <p className="mb-3 text-[10px] leading-relaxed text-slate-400">
              Your inbox, categorized and summarized with NVIDIA NIM — urgent items surface first.
            </p>
            <div className="rounded-lg border border-violet-500/15 bg-mail-bg/60 p-2">
              <p className="line-clamp-4 text-[10px] leading-relaxed text-slate-500">
                Generate a professional reply in one click, then open Gmail compose with the draft ready.
              </p>
            </div>
            <div className="mt-3">
              <span className="rounded-md bg-violet-600 px-2 py-1 text-[10px] font-medium text-white">
                Generate Reply
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
