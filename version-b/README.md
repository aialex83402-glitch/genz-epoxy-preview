# GENZ Epoxy

Static website. Unzip this archive. Its root is the site: `index.html`, `base.css`, `style.css`, `app.js`, and the `assets` folder.

## Deploy

1. Unzip the archive.
2. Upload those root files, keeping `assets` beside `index.html`, to the document root you want to serve. Examples are `public_html`, `www`, or `/var/www/html`.
3. Serve `index.html` as the default page.

No build step, package install, or database is required. Any static-file server works. Paths are relative, so the same files can also sit in a subfolder.

## Preview locally

From the unzipped folder, run:

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080`. Stop the server with Ctrl+C.

## Files

- `index.html`: page content, navigation, forms, and metadata.
- `base.css`: browser resets and base styles.
- `style.css`: layout, typography, colors, and responsive styles.
- `app.js`: before/after sliders, mobile menu, animations, and preview form behavior.
- `assets/`: logo, favicon, sample project images, and flake color tiles.

## Fonts

The page loads Barlow Condensed from Google Fonts and Satoshi from Fontshare. The font files are not in this archive. Without those services, the browser uses its fallback fonts. To avoid those requests, host font files you have permission to use and replace the font links in `index.html` with local `@font-face` rules.

## On this page

The quote form is a preview. It does not send, store, or monitor what is typed.

The Reviews section shows six short customer comments as supplied by the owner, shown with first name and last initial plus the source (Facebook recommendation or Yelp). The comments are kept in the customers’ own words. Edit or remove them in the `#reviews` section of `index.html`.

Before/after images are labeled “AI concept illustration — not an actual customer property.”

Hours are Mon–Sat 7am–6pm. The phone number on the page is 817-925-8395. This version uses the name GENZ Epoxy. The supplied logo artwork is included as provided.

## Editing

Edit text in `index.html`, appearance in `style.css`, and interactions in `app.js`. To replace photos without code changes, retain their existing filenames in `assets` and use matching before/after camera angles.
