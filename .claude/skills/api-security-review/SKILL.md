---
name: api-security-review
description: Perform a static, read-only review of CMS API contracts and client-side authentication or authorization handling. Do not probe live services or perform active security testing.
---

# Read-only API security review

Review only repository code, checked-in API contracts, and documentation provided for the task. This skill does not authorize network requests to running services, active scans, fuzzing, credential use, or state-changing tests.

## Review focus

- Check how the CMS handles authentication state, token/session storage, logout, and API errors.
- Inspect client-side authorization assumptions and identify places where the UI appears to rely on itself to enforce access. Client checks improve UX; authorization must be enforced by the backend.
- Review API request/response types and checked-in contracts for sensitive fields, unsafe assumptions, and inconsistent error handling.
- Treat backend-only controls as unverified unless their implementation or authoritative contract is included in the review scope.

## Report

For each actionable finding, include the file and relevant code location, explain the violated security boundary and impact at a high level, and give a defensive remediation. Separate confirmed findings from questions or verification gaps. Do not include exploit payloads, proof-of-concept attack steps, or claims based only on the absence of backend code in this repository.
