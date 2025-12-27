'use client';

import React, { createContext, useContext } from 'react';
import hotToast, { Toaster } from 'react-hot-toast';

interface ToastContextType {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    info: (message: string) => void;
    loading: (message: string) => string;
    dismiss: (id: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toast = {
    success: (message: string) => {
      hotToast.success(message, {
        duration: 4000,
        position: 'top-right',
      });
    },

    error: (message: string) => {
      hotToast.error(message, {
        duration: 5000,
        position: 'top-right',
      });
    },

    warning: (message: string) => {
      hotToast(message, {
        icon: '⚠️',
        duration: 4000,
        position: 'top-right',
        style: {
          background: 'hsl(38, 92%, 50%)',
          color: 'white',
        },
      });
    },

    info: (message: string) => {
      hotToast(message, {
        icon: 'ℹ️',
        duration: 4000,
        position: 'top-right',
        style: {
          background: 'hsl(217, 91%, 60%)',
          color: 'white',
        },
      });
    },

    loading: (message: string): string => {
      return hotToast.loading(message, {
        position: 'top-right',
      });
    },

    dismiss: (id: string) => {
      hotToast.dismiss(id);
    },
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
          success: {
            iconTheme: {
              primary: 'hsl(142, 76%, 36%)',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: 'hsl(0, 84%, 60%)',
              secondary: 'white',
            },
          },
        }}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast; // Now returns { success, error, warning, info, loading, dismiss }
}