import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        // Handle both Next.js 15 (params as Promise) and earlier versions
        const resolvedParams = params instanceof Promise ? await params : params;
        const { id } = resolvedParams;

        if (!id) {
            return NextResponse.json(
                { error: 'Invalid QR code identifier' },
                { status: 400 }
            );
        }

        const supabase = await createServerClient();

        // Look up the dynamic QR code by unique_id
        // This is a public endpoint, so we don't require authentication
        const { data, error } = await supabase
            .from('dynamic_qr_codes')
            .select('destination_url, expires_at, deleted_at')
            .eq('unique_id', id)
            .is('deleted_at', null)
            .single();

        if (error || !data) {
            return NextResponse.json(
                { error: 'QR code not found or expired' },
                { status: 404 }
            );
        }

        // Check if expired
        const expiresAt = new Date(data.expires_at);
        const now = new Date();

        if (now > expiresAt) {
            return NextResponse.json(
                { error: 'QR code has expired' },
                { status: 410 } // 410 Gone
            );
        }

        // Return the destination URL
        return NextResponse.json({
            destination_url: data.destination_url,
        });
    } catch (error) {
        console.error('Error fetching dynamic QR code:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

