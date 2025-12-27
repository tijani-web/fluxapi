'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Project, ProjectWithDetails, Endpoint, MockDataCollection, Environment } from '@/types/types';
import { useAuth } from './AuthContext';
import { api } from '@/lib/api';

interface ProjectState {
  currentProject: ProjectWithDetails | null;
  projects: Project[];
  endpoints: Endpoint[];
  mockData: MockDataCollection[];
  environments: Environment[];
  isLoading: boolean;
  error: string | null;
}

type ProjectAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_CURRENT_PROJECT'; payload: ProjectWithDetails | null }
  | { type: 'ADD_ENDPOINT'; payload: Endpoint }
  | { type: 'UPDATE_ENDPOINT'; payload: Endpoint }
  | { type: 'DELETE_ENDPOINT'; payload: string }
  | { type: 'ADD_MOCK_DATA'; payload: MockDataCollection }
  | { type: 'UPDATE_MOCK_DATA'; payload: MockDataCollection }
  | { type: 'DELETE_MOCK_DATA'; payload: string }
  | { type: 'ADD_ENVIRONMENT'; payload: Environment }
  | { type: 'UPDATE_ENVIRONMENT'; payload: Environment }
  | { type: 'DELETE_ENVIRONMENT'; payload: string };

interface ProjectContextType extends ProjectState {
  loadProjects: () => Promise<void>;
  loadProject: (projectId: string) => Promise<void>;
  createProject: (data: any) => Promise<Project>;
  updateProject: (projectId: string, data: any) => Promise<Project>;
  deleteProject: (projectId: string) => Promise<void>;
  createEndpoint: (data: any) => Promise<Endpoint>;
  updateEndpoint: (endpointId: string, data: any) => Promise<Endpoint>;
  deleteEndpoint: (endpointId: string) => Promise<void>;
  clearCurrentProject: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const projectReducer = (state: ProjectState, action: ProjectAction): ProjectState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload, isLoading: false };
    
    case 'SET_CURRENT_PROJECT':
      return {
        ...state,
        currentProject: action.payload,
        endpoints: action.payload?.endpoints || [],
        mockData: action.payload?.mockData || [],
        environments: action.payload?.environments || [],
        isLoading: false,
      };
    
    case 'ADD_ENDPOINT':
      return {
        ...state,
        endpoints: [...state.endpoints, action.payload],
        currentProject: state.currentProject ? {
          ...state.currentProject,
          endpoints: [...state.endpoints, action.payload],
        } : null,
      };
    
    case 'UPDATE_ENDPOINT':
      return {
        ...state,
        endpoints: state.endpoints.map(ep => 
          ep.id === action.payload.id ? action.payload : ep
        ),
        currentProject: state.currentProject ? {
          ...state.currentProject,
          endpoints: state.endpoints.map(ep => 
            ep.id === action.payload.id ? action.payload : ep
          ),
        } : null,
      };
    
    case 'DELETE_ENDPOINT':
      return {
        ...state,
        endpoints: state.endpoints.filter(ep => ep.id !== action.payload),
        currentProject: state.currentProject ? {
          ...state.currentProject,
          endpoints: state.endpoints.filter(ep => ep.id !== action.payload),
        } : null,
      };
    
    case 'ADD_MOCK_DATA':
      return {
        ...state,
        mockData: [...state.mockData, action.payload],
      };
    
    case 'UPDATE_MOCK_DATA':
      return {
        ...state,
        mockData: state.mockData.map(md => 
          md.id === action.payload.id ? action.payload : md
        ),
      };
    
    case 'DELETE_MOCK_DATA':
      return {
        ...state,
        mockData: state.mockData.filter(md => md.id !== action.payload),
      };
    
    case 'ADD_ENVIRONMENT':
      return {
        ...state,
        environments: [...state.environments, action.payload],
      };
    
    case 'UPDATE_ENVIRONMENT':
      return {
        ...state,
        environments: state.environments.map(env => 
          env.id === action.payload.id ? action.payload : env
        ),
      };
    
    case 'DELETE_ENVIRONMENT':
      return {
        ...state,
        environments: state.environments.filter(env => env.id !== action.payload),
      };
    
    default:
      return state;
  }
};

const initialState: ProjectState = {
  currentProject: null,
  projects: [],
  endpoints: [],
  mockData: [],
  environments: [],
  isLoading: false,
  error: null,
};

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    } else {
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: null });
      dispatch({ type: 'SET_PROJECTS', payload: [] });
    }
  }, [isAuthenticated]);

  const loadProjects = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.getProjects();
      dispatch({ type: 'SET_PROJECTS', payload: response.data });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const loadProject = async (projectId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const project = await api.getProject(projectId);
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createProject = async (data: any): Promise<Project> => {
    try {
      const project = await api.createProject(data);
      await loadProjects(); // Refresh projects list
      return project;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateProject = async (projectId: string, data: any): Promise<Project> => {
    try {
      const project = await api.updateProject(projectId, data);
      await loadProjects(); // Refresh projects list
      if (state.currentProject?.id === projectId) {
        await loadProject(projectId); // Refresh current project
      }
      return project;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      await api.deleteProject(projectId);
      await loadProjects(); // Refresh projects list
      if (state.currentProject?.id === projectId) {
        dispatch({ type: 'SET_CURRENT_PROJECT', payload: null });
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const createEndpoint = async (data: any): Promise<Endpoint> => {
    if (!state.currentProject) throw new Error('No project selected');
    
    try {
      const endpoint = await api.createEndpoint(state.currentProject.id, data);
      dispatch({ type: 'ADD_ENDPOINT', payload: endpoint });
      return endpoint;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateEndpoint = async (endpointId: string, data: any): Promise<Endpoint> => {
    if (!state.currentProject) throw new Error('No project selected');
    
    try {
      const endpoint = await api.updateEndpoint(state.currentProject.id, endpointId, data);
      dispatch({ type: 'UPDATE_ENDPOINT', payload: endpoint });
      return endpoint;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const deleteEndpoint = async (endpointId: string) => {
    if (!state.currentProject) throw new Error('No project selected');
    
    try {
      await api.deleteEndpoint(state.currentProject.id, endpointId);
      dispatch({ type: 'DELETE_ENDPOINT', payload: endpointId });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const clearCurrentProject = () => {
    dispatch({ type: 'SET_CURRENT_PROJECT', payload: null });
  };

  const value: ProjectContextType = {
    ...state,
    loadProjects,
    loadProject,
    createProject,
    updateProject,
    deleteProject,
    createEndpoint,
    updateEndpoint,
    deleteEndpoint,
    clearCurrentProject,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}