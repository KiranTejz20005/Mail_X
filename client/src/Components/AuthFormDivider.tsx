interface AuthFormDividerProps {
  label?: string;
}

export function AuthFormDivider({ label = 'or' }: AuthFormDividerProps) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-violet-500/20" />
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-wide">
        <span className="bg-mail-card px-3 text-slate-500">{label}</span>
      </div>
    </div>
  );
}
