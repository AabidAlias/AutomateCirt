# Frontend — Smart Certificate Automation

React + Vite + Tailwind CSS dashboard for the certificate automation system.

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:5173
```

## Build for Production

```bash
npm run build
# Output: dist/ — serve with Nginx or any static host
```

## Components

| Component | Purpose |
|-----------|---------|
| `Layout.jsx` | App shell / header |
| `UploadForm.jsx` | Template + CSV upload + email config form |
| `ProgressBar.jsx` | Live batch progress (total / sent / failed / pending) |
| `StatusTable.jsx` | Per-recipient status table |
| `Dashboard.jsx` | Page that wires all components + polling logic |

## Environment

Vite proxies `/api` requests to `http://localhost:8000` during development.
For production, set your backend URL in `vite.config.js` or serve via Nginx proxy.
