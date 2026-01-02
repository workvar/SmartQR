'use server'

import { GoogleGenAI, Type } from "@google/genai";
import { BrandingSuggestion, QRSettings } from "../types";
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import { QRCode } from '@/lib/supabase/types';

export async function fetchLogo(url: string): Promise<string | null> {
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const mimeType = response.headers.get('content-type') || 'image/png';
        return `data:${mimeType};base64,${base64}`;
    } catch (error) {
        console.error('Error fetching logo:', error);
        return null;
    }
}

export async function getBrandingInsights(url: string): Promise<BrandingSuggestion> {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Please log in to use AI suggestions');
    }

    // Check AI suggestions limit
    const supabase = await createServerClient();
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('ai_suggestions_used')
        .eq('clerk_user_id', userId)
        .single();

    if (userError && userError.code !== 'PGRST116') {
        console.error('Error checking user limits:', userError);
        throw new Error('Error checking your account limits');
    }

    const aiSuggestionsUsed = userData?.ai_suggestions_used || 0;
    if (aiSuggestionsUsed >= 2) {
        throw new Error('AI suggestions limit reached (2/2). You have used all your AI suggestions.');
    }

    // Validate and sanitize URL input
    if (!url || typeof url !== 'string') {
        throw new Error('Invalid URL provided');
    }

    // Trim the URL
    let sanitizedUrl = url.trim();

    // Extract only the base URL (protocol + hostname + pathname) without query parameters or hash
    // This prevents passing large query strings that could cause 431 errors
    try {
        const urlObj = new URL(sanitizedUrl);
        // Reconstruct URL with only protocol, hostname, and pathname (no query params, no hash)
        sanitizedUrl = `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
    } catch {
        throw new Error('Invalid URL format');
    }

    // Validate URL length to prevent header size issues
    if (sanitizedUrl.length > 2048) {
        throw new Error('URL is too long. Please use a shorter URL.');
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured');
    }

    const ai = new GoogleGenAI({ apiKey });

    // Use sanitized URL in prompt - analyze the website URL itself, not a QR code
    const prompt = `Analyze the following website URL and suggest color palette for a QR code based on the website's brand colors.

Website URL: ${sanitizedUrl}

Analyze the website's brand colors and color scheme. Based on this analysis, suggest:
1. Primary color (hex) for QR dots - should match or complement the website's primary brand color
2. Secondary color (hex) for corner squares/eyes - should match or complement the website's secondary/accent color
3. Background color (hex) - if a background color would enhance the design, suggest a hex color that matches the website's color scheme. If transparent background is better, set backgroundColor to null
4. If a gradient background would look better, set bgGradientEnabled to true and provide bgGradientSecondary color
5. Make sure the colors are not too dark or too light, they should be readable and contrast well with the background.

Return only color values in hex format.`;

    console.log('[Gemini API] Request:', {
        url: sanitizedUrl,
        model: 'gemini-2.0-flash',
        prompt: prompt.substring(0, 200) + '...' // Log first 200 chars
    });

    const requestConfig = {
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    primaryColor: { type: Type.STRING, description: 'Primary hex color for QR dots' },
                    secondaryColor: { type: Type.STRING, description: 'Secondary hex color for corner squares' },
                    backgroundColor: {
                        type: Type.STRING,
                        description: 'Background hex color, or null/empty string if transparent background is preferred'
                    },
                    bgGradientEnabled: {
                        type: Type.BOOLEAN,
                        description: 'Whether to use a gradient background instead of solid color'
                    },
                    bgGradientSecondary: {
                        type: Type.STRING,
                        description: 'Secondary hex color for gradient (only if bgGradientEnabled is true)'
                    }
                },
                required: ['primaryColor', 'secondaryColor']
            }
        }
    };

    console.log('[Gemini API] Full Request Config:', JSON.stringify(requestConfig, null, 2));

    const response = await ai.models.generateContent(requestConfig);

    console.log('[Gemini API] Response:', {
        text: response.text,
        fullResponse: JSON.stringify(response, null, 2)
    });

    const result = JSON.parse(response.text || '{}');

    console.log('[Gemini API] Parsed Result:', result);

    // Normalize null/empty string values
    if (result.backgroundColor === '' || result.backgroundColor === null) {
        result.backgroundColor = null;
    }
    if (result.bgGradientEnabled === undefined) {
        result.bgGradientEnabled = false;
    }

    console.log('[Gemini API] Final Normalized Result:', result);

    // Increment AI suggestions count
    const newCount = aiSuggestionsUsed + 1;
    await supabase
        .from('users')
        .update({ ai_suggestions_used: newCount })
        .eq('clerk_user_id', userId);

    return result;
}

export async function saveQRCode(name: string, url: string, settings: QRSettings, qrId?: string | null): Promise<string> {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Please log in to save QR codes');
    }

    const supabase = await createServerClient();

    // Get user ID from users table
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, qr_count')
        .eq('clerk_user_id', userId)
        .single();

    if (userError) {
        console.error('Error fetching user:', userError);
        throw new Error('User not found. Please contact support.');
    }

    if (!userData) {
        throw new Error('User not found. Please contact support.');
    }

    if (qrId) {
        // Update existing QR
        const { data, error } = await supabase
            .from('qr_codes')
            .update({
                name,
                url,
                settings,
                updated_at: new Date().toISOString(),
            })
            .eq('id', qrId)
            .eq('user_id', userData.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating QR code:', error);
            throw new Error('Failed to update QR code');
        }

        return data.id;
    } else {
        // Check QR limit
        if (userData.qr_count >= 4) {
            throw new Error('QR code limit reached (4/4). Please delete an existing QR code to create a new one.');
        }

        // Create new QR
        const { data, error } = await supabase
            .from('qr_codes')
            .insert({
                user_id: userData.id,
                name,
                url,
                settings,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating QR code:', error);
            throw new Error('Failed to save QR code');
        }

        // Increment QR count
        await supabase
            .from('users')
            .update({ qr_count: userData.qr_count + 1 })
            .eq('id', userData.id);

        return data.id;
    }
}

export async function checkQRLimit(): Promise<{ canCreate: boolean; count: number; limit: number }> {
    const { userId } = await auth();
    if (!userId) {
        return { canCreate: false, count: 0, limit: 4 };
    }

    const supabase = await createServerClient();
    const { data: userData } = await supabase
        .from('users')
        .select('qr_count')
        .eq('clerk_user_id', userId)
        .single();

    const count = userData?.qr_count || 0;
    return { canCreate: count < 4, count, limit: 4 };
}

export async function getUserData(): Promise<{ qr_count: number; ai_suggestions_used: number } | null> {
    const { userId } = await auth();
    if (!userId) {
        return null;
    }

    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from('users')
        .select('qr_count, ai_suggestions_used')
        .eq('clerk_user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error loading user data:', error);
        return null;
    }

    return data || null;
}

export async function getUserQRCodes(): Promise<QRCode[]> {
    const { userId } = await auth();
    if (!userId) {
        return [];
    }

    const supabase = await createServerClient();
    
    // First get user ID from users table
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_user_id', userId)
        .single();

    if (userError || !userData) {
        console.error('Error fetching user:', userError);
        return [];
    }

    const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading QR codes:', error);
        return [];
    }

    return data || [];
}

export async function deleteQRCode(qrId: string): Promise<{ success: boolean; error?: string }> {
    const { userId } = await auth();
    if (!userId) {
        return { success: false, error: 'Not authenticated' };
    }

    const supabase = await createServerClient();

    // Get user ID from users table
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, qr_count')
        .eq('clerk_user_id', userId)
        .single();

    if (userError || !userData) {
        return { success: false, error: 'User not found' };
    }

    // Verify QR code belongs to user
    const { data: qrData, error: qrError } = await supabase
        .from('qr_codes')
        .select('id')
        .eq('id', qrId)
        .eq('user_id', userData.id)
        .single();

    if (qrError || !qrData) {
        return { success: false, error: 'QR code not found or access denied' };
    }

    // Delete QR code
    const { error: deleteError } = await supabase
        .from('qr_codes')
        .delete()
        .eq('id', qrId)
        .eq('user_id', userData.id);

    if (deleteError) {
        console.error('Error deleting QR code:', deleteError);
        return { success: false, error: 'Failed to delete QR code' };
    }

    // Update user QR count
    const newCount = Math.max(0, userData.qr_count - 1);
    await supabase
        .from('users')
        .update({ qr_count: newCount })
        .eq('id', userData.id);

    return { success: true };
}

