# cloudflare-pages-test / jldec.eu
Repo based on source repo for [jldec.me](https://jldec.me).

This blog is generated from markdown using [pub-server](https://jldec.github.io/pub-doc).

To edit the site locally, clone https://github.com/jldec/cloudflare-pages-test, then

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
