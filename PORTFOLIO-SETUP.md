# Portfolio rebuild for the existing Render repository

Edit `portfolio/index.html`, `portfolio/style.css`, and `portfolio/app.js`. The new design uses cyan accents. All original website files remain in place. `portfolio/legacy/` contains an additional complete copy of the original website (excluding Git and node_modules), including the original package.json and dist. The footer archive links to it as “Legacy Site in ThreeJS”.

Build: `node Scripts/build-portfolio.mjs` (or `npm run build`). Output: `site-dist`.
Local preview / Render Web Service: `node Scripts/serve-portfolio.mjs` (or `npm start`). Default port 4174; respects Render's PORT.
Original commands remain available as `npm run build:legacy` and `npm run start:legacy`.

## Existing Render service

Keep the existing GitHub repository, branch, domain, and service. For a Static Site set Build Command to `node Scripts/build-portfolio.mjs` and Publish Directory to `site-dist`. For a Node Web Service use that same build command and Start Command `node Scripts/serve-portfolio.mjs`. Auto-deploy must be enabled for pushes to the connected branch. These dashboard settings still need verification; no live Render changes or GitHub push have been made by this rebuild.

## Instagram connection

The owner authorized JesseSound Portfolio through Meta Unified Login. The compatible Portfolio Read Only configuration requests instagram_basic only, with a system-user token. The refresh script uses graph.facebook.com/v27.0. Store them only in GitHub Actions secrets (`INSTAGRAM_USER_ID`, `INSTAGRAM_ACCESS_TOKEN`) for a Static Site, or in Render environment secrets for a Web Service. Do not paste secrets into chat or tracked source files. Local credentials are stored in the Git-ignored root .env file and loaded by the refresh script (Node 22 or later); the build copies only portfolio/ into site-dist/. Keep token expiry/renewal under review; invalid credentials retain saved posts and flag the feed as stale. Authorization and a live refresh were verified on November 12, 2026: nine Instagram posts were retrieved. Hosted automatic updates still require the secrets in GitHub Actions or Render; a local .env is not deployed.

Official Meta setup: https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-unified-login/

## Refresh options

Static Site: `.github/workflows/social-refresh.yml` runs hourly and can also be run manually. It commits refreshed JSON back to the default branch so Render can rebuild. GitHub schedules only run after the workflow reaches the default branch and Actions is enabled. Use the Render deploy hook as the `RENDER_DEPLOY_HOOK` Actions secret if automated pushes do not trigger your configured Render deploy policy. The hook is secret. This workflow replaces the separate preview project's GitHub Pages deployment path; it does not use GitHub Pages.

Web Service: set `SOCIAL_REFRESH_ENABLED=true` in Render to fetch on startup and hourly while the process is running. An always-running service is needed for reliable background intervals; sleeping/free services do not run checks while asleep. The JSON is cached on the service filesystem, which can reset on redeploy. The committed feed is the fallback after restart. Do not enable both refresh approaches without a reason.

YouTube uses RSS with a public-channel-page fallback. Instagram requires authorization. Provider errors retain last-good content. Browser polling only refreshes the saved feed and is not itself a background social fetch.
