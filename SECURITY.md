# Security deployment notes

The application now requires Supabase Auth and reads the caller's role from `public.app_users`.

Safe rollout order:

1. Keep the verified pre-fix export outside Supabase.
2. Create the administrator in Supabase Auth.
3. Review and run `supabase/security_migration.sql` in a maintenance window.
4. Add the administrator to `public.app_users` using the commented bootstrap statement.
5. Test reader, writer, and administrator accounts against staging.
6. Deploy the updated `index.html` only after the authenticated staging checks pass.

At the hosting layer, send `Content-Security-Policy: frame-ancestors 'none'` and
`X-Content-Type-Options: nosniff` as HTTP response headers. `frame-ancestors`
cannot be enforced by an HTML `<meta>` element.

The browser's anon key is a public project identifier, not an authorization secret. RLS and the authenticated JWT now provide authorization. Never place a service-role key in this repository or in browser code.

The migration also adds an immutable server-side history row before every state update. Only administrators can read that history, and browser clients cannot delete it.
