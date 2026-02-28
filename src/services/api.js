/**
 * services/api.js
 * Centralized Axios instance and API call functions.
 */
import axios from "axios";

// In development: uses Vite proxy (/api → localhost:8000)
// In production: uses VITE_API_URL from environment variable
const BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : "";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 30000,
});

/** Upload the certificate template PNG */
export async function uploadTemplate(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/certificates/upload-template", formData);
  return data;
}

/**
 * Start a batch send.
 * @returns {{ batch_id: string, total: number }}
 */
export async function startBatch({ csvFile, emailSubject, emailBody }) {
  const formData = new FormData();
  formData.append("csv_file", csvFile);
  formData.append("email_subject", emailSubject);
  formData.append("email_body", emailBody);
  const { data } = await api.post("/certificates/send-batch", formData);
  return data;
}

/**
 * Poll batch progress.
 * @returns {{ batch_id, total, sent, failed, pending, done }}
 */
export async function getBatchProgress(batchId) {
  const { data } = await api.get(`/certificates/progress/${batchId}`);
  return data;
}

/**
 * Fetch paginated status records for a batch.
 */
export async function getBatchStatus(batchId, skip = 0, limit = 100) {
  const { data } = await api.get(`/certificates/status/${batchId}`, {
    params: { skip, limit },
  });
  return data;
}

/**
 * Retry failed emails for a batch.
 */
export async function retryFailed(batchId, emailSubject, emailBody) {
  const formData = new FormData();
  formData.append("email_subject", emailSubject);
  formData.append("email_body", emailBody);
  const { data } = await api.post(`/certificates/retry/${batchId}`, formData);
  return data;
}

/**
 * Get ZIP download URL for a batch.
 */
export function getZipDownloadUrl(batchId) {
  return `${BASE_URL}/api/certificates/download-zip/${batchId}`;
}

export default api;