'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProjectProvider } from '@/contexts/ProjectContext';  
import { SocketProvider } from '@/contexts/SocketContext';    
import { CollaborationProvider } from '@/contexts/CollaborationContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <ProjectProvider>  
              <SocketProvider>  
                <CollaborationProvider>
                  {children}
                </CollaborationProvider>
              </SocketProvider>
            </ProjectProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}