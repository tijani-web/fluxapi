'use client';

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { CollaborationUser, CodeChange, CursorPosition, SelectionRange } from '@/types/types';
import { useSocket } from './SocketContext';
import { useProject } from './ProjectContext';

interface CollaborationState {
  collaborators: CollaborationUser[];
  activeUsers: CollaborationUser[];
  codeChanges: CodeChange[];
  cursors: Map<string, CursorPosition>;
  selections: Map<string, SelectionRange>;
  isCollaborating: boolean;
}

type CollaborationAction =
  | { type: 'USER_JOINED'; payload: CollaborationUser }
  | { type: 'USER_LEFT'; payload: string }
  | { type: 'SET_COLLABORATORS'; payload: CollaborationUser[] }
  | { type: 'CODE_CHANGE'; payload: CodeChange }
  | { type: 'CURSOR_UPDATE'; payload: { userId: string; position: CursorPosition } }
  | { type: 'SELECTION_UPDATE'; payload: { userId: string; selection: SelectionRange } }
  | { type: 'CLEAR_COLLABORATION' };

interface CollaborationContextType extends CollaborationState {
  startCollaboration: (projectId: string, endpointId: string) => void;
  stopCollaboration: () => void;
  sendCodeChange: (change: CodeChange) => void;
  sendCursorMove: (position: CursorPosition) => void;
  sendSelectionChange: (selection: SelectionRange) => void;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

const collaborationReducer = (state: CollaborationState, action: CollaborationAction): CollaborationState => {
  switch (action.type) {
    case 'USER_JOINED':
      return {
        ...state,
        collaborators: [...state.collaborators.filter(c => c.user.id !== action.payload.user.id), action.payload],
        activeUsers: [...state.activeUsers.filter(u => u.user.id !== action.payload.user.id), action.payload],
      };
    
    case 'USER_LEFT':
      return {
        ...state,
        activeUsers: state.activeUsers.filter(user => user.user.id !== action.payload),
        collaborators: state.collaborators.map(collab => 
          collab.user.id === action.payload 
            ? { ...collab, activeEndpoint: undefined }
            : collab
        ),
      };
    
    case 'SET_COLLABORATORS':
      return {
        ...state,
        collaborators: action.payload,
      };
    
    case 'CODE_CHANGE':
      return {
        ...state,
        codeChanges: [...state.codeChanges, action.payload],
      };
    
    case 'CURSOR_UPDATE':
      const newCursors = new Map(state.cursors);
      newCursors.set(action.payload.userId, action.payload.position);
      return {
        ...state,
        cursors: newCursors,
      };
    
    case 'SELECTION_UPDATE':
      const newSelections = new Map(state.selections);
      newSelections.set(action.payload.userId, action.payload.selection);
      return {
        ...state,
        selections: newSelections,
      };
    
    case 'CLEAR_COLLABORATION':
      return {
        ...state,
        activeUsers: [],
        codeChanges: [],
        cursors: new Map(),
        selections: new Map(),
        isCollaborating: false,
      };
    
    default:
      return state;
  }
};

const initialState: CollaborationState = {
  collaborators: [],
  activeUsers: [],
  codeChanges: [],
  cursors: new Map(),
  selections: new Map(),
  isCollaborating: false,
};

export function CollaborationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(collaborationReducer, initialState);
  const { socket, isConnected, joinProject, leaveProject, sendCodeChange: socketSendCodeChange, sendCursorMove: socketSendCursorMove } = useSocket();
  const { currentProject } = useProject();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleUserJoined = (data: any) => {
      dispatch({ type: 'USER_JOINED', payload: data });
    };

    const handleUserLeft = (data: any) => {
      dispatch({ type: 'USER_LEFT', payload: data.userId });
    };

    const handleCollaboratorsList = (data: any) => {
      dispatch({ type: 'SET_COLLABORATORS', payload: data.collaborators });
    };

    const handleCodeUpdate = (data: any) => {
      dispatch({ type: 'CODE_CHANGE', payload: data });
    };

    const handleCursorUpdate = (data: any) => {
      dispatch({ type: 'CURSOR_UPDATE', payload: { userId: data.userId, position: data.position } });
    };

    const handleSelectionUpdate = (data: any) => {
      dispatch({ type: 'SELECTION_UPDATE', payload: { userId: data.userId, selection: data.selection } });
    };

    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);
    socket.on('collaborators-list', handleCollaboratorsList);
    socket.on('code-update', handleCodeUpdate);
    socket.on('cursor-update', handleCursorUpdate);
    socket.on('selection-update', handleSelectionUpdate);

    return () => {
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
      socket.off('collaborators-list', handleCollaboratorsList);
      socket.off('code-update', handleCodeUpdate);
      socket.off('cursor-update', handleCursorUpdate);
      socket.off('selection-update', handleSelectionUpdate);
    };
  }, [socket, isConnected]);

  const startCollaboration = (projectId: string, endpointId: string) => {
    if (!isConnected) return;
    
    joinProject(projectId, endpointId);
  };

  const stopCollaboration = () => {
    if (!isConnected || !currentProject) return;
    
    leaveProject(currentProject.id);
    dispatch({ type: 'CLEAR_COLLABORATION' });
  };

  const sendCodeChange = (change: CodeChange) => {
    socketSendCodeChange(change);
  };

  const sendCursorMove = (position: CursorPosition) => {
    if (!currentProject?.id) return;
    
    socketSendCursorMove({
      endpointId: '', // Will be set by the component
      position,
    });
  };

  const sendSelectionChange = (selection: SelectionRange) => {
    // Implementation for selection changes
  };

  const value: CollaborationContextType = {
    ...state,
    startCollaboration,
    stopCollaboration,
    sendCodeChange,
    sendCursorMove,
    sendSelectionChange,
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
}

export function useCollaboration() {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
}