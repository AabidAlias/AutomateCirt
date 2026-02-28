/**
 * components/UploadForm.jsx
 * Form for uploading template, CSV, and setting email content.
 */
import { useRef } from "react";
import { useForm } from "react-hook-form";

export default function UploadForm({ onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      emailSubject: "Congratulations {{name}}! Your Certificate is Ready 🎓",
      emailBody:
        "Dear {{name}},\n\nCongratulations! Please find your certificate attached.\n\nBest regards,\nThe Team",
    },
  });

  const templateInputRef = useRef(null);
  const csvInputRef = useRef(null);

  const handleFormSubmit = (data) => {
    const csvFile = csvInputRef.current?.files?.[0];
    const templateFile = templateInputRef.current?.files?.[0];
    if (!csvFile) return;
    onSubmit({ ...data, csvFile, templateFile });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5"
    >
      <h2 className="text-base font-semibold text-white">Configuration</h2>

      {/* Template upload */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          Certificate Template (PNG) — optional to re-upload
        </label>
        <input
          ref={templateInputRef}
          type="file"
          accept=".png"
          className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0 file:text-sm file:font-medium
            file:bg-brand-500 file:text-white hover:file:bg-brand-600 cursor-pointer"
        />
      </div>

      {/* CSV upload */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          Recipients CSV <span className="text-red-400">*</span>{" "}
          <span className="text-slate-600">(columns: Name, Email)</span>
        </label>
        <input
          ref={csvInputRef}
          type="file"
          accept=".csv"
          required
          className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0 file:text-sm file:font-medium
            file:bg-brand-500 file:text-white hover:file:bg-brand-600 cursor-pointer"
        />
      </div>

      {/* Email subject */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          Email Subject <span className="text-slate-600">(use {`{{name}}`} for personalization)</span>
        </label>
        <input
          {...register("emailSubject", { required: "Subject is required" })}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm
            text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
          placeholder="Congratulations {{name}}!"
        />
        {errors.emailSubject && (
          <p className="text-red-400 text-xs mt-1">{errors.emailSubject.message}</p>
        )}
      </div>

      {/* Email body */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          Email Body <span className="text-slate-600">(use {`{{name}}`} for personalization)</span>
        </label>
        <textarea
          {...register("emailBody", { required: "Body is required" })}
          rows={5}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm
            text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors resize-y"
          placeholder="Dear {{name}}, ..."
        />
        {errors.emailBody && (
          <p className="text-red-400 text-xs mt-1">{errors.emailBody.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-6 rounded-lg font-semibold text-white text-sm
          bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Processing…
          </>
        ) : (
          "🚀 Start Sending Certificates"
        )}
      </button>
    </form>
  );
}
