"""Package each standalone page with index.html at the archive root."""
from pathlib import Path
import hashlib
import time
import zipfile

repository = Path(__file__).resolve().parent.parent
for slug in ("yueyang-lou-ji", "zuiweng-ting-ji"):
    source = repository / slug / "index.html"
    content = source.read_bytes()
    archive = repository.parent / (slug + ".zip")
    entry = zipfile.ZipInfo("index.html", time.localtime(source.stat().st_mtime)[:6])
    entry.create_system = 3
    entry.external_attr = 0o100644 << 16
    with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as package:
        package.writestr(entry, content, compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
    archive.chmod(0o644)
    assert archive.stat().st_size < 32_000_000, "ZIP exceeds the 32 MB limit"
    with zipfile.ZipFile(archive) as package:
        assert package.namelist() == ["index.html"]
        assert package.testzip() is None
        assert hashlib.sha256(package.read("index.html")).digest() == hashlib.sha256(content).digest()
    print(f"{archive}: {archive.stat().st_size / 1_000_000:.2f} MB, integrity verified")
