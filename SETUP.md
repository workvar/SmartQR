# Setup Instructions for NovaQR Studio

## Environment Variables

Add the following to your `.env.local` file:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Supabase (Server-side only - NOT public)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Gemini (for AI suggestions)
GEMINI_API_KEY=your_gemini_api_key
```

## Database Setup

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor in your Supabase dashboard
3. Run the SQL script from `supabase-schema.sql` to create the necessary tables and policies
4. Get your Service Role Key:
   - Go to Project Settings → API
   - Copy the `service_role` key (NOT the anon key)
   - This key has admin privileges and should NEVER be exposed to the client
   - Add it to `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`

## Clerk Webhook Setup

1. Go to your Clerk Dashboard → Webhooks
2. Create a new webhook endpoint pointing to: `https://your-domain.com/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`, and `user.deleted`
4. Copy the webhook signing secret and add it to `.env.local` as `CLERK_WEBHOOK_SECRET`

**Note:** The `user.deleted` event is handled with soft delete - users are marked as deleted but their data is preserved to prevent limit abuse.

## Features Implemented

### 1. Dashboard Page
- After login, users are redirected to `/dashboard`
- Shows all created QR codes
- Displays limits: 4 QR codes max, 2 AI suggestions max
- Edit and delete functionality for QR codes

### 2. QR Code Limits
- Users can create maximum 4 QR codes
- Users can use maximum 2 AI suggestions
- Limits are enforced in the application

### 3. User Management
- Logout button is now in the UserButton dropdown (cleaner UI)
- User data is synced to Supabase via Clerk webhooks

### 4. QR Code Management
- Save QR codes from the design step
- Edit existing QR codes from dashboard
- Delete QR codes (count is automatically updated)

## Database Schema

- **users**: Tracks user limits (qr_count, ai_suggestions_used)
- **qr_codes**: Stores all QR code data with settings

## Authentication Flow

1. User signs up/logs in via Clerk
2. Clerk webhook creates/updates user in Supabase
3. User is redirected to dashboard
4. User can create, edit, or delete QR codes

