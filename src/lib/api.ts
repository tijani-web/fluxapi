// api.ts - COMPLETE UPDATED VERSION WITH OAUTH
import { 
  User, AuthResponse, LoginCredentials, RegisterData, RefreshTokenRequest, PasswordResetRequest,
  Project, ProjectWithDetails, CreateProjectData, UpdateProjectData, ProjectCollaborator,
  Endpoint, CreateEndpointData, UpdateEndpointData,
  ExecutionRequest, ExecutionResult, ExecutionLog,
  AIGenerateRequest, AIOptimizeRequest, AIDebugRequest, AITestRequest, AIDocumentationRequest, AIResponse, AIUsageStats, AIUsage,
  MockDataCollection, CreateMockDataCollection, UpdateMockDataCollection,
  Environment, CreateEnvironment, UpdateEnvironment,
  OpenAPISpec, DocumentationAnalytics,
  ExportRequest, ExportResult, ImportRequest, ExportFormatInfo, ProjectExport,
  ProjectAnalytics, UserAnalytics, EndpointAnalytics,
  Webhook, CreateWebhook, UpdateWebhook, WebhookDelivery,
  ApiKey, CreateApiKey, UpdateApiKey,
  CollaborationSession, CollaborationUser,
  SandboxHealth,
  FileUpload, UploadResponse,
  PaginatedResponse, PaginationParams,
  ApiResponse, ErrorResponse,
  OAuthCallbackParams, OAuthProvider 
} from '../types/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

type RequestHeaders = Record<string, string> & {
  'Content-Type'?: string;
  'Authorization'?: string;
  'Accept'?: string;
  'X-Requested-With'?: string;
};

class ApiClient {
  private baseURL: string;
  private defaultHeaders: RequestHeaders;
  

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };
  }

  // Fixed request method with proper headers type
private async request<T>(
  endpoint: string, 
  options: RequestInit = {},
  retryCount = 0
): Promise<T> {
  const url = `${this.baseURL}${endpoint}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const headers: RequestHeaders = {
    ...this.defaultHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      headers[key] = String(value);
    });
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  try {
    const response = await fetch(url, config);
    const responseClone = response.clone();
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      if (isJson) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          const text = await responseClone.text();
          errorMessage = text || errorMessage;
        }
      } else {
        const text = await responseClone.text();
        errorMessage = text || errorMessage;
      }
      
      if (response.status === 401 && endpoint !== '/auth/refresh-token') {
        window.dispatchEvent(new CustomEvent('auth:token-expired'));
        return Promise.reject({ code: 401 });
      }

      
      throw new Error(errorMessage);
    }
    
    if (isJson) {
      const data = await response.json();
      
      if (data && typeof data === 'object' && 'success' in data) {
        if (!data.success) {
          throw new Error(data.error || 'Request failed');
        }
        return data.data as T;
      }
      
      return data as T;
    } else {
      const text = await response.text();
      return text as unknown as T;
    }
    
  } catch (error) {
    console.error('API Request failed:', {
      endpoint,
      method: options.method || 'GET',
      error: error instanceof Error ? error.message : String(error),
    });
    
    throw error;
  }
}

async refreshToken(refreshToken: string): Promise<AuthResponse['data']> {
  const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Token refresh failed');
  }
  
  const result = await response.json();
  
  if (result && result.success && result.data) {
    return result.data as AuthResponse['data'];
  }
  
  throw new Error('Invalid refresh token response');
}

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }


// ===== AUTH API ===== 
async register(data: RegisterData): Promise<AuthResponse['data']> {
  return this.request<AuthResponse['data']>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async login(credentials: LoginCredentials): Promise<AuthResponse['data']> {
  const response = await this.request<AuthResponse['data']>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  this.setToken(response.accessToken);
  this.setRefreshToken(response.refreshToken);
  
  return response;
}

async verifyEmail(token: string): Promise<AuthResponse['data']> {
  return this.request<AuthResponse['data']>('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

async logout(): Promise<void> {
  try {
    await this.request('/auth/logout', { method: 'POST' });
  } finally {
    this.clearToken();
  }
}


async requestPasswordReset(email: string): Promise<void> {
  return this.request('/auth/request-password-reset', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

async resetPassword(token: string, newPassword: string): Promise<void> {
  return this.request('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}

async changePassword(currentPassword: string, newPassword: string): Promise<void> {
  return this.request('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

getRefreshToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  return null;
}

// ===== OAUTH API ===== 
getGoogleAuthUrl(): string {
  return `${this.baseURL}/oauth/google`;
}

getGithubAuthUrl(): string {
  return `${this.baseURL}/oauth/github`;
}

handleOAuthCallback(): OAuthCallbackParams | null {
  if (typeof window === 'undefined') return null;
  
  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get('accessToken');
  const refreshToken = params.get('refreshToken');
  const userId = params.get('userId');
  const email = params.get('email');
  const name = params.get('name');
  const avatar = params.get('avatar');
  const provider = params.get('provider') as OAuthProvider | null;
  
  if (accessToken && refreshToken && userId) {
    this.setToken(accessToken);
    this.setRefreshToken(refreshToken);
    
    return {
      accessToken,
      refreshToken,
      userId,
      email: email || undefined,
      name: name || undefined,
      avatar: avatar || undefined,
      provider: provider || undefined
    };
  }
  
  return null;
}

// NEW: Process OAuth callback and get full user data
async processOAuthCallback(): Promise<AuthResponse['data'] | null> {
  const oauthData = this.handleOAuthCallback();
  if (!oauthData) return null;
  
  // Store tokens
  this.setToken(oauthData.accessToken);
  this.setRefreshToken(oauthData.refreshToken);
  
  // Try to get full user data
  try {
    const response = await this.getProfile();
    return {
      user: response,
      accessToken: oauthData.accessToken,
      refreshToken: oauthData.refreshToken
    };
  } catch (error) {
    console.error('Failed to get user data after OAuth:', error);
    // Fallback: create minimal user object
    return {
      user: {
        id: oauthData.userId,
        email: oauthData.email || '',
        name: oauthData.name || '',
        avatar: oauthData.avatar || undefined,
        role: 'USER',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      accessToken: oauthData.accessToken,
      refreshToken: oauthData.refreshToken
    };
  }
}

clearOAuthCallback(): void {
  if (typeof window !== 'undefined') {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

hasOAuthCallback(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.has('accessToken') && params.has('refreshToken');
}

// NEW: Get user's OAuth accounts
async getOAuthAccounts(): Promise<{ provider: OAuthProvider; connected: boolean }[]> {
  try {
    const profile = await this.getProfile();
    const connectedProviders = profile.oauthAccounts?.map(acc => acc.provider) || [];
    
    return [
      { provider: 'GOOGLE', connected: connectedProviders.includes('GOOGLE') },
      { provider: 'GITHUB', connected: connectedProviders.includes('GITHUB') }
    ];
  } catch {
    return [
      { provider: 'GOOGLE', connected: false },
      { provider: 'GITHUB', connected: false }
    ];
  }
}

// ===== UTILITY METHODS =====
 setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
  }
}

 setRefreshToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refreshToken', token);
  }
}

 clearToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

  // ===== USER API =====
  async getProfile(): Promise<User> {
    return this.request<User>('/users/profile');
  }

  async updateProfile(data: { name?: string; avatar?: string }): Promise<User> {
    return this.request<User>('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteAccount(): Promise<void> {
    return this.request('/users/account', { method: 'DELETE' });
  }

  async getUserStats(): Promise<any> {
    return this.request('/users/stats');
  }

  async searchUsers(query: string): Promise<User[]> {
    return this.request<User[]>(`/users/search?q=${encodeURIComponent(query)}`);
  }

// ===== PROJECT API =====
async createProject(data: CreateProjectData): Promise<Project> {
  return this.request<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async getProjects(params?: PaginationParams): Promise<PaginatedResponse<Project>> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', params.page.toString());
  if (params?.limit) query.set('limit', params.limit.toString());
  if (params?.search) query.set('search', params.search);
  if (params?.sortBy) query.set('sortBy', params.sortBy);
  if (params?.sortOrder) query.set('sortOrder', params.sortOrder);
  
  return this.request<PaginatedResponse<Project>>(`/projects?${query}`);
}

async getProject(projectId: string): Promise<ProjectWithDetails> {
  return this.request<ProjectWithDetails>(`/projects/${projectId}`);
}

async updateProject(projectId: string, data: UpdateProjectData): Promise<Project> {
  return this.request<Project>(`/projects/${projectId}`, {
    method: 'PUT', 
    body: JSON.stringify(data),
  });
}

async deleteProject(projectId: string): Promise<void> {
  return this.request(`/projects/${projectId}`, { method: 'DELETE' });
}

// ===== PROJECT ACTIVITY =====
async getProjectActivity(projectId: string, limit?: number): Promise<any> {
  const query = new URLSearchParams();
  if (limit) query.set('limit', limit.toString());
  
  return this.request(`/projects/${projectId}/activity?${query}`);
}


// Export project 
// ===== PROJECT EXPORT/IMPORT =====

// Export project - returns blob/file for download
async exportProjectData(
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
  const token = this.getToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${this.baseURL}/projects/${projectId}/export`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      format: options?.format || 'CUSTOM_JSON',
      include: options?.include || { endpoints: true }
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Export failed' }));
    throw new Error(error.message || 'Export failed');
  }

  // Get filename from headers
  const contentDisposition = response.headers.get('content-disposition');
  const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
  const filename = filenameMatch 
    ? filenameMatch[1] 
    : `project-${projectId}-export.${options?.format === 'OPENAPI' ? 'yaml' : 'json'}`;

  const blob = await response.blob();
  
  return { blob, filename };
}

// Import project
async importProjectData(
  file: File, 
  options?: {
    name?: string;
    visibility?: 'PRIVATE' | 'TEAM' | 'PUBLIC';
  }
): Promise<Project> {
  const formData = new FormData();
  formData.append('file', file);
  
  if (options?.name) formData.append('name', options.name);
  if (options?.visibility) formData.append('visibility', options.visibility);
  
  // For FormData, we need to remove Content-Type header
  const token = this.getToken();
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${this.baseURL}/projects/import`, {
    method: 'POST',
    headers,
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Import failed' }));
    throw new Error(error.message || 'Import failed');
  }

  const result = await response.json();
  
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.message || 'Import failed');
  }
}

// Get project export history
async getProjectExportsHistory(
  projectId: string, 
  limit?: number
): Promise<{ success: boolean; data: ProjectExport[]; debug?: any }> {
  const query = new URLSearchParams();
  if (limit) query.set('limit', limit.toString());
  
  return this.request<{ success: boolean; data: ProjectExport[]; debug?: any }>(
    `/projects/${projectId}/exports?${query}`
  );
}



// ===== PROJECT COLLABORATORS =====
async sendInvitation(projectId: string, email: string, role: string = 'EDITOR'): Promise<any> {
  return this.request<any>(`/projects/${projectId}/collaborators`, {
    method: 'POST',
    body: JSON.stringify({ email, role }),
  });
}

async getCollaborators(projectId: string): Promise<any[]> {
  const response = await this.request<any>(`/projects/${projectId}/collaborators`);
  return response.success ? response.data : [];
}

async removeCollaborator(projectId: string, userId: string): Promise<void> {
  return this.request(`/projects/${projectId}/collaborators/${userId}`, { 
    method: 'DELETE' 
  });
}

async updateCollaborator(projectId: string, userId: string, data: { role: string }): Promise<any> {
  const response = await this.request<any>(`/projects/${projectId}/collaborators/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return response.success ? response.data : null;
}

async acceptInvitation(token: string): Promise<any> {
  const response = await this.request<any>('/projects/invitations/accept', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
  return response.success ? response.data : null;
}

async getPendingInvitations(projectId: string): Promise<any[]> {
  const response = await this.request<any>(`/projects/${projectId}/invitations/pending`);
  if (Array.isArray(response)) {
    return response;
  }
  return [];
}

async addCollaboratorDirect(projectId: string, userId: string, role: string = 'EDITOR'): Promise<any> {
  const response = await this.request<any>(`/projects/${projectId}/collaborators/direct`, {
    method: 'POST',
    body: JSON.stringify({ userId, role }),
  });
  return response.success ? response.data : null;
}

async searchCollaborationUsers(query: string): Promise<any[]> {
  const response = await this.request<any>(`/projects/search/users?query=${encodeURIComponent(query)}`);
  return response.success ? response.data : [];
}

async getUserPermissions(projectId: string): Promise<any> {
  const response = await this.request<any>(`/projects/${projectId}/permissions`);
  return response.success ? response.data : null;
}

async getActiveCollaborators(projectId: string): Promise<any[]> {
  const response = await this.request<any>(`/collaboration/project/${projectId}/active`);
  return response.success ? response.data : [];
}

async getSessionStats(): Promise<any> {
  const response = await this.request<any>('/collaboration/stats');
  return response.success ? response.data : null;
}



// ===== ENDPOINT API =====
async createEndpoint(projectId: string, data: CreateEndpointData): Promise<Endpoint> {
  return this.request<Endpoint>(`/endpoints/${projectId}/endpoints`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async getEndpoints(projectId: string, params?: PaginationParams): Promise<PaginatedResponse<Endpoint>> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', params.page.toString());
  if (params?.limit) query.set('limit', params.limit.toString());
  if (params?.search) query.set('search', params.search);
  if (params?.sortBy) query.set('sortBy', params.sortBy);
  if (params?.sortOrder) query.set('sortOrder', params.sortOrder);
  
  return this.request<PaginatedResponse<Endpoint>>(`/endpoints/${projectId}/endpoints?${query}`);
}

async getEndpoint(projectId: string, endpointId: string): Promise<Endpoint> {
  return this.request<Endpoint>(`${projectId}/endpoints/${endpointId}`);
}

async updateEndpoint(projectId: string, endpointId: string, data: UpdateEndpointData): Promise<Endpoint> {
  return this.request<Endpoint>(`/endpoints/${projectId}/endpoints/${endpointId}`, {
    method: 'PUT', 
    body: JSON.stringify(data),
  });
}

async deleteEndpoint(projectId: string, endpointId: string): Promise<void> {
  return this.request(`/endpoints/${projectId}/endpoints/${endpointId}`, { 
    method: 'DELETE' 
  });
}

async duplicateEndpoint(projectId: string, endpointId: string): Promise<Endpoint> {
  return this.request<Endpoint>(`/endpoints/${projectId}/endpoints/${endpointId}/duplicate`, {
    method: 'POST',
  });
}

  // ===== EXECUTION API =====
  async executeEndpoint(projectId: string, endpointId: string, data: ExecutionRequest): Promise<ExecutionResult> {
    return this.request<ExecutionResult>(`/execute/project/${projectId}/endpoint/${endpointId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getExecutionHistory(endpointId: string, limit: number = 20): Promise<ExecutionLog[]> {
    return this.request<ExecutionLog[]>(`/execute/endpoint/${endpointId}/history?limit=${limit}`);
  }

  async getExecutionLog(executionId: string): Promise<ExecutionLog> {
    return this.request<ExecutionLog>(`/execute/logs/${executionId}`);
  }

  async getSandboxHealth(): Promise<SandboxHealth> {
    return this.request<SandboxHealth>('/execute/health');
  }

  // ===== AI API =====
  async generateCode(data: AIGenerateRequest): Promise<AIResponse['data']> {
    return this.request<AIResponse['data']>('/ai/generate-code', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async optimizeCode(data: AIOptimizeRequest): Promise<AIResponse['data']> {
    return this.request<AIResponse['data']>('/ai/optimize-code', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async debugCode(data: AIDebugRequest): Promise<AIResponse['data']> {
    return this.request<AIResponse['data']>('/ai/debug-code', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateTests(data: AITestRequest): Promise<AIResponse['data']> {
    return this.request<AIResponse['data']>('/ai/generate-tests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateAiDocumentation(data: AIDocumentationRequest): Promise<AIResponse['data']> {
    return this.request<AIResponse['data']>('/ai/generate-documentation', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAIUsage(): Promise<AIUsageStats> {
    return this.request<AIUsageStats>('/ai/usage');
  }

  async getAIHistory(projectId?: string): Promise<AIUsage[]> {
    const url = projectId 
      ? `/ai/history?projectId=${projectId}`
      : '/ai/history';
    return this.request<AIUsage[]>(url);
  }

 // ===== MOCK DATA API =====
async createMockDataCollection(projectId: string, data: CreateMockDataCollection): Promise<MockDataCollection> {
  return this.request<MockDataCollection>(`/mock-data/project/${projectId}/collections`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async getMockDataCollections(projectId: string): Promise<MockDataCollection[]> {
  return this.request<MockDataCollection[]>(`/mock-data/project/${projectId}/collections`);
}

async getMockDataCollection(collectionId: string): Promise<MockDataCollection> {
  return this.request<MockDataCollection>(`/mock-data/collections/${collectionId}`);
}

async updateMockDataCollection(collectionId: string, data: UpdateMockDataCollection): Promise<MockDataCollection> {
  return this.request<MockDataCollection>(`/mock-data/collections/${collectionId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

async deleteMockDataCollection(collectionId: string): Promise<void> {
  return this.request(`/mock-data/collections/${collectionId}`, { method: 'DELETE' });
}

async searchMockData(collectionId: string, query: string, filters: any = {}): Promise<any> {
  const searchParams = new URLSearchParams();
  searchParams.set('q', query);
  Object.entries(filters).forEach(([key, value]) => {
    searchParams.set(key, String(value));
  });
  
  return this.request(`/mock-data/collections/${collectionId}/search?${searchParams}`);
}

//  Save mock data from endpoint execution
async saveMockDataFromExecution(projectId: string, collectionId: string, data: any[], executionContext?: any): Promise<any> {
  return this.request(`/mock-data/projects/${projectId}/collections/${collectionId}/save-from-execution`, {
    method: 'POST',
    body: JSON.stringify({ 
      collectionId,
      data, 
      executionContext 
    }),
  });
}

//  Get save history
async getMockDataSaveHistory(collectionId: string, limit: number = 10): Promise<any> {
  return this.request(`/mock-data/collections/${collectionId}/save-history?limit=${limit}`);
}

//  Rollback collection
async rollbackMockDataCollection(collectionId: string, version?: number): Promise<any> {
  return this.request(`/mock-data/collections/${collectionId}/rollback`, {
    method: 'POST',
    body: JSON.stringify({ version }),
  });
}

  // ===== ENVIRONMENT API =====
  async createEnvironment(projectId: string, data: CreateEnvironment): Promise<Environment> {
    return this.request<Environment>(`/environments/project/${projectId}/environments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEnvironments(projectId: string): Promise<Environment[]> {
    return this.request<Environment[]>(`/environments/project/${projectId}/environments`);
  }

  async getEnvironment(environmentId: string): Promise<Environment> {
    return this.request<Environment>(`/environments/environments/${environmentId}`);
  }

  async updateEnvironment(environmentId: string, data: UpdateEnvironment): Promise<Environment> {
    return this.request<Environment>(`/environments/environments/${environmentId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteEnvironment(environmentId: string): Promise<void> {
    return this.request(`/environments/environments/${environmentId}`, { method: 'DELETE' });
  }

  // ===== WEBHOOK API =====
  async createWebhook(projectId: string, data: CreateWebhook): Promise<Webhook> {
    return this.request<Webhook>(`/webhooks/project/${projectId}/webhooks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getWebhooks(projectId: string): Promise<Webhook[]> {
    return this.request<Webhook[]>(`/webhooks/project/${projectId}/webhooks`);
  }

  async getWebhook(webhookId: string): Promise<Webhook> {
    return this.request<Webhook>(`/webhooks/webhooks/${webhookId}`);
  }

  async updateWebhook(webhookId: string, data: UpdateWebhook): Promise<Webhook> {
    return this.request<Webhook>(`/webhooks/webhooks/${webhookId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    return this.request(`/webhooks/webhooks/${webhookId}`, { method: 'DELETE' });
  }

  async triggerWebhook(webhookId: string, data: any): Promise<any> {
    return this.request(`/webhooks/webhooks/${webhookId}/trigger`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getWebhookDeliveries(webhookId: string, limit: number = 20): Promise<WebhookDelivery[]> {
    return this.request<WebhookDelivery[]>(`/webhooks/webhooks/${webhookId}/deliveries?limit=${limit}`);
  }

  // ===== API KEYS =====
  async createApiKey(data: CreateApiKey): Promise<ApiKey> {
    return this.request<ApiKey>('/api-keys', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getApiKeys(): Promise<ApiKey[]> {
    return this.request<ApiKey[]>('/api-keys');
  }

  async getApiKey(keyId: string): Promise<ApiKey> {
    return this.request<ApiKey>(`/api-keys/${keyId}`);
  }

  async updateApiKey(keyId: string, data: UpdateApiKey): Promise<ApiKey> {
    return this.request<ApiKey>(`/api-keys/${keyId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteApiKey(keyId: string): Promise<void> {
    return this.request(`/api-keys/${keyId}`, { method: 'DELETE' });
  }

  async rotateApiKey(keyId: string): Promise<ApiKey> {
    return this.request<ApiKey>(`/api-keys/${keyId}/rotate`, {
      method: 'POST',
    });
  }

  // ===== DOCUMENTATION API =====
  async generateDocumentation(projectId: string): Promise<OpenAPISpec> {
    return this.request<OpenAPISpec>(`/documentation/project/${projectId}`);
  }

  async exportDocumentation(projectId: string, format: string): Promise<ExportResult> {
    return this.request<ExportResult>(`/documentation/project/${projectId}/export`, {
      method: 'POST',
      body: JSON.stringify({ format }),
    });
  }

  async getDocumentationAnalytics(projectId: string): Promise<DocumentationAnalytics> {
    return this.request<DocumentationAnalytics>(`/documentation/project/${projectId}/analytics`);
  }


// ===== EXPORT/IMPORT API =====
async exportProject(projectId: string, data: any): Promise<any> {
  return this.request<any>(`/export-import/project/${projectId}/export`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async importProject(data: any): Promise<any> {
  return this.request<any>('/export-import/import', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async getExportFormats(): Promise<any> {
  return this.request<any>('/export-import/formats');
}

async getExports(projectId?: string): Promise<any> {
  const url = '/export-import/exports';
  const params = new URLSearchParams();
  
  if (projectId) {
    params.append('projectId', projectId);
  }
  
  const queryString = params.toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  
  return this.request<any>(fullUrl);
}

  // ===== COLLABORATION API =====

  async getCollaborationStats(): Promise<any> {
    return this.request('/collaboration/stats');
  }

  // ===== ANALYTICS API =====
  async getProjectAnalytics(projectId: string, period: string = '7d'): Promise<ProjectAnalytics> {
    return this.request<ProjectAnalytics>(`/analytics/project/${projectId}?period=${period}`);
  }

  async getUserAnalytics(period: string = '30d'): Promise<UserAnalytics> {
    return this.request<UserAnalytics>(`/analytics/user?period=${period}`);
  }

  async getEndpointAnalytics(endpointId: string, period: string = '7d'): Promise<EndpointAnalytics> {
    return this.request<EndpointAnalytics>(`/analytics/endpoint/${endpointId}?period=${period}`);
  }

  // ===== FILE UPLOAD =====
  async uploadFile(file: File, projectId?: string): Promise<FileUpload> {
    const formData = new FormData();
    formData.append('file', file);
    if (projectId) {
      formData.append('projectId', projectId);
    }

    // For file uploads, we need to remove the Content-Type header
    // so the browser can set it with the boundary
    const headers: RequestHeaders = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`,
    };

    const response = await fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result: UploadResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }

    return result.data;
  }

  async deleteFile(fileId: string): Promise<void> {
    return this.request(`/upload/${fileId}`, { method: 'DELETE' });
  }

  // ===== HEALTH CHECKS =====
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/health');
  }

  async databaseHealth(): Promise<{ status: string; latency: number }> {
    return this.request('/health/database');
  }

  // ===== UTILITY METHODS =====
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getAuthHeaders(): RequestHeaders {
    const token = this.getToken();
    const headers: RequestHeaders = { ...this.defaultHeaders };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }
}

// Create singleton instance
export const api = new ApiClient();

// Export for use in components
export default api;