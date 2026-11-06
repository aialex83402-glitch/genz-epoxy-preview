# GENZ Epoxy

Complete static website source for the GENZ Epoxy concept.

## Deploy on your own server

No build step, package installation, Node.js runtime, database, or Perplexity hosting is required.

1. Unzip this archive.
2. Upload the contents of the `genz-epoxy` folder to your web server's document root, such as `public_html`, `www`, or `/var/www/html`.
3. Keep `index.html`, `base.css`, `style.css`, `app.js`, and the `assets` folder together with their existing names.
4. Serve `index.html` as the default page and enable HTTPS using your hosting provider.

Any standard static-file web server works. Asset paths are relative, so the site can also be hosted inside a subfolder. No URL rewrites are needed.

## Preview locally

From inside this folder, run:

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080` in your browser. Stop the server with Ctrl+C.

## Files

- `index.html`: page content, navigation, forms, and metadata.
- `base.css`: browser resets and base styles.
- `style.css`: layout, typography, colors, and responsive styles.
- `app.js`: before/after sliders, mobile menu, animations, and demo form behavior.
- `assets/`: supplied logo, favicon, and generated sample project images.

## External dependencies

The page loads Barlow Condensed from Google Fonts and Satoshi from Fontshare. All page code and images are included, but the font files are not bundled. Without internet access to those font services, browser fallback fonts will be used. To eliminate those external requests, obtain appropriately licensed font files, host them locally, and replace the font stylesheet links in `index.html` with local `@font-face` definitions.

There are no API keys, paid API dependencies, or required Perplexity services.

## Important before a real business launch

- The quote form is a demo. It validates input and displays a confirmation locally, but it does not send or store submissions. Connect it to your own backend or form service before accepting real leads.
- Before/after images are generated concept illustrations, not evidence of completed company projects. Replace them with real project photos for production.
- Reviews and business details are sample content. Verify or replace the service area, hours, services, warranty, installation times, statistics, and testimonials before launch.
- The phone number used throughout the site is `817-925-8395`, taken from the supplied logo.
- The site name is GENZ Epoxy. The supplied logo artwork is included as provided.
- For social sharing on a public domain, update the `og:image` metadata in `index.html` to the full HTTPS URL of your hosted image.

## Editing

Edit text in `index.html`, appearance in `style.css`, and interactions in `app.js`. To replace photos without code changes, retain their existing filenames in `assets` and use matching before/after camera angles.
