# Security deployment notes

The application now requires Supabase Auth and reads the caller's role from `public.app_users`.

Safe rollout order:

1. Keep a same-day verified export outside Supabase.
2. Create the administrator in Supabase Auth and have the user accept the invitation.
3. Run `supabase/security_migration.sql`. This preparation phase deliberately keeps the legacy UI working.
4. Add the administrator to `public.app_users` using the commented bootstrap statement.
5. Test reader, writer, and administrator behavior against the preview deployment, including a confirmed write and restore safety check.
6. Deploy the updated `index.html` while the legacy anon access still exists.
7. Confirm the authenticated production UI can read and perform one controlled write.
8. Run `supabase/security_cutover.sql` to revoke anonymous access.
9. Confirm anonymous REST access is denied and authenticated access still works.

If production must be reverted after step 8, redeploy the legacy HTML and run
`supabase/security_rollback.sql` to restore only the minimum legacy grants.

At the hosting layer, send `Content-Security-Policy: frame-ancestors 'none'` and
`X-Content-Type-Options: nosniff` as HTTP response headers. `frame-ancestors`
cannot be enforced by an HTML `<meta>` element.

The browser's anon key is a public project identifier, not an authorization secret. RLS and the authenticated JWT now provide authorization. Never place a service-role key in this repository or in browser code.

The migration also adds an immutable server-side history row before every state update. Only administrators can read that history, and browser clients cannot delete it.
