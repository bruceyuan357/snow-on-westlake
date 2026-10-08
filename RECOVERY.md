# Recovery of the literary collection

The previous chat, “Set up snow-on-westlake”, failed with HTTP 400:

    The combined resolved image content is too large.
    Reduce the number or size of input images.
    code: image_request_too_large
    param: input

Its unfinished four-work turn records 52 completed image generations, including
art corrections. The combined resolved image input exceeded the request limit.
Later requests, including “compress it” and the request for 天净沙·秋思, were
rejected before the agent could execute commands. The error identifies image
input, and does not establish a text-context limit, a broken website, or a bad ZIP.
The precise image-size threshold and exact rejected payload are not exposed by
the saved error.

The seven-work package survived. All 114 entries in its original SHA256SUMS
verified before this recovery copied it to a separate eight-work folder. The
original package and generated full-size PNGs were preserved. The new copy adds
the complete 天净沙·秋思 by 马致远, six paintings, two click transitions, sources,
a collection entry, standalone export support, and the updated Pages workflow.

All 85 delivery paintings are WebP at quality 76 with a maximum edge of 1280
pixels. The older 79 paintings went from 21,158,224 to 10,395,538 bytes, a 50.87%
reduction. The six new delivery paintings total 903,908 bytes. All Chinese texts
were preserved, including 滕王阁序's concluding eight-line poem.

ZIP compression or resizing files on disk does not remove images already stored
in the old chat. Continue from this bundle in a fresh chat, use small previews,
and keep image inspection batches small. The full-size originals are unnecessary
for publishing the site.

See VERIFICATION.json for the completed checks. This package is a tested source
and download delivery. The cloud browser blocks file:// navigation; offline
standalone checks use a blob document with networking disabled. Native-file
opening is included in the local publishing agent’s verification instructions.
Publication uses the owner's local GitHub agent following
PUBLISH_WITH_LOCAL_AGENT.md; this recovery does not claim a new public deployment.
