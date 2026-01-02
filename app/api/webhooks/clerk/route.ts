import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env.local');
  }

  // Get the Svix headers for verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  const supabase = await createServerClient();

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, primary_email_address_id } = evt.data;
    const email = email_addresses.find(
      (email) => email.id === primary_email_address_id
    )?.email_address || email_addresses[0]?.email_address || '';

    try {
      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_user_id', id)
        .single();

      if (existingUser) {
        // Update existing user
        await supabase
          .from('users')
          .update({
            email,
            updated_at: new Date().toISOString(),
          })
          .eq('clerk_user_id', id);
      } else {
        // Create new user
        await supabase
          .from('users')
          .insert({
            clerk_user_id: id,
            email,
            qr_count: 0,
            ai_suggestions_used: 0,
          });
      }
    } catch (error) {
      console.error('Error syncing user to Supabase:', error);
      return new Response('Error syncing user', {
        status: 500,
      });
    }
  }

  return new Response('', { status: 200 });
}

