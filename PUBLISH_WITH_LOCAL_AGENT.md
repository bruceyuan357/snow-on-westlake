Publish the contents of eight-classics-github.zip to my existing GitHub
repository bruceyuan357/snow-on-westlake and deploy the collection with GitHub Pages.
This expands my existing three works to eight, adding 石壕吏、茅屋为秋风所破歌、
小石潭记、滕王阁序、天净沙·秋思（马致远，古道西风瘦马）. Complete the deployment, not just a plan.

1. Locate the ZIP in my Downloads or workspace, or ask for its path if absent.
   Extract to a temporary folder and verify SHA256SUMS. Use my existing GitHub
   authentication. Inspect the target repository, branch and Pages configuration.
2. Reuse a suitable clean checkout or clone the repository. Preserve Git history,
   unrelated files and uncommitted work; do not force-push. Copy the bundle's
   contents to the repository root, including hidden files and the workflow.
   Do not commit the ZIP itself. Keep all eight HTML files and all 85 art files.
3. Preserve the designs, complete Chinese texts, painting order, click transitions,
   and images. This collection references each work's local art folder, so upload
   these folders with the HTML. Do not replace them with dependencies or a framework.
4. Reconcile any existing Pages workflow so only one publishes the site. Use the
   correct publishing branch and adjust the workflow if it is not main. Set Pages
   build_type to workflow, preserving the existing custom domain and visibility.
   If the repository is missing, create it under bruceyuan357 only if my authenticated
   account is authorized; do not choose a different owner silently.
5. Run the included workflow's static staging step locally. Verify the collection
   and all eight work URLs under a repository subpath. Check all 85 pictures load,
   the complete text is present, scrolling and clicking work on desktop and phone.
   Export 天净沙·秋思 with tools/export-standalone.py, and check that its HTML
   opens and its two click transitions work when double-clicked locally offline;
   the cloud browser blocks file:// URLs, so that native-file check needs the Mac.
   Node.js is optional for source rebuilds; deployment needs no application build.
6. Review the diff, commit and push. If branch protection requires a PR, create one
   and report the required merge instead of claiming the site is live. Otherwise
   monitor the Pages deployment workflow and resolve failures within the available
   authorization. Dispatch the workflow if Pages was configured after the push.
7. Verify the actual public collection URL and eight work URLs. Return the repository
   URL, commit, successful Actions run and working public links. If permissions,
   policy or a required merge blocks deployment, state the exact remaining action.

Continue through routine steps without asking me to reconfirm implementation choices.
