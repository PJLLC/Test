# Preview Elsewhere without publishing

This folder contains a self-contained snapshot of the travel website.

1. On this GitHub branch, click **Code → Download ZIP**.
2. Extract the ZIP on your computer.
3. Open `preview/elsewhere.html` in Chrome, Edge, Firefox, or Safari.

No Node.js installation, hosting account, or internet connection is needed after downloading. Fonts, illustrations, and application code are included in the HTML file. Reviews and saved places stay in your browser; local-file storage support varies by browser.

GitHub shows HTML as source code rather than running it. Download and open the file on your computer to interact with the site. If downloading just the HTML, use GitHub's **Download raw file** button rather than copying the code view.

This is an offline preview snapshot. Rebuild the current source with `npm run build:standalone`; the newly generated file will be `dist/elsewhere.html`.

The GitHub Pages workflow is manual. Uploading this branch does not deploy the website.
