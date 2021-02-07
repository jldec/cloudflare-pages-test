---- /fun-with-vercel ----
title: Fun with Vercel
image: images/library.jpg
date: 2021-02-07
template: post

## Vercel

Last week I wrote about [](first-steps-using-cloudflare-pages). That included a comparison with [GitHub Pages](https://docs.github.com/en/github/working-with-github-pages/about-github-pages) and also talked about [Netlify](https://www.netlify.com/products/).

[Vercel](https://vercel.com/home) is another interesting participant in the trend toward static hosting, preview builds, serverless, and [edge compute](/why-serverless-at-the-edge).

## [jldec.fun](https://jldec.fun/fun-with-vercel) 🤪

This is a walkthough of deploying [jldec.fun](https://jldec.fun/) with Vercel. Markdown source files live on [GitHub](https://github.com/jldec/cloudflare-pages-test).

The Vercel signup starts a New Project workflow _(which could be simplified.)_ 😁

![Vercel new project workflow with link to GitHub](/images/vercel-new-project.png)

Choose the first option in the dropdown.

![Vercel add GitHub account dropdown](/images/vercel-add-github-account.png)

This leads to the GitHub form for granting repo access to the 'Vercel' GitHub app. (_Look for it later in your [GitHub Settings](https://github.com/settings/installations) to add more repos, or to revoke access._)

![Authorize Vercel app on GitHub](/images/vercel-github-app.png)

Back on Vercel, select a repo, and confirm the project scope. Team scope requires a paid plan.

![Select scope for the new project](/images/vercel-select-project-scope.png)

Select the project directory within the repo - usually this will be the root.

![Select project direcotry inside repo](/images/vercel-select-directory.png)

The project name defaults to the name of the repo. I configured a build command and the output directory. I didn't really want encrypted [environment variables](https://vercel.com/docs/environment-variables) here, so I made a note to go back to change this setting later.

![Configure the build command and output directory](/images/vercel-configure-build-jldec-fun.png)

Submitting the form, triggered the first build followed by a confetti shower. 🎉

![First build and deploy confetti celebration](/images/vercel-confetti-jldec-fun.png)

I fixed the environment variables in the dashboard.

![Dashboard environment settings](/images/vercel-environment-settings.png)

When I added my domain, the form helpfully recommended configuring an IP address.

![Dashboard domain settings](/images/vercel-domain-setting.png)

Once the DNS record was in place, the invalid configuration was resolved.

![Dashboard domain settings fixed](/images/vercel-domain-setting-fixed.png)

[jldec.fun](https://jldec.fun/fun-with-vercel) is deployed from `main`. Commits to any other branch will trigger a preview deployment on a different URL.

> Static websites are awesome!  
> _!thumbs-o-up 2x_

---- #excerpt ----

Deploying [jldec.fun](https://jldec.fun/) using Vercel


