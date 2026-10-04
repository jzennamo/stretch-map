# Muscle Stretch Map

Tap muscles on a front and back body map, deep hip rotators included, to get stretches that target them. Each stretch has a looping how-to animation, and you can run a guided routine with timers. There are also presets like "After a long hike" and "Day after heavy lifting."

It's one static page with no build step and no server, so GitHub Pages can host it as is. After it loads once it works offline, and you can add it to your phone's home screen.

## Files

- `index.html`: the whole app
- `manifest.webmanifest`, `icon-192.png`, `icon-512.png`: home-screen install
- `sw.js`: offline cache. When you change `index.html`, phones pick up the new page the next time they're online. If you change the icons or manifest, also bump `VERSION` in `sw.js`.

## Publish with GitHub Pages

1. Push these files to the root of a repo, for example `stretch-map`.
2. In the repo, go to **Settings → Pages**. Under **Build and deployment**, set **Source** to *Deploy from a branch* and **Branch** to `main` with folder `/ (root)`, then save.
3. After a minute or so the app is live at `https://<your-username>.github.io/stretch-map/`.
4. Open that page on your phone. On iPhone, use **Share → Add to Home Screen**. On Android, use **⋮ → Install app**.
