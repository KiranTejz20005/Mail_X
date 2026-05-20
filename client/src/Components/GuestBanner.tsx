import { Link } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';
import { GUEST_LIMITATIONS } from '../lib/guestData';

interface GuestBannerProps {
  onDismiss?: () => void;
}

export function GuestBanner({ onDismiss }: GuestBannerProps) {
  return (
    <div className="border-b border-amber-500/25 bg-amber-500/10 px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
          <div>
            <p className="text-sm font-semibold text-amber-100">Guest mode</p>
            <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-amber-200/90">
              {GUEST_LIMITATIONS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/signup"
            className="rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-500"
          >
            Create free account
          </Link>
          {onDismiss ? (
            <button
              type="button"
              onClick={onDismiss}
              className="rounded-lg p-2 text-amber-200/80 hover:bg-amber-500/15"
              aria-label="Dismiss guest banner"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
