# cloudflare-pages-test

Copy of the (private) source repo for [jldec.me](https://jldec.me).  
Contains markdown blog content to generate a static site using [pub-server](https://jldec.github.io/pub-doc).

### auto-deploy on push

- Vercel site at [jldec.fun](https://jldec.fun)
- Cloudflare Pages site at [jldec.eu](https://jldec.eu)
- GitHub Action generates GitHub Pages site at [jldec.uk](https://jldec.uk)

### build environment

see [pub-config.js](pub-config.js)

- `DOMAIN` : for site name and fully qualified urls, e.g. in sitemap.xml.
- `PREVIEW` : if set, also add ` (preview)` to the site name.

### to edit content

Clone https://github.com/jldec/cloudflare-pages-test, then

```sh
npm install
```

To preview at http://localhost:3001/ while you edit the markdown (using any editor).

```sh
npm start
```

The browser preview will auto-reload whenever you save a file.

To generate a new set of html and copy static files into ./out.

```sh
npm run generate
```

To preview the generated static output at http://localhost:3001/

```sh
npm run preview
```



