# Security Implementation

## Supabase Configuration

This application uses **server-side only** Supabase access for security:

### Environment Variables
- `SUPABASE_URL` - Supabase project URL (server-side only)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key with admin privileges (server-side only, NEVER expose to client)

### Why Service Role Key?

1. **No Public Keys**: The service role key is never exposed to the client
2. **Server-Side Only**: All database operations happen in server actions
3. **Manual Security**: Since service role bypasses RLS, we implement security checks in server actions:
   - All actions verify user authentication via Clerk
   - All queries filter by `clerk_user_id` to ensure users only access their own data
   - Ownership verification before updates/deletes

### Security Measures

1. **Authentication Required**: All server actions check `auth()` from Clerk
2. **User Verification**: All queries verify user ownership via `clerk_user_id`
3. **No Client Access**: The client never directly accesses Supabase
4. **Server Actions Only**: All database operations go through server actions in `app/actions.ts`

### Server Actions

All database operations are handled through server actions:

- `getUserData()` - Get user limits (verified by Clerk user ID)
- `getUserQRCodes()` - Get user's QR codes (filtered by user ID)
- `saveQRCode()` - Save/update QR code (verifies user ownership)
- `deleteQRCode()` - Delete QR code (verifies ownership before deletion)
- `getBrandingInsights()` - AI suggestions (checks limits, increments counter)

### Important Notes

⚠️ **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` to the client
⚠️ **NEVER** use `NEXT_PUBLIC_` prefix for Supabase credentials
⚠️ **ALWAYS** verify user ownership in server actions before database operations

