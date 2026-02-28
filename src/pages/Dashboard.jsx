/**
 * pages/Dashboard.jsx
 * Main dashboard: form + live progress + status table.
 */
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

import UploadForm from "../components/UploadForm";
import ProgressBar from "../components/ProgressBar";
import StatusTable from "../components/StatusTable";
import {
  uploadTemplate,
  startBatch,
  getBatchProgress,
  getBatchStatus,
  retryFailed,
  getZipDownloadUrl,
} from "../services/api";

const POLL_INTERVAL_MS = 2000;

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [batchId, setBatchId] = useState(null);
  const [progress, setProgress] = useState(null);
  const [records, setRecords] = useState([]);
  const [emailMeta, setEmailMeta] = useState(null); // for retry

  const pollRef = useRef(null);

  // ── Start polling when batchId is set ───────────────────────────────────────
  useEffect(() => {
    if (!batchId) return;

    const poll = async () => {
      try {
        const [prog, statusData] = await Promise.all([
          getBatchProgress(batchId),
          getBatchStatus(batchId),
        ]);
        setProgress(prog);
        setRecords(statusData.records);

        if (prog.done) {
          clearInterval(pollRef.current);
          setIsLoading(false);
          toast.success(`Batch complete! ✅ ${prog.sent} sent, ${prog.failed} failed.`);
        }
      } catch (e) {
        console.error("Polling error:", e);
      }
    };

    pollRef.current = setInterval(poll, POLL_INTERVAL_MS);
    poll(); // immediate first call

    return () => clearInterval(pollRef.current);
  }, [batchId]);

  // ── Form submit handler ──────────────────────────────────────────────────────
  const handleSubmit = async ({ csvFile, templateFile, emailSubject, emailBody }) => {
    setIsLoading(true);
    setProgress(null);
    setRecords([]);
    setBatchId(null);
    clearInterval(pollRef.current);

    try {
      // Upload template if provided
      if (templateFile) {
        await uploadTemplate(templateFile);
        toast.success("Template uploaded!");
      }

      // Start batch
      const result = await startBatch({ csvFile, emailSubject, emailBody });
      setBatchId(result.batch_id);
      setEmailMeta({ emailSubject, emailBody });
      toast.success(`Batch started! Processing ${result.total} recipients.`);
    } catch (err) {
      const detail = err?.response?.data?.detail || "Something went wrong.";
      toast.error(detail);
      setIsLoading(false);
    }
  };

  // ── Retry handler ────────────────────────────────────────────────────────────
  const handleRetry = async () => {
    if (!batchId || !emailMeta) return;
    try {
      await retryFailed(batchId, emailMeta.emailSubject, emailMeta.emailBody);
      setIsLoading(true);
      setBatchId(batchId); // re-trigger polling effect
      toast("Retrying failed emails…", { icon: "🔄" });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Retry failed.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">
          Upload your template and CSV, then send personalized certificates automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: form */}
        <div className="lg:col-span-1">
          <UploadForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Right: progress + actions */}
        <div className="lg:col-span-2 space-y-4">
          {progress && <ProgressBar progress={progress} />}

          {/* Action buttons */}
          {batchId && progress && (
            <div className="flex gap-3 flex-wrap">
              {progress.failed > 0 && (
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 text-sm font-medium bg-amber-500/20 text-amber-400
                    border border-amber-500/30 rounded-lg hover:bg-amber-500/30 transition-colors"
                >
                  🔄 Retry {progress.failed} Failed
                </button>
              )}
              {progress.done && (
                <a
                  href={getZipDownloadUrl(batchId)}
                  className="px-4 py-2 text-sm font-medium bg-brand-500/20 text-brand-500
                    border border-brand-500/30 rounded-lg hover:bg-brand-500/30 transition-colors"
                  download
                >
                  📦 Download All as ZIP
                </a>
              )}
            </div>
          )}

          {/* Batch ID badge */}
          {batchId && (
            <p className="text-xs text-slate-600 font-mono">
              Batch ID: {batchId}
            </p>
          )}
        </div>
      </div>

      {/* Status table */}
      {records.length > 0 && <StatusTable records={records} />}
    </div>
  );
}
