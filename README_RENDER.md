# Deploying this Node app to Render

This file explains a quick, minimal set of steps to deploy the existing Node/Express app in this repository to Render (Managed service). It also includes configuration notes and environment variable guidance.

1) Prepare the repo

- Ensure you DO NOT commit secrets. Remove any `.env` or secret files from the repository and add them to `.gitignore`.
- Confirm `package.json` has a start script. This repo already has:

```
"start": "node server.js"
```

2) Create the Render service

- Go to https://render.com and sign in.
- Click "New" -> "Web Service".
- Connect your GitHub account and pick this repository (branch `main`).
- For the "Build Command" leave blank (Node apps typically don't need a build step) or add `npm install` if you prefer; Render runs `npm install` by default.
- For the "Start Command" use:

```
npm start
```

- Render will detect the `Procfile` (added to the repo) and the `start` script; either way `npm start` will run `node server.js`.

3) Set environment variables in Render

- After creating the service, open its Settings -> Environment and add the following variables (example names):
  - `MONGODB_URI` : your MongoDB connection string
  - `JWT_SECRET` : (if used by your app)
  - `BEAMER_KEY` or any third-party API keys (do not commit these to git)

Render makes these available to the app at runtime through process.env.

4) Static frontend handling

- If your server (`server.js`) already serves the frontend (`index.html`) using Express static middleware, visiting the Render service URL will show the website.
- If your prefer to host the frontend separately (e.g., on Vercel or Netlify) and keep the API on Render, that's also supported. In that case, configure the frontend to call your Render service URL for API endpoints.

5) Confirm the app runs

- After deploy, check the service logs on Render for startup errors.
- Health check: ensure Render is set to use the port exposed by the process (Render sets a `PORT` env var). The app should use `process.env.PORT || 3000`.

6) Rotate exposed secrets

- If any keys were exposed in the repository (for example the Beamer API key GitHub flagged), rotate/revoke those keys immediately with the provider.

7) Troubleshooting

- If the site shows JSON (like `{ "message": "KLHResolve Backend API" }`) it means the backend responds at `/` with JSON; to show the frontend make sure `server.js` serves `index.html` or that you deploy the frontend separately.
- If Render fails to start, check logs for missing env vars, port errors, or npm install failures.

Local test commands

```powershell
# from repo root
npm install
npm start

# Open http://localhost:3000 (or the port printed by the server)
```

If you'd like, I can also:
- Add an Express static catch-all in `server.js` so `index.html` is served for unknown routes (useful for single-page apps).
- Add a small health-check endpoint for Render.

Security note: never commit credentials. Use service environment variables and rotate any leaked credentials.