# Elsewhere

A responsive travel review and guide website built with vanilla JavaScript and Vite. Features six illustrated destination guides, search and combined filters, sorting, saved places, travel articles, and local review submission.

## Run locally

Requires Node.js 22.12+ (Node 24 recommended) and npm.

**To open the website without installing anything:** download `dist/elsewhere.html` and open it in a modern browser. It includes all fonts, illustrations, styling, and JavaScript and works offline. Generate this portable file with `npm run build:standalone`. Storage support for local HTML files varies by browser; if persistence is unavailable, saved places and reviews last for the current visit.

**Cloud access:** a server running inside the Codex cloud machine is not automatically available in your computer's browser. This onboarding interface does not expose localhost previews. Publishing the cloud environment saves its development setup; it does not deploy the website publicly. Use the portable file, run the project on your computer, or deploy the generated `dist/` files to a static hosting service for a public URL.

```sh
npm ci
npm run dev
```

Vite prints the development server address. To create and serve a production build:

```sh
npm run build
npm run preview
```

The `dist/` directory can be deployed to a static website host. No API keys, database, or environment variables are required. All fonts and illustrations are bundled, with no third-party runtime requests.

## Preview first, publish later

Running `npm run dev` on your own computer provides a private local preview. Running `npm run build` and `npm run preview` lets you check the production version. These commands don't publish anything. Cloud onboarding does not expose its local servers to your browser; the portable HTML export is an alternative for viewing without installing Node.js.

The included `.github/workflows/pages.yml` prepares GitHub Pages publishing. It runs **only when manually triggered**, never automatically on a push. Asset paths support the repository subdirectory used by Pages.

When ready to publish:

1. Save the project, including the workflow and lockfile, to the `main` branch of `PJLLC/Test` on GitHub.
2. In that repository, open **Settings → Pages** and select **GitHub Actions** as the source. Pages availability depends on the repository's visibility and GitHub plan; this project does not change repository visibility.
3. Open **Actions → Publish Elsewhere to GitHub Pages → Run workflow** and choose `main`.
4. Wait for the deployment job to complete. Use the actual website URL shown by that job.

The workflow has been prepared locally. Its presence alone does not enable Pages or create a public website. GitHub Pages publishes a live site; it is not a private preview service.

If **Check GitHub Pages settings** fails with **Get Pages site failed / Not Found**, open the repository's **Settings → Pages** and ensure **Build and deployment → Source** is **GitHub Actions**. Save if a Save button is shown, then start a new run of this workflow on `main`. If Pages settings instead show a plan or organization restriction, resolve that restriction before retrying. The workflow's default GitHub token cannot automatically enable a missing Pages site; adding `enablement: true` alone is insufficient.

## Validate

```sh
npm test
npm run test:e2e
npm run test:standalone
npm run test:deployment
```

Browser tests use `/usr/bin/chromium` when available. Otherwise install Playwright Chromium with `npx playwright install chromium` (and OS dependencies with `npx playwright install-deps chromium` if needed). Tests start the development server automatically and cover search, combined filtering, sorting, saving, local review submission and escaping, articles, dialogs, image loading, mobile layout, and unavailable browser storage.

If npm's default cache is unavailable in a cloud workspace, use `npm --cache /tmp/elsewhere-npm-cache ci`.

## Content and storage

This is a working frontend demo, not a live review platform. Each destination has one labeled sample review. Displayed averages combine that sample rating with reviews added in the current browser; there are no invented review counts. Guides are illustrative and aren't verified real-time travel advice. The journal contains original editorial sample content, not firsthand travel reporting.

Saved places and submitted reviews are stored in localStorage on this site's origin. They are not transmitted to a server, shared between devices, or visible to other visitors. Clearing site data removes them. If storage is unavailable, changes last only for the current visit. Do not enter sensitive personal information.

For a public community review site, the next step would be a backend with accounts, server-side validation, moderation, abuse controls, and shared storage.

## Project structure

- `src/main.js`: page rendering, dialogs, filters, saved places, and review forms.
- `src/data.js`: destination content and query/rating functions.
- `src/style.css`: responsive styling and locally hosted font definitions.
- `public/art/`: original SVG destination illustrations.
- `public/fonts/`: DM Sans and Playfair Display, distributed under their included SIL Open Font Licenses.
- `tests/`: data unit tests and browser workflow tests.
