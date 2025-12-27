'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { SocketEvents } from '@/types/types';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  isAuthenticated: boolean;
  activeProject: string | null;
  activeEndpoint: string | null;
  joinProject: (projectId: string, endpointId?: string) => void;
  leaveProject: (projectId: string) => void;
  sendCodeChange: (data: SocketEvents['code-change']) => void;
  sendCursorMove: (data: SocketEvents['cursor-move']) => void;
  sendSelectionChange: (data: SocketEvents['selection-change']) => void;
  disconnect: () => void;
  reconnect: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const socketRef = useRef<Socket | null>(null);
  const { user, isAuthenticated: isUserAuthenticated, refreshToken } = useAuth();
  const toast = useToast();

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const token = localStorage.getItem('accessToken');
    if (!token || !isUserAuthenticated) {
      console.log('🔒 No auth token, skipping socket connection');
      return;
    }

    console.log('🔗 Connecting to socket server...');
    
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5001', {
      auth: { 
        token: token,
        userId: user?.id
      },
      transports: ['websocket', 'polling'],
      reconnection: false,
      timeout: 10000,
      query: {
        userId: user?.id,
        client: 'web',
        version: '1.0.0'
      }
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Socket connected');
      setIsConnected(true);
      setReconnectAttempts(0);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      setIsConnected(false);
      setIsAuthenticated(false);
      
      if (reason === 'io server disconnect') {
        setReconnectAttempts(prev => prev + 1);
      }
      
      if (activeProject) {
        toast.warning('Lost connection to collaboration server');
      }
    });

    socket.on('connect_error', async (error) => {
      console.error('❌ Socket connection error:', error.message);
      
      if (error.message.includes('auth') || error.message.includes('401')) {
        try {
          await refreshToken();
          setTimeout(() => reconnect(), 1000);
        } catch {
          console.error('Token refresh failed');
        }
      }
    });

    // Authentication events
    socket.on('authenticated', (data: SocketEvents['authenticated']) => {
      console.log('🔐 Socket authenticated:', data.userId);
      setIsAuthenticated(true);
      setReconnectAttempts(0);
    });

    socket.on('authentication-failed', (data: SocketEvents['authentication-failed']) => {
      console.error('🔒 Socket auth failed:', data.error);
      setIsAuthenticated(false);
    });

    // Collaboration events
    socket.on('user-joined', (data: SocketEvents['user-joined']) => {
      console.log('👤 User joined:', data.user.name);
      if (data.user.id !== user?.id) {
        toast.info(`${data.user.name} joined the project`);
      }
    });

    socket.on('user-left', (data: SocketEvents['user-left']) => {
      console.log('👋 User left:', data.userId);
    });

    socket.on('collaborators-list', (data: SocketEvents['collaborators-list']) => {
      console.log('👥 Collaborators list:', data.collaborators.length);
      window.dispatchEvent(new CustomEvent('socket:collaborators-list', { 
        detail: data 
      }));
    });

    // Code editing events
    socket.on('code-update', (data: SocketEvents['code-update']) => {
      console.log('📝 Code update from:', data.userId);
      window.dispatchEvent(new CustomEvent('socket:code-update', { 
        detail: data 
      }));
    });

    socket.on('cursor-update', (data: SocketEvents['cursor-update']) => {
      window.dispatchEvent(new CustomEvent('socket:cursor-update', { 
        detail: data 
      }));
    });

    socket.on('selection-update', (data: SocketEvents['selection-update']) => {
      window.dispatchEvent(new CustomEvent('socket:selection-update', { 
        detail: data 
      }));
    });

    // Execution events
    socket.on('execution-started', (data: SocketEvents['execution-started']) => {
      console.log('🚀 Execution started:', data.endpointId);
    });

    socket.on('execution-completed', (data: SocketEvents['execution-completed']) => {
      console.log('✅ Execution completed:', data.endpointId);
      window.dispatchEvent(new CustomEvent('socket:execution-completed', { 
        detail: data 
      }));
    });

    // Project events
    socket.on('project-updated', (data: SocketEvents['project-updated']) => {
      console.log('🔄 Project updated:', data.projectId);
      window.dispatchEvent(new CustomEvent('socket:project-updated', { 
        detail: data 
      }));
    });

    socket.on('endpoint-changed', (data: SocketEvents['endpoint-changed']) => {
      console.log('📁 Endpoint changed:', data.endpointId);
      window.dispatchEvent(new CustomEvent('socket:endpoint-changed', { 
        detail: data 
      }));
    });

    // System events
    socket.on('server-shutdown', (data: SocketEvents['server-shutdown']) => {
      console.log('🛑 Server shutting down:', data.message);
      toast.warning('Server is shutting down: ' + data.message);
    });

    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });

  }, [user, isUserAuthenticated, toast, refreshToken, activeProject]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      if (activeProject) {
        socketRef.current.emit('leave-project', { projectId: activeProject });
        setActiveProject(null);
        setActiveEndpoint(null);
      }
      
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setIsAuthenticated(false);
      console.log('🔌 Socket manually disconnected');
    }
  }, [activeProject]);

  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(() => connect(), 500);
  }, [disconnect, connect]);

  // Auto-connect when user is authenticated
  useEffect(() => {
    if (isUserAuthenticated && user) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isUserAuthenticated, user, connect, disconnect]);

  // Auto-reconnect logic
  useEffect(() => {
    let reconnectTimer: NodeJS.Timeout;
    
    if (!isConnected && reconnectAttempts < 3) {
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
      reconnectTimer = setTimeout(() => {
        if (isUserAuthenticated) {
          console.log(`🔄 Attempting reconnect (${reconnectAttempts + 1}/3)...`);
          reconnect();
        }
      }, delay);
    }

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [isConnected, reconnectAttempts, isUserAuthenticated, reconnect]);

  const joinProject = useCallback((projectId: string, endpointId?: string) => {
    if (!socketRef.current?.connected) {
      console.error('Not connected to server');
      return;
    }

    if (!isAuthenticated) {
      console.error('Socket not authenticated');
      return;
    }

    socketRef.current.emit('join-project', {
      projectId,
      endpointId,
    });

    setActiveProject(projectId);
    setActiveEndpoint(endpointId || null);
    console.log(`📂 Joined project: ${projectId}, endpoint: ${endpointId || 'none'}`);
  }, [isAuthenticated]);

  const leaveProject = useCallback((projectId: string) => {
    if (!socketRef.current?.connected) return;

    socketRef.current.emit('leave-project', { projectId });
    
    if (activeProject === projectId) {
      setActiveProject(null);
      setActiveEndpoint(null);
    }
    
    console.log(`📭 Left project: ${projectId}`);
  }, [activeProject]);

  const sendCodeChange = useCallback((data: SocketEvents['code-change']) => {
    if (!socketRef.current?.connected || !isAuthenticated) {
      console.warn('Cannot send code change: Not connected or authenticated');
      return;
    }

    socketRef.current.emit('code-change', {
      ...data,
      timestamp: Date.now(),
      userId: user?.id,
    });
  }, [isAuthenticated, user?.id]);

  const sendCursorMove = useCallback((data: SocketEvents['cursor-move']) => {
    if (!socketRef.current?.connected || !isAuthenticated) return;

    socketRef.current.emit('cursor-move', {
      ...data,
      timestamp: Date.now(),
      userId: user?.id,
    });
  }, [isAuthenticated, user?.id]);

  const sendSelectionChange = useCallback((data: SocketEvents['selection-change']) => {
    if (!socketRef.current?.connected || !isAuthenticated) return;

    socketRef.current.emit('selection-change', {
      ...data,
      timestamp: Date.now(),
      userId: user?.id,
    });
  }, [isAuthenticated, user?.id]);

  const value: SocketContextType = {
    socket: socketRef.current,
    isConnected,
    isAuthenticated,
    activeProject,
    activeEndpoint,
    joinProject,
    leaveProject,
    sendCodeChange,
    sendCursorMove,
    sendSelectionChange,
    disconnect,
    reconnect,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

export function useSocketEvent<T>(
  eventName: keyof SocketEvents,
  handler: (data: T) => void,
  dependencies: any[] = []
) {
  useEffect(() => {
    const handleEvent = (event: CustomEvent) => {
      handler(event.detail as T);
    };

    window.addEventListener(`socket:${eventName}` as any, handleEvent as EventListener);
    
    return () => {
      window.removeEventListener(`socket:${eventName}` as any, handleEvent as EventListener);
    };
  }, dependencies);
}