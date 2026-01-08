'use server'

import { GoogleGenAI, Type } from "@google/genai";
import { BrandingSuggestion, QRSettings } from "../types";
import { auth, currentUser } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import { QRCode } from '@/lib/supabase/types';

/**
 * Ensures user exists in database. Creates user if they don't exist.
 * This removes dependency on webhooks - users are created on-demand.
 */
async function ensureUserExists(userId: string): Promise<{ id: string; qr_count: number; ai_suggestions_used: number }> {
    const supabase = await createServerClient();
    
    // Check if user exists (including deleted users)
    const { data: existingUser } = await supabase
        .from('users')
        .select('id, qr_count, ai_suggestions_used, deleted_at')
        .eq('clerk_user_id', userId)
        .single();

    if (existingUser) {
        // If user was deleted, restore them
        if (existingUser.deleted_at) {
            const { data: restoredUser } = await supabase
                .from('users')
                .update({
                    deleted_at: null,
                    updated_at: new Date().toISOString(),
                })
                .eq('clerk_user_id', userId)
                .select('id, qr_count, ai_suggestions_used')
                .single();
            
            if (restoredUser) {
                return restoredUser;
            }
        } else {
            // User exists and is active
            return {
                id: existingUser.id,
                qr_count: existingUser.qr_count,
                ai_suggestions_used: existingUser.ai_suggestions_used,
            };
        }
    }

    // User doesn't exist - create them
    // Get email from Clerk
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress || clerkUser?.primaryEmailAddress?.emailAddress || '';

    const { data: newUser, error } = await supabase
        .from('users')
        .insert({
            clerk_user_id: userId,
            email,
            qr_count: 0,
            ai_suggestions_used: 0,
            deleted_at: null,
        })
        .select('id, qr_count, ai_suggestions_used')
        .single();

    if (error || !newUser) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user account. Please try again.');
    }

    return newUser;
}

export async function fetchLogo(url: string): Promise<string | null> {
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        
        // Check content length before downloading
        const contentLength = response.headers.get('content-length');
        const maxSizeBytes = 1.5 * 1024 * 1024; // 1.5MB limit
        
        if (contentLength && parseInt(contentLength) > maxSizeBytes) {
            console.warn(`Image too large: ${contentLength} bytes. Skipping.`);
            return null;
        }
        
        const arrayBuffer = await response.arrayBuffer();
        
        // Double-check size after download (in case content-length was missing)
        if (arrayBuffer.byteLength > maxSizeBytes) {
            console.warn(`Image too large after download: ${arrayBuffer.byteLength} bytes. Skipping.`);
            return null;
        }
        
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

    // Ensure user exists in database
    const userData = await ensureUserExists(userId);
    const aiSuggestionsUsed = userData.ai_suggestions_used;
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
    const supabase = await createServerClient();
    const newCount = aiSuggestionsUsed + 1;
    await supabase
        .from('users')
        .update({ ai_suggestions_used: newCount })
        .eq('id', userData.id);

    return result;
}

/**
 * Gets the domain from environment variables
 */
function getDomain(): string {
    let domain = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_DOMAIN;
    
    if (domain) {
        // Remove protocol if present
        domain = domain.replace(/^https?:\/\//, '');
        return domain;
    }
    
    // Fallback to localhost for development
    return 'localhost:3000';
}

/**
 * Generates a unique identifier for dynamic QR codes
 */
function generateUniqueId(): string {
    // Generate a URL-safe unique ID using crypto
    const array = new Uint8Array(16);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(array);
    } else {
        // Fallback for environments without crypto
        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }
    }
    return Array.from(array)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export async function saveQRCode(name: string, url: string, settings: QRSettings, qrId?: string | null): Promise<string> {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Please log in to save QR codes');
    }

    // Ensure user exists in database
    const userData = await ensureUserExists(userId);
    const supabase = await createServerClient();

    const isDynamic = settings.isDynamic || false;

    // If dynamic, check dynamic QR limit (1 for free tier)
    // BUT: Skip this check if we're updating an existing QR that's already dynamic
    // (editing content of existing dynamic QR should not count against quota)
    if (isDynamic && !qrId) {
        // Only check limit when creating a NEW dynamic QR
        // Count active dynamic QRs (non-deleted and not expired)
        let dynamicCountResult = await supabase
            .from('dynamic_qr_codes')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userData.id)
            .is('deleted_at', null)
            .gt('expires_at', new Date().toISOString());
        
        if (dynamicCountResult.error && !dynamicCountResult.error.message?.includes('does not exist')) {
            console.error('Error checking dynamic QR limit:', dynamicCountResult.error);
        } else {
            const dynamicCount = dynamicCountResult.count || 0;
            if (dynamicCount >= 1) {
                throw new Error('Dynamic QR code limit reached (1/1). Free tier users can only have 1 active dynamic QR code. Please delete your existing dynamic QR code or wait for it to expire.');
            }
        }
    }
    // Note: We no longer allow converting between static and dynamic QR codes
    // The isDynamic flag check happens later when updating existing QRs

    if (qrId) {
        // Get the current QR to check its original state
        const { data: currentQR } = await supabase
            .from('qr_codes')
            .select('settings, url')
            .eq('id', qrId)
            .eq('user_id', userData.id)
            .single();
        
        if (!currentQR) {
            throw new Error('QR code not found');
        }

        const wasAlreadyDynamic = currentQR?.settings?.isDynamic || false;
        
        // Prevent changing isDynamic flag for existing QR codes
        if (isDynamic !== wasAlreadyDynamic) {
            throw new Error('Cannot change QR code type. Once a QR code is set as dynamic or non-dynamic, this setting cannot be changed.');
        }

        // For non-dynamic QRs, prevent changing the URL
        if (!isDynamic && !wasAlreadyDynamic) {
            // Keep the original URL for non-dynamic QRs
            const originalUrl = currentQR.url;
            if (url !== originalUrl) {
                throw new Error('Cannot change the content of non-dynamic QR codes. Only dynamic QR codes can have their content updated.');
            }
        }

        // For dynamic QRs, the URL parameter is the destination URL, not the scan URL
        // We need to keep the scan URL in the qr_codes table
        let finalUrl = url;
        
        if (isDynamic) {
            // Check if dynamic QR entry exists to get the scan URL
            const { data: existingDynamic } = await supabase
                .from('dynamic_qr_codes')
                .select('unique_id')
                .eq('qr_code_id', qrId)
                .eq('user_id', userData.id)
                .is('deleted_at', null)
                .single();

            if (existingDynamic) {
                // Keep the scan URL for the QR code itself
                const domain = getDomain();
                const protocol = domain.includes('localhost') ? 'http' : 'https';
                finalUrl = `${protocol}://${domain}/dynamic/scan/${existingDynamic.unique_id}`;
            }
        } else {
            // For non-dynamic, keep the original URL
            finalUrl = currentQR.url;
        }

        // Update existing QR
        const { data, error } = await supabase
            .from('qr_codes')
            .update({
                name,
                url: finalUrl,
                settings: {
                    ...settings,
                    url: finalUrl, // Update settings URL too
                    isDynamic: wasAlreadyDynamic, // Preserve original isDynamic value
                },
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

        // Handle dynamic QR update (only if it was already dynamic)
        if (isDynamic && wasAlreadyDynamic) {
            // Check if dynamic QR entry exists
            const { data: existingDynamic } = await supabase
                .from('dynamic_qr_codes')
                .select('id')
                .eq('qr_code_id', qrId)
                .eq('user_id', userData.id)
                .is('deleted_at', null)
                .single();

            if (existingDynamic) {
                // Update existing dynamic QR destination URL
                // The 'url' parameter contains the destination URL from user input
                await supabase
                    .from('dynamic_qr_codes')
                    .update({
                        destination_url: url, // This is the destination URL from the user input
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', existingDynamic.id);
            }
        }
        // Note: We no longer allow converting static to dynamic or dynamic to static

        return data.id;
    } else {
        // Check QR limit - count only active (non-deleted) QR codes
        // Try to count active QRs, fallback to total count if deleted_at column doesn't exist
        let activeCount: number | null = null;
        let countResult = await supabase
            .from('qr_codes')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userData.id)
            .is('deleted_at', null);
        
        if (countResult.error && countResult.error.message?.includes('deleted_at')) {
            // Column doesn't exist, count all QRs
            const retry = await supabase
                .from('qr_codes')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userData.id);
            activeCount = retry.count;
        } else {
            activeCount = countResult.count;
        }

        if ((activeCount || 0) >= 4) {
            throw new Error('QR code limit reached (4/4). Grab an add-on to create more QR codes.');
        }

        // Generate scan URL for dynamic QRs
        let finalUrl = url;
        let uniqueId: string | null = null;
        
        if (isDynamic) {
            uniqueId = generateUniqueId();
            const domain = getDomain();
            const protocol = domain.includes('localhost') ? 'http' : 'https';
            finalUrl = `${protocol}://${domain}/dynamic/scan/${uniqueId}`;
        }

        // Create new QR
        const { data, error } = await supabase
            .from('qr_codes')
            .insert({
                user_id: userData.id,
                name,
                url: finalUrl, // Use scan URL for dynamic, original URL for static
                settings: {
                    ...settings,
                    url: finalUrl, // Update settings URL too
                },
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating QR code:', error);
            throw new Error('Failed to save QR code');
        }

        // Create dynamic QR entry if needed
        if (isDynamic && uniqueId) {
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 15); // 15 days expiry

            const { error: dynamicError } = await supabase
                .from('dynamic_qr_codes')
                .insert({
                    qr_code_id: data.id,
                    user_id: userData.id,
                    unique_id: uniqueId,
                    destination_url: url, // Store the original destination URL
                    expires_at: expiresAt.toISOString(),
                });

            if (dynamicError) {
                console.error('Error creating dynamic QR entry:', dynamicError);
                // Clean up the QR code if dynamic entry creation fails
                await supabase
                    .from('qr_codes')
                    .delete()
                    .eq('id', data.id);
                throw new Error('Failed to create dynamic QR code');
            }
        }

        // Increment QR count (for display purposes, even if some are soft-deleted)
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

    try {
        const userData = await ensureUserExists(userId);
        const supabase = await createServerClient();
        
        // Count only active (non-deleted) QR codes for limit check
        // Try to count active QRs, fallback to total count if deleted_at column doesn't exist
        let activeCount: number | null = null;
        let countResult = await supabase
            .from('qr_codes')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userData.id)
            .is('deleted_at', null);
        
        if (countResult.error && countResult.error.message?.includes('deleted_at')) {
            // Column doesn't exist, count all QRs
            const retry = await supabase
                .from('qr_codes')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userData.id);
            activeCount = retry.count;
        } else {
            activeCount = countResult.count;
        }
        
        const actualCount = activeCount || 0;
        // Return stored count for display, but check against active count
        return { canCreate: actualCount < 4, count: userData.qr_count, limit: 4 };
    } catch (error) {
        console.error('Error checking QR limit:', error);
        return { canCreate: false, count: 0, limit: 4 };
    }
}

export async function getUserData(): Promise<{ qr_count: number; ai_suggestions_used: number } | null> {
    const { userId } = await auth();
    if (!userId) {
        return null;
    }

    try {
        const userData = await ensureUserExists(userId);
        return {
            qr_count: userData.qr_count,
            ai_suggestions_used: userData.ai_suggestions_used,
        };
    } catch (error) {
        console.error('Error loading user data:', error);
        return null;
    }
}

export async function getUserQRCodes(): Promise<QRCode[]> {
    const { userId } = await auth();
    if (!userId) {
        return [];
    }

    try {
        const userData = await ensureUserExists(userId);
        const supabase = await createServerClient();

        // Include both active and deleted QR codes (deleted ones should still be visible)
        let { data, error } = await supabase
            .from('qr_codes')
            .select('*')
            .eq('user_id', userData.id)
            .order('created_at', { ascending: false });
        
        // If error is about missing deleted_at column, it's fine - just continue
        if (error && error.message?.includes('deleted_at')) {
            // Column doesn't exist, but we can still proceed
            console.warn('deleted_at column not found, continuing without it');
        }

        if (error) {
            console.error('Error loading QR codes:', error);
            return [];
        }

        // For dynamic QRs, fetch the destination URL and update both url and settings
        if (data) {
            for (const qr of data) {
                const isDynamic = qr.settings?.isDynamic || false;
                if (isDynamic) {
                    // Get the destination URL from dynamic_qr_codes table
                    const { data: dynamicQR } = await supabase
                        .from('dynamic_qr_codes')
                        .select('destination_url')
                        .eq('qr_code_id', qr.id)
                        .eq('user_id', userData.id)
                        .is('deleted_at', null)
                        .gt('expires_at', new Date().toISOString())
                        .single();
                    
                    if (dynamicQR && dynamicQR.destination_url) {
                        // Update both the url field and settings to show destination URL instead of scan URL
                        qr.url = dynamicQR.destination_url;
                        qr.settings = {
                            ...qr.settings,
                            url: dynamicQR.destination_url,
                        };
                    }
                }
            }
        }

        return data || [];
    } catch (error) {
        console.error('Error loading QR codes:', error);
        return [];
    }
}

export async function getDynamicQRDestination(qrId: string): Promise<string | null> {
    const { userId } = await auth();
    if (!userId) {
        return null;
    }

    try {
        const userData = await ensureUserExists(userId);
        const supabase = await createServerClient();

        // Get the destination URL for this dynamic QR
        const { data, error } = await supabase
            .from('dynamic_qr_codes')
            .select('destination_url')
            .eq('qr_code_id', qrId)
            .eq('user_id', userData.id)
            .is('deleted_at', null)
            .gt('expires_at', new Date().toISOString())
            .single();

        if (error || !data) {
            return null;
        }

        return data.destination_url;
    } catch (error) {
        console.error('Error getting dynamic QR destination:', error);
        return null;
    }
}

export async function getDynamicQRScanUrl(qrId: string): Promise<string | null> {
    const { userId } = await auth();
    if (!userId) {
        return null;
    }

    try {
        const userData = await ensureUserExists(userId);
        const supabase = await createServerClient();

        // Get the unique_id for this dynamic QR to construct the scan URL
        const { data, error } = await supabase
            .from('dynamic_qr_codes')
            .select('unique_id')
            .eq('qr_code_id', qrId)
            .eq('user_id', userData.id)
            .is('deleted_at', null)
            .gt('expires_at', new Date().toISOString())
            .single();

        if (error || !data) {
            return null;
        }

        const domain = getDomain();
        const protocol = domain.includes('localhost') ? 'http' : 'https';
        return `${protocol}://${domain}/dynamic/scan/${data.unique_id}`;
    } catch (error) {
        console.error('Error getting dynamic QR scan URL:', error);
        return null;
    }
}

export async function deleteQRCode(qrId: string): Promise<{ success: boolean; error?: string }> {
    const { userId } = await auth();
    if (!userId) {
        return { success: false, error: 'Not authenticated' };
    }

    try {
        const userData = await ensureUserExists(userId);
        const supabase = await createServerClient();

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

        // Soft delete QR code (don't reduce count)
        // Try soft delete first, fallback to hard delete if column doesn't exist
        let deleteResult = await supabase
            .from('qr_codes')
            .update({
                deleted_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', qrId)
            .eq('user_id', userData.id);
        
        // If deleted_at column doesn't exist, do hard delete
        if (deleteResult.error && deleteResult.error.message?.includes('deleted_at')) {
            deleteResult = await supabase
                .from('qr_codes')
                .delete()
                .eq('id', qrId)
                .eq('user_id', userData.id);
        }
        
        const deleteError = deleteResult.error;

        if (deleteError) {
            console.error('Error deleting QR code:', deleteError);
            return { success: false, error: 'Failed to delete QR code' };
        }

        // Don't update QR count - soft delete preserves the count

        return { success: true };
    } catch (error) {
        console.error('Error deleting QR code:', error);
        return { success: false, error: 'Failed to delete QR code' };
    }
}

export async function getDynamicQRQuota(): Promise<{ count: number; limit: number; canCreate: boolean }> {
    const { userId } = await auth();
    if (!userId) {
        return { count: 0, limit: 1, canCreate: false };
    }

    try {
        const userData = await ensureUserExists(userId);
        const supabase = await createServerClient();

        // Count active dynamic QRs (non-deleted and not expired)
        let countResult = await supabase
            .from('dynamic_qr_codes')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userData.id)
            .is('deleted_at', null)
            .gt('expires_at', new Date().toISOString());

        if (countResult.error && !countResult.error.message?.includes('does not exist')) {
            console.error('Error checking dynamic QR quota:', countResult.error);
            return { count: 0, limit: 1, canCreate: false };
        }

        const count = countResult.count || 0;
        const limit = 1; // Free tier limit
        const canCreate = count < limit;

        return { count, limit, canCreate };
    } catch (error) {
        console.error('Error getting dynamic QR quota:', error);
        return { count: 0, limit: 1, canCreate: false };
    }
}

export async function renameQRCode(qrId: string, newName: string): Promise<{ success: boolean; error?: string }> {
    const { userId } = await auth();
    if (!userId) {
        return { success: false, error: 'Not authenticated' };
    }

    if (!newName || newName.trim().length === 0) {
        return { success: false, error: 'Name cannot be empty' };
    }

    try {
        const userData = await ensureUserExists(userId);
        const supabase = await createServerClient();

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

        // Update the name
        const { error: updateError } = await supabase
            .from('qr_codes')
            .update({
                name: newName.trim(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', qrId)
            .eq('user_id', userData.id);

        if (updateError) {
            console.error('Error renaming QR code:', updateError);
            return { success: false, error: 'Failed to rename QR code' };
        }

        return { success: true };
    } catch (error) {
        console.error('Error renaming QR code:', error);
        return { success: false, error: 'Failed to rename QR code' };
    }
}
