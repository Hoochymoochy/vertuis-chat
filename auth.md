1. User enters email/password in LoginPage
   ↓
2. signIn() calls supabase.auth.signInWithPassword()
   ↓
3. createBrowserClient sets these cookies:
   - sb-[project]-auth-token (the session token)
   - sb-[project]-auth-token-code-verifier
   ↓
4. Browser redirects to /chat
   ↓
5. Server runs getAuthenticatedUser()
   ↓
6. createServerClient READS those cookies
   ↓
7. Finds valid session → allows access to /chat ✅