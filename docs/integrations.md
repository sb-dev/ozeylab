# Integrations

The repository works with Node.js 24 and no third-party runtime packages.
Skills run through a coding agent with access to this checkout. They are canonical
in skills/. `install-skills` copies them into a tool's repository-local skill folder.
These copies depend on ozeylab processes; do not distribute one as a standalone skill.

## Wider projects

- Production Skills: inspect and select relevant production expertise and bootstrap patterns.
- llm-wiki: use the source/ontology/reviewer method adapted in processes/wiki.md.
- Pactwright: owns delivery inside a generated target when configured there.
- Prompt Engineering: owns reusable prompt implementations and run history when available.

No connector or API integration with these repositories is implied by these links.
Record selected versions and contracts before binding a target to them.

## Domain provider

Set NAMECOM_USERNAME and NAMECOM_TOKEN in the environment or Actions secrets.
Only the production read-only availability endpoint is called. No registration,
transfer, renewal or payment endpoint exists in this code.

Official references checked 8 October 2026:
- https://docs.name.com/api/v1/reference/domains/check-availability
- https://www.name.dev/learn/the-name-com-api-authentication-and-sandbox-setup-guide

Interpret purchasable=true with purchaseType=registration as an explicit registration
offer. Other purchase types are resale/non-registration offers. A negative offer
is unavailable at this provider; it does not prove registration. Preserve raw results.
Initial quotes can cover a TLD-specific minimum term. Confirm term, fees, restrictions
and final checkout prices separately. Credentials and live provider access are
required; fixture tests do not verify a live result.
