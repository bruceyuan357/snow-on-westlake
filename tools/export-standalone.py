"""Export any work as a self-contained HTML and ZIP. No third-party packages."""
from pathlib import Path
import base64
import re
import sys
import zipfile
root=Path(__file__).resolve().parent.parent
slugs=['hu-xin-ting-kan-xue', 'yueyang-lou-ji', 'zuiweng-ting-ji', 'shi-hao-li', 'mao-wu-wei-qiu-feng-suo-po-ge', 'xiao-shi-tan-ji', 'teng-wang-ge-xu', 'tian-jing-sha-qiu-si']
selected=sys.argv[1:] or slugs
for slug in selected:
    if slug not in slugs:
        raise SystemExit("Unknown work: "+slug)
    folder=root/slug
    text=(folder/"index.html").read_text(encoding="utf-8")
    def embed(match):
        relative=match.group(2)
        target=(folder/relative).resolve()
        if not target.is_relative_to(folder.resolve()) or target.suffix!=".webp":
            raise ValueError("Unexpected asset path: "+relative)
        data=base64.b64encode(target.read_bytes()).decode()
        return match.group(1)+"data:image/webp;base64,"+data+'"'
    text=re.sub(r'(<img\b[^>]*\bsrc=")(\./art/[^"]+)"',embed,text)
    output=root/"dist"/slug
    output.mkdir(parents=True,exist_ok=True)
    (output/"index.html").write_text(text,encoding="utf-8")
    archive=root/"dist"/(slug+".zip")
    with zipfile.ZipFile(archive,"w",zipfile.ZIP_DEFLATED,compresslevel=9) as pack:
        pack.writestr("index.html",text)
    if archive.stat().st_size>=32_000_000:
        raise ValueError("ZIP exceeds 32 MB: "+slug)
    print(archive)
