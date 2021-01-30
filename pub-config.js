var opts = module.exports = {

  docTitle: 'jldec.eu',          // site name
  appUrl: 'https://jldec.eu',    // site url
  noRobots: true,                // not ok to crawl
  throttleReload: '1s',
  linkNewWindow: true,
  tmp: './tmp',                   // tmp dir for atomic writes

  pkgs: [
    'pub-theme-pubblog',
    'pub-pkg-font-open-sans',
    'pub-pkg-font-awesome',
    'pub-pkg-seo',
    'pub-pkg-highlight'
  ],

  github: 'https://github.com/jldec/cloudflare-pages-test',

  sources: [
    {
      path: 'markdown',
      writable: true
    }
  ],

  staticPaths: [
    { path:'./images', route:'/images' },
    './favicon.ico'
  ],

  outputs: [
    {
      path: './out',
      relPaths: true
    }
  ],

};
