'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function OAuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleOAuthCallback } = useAuth();
  const toast = useToast();

  const hasHandled = useRef(false);

  useEffect(() => {
    if (hasHandled.current) return;
    hasHandled.current = true;

    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (!accessToken || !refreshToken) {
      toast.error('Missing OAuth tokens');
      router.replace('/login');
      return;
    }

    handleOAuthCallback(accessToken, refreshToken)
      .then(() => {
        toast.success('Successfully logged in!');
        router.replace('/dashboard'); 
      })
      .catch((err) => {
        console.error('OAuth error:', err);
        toast.error('OAuth login failed');
        router.replace('/login');
      });
  }, [searchParams, handleOAuthCallback, toast, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto" />
        <p className="mt-4 text-lg">Completing login...</p>
      </div>
    </div>
  );
}
