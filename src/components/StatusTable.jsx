/**
 * components/StatusTable.jsx
 * Shows per-recipient certificate send status.
 */
const STATUS_STYLES = {
  sent: "bg-emerald-500/20 text-emerald-400",
  failed: "bg-red-500/20 text-red-400",
  pending: "bg-amber-500/20 text-amber-400",
};

export default function StatusTable({ records }) {
  if (!records || records.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Recipient Status
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/50">
              <th className="text-left px-5 py-3 text-slate-400 font-medium">Name</th>
              <th className="text-left px-5 py-3 text-slate-400 font-medium">Email</th>
              <th className="text-left px-5 py-3 text-slate-400 font-medium">Status</th>
              <th className="text-left px-5 py-3 text-slate-400 font-medium">Note</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr
                key={r.certificate_id || i}
                className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-5 py-3 text-white font-medium">{r.name}</td>
                <td className="px-5 py-3 text-slate-400">{r.email}</td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wide ${
                      STATUS_STYLES[r.status] || "text-slate-400"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-red-400">
                  {r.error_message || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
