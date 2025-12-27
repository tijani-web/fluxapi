// api-client.ts - COMPLETE VERSION
import { api } from '@/lib/api';
import {
  // Auth Types
  User, LoginCredentials, RegisterData, AuthResponse,
  // Project Types
  Project, ProjectWithDetails, CreateProjectData, UpdateProjectData, ProjectCollaborator,
  // Endpoint Types
  Endpoint, CreateEndpointData, UpdateEndpointData,
  // Execution Types
  ExecutionRequest, ExecutionResult, ExecutionLog,
  // AI Types
  AIGenerateRequest, AIOptimizeRequest, AIDebugRequest, AITestRequest, 
  AIDocumentationRequest, AIResponse, AIUsageStats, AIUsage,
  // Mock Data Types
  MockDataCollection, CreateMockDataCollection, UpdateMockDataCollection,
  // Environment Types
  Environment, CreateEnvironment, UpdateEnvironment,
  // Webhook Types
  Webhook, CreateWebhook, UpdateWebhook, WebhookDelivery,
  // API Key Types
  ApiKey, CreateApiKey, UpdateApiKey,
  // Collaboration Types
  CollaborationSession, CollaborationUser,
  // Analytics Types
  ProjectAnalytics, UserAnalytics, EndpointAnalytics, DocumentationAnalytics,
  // Export/Import Types
  ExportRequest, ExportResult, ImportRequest, ExportFormatInfo, ProjectExport,
  // Other Types
  OpenAPISpec, SandboxHealth, FileUpload,
  PaginationParams, PaginatedResponse,
  OAuthProvider
} from '@/types/types';

export class ApiClient {
  // ===== AUTHENTICATION & USER MANAGEMENT =====
  
  static async login(credentials: LoginCredentials): Promise<AuthResponse['data']> {
    try {
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      const response = await api.login(credentials);
      return response;
    } catch (error: any) {
      console.error('Login failed:', error);
      
      if (error.message.includes('401') || error.message.includes('invalid')) {
        throw new Error('Invalid email or password');
      }
      
      if (error.message.includes('network') || error.message.includes('failed to fetch')) {
        throw new Error('Network error. Please check your connection');
      }
      
      if (error.message.includes('not verified')) {
        throw new Error('Please verify your email address first');
      }
      
      throw new Error('Login failed. Please try again');
    }
  }

  static async register(data: RegisterData): Promise<AuthResponse['data']> {
    try {
      if (!data.email || !data.password || !data.name) {
        throw new Error('All fields are required');
      }

      if (data.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const response = await api.register(data);
      return response;
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      if (error.message.includes('409') || error.message.includes('already exists')) {
        throw new Error('Email already registered');
      }
      
      if (error.message.includes('validation')) {
        throw new Error('Invalid email format');
      }
      
      throw new Error('Registration failed. Please try again');
    }
  }

  static async logout(): Promise<void> {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      api.clearToken();
      // window.dispatchEvent(new CustomEvent('auth:logout'));
    }
  }

  static async getCurrentUser(): Promise<User> {
    try {
      return await api.getProfile();
    } catch (error: any) {
      console.error('Failed to get user profile:', error);
      
      if (error?.code === 401) {
        throw error; 
      }

      
      throw new Error('Unable to load user profile');
    }
  }

  static async updateProfile(data: { name?: string; avatar?: string }): Promise<User> {
    try {
      if (data.name && data.name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters');
      }

      return await api.updateProfile(data);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      
      if (error.message.includes('validation')) {
        throw new Error('Invalid profile data');
      }
      
      throw new Error('Failed to update profile. Please try again');
    }
  }

  static async deleteAccount(): Promise<void> {
    try {
      if (!confirm('Are you sure? This action cannot be undone.')) {
        throw new Error('Cancelled by user');
      }
      
      await api.deleteAccount();
      api.clearToken();
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      
      if (error.message === 'Cancelled by user') {
        throw error;
      }
      
      throw new Error('Failed to delete account. Please try again');
    }
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      if (!currentPassword || !newPassword) {
        throw new Error('Both passwords are required');
      }

      if (newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters');
      }

      await api.changePassword(currentPassword, newPassword);
    } catch (error: any) {
      console.error('Failed to change password:', error);
      
      if (error.message.includes('invalid') || error.message.includes('401')) {
        throw new Error('Current password is incorrect');
      }
      
      throw new Error('Failed to change password. Please try again');
    }
  }

  static async requestPasswordReset(email: string): Promise<void> {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      await api.requestPasswordReset(email);
    } catch (error: any) {
      console.error('Failed to request password reset:', error);
      
      if (error.message.includes('not found')) {
        // Don't reveal if email exists
        console.log('If an account exists, a reset email has been sent');
      }
      
      throw new Error('Failed to request password reset. Please try again');
    }
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      if (!token || !newPassword) {
        throw new Error('Token and new password are required');
      }

      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      await api.resetPassword(token, newPassword);
    } catch (error: any) {
      console.error('Failed to reset password:', error);
      
      if (error.message.includes('invalid') || error.message.includes('expired')) {
        throw new Error('Reset link is invalid or has expired');
      }
      
      throw new Error('Failed to reset password. Please try again');
    }
  }

  // ===== OAUTH =====
  
  static getOAuthUrl(provider: OAuthProvider): string {
    try {
      switch (provider) {
        case 'GOOGLE':
          return api.getGoogleAuthUrl();
        case 'GITHUB':
          return api.getGithubAuthUrl();
        default:
          throw new Error('Unsupported OAuth provider');
      }
    } catch (error) {
      console.error('Failed to get OAuth URL:', error);
      throw new Error('OAuth provider not configured');
    }
  }

  static async processOAuthCallback(): Promise<AuthResponse['data'] | null> {
    try {
      if (!api.hasOAuthCallback()) {
        return null;
      }

      const result = await api.processOAuthCallback();
      api.clearOAuthCallback();
      return result;
    } catch (error) {
      console.error('Failed to process OAuth callback:', error);
      api.clearOAuthCallback();
      throw new Error('OAuth login failed. Please try again');
    }
  }

  static async getOAuthConnections(): Promise<{ provider: OAuthProvider; connected: boolean }[]> {
    try {
      return await api.getOAuthAccounts();
    } catch (error) {
      console.error('Failed to get OAuth connections:', error);
      return [
        { provider: 'GOOGLE', connected: false },
        { provider: 'GITHUB', connected: false }
      ];
    }
  }

  // ===== PROJECT MANAGEMENT =====
  
  static async createProject(data: CreateProjectData): Promise<Project> {
    try {
      if (!data.name || data.name.trim().length < 3) {
        throw new Error('Project name must be at least 3 characters');
      }

      // Generate slug if not provided
      const projectData = {
        ...data,
        slug: data.slug?.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-') || 
              data.name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')
      };

      return await api.createProject(projectData);
    } catch (error: any) {
      console.error('Failed to create project:', error);
      
      if (error.message.includes('unique constraint') || error.message.includes('slug')) {
        throw new Error('Project slug already exists. Please choose another name');
      }
      
      throw new Error('Failed to create project. Please try again');
    }
  }

  static async getProjects(params?: PaginationParams): Promise<Project[]> {
    try {
      const response = await api.getProjects(params);
      
      // Handle different response formats
      if (response && 'data' in response && Array.isArray(response.data)) {
        return response.data;
      }
      
      if (Array.isArray(response)) {
        return response;
      }
      
      return [];
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      return [];
    }
  }

  static async getProject(projectId: string): Promise<ProjectWithDetails> {
    try {
      if (!projectId) {
        throw new Error('Project ID is required');
      }

      return await api.getProject(projectId);
    } catch (error: any) {
      console.error('Failed to fetch project:', error);
      
      if (error.message.includes('404')) {
        throw new Error('Project not found');
      }
      
      if (error.message.includes('403')) {
        throw new Error('You do not have access to this project');
      }
      
      throw new Error('Failed to load project. Please try again');
    }
  }

  static async updateProject(projectId: string, data: UpdateProjectData): Promise<Project> {
    try {
      if (!projectId) {
        throw new Error('Project ID is required');
      }

      return await api.updateProject(projectId, data);
    } catch (error: any) {
      console.error('Failed to update project:', error);
      
      if (error.message.includes('404')) {
        throw new Error('Project not found');
      }
      
      throw new Error('Failed to update project. Please try again');
    }
  }

  static async deleteProject(projectId: string): Promise<void> {
    try {
      if (!projectId) {
        throw new Error('Project ID is required');
      }

      if (!confirm('Are you sure? This will delete the project and all its endpoints.')) {
        throw new Error('Cancelled by user');
      }

      await api.deleteProject(projectId);
    } catch (error: any) {
      console.error('Failed to delete project:', error);
      
      if (error.message === 'Cancelled by user') {
        throw error;
      }
      
      if (error.message.includes('404')) {
        throw new Error('Project not found');
      }
      
      throw new Error('Failed to delete project. Please try again');
    }
  }

// ===== PROJECT EXPORT/IMPORT =====

// Export project data - returns file download
static async exportProjectData(
  projectId: string, 
  options?: {
    format?: 'CUSTOM_JSON' | 'POSTMAN' | 'OPENAPI' | 'INSOMNIA';
    include?: {
      endpoints?: boolean;
      mockData?: boolean;
      environments?: boolean;
      webhooks?: boolean;
    };
  }
): Promise<{ blob: Blob; filename: string }> {
  try {
    if (!projectId) {
      throw new Error('Project ID is required');
    }

    // Call the api.ts method
    return await api.exportProjectData(projectId, options);
  } catch (error: any) {
    console.error('Failed to export project data:', error);
    
    if (error.message.includes('403') || error.message.includes('ACCESS_DENIED')) {
      throw new Error('You do not have permission to export this project');
    }
    
    if (error.message.includes('404')) {
      throw new Error('Project not found');
    }
    
    throw new Error(error.message || 'Failed to export project. Please try again');
  }
}

// Import project data from file
static async importProjectData(
  file: File, 
  options?: {
    name?: string;
    visibility?: 'PRIVATE' | 'TEAM' | 'PUBLIC';
  }
): Promise<Project> {
  try {
    if (!file) {
      throw new Error('File is required');
    }

    // Validate file type
    const allowedTypes = ['application/json', 'application/yaml', 'text/yaml', 'text/plain'];
    const allowedExtensions = ['.json', '.yaml', '.yml'];
    
    const fileExt = file.name.toLowerCase().slice(-5);
    const hasValidExtension = allowedExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
    
    if (!allowedTypes.includes(file.type) && !hasValidExtension) {
      throw new Error('Invalid file type. Please upload JSON or YAML files only');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('File is too large. Maximum size is 10MB');
    }

    // Call the api.ts method
    return await api.importProjectData(file, options);
  } catch (error: any) {
    console.error('Failed to import project data:', error);
    
    if (error.message.includes('Invalid') || error.message.includes('validation')) {
      throw new Error('Invalid import file format. Please upload a valid project export file');
    }
    
    if (error.message.includes('already exists') || error.message.includes('duplicate')) {
      throw new Error('A project with this name already exists');
    }
    
    if (error.name === 'SyntaxError' || error.message.includes('JSON') || error.message.includes('parse')) {
      throw new Error('Invalid file format. Please upload a valid JSON or YAML file');
    }
    
    throw new Error(error.message || 'Failed to import project. Please try again');
  }
}

// Get project export history
static async getProjectExportsHistory(
  projectId: string, 
  limit?: number
): Promise<ProjectExport[]> {
  try {
    if (!projectId) {
      throw new Error('Project ID is required');
    }

    // Call the api.ts method
    return await api.getProjectExportsHistory(projectId, limit);
  } catch (error: any) {
    console.error('Failed to fetch project exports:', error);
    
    if (error.message.includes('403')) {
      console.log('No permission to view exports');
      return [];
    }
    
    return [];
  }
}

// ===== PROJECT COLLABORATORS =====

static async getCollaborators(projectId: string): Promise<any[]> {
  try {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    return await api.getCollaborators(projectId);
  } catch (error) {
    console.error('Failed to fetch collaborators:', error);
    return [];
  }
}

static async sendInvitation(projectId: string, email: string, role: string = 'EDITOR'): Promise<any> {
  try {
    if (!projectId || !email) {
      throw new Error('Project ID and email are required');
    }
    return await api.sendInvitation(projectId, email, role);
  } catch (error: any) {
    console.error('Failed to send invitation:', error);
    
    if (error.message.includes('already')) {
      throw new Error('User is already a collaborator');
    }
    if (error.message.includes('not found')) {
      throw new Error('User not found with this email');
    }
    
    throw new Error(error.message || 'Failed to send invitation');
  }
}

static async updateCollaborator(projectId: string, userId: string, role: string): Promise<any> {
  try {
    if (!projectId || !userId || !role) {
      throw new Error('Project ID, User ID and role are required');
    }
    return await api.updateCollaborator(projectId, userId, { role });
  } catch (error: any) {
    console.error('Failed to update collaborator:', error);
    throw new Error('Failed to update collaborator. Please try again');
  }
}

static async removeCollaborator(projectId: string, userId: string): Promise<void> {
  try {
    if (!projectId || !userId) {
      throw new Error('Project ID and User ID are required');
    }
    await api.removeCollaborator(projectId, userId);
  } catch (error: any) {
    console.error('Failed to remove collaborator:', error);
    throw new Error('Failed to remove collaborator. Please try again');
  }
}

static async acceptInvitation(token: string): Promise<any> {
  try {
    if (!token) {
      throw new Error('Invitation token is required');
    }
    return await api.acceptInvitation(token);
  } catch (error: any) {
    console.error('Failed to accept invitation:', error);
    throw new Error('Failed to accept invitation. Please try again');
  }
}

static async getPendingInvitations(projectId: string): Promise<any[]> {
  try {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    return await api.getPendingInvitations(projectId);
  } catch (error) {
    console.error('Failed to fetch pending invitations:', error);
    return [];
  }
}

// NEW: Direct add (admin only)
static async addCollaboratorDirect(projectId: string, userId: string, role: string = 'EDITOR'): Promise<any> {
  try {
    if (!projectId || !userId) {
      throw new Error('Project ID and User ID are required');
    }
    return await api.addCollaboratorDirect(projectId, userId, role);
  } catch (error: any) {
    console.error('Failed to add collaborator directly:', error);
    throw new Error('Failed to add collaborator. Please try again');
  }
}

// NEW: Search collaboration users
static async searchCollaborationUsers(query: string): Promise<any[]> {
  try {
    if (!query || query.length < 2) {
      return [];
    }
    return await api.searchCollaborationUsers(query);
  } catch (error) {
    console.error('Failed to search users:', error);
    return [];
  }
}

// NEW: Get user permissions
static async getUserPermissions(projectId: string): Promise<any> {
  try {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    return await api.getUserPermissions(projectId);
  } catch (error) {
    console.error('Failed to fetch permissions:', error);
    return null;
  }
}

// NEW: Active collaborators (real-time)
static async getActiveCollaborators(projectId: string): Promise<any[]> {
  try {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    return await api.getActiveCollaborators(projectId);
  } catch (error) {
    console.error('Failed to fetch active collaborators:', error);
    return [];
  }
}

// NEW: Session stats
static async getCollaborationStats(): Promise<any> {
  try {
    return await api.getSessionStats();
  } catch (error) {
    console.error('Failed to fetch collaboration stats:', error);
    return null;
  }
}

  // ===== ENDPOINT MANAGEMENT =====
  
static async getEndpoints(projectId: string, params?: PaginationParams): Promise<Endpoint[]> {
  try {
    const response = await api.getEndpoints(projectId, params);
    
    console.log('🔄 ApiClient.getEndpoints raw response:', response);
    
    // response = { endpoints: Endpoint[], pagination: {...} }
    if (response && response.endpoints && Array.isArray(response.endpoints)) {
      return response.endpoints;
    }
    
    // If response is already an array (fallback)
    if (Array.isArray(response)) {
      return response;
    }
    
    return [];
    
  } catch (error) {
    return [];
  }
}






  static async getEndpoint(projectId: string, endpointId: string): Promise<Endpoint> {
    try {
      if (!projectId || !endpointId) {
        throw new Error('Project ID and Endpoint ID are required');
      }

      return await api.getEndpoint(projectId, endpointId);
    } catch (error: any) {
      console.error('Failed to fetch endpoint:', error);
      
      if (error.message.includes('404')) {
        throw new Error('Endpoint not found');
      }
      
      throw new Error('Failed to load endpoint. Please try again');
    }
  }

 
static async createEndpoint(projectId: string, data: CreateEndpointData): Promise<Endpoint> {
  try {
    console.log('Creating endpoint:', { projectId, data });
    
    // Call the api.ts method
    const response = await api.createEndpoint(projectId, data);
    
    // Handle different response formats
    if (response && typeof response === 'object') {
      // If response has data field (wrapped response)
      if ('data' in response && response.data) {
        return response.data as Endpoint;
      }
      // If response is the endpoint directly
      if ('id' in response && 'path' in response) {
        return response as Endpoint;
      }
    }
    
    console.error('Unexpected response format:', response);
    throw new Error('Invalid response format from server');
    
  } catch (error: any) {
    console.error('Failed to create endpoint:', error);
    throw error;
  }
}

  static async updateEndpoint(projectId: string, endpointId: string, data: UpdateEndpointData): Promise<Endpoint> {
    try {
      if (!projectId || !endpointId) {
        throw new Error('Project ID and Endpoint ID are required');
      }

      const endpoint = await api.updateEndpoint(projectId, endpointId, data);
      return endpoint;
    } catch (error: any) {
      console.error('Failed to update endpoint:', error);
      
      if (error.message.includes('404')) {
        throw new Error('Endpoint not found');
      }
      
      throw new Error('Failed to update endpoint. Please try again');
    }
  }

  static async deleteEndpoint(projectId: string, endpointId: string): Promise<void> {
    try {
      if (!projectId || !endpointId) {
        throw new Error('Project ID and Endpoint ID are required');
      }

      if (!confirm('Are you sure you want to delete this endpoint?')) {
        throw new Error('Cancelled by user');
      }

      await api.deleteEndpoint(projectId, endpointId);
    } catch (error: any) {
      console.error('Failed to delete endpoint:', error);
      
      if (error.message === 'Cancelled by user') {
        throw error;
      }
      
      throw new Error('Failed to delete endpoint. Please try again');
    }
  }

  static async duplicateEndpoint(projectId: string, endpointId: string): Promise<Endpoint> {
    try {
      if (!projectId || !endpointId) {
        throw new Error('Project ID and Endpoint ID are required');
      }

      const endpoint = await api.duplicateEndpoint(projectId, endpointId);
      return endpoint;
    } catch (error: any) {
      console.error('Failed to duplicate endpoint:', error);
      throw new Error('Failed to duplicate endpoint. Please try again');
    }
  }

  // ===== EXECUTION =====
  
  static async executeEndpoint(projectId: string, endpointId: string, requestData: ExecutionRequest): Promise<ExecutionResult> {
    try {
      console.log('🔍 ApiClient.executeEndpoint called with:', { projectId, endpointId });
      
      if (!projectId || !endpointId) {
        throw new Error('Project ID and Endpoint ID are required');
      }

      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('accessToken') 
        : null;
      
      if (!token) {
        throw new Error('Authentication required. Please login');
      }

      const result = await api.executeEndpoint(projectId, endpointId, requestData);
      console.log('🔍 ApiClient.executeEndpoint result:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Failed to execute endpoint:', error);
      
      if (error.message.includes('401')) {
        throw new Error('Authentication expired. Please login again');
      }
      
      if (error.message.includes('404')) {
        throw new Error('Endpoint not found');
      }
      
      if (error.message.includes('timeout')) {
        throw new Error('Request timeout. The endpoint took too long to respond');
      }
      
      if (error.message.includes('sandbox') || error.message.includes('Docker')) {
        throw new Error('Execution environment is currently unavailable. Please try again later');
      }
      
      throw new Error(`Failed to execute endpoint: ${error.message}`);
    }
  }

  static async getExecutionHistory(endpointId: string, limit: number = 20): Promise<ExecutionLog[]> {
    try {
      if (!endpointId) {
        throw new Error('Endpoint ID is required');
      }

      return await api.getExecutionHistory(endpointId, limit);
    } catch (error) {
      console.error('Failed to fetch execution history:', error);
      return [];
    }
  }

  static async getExecutionLog(executionId: string): Promise<ExecutionLog> {
    try {
      if (!executionId) {
        throw new Error('Execution ID is required');
      }

      return await api.getExecutionLog(executionId);
    } catch (error: any) {
      console.error('Failed to fetch execution log:', error);
      
      if (error.message.includes('404')) {
        throw new Error('Execution log not found');
      }
      
      throw new Error('Failed to load execution log. Please try again');
    }
  }

  // ===== AI SERVICES =====
  
  static async generateCode(data: AIGenerateRequest): Promise<AIResponse['data']> {
    try {
      if (!data.prompt || data.prompt.trim().length < 5) {
        throw new Error('Please provide a more detailed prompt (at least 5 characters)');
      }

      const response = await api.generateCode(data);
      return response;
    } catch (error: any) {
      console.error('AI code generation failed:', error);
      
      if (error.message.includes('quota') || error.message.includes('limit')) {
        throw new Error('AI usage limit reached. Please try again later');
      }
      
      if (error.message.includes('timeout')) {
        throw new Error('AI service timeout. Please try again');
      }
      
      throw new Error('Failed to generate code. Please try again');
    }
  }

  static async optimizeCode(data: AIOptimizeRequest): Promise<AIResponse['data']> {
    try {
      if (!data.code || data.code.trim().length < 10) {
        throw new Error('Please provide valid code to optimize');
      }

      const response = await api.optimizeCode(data);
      return response;
    } catch (error: any) {
      console.error('AI code optimization failed:', error);
      throw new Error('Failed to optimize code. Please try again');
    }
  }

  static async debugCode(data: AIDebugRequest): Promise<AIResponse['data']> {
    try {
      if (!data.code || !data.errorMessage) {
        throw new Error('Code and error message are required');
      }

      const response = await api.debugCode(data);
      return response;
    } catch (error: any) {
      console.error('AI debugging failed:', error);
      throw new Error('Failed to debug code. Please try again');
    }
  }

  static async generateTests(data: AITestRequest): Promise<AIResponse['data']> {
    try {
      if (!data.code || data.code.trim().length < 10) {
        throw new Error('Please provide valid code to generate tests for');
      }

      const response = await api.generateTests(data);
      return response;
    } catch (error: any) {
      console.error('AI test generation failed:', error);
      throw new Error('Failed to generate tests. Please try again');
    }
  }

  static async generateDocumentation(data: AIDocumentationRequest): Promise<AIResponse['data']> {
    try {
      if (!data.code || data.code.trim().length < 10) {
        throw new Error('Please provide valid code to document');
      }

      const response = await api.generateAiDocumentation(data);
      return response;
    } catch (error: any) {
      console.error('AI documentation generation failed:', error);
      throw new Error('Failed to generate documentation. Please try again');
    }
  }

  static async getAIUsage(): Promise<AIUsageStats> {
    try {
      return await api.getAIUsage();
    } catch (error) {
      console.error('Failed to fetch AI usage:', error);
      return {
        daily: [],
        total: { inputTokens: 0, outputTokens: 0, cost: 0, requests: 0 },
        limit: 0,
        remaining: 0
      };
    }
  }

  static async getAIHistory(projectId?: string): Promise<AIUsage[]> {
    try {
      return await api.getAIHistory(projectId);
    } catch (error) {
      console.error('Failed to fetch AI history:', error);
      return [];
    }
  }

   
  
// ===== MOCK DATA =====
static async getMockDataCollections(projectId: string): Promise<MockDataCollection[]> {
  try {
    if (!projectId) {
      throw new Error('Project ID is required');
    }

    const collections = await api.getMockDataCollections(projectId);
    return Array.isArray(collections) ? collections : [];
  } catch (error) {
    console.error('Failed to fetch mock data:', error);
    return [];
  }
}

static async getMockDataCollection(collectionId: string): Promise<MockDataCollection> {
  try {
    if (!collectionId) {
      throw new Error('Collection ID is required');
    }

    return await api.getMockDataCollection(collectionId);
  } catch (error: any) {
    console.error('Failed to fetch mock data collection:', error);
    
    if (error.message.includes('404')) {
      throw new Error('Mock data collection not found');
    }
    
    throw new Error('Failed to load mock data collection. Please try again');
  }
}

static async createMockDataCollection(projectId: string, data: CreateMockDataCollection): Promise<MockDataCollection> {
  try {
    if (!projectId) {
      throw new Error('Project ID is required');
    }

    if (!data.name || data.name.trim().length < 3) {
      throw new Error('Collection name must be at least 3 characters');
    }

    const collection = await api.createMockDataCollection(projectId, data);
    return collection;
  } catch (error: any) {
    console.error('Failed to create mock data collection:', error);
    
    if (error.message.includes('unique constraint')) {
      throw new Error('A collection with this name already exists');
    }
    
    throw new Error('Failed to create mock data collection. Please try again');
  }
}

static async updateMockDataCollection(collectionId: string, data: UpdateMockDataCollection): Promise<MockDataCollection> {
  try {
    if (!collectionId) {
      throw new Error('Collection ID is required');
    }

    const collection = await api.updateMockDataCollection(collectionId, data);
    return collection;
  } catch (error: any) {
    console.error('Failed to update mock data collection:', error);
    throw new Error('Failed to update mock data collection. Please try again');
  }
}

static async deleteMockDataCollection(collectionId: string): Promise<void> {
  try {
    if (!collectionId) {
      throw new Error('Collection ID is required');
    }

    if (!confirm('Are you sure you want to delete this mock data collection?')) {
      throw new Error('Cancelled by user');
    }

    await api.deleteMockDataCollection(collectionId);
  } catch (error: any) {
    console.error('Failed to delete mock data collection:', error);
    
    if (error.message === 'Cancelled by user') {
      throw error;
    }
    
    throw new Error('Failed to delete mock data collection. Please try again');
  }
}

static async searchMockData(collectionId: string, query: string, filters: any = {}): Promise<any> {
  try {
    if (!collectionId || !query) {
      throw new Error('Collection ID and query are required');
    }

    return await api.searchMockData(collectionId, query, filters);
  } catch (error) {
    console.error('Failed to search mock data:', error);
    return null;
  }
}

//  Save mock data from endpoint execution
static async saveMockDataFromExecution(collectionId: string, data: any[], executionContext?: any): Promise<any> {
  try {
    if (!collectionId) {
      throw new Error('Collection ID is required');
    }

    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }

    console.log('💾 Saving mock data from execution:', {
      collectionId,
      dataLength: data.length,
      executionContext
    });

    return await api.saveMockDataFromExecution(collectionId, data, executionContext);
  } catch (error: any) {
    console.error('Failed to save mock data from execution:', error);
    
    if (error.message.includes('ACCESS_DENIED')) {
      throw new Error('You do not have permission to save this collection');
    }
    
    if (error.message.includes('SCHEMA_VALIDATION')) {
      throw new Error('Data does not match collection schema');
    }
    
    throw new Error('Failed to save mock data. Please try again');
  }
}

//  Get save history for a collection
static async getMockDataSaveHistory(collectionId: string, limit: number = 10): Promise<any> {
  try {
    if (!collectionId) {
      throw new Error('Collection ID is required');
    }

    return await api.getMockDataSaveHistory(collectionId, limit);
  } catch (error: any) {
    console.error('Failed to get save history:', error);
    throw new Error('Failed to load save history. Please try again');
  }
}

//  Rollback collection to previous version
static async rollbackMockDataCollection(collectionId: string, version?: number): Promise<any> {
  try {
    if (!collectionId) {
      throw new Error('Collection ID is required');
    }

    if (!confirm('Are you sure you want to rollback this collection? This cannot be undone.')) {
      throw new Error('Cancelled by user');
    }

    return await api.rollbackMockDataCollection(collectionId, version);
  } catch (error: any) {
    console.error('Failed to rollback collection:', error);
    
    if (error.message === 'Cancelled by user') {
      throw error;
    }
    
    if (error.message.includes('NO_BACKUP')) {
      throw new Error('No backup available for rollback');
    }
    
    throw new Error('Failed to rollback collection. Please try again');
  }
}

  // ===== ENVIRONMENTS =====
  
  static async getEnvironments(projectId: string): Promise<Environment[]> {
    try {
      if (!projectId) {
        throw new Error('Project ID is required');
      }

      const environments = await api.getEnvironments(projectId);
      return Array.isArray(environments) ? environments : [];
    } catch (error) {
      console.error('Failed to fetch environments:', error);
      return [];
    }
  }

  static async getEnvironment(environmentId: string): Promise<Environment> {
    try {
      if (!environmentId) {
        throw new Error('Environment ID is required');
      }

      return await api.getEnvironment(environmentId);
    } catch (error: any) {
      console.error('Failed to fetch environment:', error);
      
      if (error.message.includes('404')) {
        throw new Error('Environment not found');
      }
      
      throw new Error('Failed to load environment. Please try again');
    }
  }

  static async createEnvironment(projectId: string, data: CreateEnvironment): Promise<Environment> {
    try {
      if (!projectId) {
        throw new Error('Project ID is required');
      }

      if (!data.name || !data.variables) {
        throw new Error('Name and variables are required');
      }

      const environment = await api.createEnvironment(projectId, data);
      return environment;
    } catch (error: any) {
      console.error('Failed to create environment:', error);
      
      if (error.message.includes('unique')) {
        throw new Error('Environment name already exists in this project');
      }
      
      throw new Error('Failed to create environment. Please try again');
    }
  }

  static async updateEnvironment(environmentId: string, data: UpdateEnvironment): Promise<Environment> {
    try {
      if (!environmentId) {
        throw new Error('Environment ID is required');
      }

      const environment = await api.updateEnvironment(environmentId, data);
      return environment;
    } catch (error: any) {
      console.error('Failed to update environment:', error);
      throw new Error('Failed to update environment. Please try again');
    }
  }

  static async deleteEnvironment(environmentId: string): Promise<void> {
    try {
      if (!environmentId) {
        throw new Error('Environment ID is required');
      }

      if (!confirm('Are you sure you want to delete this environment?')) {
        throw new Error('Cancelled by user');
      }

      await api.deleteEnvironment(environmentId);
    } catch (error: any) {
      console.error('Failed to delete environment:', error);
      
      if (error.message === 'Cancelled by user') {
        throw error;
      }
      
      throw new Error('Failed to delete environment. Please try again');
    }
  }

  // ===== WEBHOOKS =====
  
  static async getWebhooks(projectId: string): Promise<Webhook[]> {
    try {
      if (!projectId) {
        throw new Error('Project ID is required');
      }

      const webhooks = await api.getWebhooks(projectId);
      return Array.isArray(webhooks) ? webhooks : [];
    } catch (error) {
      console.error('Failed to fetch webhooks:', error);
      return [];
    }
  }

  static async getWebhook(webhookId: string): Promise<Webhook> {
    try {
      if (!webhookId) {
        throw new Error('Webhook ID is required');
      }

      return await api.getWebhook(webhookId);
    } catch (error: any) {
      console.error('Failed to fetch webhook:', error);
      
      if (error.message.includes('404')) {
        throw new Error('Webhook not found');
      }
      
      throw new Error('Failed to load webhook. Please try again');
    }
  }

  static async createWebhook(projectId: string, data: CreateWebhook): Promise<Webhook> {
    try {
      if (!projectId) {
        throw new Error('Project ID is required');
      }

      // Validate URL
      try {
        new URL(data.url);
      } catch {
        throw new Error('Invalid webhook URL');
      }
      
      if (!data.events || data.events.length === 0) {
        throw new Error('Please select at least one event');
      }

      const webhook = await api.createWebhook(projectId, data);
      return webhook;
    } catch (error: any) {
      console.error('Failed to create webhook:', error);
      throw new Error(error.message || 'Failed to create webhook');
    }
  }

  static async updateWebhook(webhookId: string, data: UpdateWebhook): Promise<Webhook> {
    try {
      if (!webhookId) {
        throw new Error('Webhook ID is required');
      }

      if (data.url) {
        try {
          new URL(data.url);
        } catch {
          throw new Error('Invalid webhook URL');
        }
      }

      const webhook = await api.updateWebhook(webhookId, data);
      return webhook;
    } catch (error: any) {
      console.error('Failed to update webhook:', error);
      throw new Error('Failed to update webhook. Please try again');
    }
  }

  static async deleteWebhook(webhookId: string): Promise<void> {
    try {
      if (!webhookId) {
        throw new Error('Webhook ID is required');
      }

      if (!confirm('Are you sure you want to delete this webhook?')) {
        throw new Error('Cancelled by user');
      }

      await api.deleteWebhook(webhookId);
    } catch (error: any) {
      console.error('Failed to delete webhook:', error);
      
      if (error.message === 'Cancelled by user') {
        throw error;
      }
      
      throw new Error('Failed to delete webhook. Please try again');
    }
  }

  static async getWebhookDeliveries(webhookId: string, limit: number = 20): Promise<WebhookDelivery[]> {
    try {
      if (!webhookId) {
        throw new Error('Webhook ID is required');
      }

      return await api.getWebhookDeliveries(webhookId, limit);
    } catch (error) {
      console.error('Failed to fetch webhook deliveries:', error);
      return [];
    }
  }

  static async triggerWebhook(webhookId: string, data: any): Promise<any> {
    try {
      if (!webhookId) {
        throw new Error('Webhook ID is required');
      }

      return await api.triggerWebhook(webhookId, data);
    } catch (error: any) {
      console.error('Failed to trigger webhook:', error);
      throw new Error('Failed to trigger webhook. Please try again');
    }
  }

  // ===== API KEYS =====
  
  static async getApiKeys(): Promise<ApiKey[]> {
    try {
      const apiKeys = await api.getApiKeys();
      return Array.isArray(apiKeys) ? apiKeys : [];
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
      return [];
    }
  }

  static async getApiKey(keyId: string): Promise<ApiKey> {
    try {
      if (!keyId) {
        throw new Error('API Key ID is required');
      }

      return await api.getApiKey(keyId);
    } catch (error: any) {
      console.error('Failed to fetch API key:', error);
      
      if (error.message.includes('404')) {
        throw new Error('API key not found');
      }
      
      throw new Error('Failed to load API key. Please try again');
    }
  }

  static async createApiKey(data: CreateApiKey): Promise<ApiKey> {
    try {
      if (!data.name || data.name.length < 3) {
        throw new Error('API key name must be at least 3 characters');
      }

      const apiKey = await api.createApiKey(data);
      
      // IMPORTANT: This is the only time the full key is returned
      // Store it securely and show to user once
      return apiKey;
    } catch (error: any) {
      console.error('Failed to create API key:', error);
      throw new Error('Failed to create API key. Please try again');
    }
  }

  static async updateApiKey(keyId: string, data: UpdateApiKey): Promise<ApiKey> {
    try {
      if (!keyId) {
        throw new Error('API Key ID is required');
      }

      const apiKey = await api.updateApiKey(keyId, data);
      return apiKey;
    } catch (error: any) {
      console.error('Failed to update API key:', error);
      throw new Error('Failed to update API key. Please try again');
    }
  }

  static async deleteApiKey(keyId: string): Promise<void> {
    try {
      if (!keyId) {
        throw new Error('API Key ID is required');
      }

      if (!confirm('Are you sure you want to delete this API key? This cannot be undone.')) {
        throw new Error('Cancelled by user');
      }

      await api.deleteApiKey(keyId);
    } catch (error: any) {
      console.error('Failed to delete API key:', error);
      
      if (error.message === 'Cancelled by user') {
        throw error;
      }
      
      throw new Error('Failed to delete API key. Please try again');
    }
  }

  static async rotateApiKey(keyId: string): Promise<ApiKey> {
    try {
      if (!keyId) {
        throw new Error('API Key ID is required');
      }

      if (!confirm('Are you sure? This will invalidate the current key and generate a new one.')) {
        throw new Error('Cancelled by user');
      }

      const apiKey = await api.rotateApiKey(keyId);
      return apiKey;
    } catch (error: any) {
      console.error('Failed to rotate API key:', error);
      
      if (error.message === 'Cancelled by user') {
        throw error;
      }
      
      throw new Error('Failed to rotate API key. Please try again');
    }
  }

  // ===== DOCUMENTATION =====
  
  static async generateOpenAPISpec(projectId: string): Promise<OpenAPISpec> {
    try {
      if (!projectId) {
        throw new Error('Project ID is required');
      }

      return await api.generateDocumentation(projectId);
    } catch (error: any) {
      console.error('Failed to generate documentation:', error);
      throw new Error('Failed to generate documentation. Please try again');
    }
  }

  static async exportDocumentation(projectId: string, format: string): Promise<ExportResult> {
    try {
      if (!projectId) {
        throw new Error('Project ID is required');
      }

      return await api.exportDocumentation(projectId, format);
    } catch (error: any) {
      console.error('Failed to export documentation:', error);
      throw new Error('Failed to export documentation. Please try again');
    }
  }

  static async getDocumentationAnalytics(projectId: string): Promise<DocumentationAnalytics> {
    try {
      if (!projectId) {
        throw new Error('Project ID is required');
      }

      return await api.getDocumentationAnalytics(projectId);
    } catch (error) {
      console.error('Failed to fetch documentation analytics:', error);
      return {
        totalEndpoints: 0,
        documentedEndpoints: 0,
        documentationCoverage: 0,
        totalExecutions: 0,
        mostUsedEndpoints: [],
        endpointsByMethod: {} as Record<string, number>,
        avgResponseTime: 0,
        errorRate: 0
      };
    }
  }

 // ===== EXPORT/IMPORT =====

static async exportProject(projectId: string, data: any): Promise<any> {
  try {
    if (!projectId) {
      throw new Error('Project ID is required');
    }

    const response = await api.exportProject(projectId, data);
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'Export failed');
    }
  } catch (error: any) {
    console.error('Failed to export project:', error);
    throw new Error(error.message || 'Failed to export project. Please try again');
  }
}

static async importProject(data: any): Promise<any> {
  try {
    if (!data.file) {
      throw new Error('Import file is required');
    }

    const response = await api.importProject(data);
    
    // Your backend returns: { success: true, message: string, data: project }
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'Import failed');
    }
  } catch (error: any) {
    console.error('Failed to import project:', error);
    
    if (error.message.includes('validation') || error.message.includes('INVALID')) {
      throw new Error('Invalid import file format');
    }
    
    throw new Error(error.message || 'Failed to import project. Please try again');
  }
}

static async getExportFormats(): Promise<any[]> {
  try {
    const response = await api.getExportFormats();
    
    // Your backend returns: { success: true, data: formats[] }
    if (response.success) {
      return response.data || [];
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch export formats:', error);
    return [];
  }
}

static async getExports(projectId?: string): Promise<any[]> {
  try {
    const response = await api.getExports(projectId);
    
    // Your backend returns: { success: true, data: exports[] }
    if (response.success) {
      return response.data || [];
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch exports:', error);
    return [];
  }
}


  // ===== ANALYTICS =====
  
  static async getProjectAnalytics(projectId: string, period: string = '7d'): Promise<ProjectAnalytics> {
    try {
      if (!projectId) {
        throw new Error('Project ID is required');
      }

      return await api.getProjectAnalytics(projectId, period);
    } catch (error) {
      console.error('Failed to fetch project analytics:', error);
      return {
        period,
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        endpoints: [],
        usageByDay: [],
        topUsers: [],
        statusCodes: {},
        errorRate: 0
      };
    }
  }

  static async getUserAnalytics(period: string = '30d'): Promise<UserAnalytics> {
    try {
      return await api.getUserAnalytics(period);
    } catch (error) {
      console.error('Failed to fetch user analytics:', error);
      return {
        period,
        projects: 0,
        endpoints: 0,
        totalExecutions: 0,
        aiUsage: {
          requests: 0,
          tokens: 0,
          cost: 0,
          byAction: {} as Record<string, number>
        },
        activeDays: 0,
        dailyActivity: []
      };
    }
  }

  static async getEndpointAnalytics(endpointId: string, period: string = '7d'): Promise<EndpointAnalytics> {
    try {
      if (!endpointId) {
        throw new Error('Endpoint ID is required');
      }

      return await api.getEndpointAnalytics(endpointId, period);
    } catch (error) {
      console.error('Failed to fetch endpoint analytics:', error);
      return {
        endpointId,
        period,
        totalRequests: 0,
        successRate: 0,
        averageResponseTime: 0,
        errorRate: 0,
        requestsByHour: [],
        statusCodes: {},
        requestSizeStats: { min: 0, max: 0, avg: 0, p95: 0 },
        responseSizeStats: { min: 0, max: 0, avg: 0, p95: 0 },
        users: []
      };
    }
  }

  // ===== FILE UPLOAD =====
  
  static async uploadFile(file: File, projectId?: string): Promise<FileUpload> {
    try {
      if (!file) {
        throw new Error('File is required');
      }

      // Validate file size (max 10MB)
      const MAX_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        throw new Error('File size must be less than 10MB');
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/json', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('File type not supported. Please upload images, JSON, or text files');
      }

      const upload = await api.uploadFile(file, projectId);
      return upload;
    } catch (error: any) {
      console.error('Failed to upload file:', error);
      throw new Error(error.message || 'Failed to upload file. Please try again');
    }
  }

  static async deleteFile(fileId: string): Promise<void> {
    try {
      if (!fileId) {
        throw new Error('File ID is required');
      }

      if (!confirm('Are you sure you want to delete this file?')) {
        throw new Error('Cancelled by user');
      }

      await api.deleteFile(fileId);
    } catch (error: any) {
      console.error('Failed to delete file:', error);
      
      if (error.message === 'Cancelled by user') {
        throw error;
      }
      
      throw new Error('Failed to delete file. Please try again');
    }
  }

  // ===== HEALTH CHECKS =====
  
  static async checkHealth(): Promise<SandboxHealth | null> {
    try {
      const health = await api.getSandboxHealth();
      return health;
    } catch (error) {
      console.error('Health check failed:', error);
      return null;
    }
  }

  static async checkApiHealth(): Promise<{ status: string; timestamp: string }> {
    try {
      return await api.healthCheck();
    } catch (error) {
      console.error('API health check failed:', error);
      return { status: 'unhealthy', timestamp: new Date().toISOString() };
    }
  }

  static async checkDatabaseHealth(): Promise<{ status: string; latency: number }> {
    try {
      return await api.databaseHealth();
    } catch (error) {
      console.error('Database health check failed:', error);
      return { status: 'unhealthy', latency: 0 };
    }
  }

  // ===== UTILITIES =====
  
  static isAuthenticated(): boolean {
    return api.isAuthenticated();
  }

  static getAuthToken(): string | null {
    return api.getToken();
  }

  static async validateConnection(): Promise<boolean> {
    try {
      await api.healthCheck();
      return true;
    } catch {
      return false;
    }
  }

  static clearAuth(): void {
    api.clearToken();
  }

  // ===== SEARCH =====
  
  static async searchUsers(query: string): Promise<User[]> {
    try {
      if (!query || query.trim().length < 2) {
        return [];
      }

      const users = await api.searchUsers(query);
      return Array.isArray(users) ? users : [];
    } catch (error) {
      console.error('Failed to search users:', error);
      return [];
    }
  }

  static async getUserStats(): Promise<any> {
    try {
      return await api.getUserStats();
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      return {};
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Optional: Hook for React components
export const useApiClient = () => {
  return {
    auth: {
      login: ApiClient.login,
      register: ApiClient.register,
      logout: ApiClient.logout,
      getCurrentUser: ApiClient.getCurrentUser,
      isAuthenticated: ApiClient.isAuthenticated,
      getOAuthUrl: ApiClient.getOAuthUrl,
      processOAuthCallback: ApiClient.processOAuthCallback
    },
    projects: {
    create: ApiClient.createProject,
    getAll: ApiClient.getProjects,
    get: ApiClient.getProject,
    update: ApiClient.updateProject,
    delete: ApiClient.deleteProject,
  
    getCollaborators: ApiClient.getCollaborators,
    sendInvitation: ApiClient.sendInvitation,  
    updateCollaborator: ApiClient.updateCollaborator,
    removeCollaborator: ApiClient.removeCollaborator,
    getPendingInvitations: ApiClient.getPendingInvitations,
    acceptInvitation: ApiClient.acceptInvitation,
    searchCollaborationUsers: ApiClient.searchCollaborationUsers,
    getUserPermissions: ApiClient.getUserPermissions,
    getActiveCollaborators: ApiClient.getActiveCollaborators,
    getCollaborationStats: ApiClient.getCollaborationStats
  },
    endpoints: {
      getAll: ApiClient.getEndpoints,
      get: ApiClient.getEndpoint,
      create: ApiClient.createEndpoint,
      update: ApiClient.updateEndpoint,
      delete: ApiClient.deleteEndpoint,
      execute: ApiClient.executeEndpoint,
      getHistory: ApiClient.getExecutionHistory
    },
    ai: {
      generateCode: ApiClient.generateCode,
      optimizeCode: ApiClient.optimizeCode,
      debugCode: ApiClient.debugCode,
      generateTests: ApiClient.generateTests,
      generateDocumentation: ApiClient.generateDocumentation,
      getUsage: ApiClient.getAIUsage,
      getHistory: ApiClient.getAIHistory
    },
    health: {
      check: ApiClient.checkHealth,
      checkApi: ApiClient.checkApiHealth,
      checkDatabase: ApiClient.checkDatabaseHealth
    }
  };
};