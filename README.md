# 山水三记 · Three Literary Landscapes

Three finished, standalone literary web experiences, with a shared entry page:

| Work | Author | AI paintings | Page |
| --- | --- | ---: | --- |
| 湖心亭看雪 | 张岱 | 7 | [Open](hu-xin-ting-kan-xue/index.html) |
| 岳阳楼记 | 范仲淹 | 12 | [Open](yueyang-lou-ji/index.html) |
| 醉翁亭记 | 欧阳修 | 12 | [Open](zuiweng-ting-ji/index.html) |

Each work retains its complete original prose, scroll transitions, gentle camera movement, ambient effects and clickable painting details that lead into close views and the author's imagined writing state. The three finished HTML files are copied unchanged from the delivered works. The collection page links to them.

## Open locally

Open `index.html` in a browser. The links work directly from disk. Each work also opens independently; its paintings, CSS and JavaScript are embedded. There are no remote fonts, analytics, runtime dependencies or API keys. The collection's three cover images are in `assets/`.

For a local web server, Python 3 is sufficient:

```sh
python3 -m http.server 8000
```

## Publish to GitHub Pages

The intended existing repository is `bruceyuan357/snow-on-westlake`. Extract this ZIP into a temporary directory, then copy its contents into that repository's checkout, including `.github/`, `.gitignore` and `.nojekyll`. Preserve the checkout's `.git` folder, history, unrelated files and local changes. The new root `index.html` is the collection page; the original Westlake work is now at `hu-xin-ting-kan-xue/index.html`.

In **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**. Commit and push the files to `main`. If the repository uses a different publishing branch, update the workflow's `on.push.branches` first. If another Pages deployment workflow already exists, reconcile it so only one workflow publishes the site.

`.github/workflows/pages.yml` stages only the public site, then uses GitHub's official Pages actions to deploy it. Node.js and Python are not needed for deployment. The optional existing `CNAME` is preserved in the website artifact. Documentation and editable sources stay in the repository and are not included in the Pages artifact.

Without a custom domain, the expected addresses after successful deployment are:

- Collection: `https://bruceyuan357.github.io/snow-on-westlake/`
- 湖心亭看雪: `https://bruceyuan357.github.io/snow-on-westlake/hu-xin-ting-kan-xue/`
- 岳阳楼记: `https://bruceyuan357.github.io/snow-on-westlake/yueyang-lou-ji/`
- 醉翁亭记: `https://bruceyuan357.github.io/snow-on-westlake/zuiweng-ting-ji/`

These are expected addresses, not a claim that this bundle has already been published. Every internal link is relative so the site also works under a different repository name or a custom domain.

## Local-agent handoff

Give your local coding agent the ZIP and paste the contents of [PUBLISH_WITH_LOCAL_AGENT.md](PUBLISH_WITH_LOCAL_AGENT.md). It contains the repository, deployment steps and verification requirements. The bundle contains no account credentials or Git history.

## Editing

`hu-xin-ting-kan-xue/index.html` is the complete editable source of the original work. For the two longer essays, `literary-pages/` also contains their original text, scene definitions, shared CSS and JavaScript, and 24 optimized WebP paintings. Their generated standalone HTML files are already included.

After editing those sources, regenerate the two longer works with Node.js, without installing packages:

```sh
node literary-pages/build.cjs
```

The builder validates that the scene text matches each complete essay. It does not change the collection page or the Westlake work. See [the source notes](literary-pages/README.md) for details. `SHA256SUMS` records the delivered files; regenerate or remove that delivery manifest if you intentionally edit them.

The pages respect reduced-motion preferences, support keyboard-operated hotspots, and retain readable static fallbacks without JavaScript or WebGL. The historical prose is reproduced as literature; the AI paintings and author scenes are artistic interpretations, not exact historical reconstructions or authentic portraits. The original repository's MIT license is retained in `LICENSE`.
