# Metrics — Authentication backend integration

## Acceptance metrics

| Metric | Target | Measurement |
| --- | --- | --- |
| Type safety | 0 TypeScript errors | `npm run typecheck` |
| Auth unit tests | 100% selected auth/session/http/guard specs pass | Vitest command in report |
| Access-token persistence | 0 Web Storage writes | Session unit test + code review |
| Refresh duplication | 1 request for concurrent 401s | Session/HTTP unit tests |
| Unauthorized CMS access | 0 Customer sessions reach dashboard | role gate unit/integration coverage |

## Operational metrics to add after deploy

- Login success/failure rate by role, without recording credentials.
- Refresh success rate and 401-after-retry rate.
- Logout revoke failure rate.
- Password reset completion rate.
- 403 rate split by `STAFF` and `ADMIN`.
