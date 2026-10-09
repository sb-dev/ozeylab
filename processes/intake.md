# Intake

Accept a domain, description, files or any combination. Search existing records first.

Use `create` for a new record and `ingest` for each new source. Supply files from
any explicit path. Copy them into organised sources/<subject>/<source-id>/ paths.
For a directory input, enumerate explicit files, exclude generated outputs and
management instructions, and ingest each under a stable ID. Do not follow symlinks.

Descriptions become source notes. Preserve original files and SHA-256 hashes.
For PDF, images and office files, use an appropriate extraction tool and supply
`--extract readable.md`. Review tables, figures, units and code against the original.
The CLI preserves binary files without claiming extraction succeeded.

Supersede by ingesting with the same source ID. Withdraw with a reason. Moves do
not change identity. A repeated current hash is a no-op. Pending versions must be
incorporated or explicitly excluded with a reason before assessment completion.
