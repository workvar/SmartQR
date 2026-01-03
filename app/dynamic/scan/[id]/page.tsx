'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function DynamicQRScanPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    useEffect(() => {
        const redirectToDestination = async () => {
            if (!id) {
                router.push('/');
                return;
            }

            try {
                const response = await fetch(`/api/dynamic/scan/${id}`);
                
                if (!response.ok) {
                    // If QR not found or expired, redirect to home
                    router.push('/');
                    return;
                }

                const data = await response.json();
                
                if (data.destination_url) {
                    // Redirect to the destination URL
                    window.location.href = data.destination_url;
                } else {
                    // Fallback to home if no destination
                    router.push('/');
                }
            } catch (error) {
                console.error('Error redirecting:', error);
                router.push('/');
            }
        };

        redirectToDestination();
    }, [id, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Redirecting...</p>
            </div>
        </div>
    );
}

