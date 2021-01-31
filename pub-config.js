var opts = module.exports = {

  docTitle: (process.env.JLDEC_UK ? 'jldec.uk' : 'jldec.eu'), // site name
  appUrl: 'https://' + (process.env.JLDEC_UK ? 'jldec.uk' : 'jldec.eu'), // site url
  noRobots: true, // not ok to crawl
  throttleReload: '1s',
  linkNewWindow: true,
  tmp: './tmp', // tmp dir for atomic writes

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
    './favicon.ico',
    './CNAME',
    './.nojekyll',
    './cloudflare-pages-test-log-1.txt'
  ],

  outputs: [
    {
      path: './out',
      relPaths: true
    }
  ],

};
