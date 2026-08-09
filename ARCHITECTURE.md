# Pharmacy Trolley Architecture

The application remains deployable as a single-page `index.html`, while its
high-risk domain and infrastructure rules are isolated in `architecture/`.
Each module is a browser-compatible classic script and is loaded before the
legacy inline application code. The inline code keeps a fallback path so an
older cached page or a test harness can still start safely.

## Boundaries

- `state-repository.js`: canonical state payloads and fingerprints.
- `supabase-rest-client.js`: REST transport boundary for Supabase requests.
- `auth-session.js`: session storage and session lifecycle boundary.
- `save-coordinator.js`: serialized save queue and conflict-safe persistence.
- `backup-policy.js`: backup retention and stale-row selection.
- `session-timeout.js`: inactivity timeout lifecycle.
- `auth-runtime.js`: Supabase sign-in, recovery, invite, and session lifecycle.
- `persistence-runtime.js`: conflict-safe Supabase loading, saving, and pending-write recovery.
- `voice-module.js`: voice capture, drug resolution, and voice-session confirmation.
- `backup-module.js`: backup scheduling, retention, listing, and restoration UI flow.
- `text-policy.js`: normalization and HTML escaping.
- `date-policy.js` / `medication-policy.js`: date and expiry classification rules.
- `shelf-search.js`, `shelf-module.js`, `shelf-operations.js`: shelf queries and immutable shelf changes.
- `shelf-storage.js`: image validation, upload, signed URLs, and deletion.
- `medication-operations.js`: immutable medication creation, import normalization,
  updates, assignment, removal, and unassignment.

## Change rules

1. Put pure validation, transformation, and policy logic in `architecture/`.
2. Keep DOM and modal orchestration in `index.html`.
3. Domain operations must return new objects/arrays and must not mutate inputs.
4. Preserve the inline fallback until the external module has equivalent test coverage.
5. Run `npm test` and `git diff --check` before every merge.

## Recovery

The reference backup created before the refactor is stored under the sibling
`outputs/architecture-reference-*` directory. Git commits are the normal
rollback mechanism; the working tree must remain clean before deployment.
