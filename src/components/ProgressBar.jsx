/**
 * components/ProgressBar.jsx
 * Displays live send progress for the current batch.
 */
export default function ProgressBar({ progress }) {
  if (!progress) return null;

  const { total, sent, failed, pending, done } = progress;
  const pct = total > 0 ? Math.round(((sent + failed) / total) * 100) : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Batch Progress
        </h2>
        {done && (
          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium">
            Complete
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #6366f1, #818cf8)",
          }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 text-center">
        <Stat label="Total" value={total} color="text-slate-300" />
        <Stat label="Sent" value={sent} color="text-emerald-400" />
        <Stat label="Failed" value={failed} color="text-red-400" />
        <Stat label="Pending" value={pending} color="text-amber-400" />
      </div>

      <p className="text-center text-xs text-slate-500">
        {sent + failed} / {total} processed ({pct}%)
      </p>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="bg-slate-800 rounded-lg p-3">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}
