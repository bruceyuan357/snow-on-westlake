# 山水人间 · Eight Literary Works

Eight complete Chinese classical texts, 85 AI paintings, and a shared collection page.
Scroll to move through each work; click the subtle rings on lamps, letters, water,
fish, cups, horses and instruments to enter a closer scene. The reading pages show only
the original text over the paintings.

| Work | Author | Paintings | Folder |
| --- | --- | ---: | --- |
| 湖心亭看雪 | 张岱 | 7 | [hu-xin-ting-kan-xue](hu-xin-ting-kan-xue/index.html) |
| 岳阳楼记 | 范仲淹 | 12 | [yueyang-lou-ji](yueyang-lou-ji/index.html) |
| 醉翁亭记 | 欧阳修 | 12 | [zuiweng-ting-ji](zuiweng-ting-ji/index.html) |
| 石壕吏 | 杜甫 | 10 | [shi-hao-li](shi-hao-li/index.html) |
| 茅屋为秋风所破歌 | 杜甫 | 10 | [mao-wu-wei-qiu-feng-suo-po-ge](mao-wu-wei-qiu-feng-suo-po-ge/index.html) |
| 小石潭记 | 柳宗元 | 10 | [xiao-shi-tan-ji](xiao-shi-tan-ji/index.html) |
| 滕王阁序 | 王勃 | 18 | [teng-wang-ge-xu](teng-wang-ge-xu/index.html) |
| 天净沙·秋思 | 马致远 | 6 | [tian-jing-sha-qiu-si](tian-jing-sha-qiu-si/index.html) |

滕王阁序 includes the concluding eight-line 滕王阁诗. All seven original
literary texts are complete; 天净沙·秋思 adds its complete five-line text.
The artwork and writing scenes are artistic
interpretations, not historical documentation.

## Run and deploy

This is a complete static website. No packages, build step, API keys, remote fonts
or external runtime services are needed. Keep each work's art folder beside its
index.html. Pictures are stored once in the collection to keep the complete ZIP
under 32 MB; the cover pictures reuse those files. This compact delivery resizes
the paintings to at most 1280 pixels wide and encodes WebP at quality 76.
The original seven-work package and full-size generated images are preserved
separately in the recovery workspace.

For local viewing, run python3 -m http.server 8000 in this folder.
For GitHub, copy all bundle contents including hidden files to the existing
bruceyuan357/snow-on-westlake checkout, preserving its Git history and unrelated
files. Select Settings → Pages → Source → GitHub Actions and push to main.
The included workflow stages only the public site and preserves an optional CNAME.
If another Pages workflow already exists, reconcile it to avoid competing deployments.

Expected collection address after a successful deployment:
https://bruceyuan357.github.io/snow-on-westlake/

Each work is available under its folder name at that address. This download does
not itself claim that anything has been published to GitHub. Give your local agent
the ZIP and the instructions in PUBLISH_WITH_LOCAL_AGENT.md to perform deployment.

## Edit or export

Every deployed HTML is editable; modular sources for seven works are included under
source/. See source/README.md for the two no-dependency Node.js build commands.
To export any work as a single HTML with embedded pictures, run:

    python3 tools/export-standalone.py shi-hao-li

With no arguments it exports all eight works to dist/. Each exported ZIP has
index.html at its root. The five new standalone downloads delivered alongside this
collection already use this self-contained format.

The pages support desktop and phone layouts, keyboard or touch hotspots,
browser Back, reduced-motion preferences, static reading without JavaScript and
an original-image fallback without WebGL. Print output contains the prose.
SHA256SUMS records the delivered files; update it if you intentionally edit them.
The original MIT license remains in LICENSE.
