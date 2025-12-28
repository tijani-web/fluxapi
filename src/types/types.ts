// ===== BASE TYPES =====
export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';
export type ProjectVisibility = 'PRIVATE' | 'TEAM' | 'PUBLIC';
export type CollaboratorRole = 'VIEWER' | 'EDITOR' | 'ADMIN';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
export type ExportFormat = 'POSTMAN' | 'OPENAPI' | 'INSOMNIA' | 'CUSTOM_JSON';
export type ExportStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type AiProvider = 'GEMINI' | 'OPENAI';
export type AiAction = 'CODE_GENERATION' | 'CODE_OPTIMIZATION' | 'ERROR_RESOLUTION' | 'TEST_GENERATION' | 'DOCUMENTATION' | 'CODE_REVIEW';
export type OAuthProvider = 'GOOGLE' | 'GITHUB';

export interface OAuthAccount {
  id: string;
  provider: OAuthProvider;
  providerId: string;
  email: string;
  username?: string;
  avatar?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface OAuthCallbackParams {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email?: string;
  name?: string;
  avatar?: string;
  provider?: OAuthProvider;
}

export interface OAuthUrlResponse {
  url: string;
}

// ===== AUTH TYPES =====
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  oauthAccounts?: OAuthAccount[]; 
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface PasswordResetRequest {
  email: string;
  token?: string;
  newPassword?: string;
}

// ===== PROJECT TYPES =====
export interface Project {
  id: string;
  name: string;
  description?: string;
  slug: string;
  version: string;
  visibility: ProjectVisibility;
  ownerId: string;
  owner: User;
  settings?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  
  endpointCount?: number;
  
  _count?: {
    endpoints: number;
    collaborators: number;
    executionLogs: number;
    webhooks: number;
  };
  
  endpoints?: Endpoint[];
}

export interface ProjectWithDetails extends Project {
  endpoints: Endpoint[];
  mockData: MockDataCollection[];
  environments: Environment[];
  collaborators: ProjectCollaborator[];
  webhooks: Webhook[];
  executionLogs: ExecutionLog[];
  aiUsages: AIUsage[];
  exports: ProjectExport[];
}

export interface ProjectCollaborator {
  id: string;
  projectId: string;
  userId: string;
  role: CollaboratorRole;
  canEdit: boolean;
  canInvite: boolean;
  canDelete: boolean;
  invitedBy: string;
  invitedAt: string;
  joinedAt?: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  visibility?: ProjectVisibility;
  slug?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  visibility?: ProjectVisibility;
  settings?: Record<string, any>;
}

// ===== ENDPOINT TYPES =====
export interface Endpoint {
  id: string;
  projectId: string;
  path: string;
  method: HttpMethod;
  name: string;
  description?: string;
  code: string;
  timeout: number;
  memoryLimit: number;
  headers?: Record<string, any>;
  queryParams?: Record<string, any>;
  pathParams?: Record<string, any>;
  requestSchema?: Record<string, any>;
  responseSchema?: Record<string, any>;
  isActive: boolean;
  isPublic: boolean;
  callCount: number;
  lastCalled?: string;
  createdAt: string;
  updatedAt: string;
  version: string;
}

export interface CreateEndpointData {
  path: string;
  method: HttpMethod;
  name: string;
  description?: string;
  code?: string;
  timeout?: number;
  memoryLimit?: number;
  headers?: Record<string, any>;
  queryParams?: Record<string, any>;
  pathParams?: Record<string, any>;
  requestSchema?: Record<string, any>;
  responseSchema?: Record<string, any>;
  isPublic?: boolean;
}

export interface UpdateEndpointData {
  path?: string;
  method?: HttpMethod;
  name?: string;
  description?: string;
  code?: string;
  timeout?: number;
  memoryLimit?: number;
  headers?: Record<string, any>;
  queryParams?: Record<string, any>;
  pathParams?: Record<string, any>;
  requestSchema?: Record<string, any>;
  responseSchema?: Record<string, any>;
  isActive?: boolean;
  isPublic?: boolean;
  version?: string;
}

// ===== EXECUTION TYPES =====
export interface ExecutionRequest {
  body?: any;
  query?: Record<string, any>;
  params?: Record<string, any>;
  headers?: Record<string, any>;
  timeout?: number;
  mockDataCollectionId?: string;
  environmentId?: string;
  mockData?: any; 
  environment?: Record<string, any>; 
}

export interface ExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  logs: string[];
  executionTime: number;
  timestamp: string;
  statusCode?: number;
  memoryUsed?: number;
}

export interface ExecutionLog {
  id: string;
  endpointId: string;
  projectId: string;
  method: HttpMethod;
  path: string;
  statusCode: number;
  requestBody?: any;
  queryParams?: Record<string, any>;
  pathParams?: Record<string, any>;
  headers?: Record<string, any>;
  responseBody?: any;
  responseTime: number;
  memoryUsed?: number;
  logs: string[];
  error?: string;
  sandboxId?: string;
  userId?: string;
  apiKeyId?: string;
  createdAt: string;
  endpoint?: {
    id: string;
    name: string;
    path: string;
    method: HttpMethod;
  };
  user?: User;
  apiKey?: {
    id: string;
    name: string;
  };
}

// ===== AI TYPES =====
export interface AIGenerateRequest {
  prompt: string;
  context?: any;
  projectId?: string;
  endpointId?: string;
  model?: string;
  provider?: AiProvider;
}

export interface AIOptimizeRequest {
  code: string;
  optimizationType?: 'performance' | 'readability' | 'security';
  projectId?: string;
  endpointId?: string;
  model?: string;
  provider?: AiProvider;
}

export interface AIDebugRequest {
  code: string;
  errorMessage: string;
  context?: any;
  projectId?: string;
  endpointId?: string;
  model?: string;
  provider?: AiProvider;
}

export interface AITestRequest {
  code: string;
  testFramework?: 'jest' | 'mocha' | 'vitest';
  projectId?: string;
  endpointId?: string;
  model?: string;
  provider?: AiProvider;
}

export interface AIDocumentationRequest {
  code: string;
  docType?: 'jsdoc' | 'openapi' | 'markdown';
  projectId?: string;
  endpointId?: string;
  model?: string;
  provider?: AiProvider;
}

export interface AIResponse {
  success: boolean;
  message: string;
  data: {
    code?: string;
    originalCode?: string;
    optimizedCode?: string;
    tests?: string;
    documentation?: string;
    explanation?: string;
    improvements?: any;
    usage: {
      inputTokens: number;
      outputTokens: number;
      cost: number;
      executionTime: number;
    };
  };
}

export interface AIUsageStats {
  daily: Array<{
    date: string;
    action: AiAction;
    inputTokens: number;
    outputTokens: number;
    cost: number;
    count: number;
  }>;
  total: {
    inputTokens: number;
    outputTokens: number;
    cost: number;
    requests: number;
  };
  limit: number;
  remaining: number;
}

export interface AIUsage {
  id: string;
  userId: string;
  provider: AiProvider;
  model: string;
  action: AiAction;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  prompt?: string;
  response?: string;
  error?: string;
  executionTime?: number;
  projectId?: string;
  endpointId?: string;
  createdAt: string;
  user?: User;
  project?: Project;
  endpoint?: Endpoint;
}

// ===== MOCK DATA TYPES =====
export interface MockDataCollection {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  schema?: Record<string, any>;
  data: any[];
  isSeedData: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMockDataCollection {
  name: string;
  description?: string;
  schema?: Record<string, any>;
  initialData?: any[];
  isSeedData?: boolean;
}

export interface UpdateMockDataCollection {
  name?: string;
  description?: string;
  schema?: Record<string, any>;
  data?: any[];
  isSeedData?: boolean;
}

// ===== ENVIRONMENT TYPES =====
export interface Environment {
  id: string;
  projectId: string;
  name: string;
  variables: Record<string, any>;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnvironment {
  name: string;
  variables: Record<string, any>;
  isDefault?: boolean;
}

export interface UpdateEnvironment {
  name?: string;
  variables?: Record<string, any>;
  isDefault?: boolean;
}

// ===== WEBHOOK TYPES =====
export interface Webhook {
  id: string;
  projectId: string;
  name: string;
  url: string;
  events: string[];
  secret?: string;
  isActive: boolean;
  successCount: number;
  failureCount: number;
  lastTriggeredAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deliveries?: WebhookDelivery[];
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  url: string;
  payload: any;
  success: boolean;
  statusCode?: number;
  responseBody?: string;
  error?: string;
  responseTime?: number;
  event?: string;
  triggeredBy?: string;
  createdAt: string;
}

export interface CreateWebhook {
  name: string;
  url: string;
  events: string[];
  secret?: string;
  isActive?: boolean;
}

export interface UpdateWebhook {
  name?: string;
  url?: string;
  events?: string[];
  secret?: string;
  isActive?: boolean;
}

export interface WebhookTrigger {
  event: string;
  data: any;
  timestamp: string;
}

// ===== API KEY TYPES =====
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  userId: string;
  permissions?: Record<string, any>;
  expiresAt?: string;
  lastUsed?: string;
  callCount: number;
  createdAt: string;
}

export interface CreateApiKey {
  name: string;
  expiresAt?: string;
  permissions?: Record<string, any>;
}

export interface UpdateApiKey {
  name?: string;
  expiresAt?: string;
  permissions?: Record<string, any>;
}

// ===== SESSION TYPES =====
export interface Session {
  id: string;
  userId: string;
  token: string;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: string;
  createdAt: string;
}

// ===== COLLABORATION TYPES =====
export interface CollaborationSession {
  id: string;
  projectId: string;
  userId: string;
  socketId: string;
  activeEndpoint?: string;
  cursorPosition?: CursorPosition;
  selection?: SelectionRange;
  joinedAt: string;
  lastActivity: string;
  user: User;
  project: Project;
}

export interface CollaborationUser {
  user: User;
  socketId: string;
  joinedAt: string;
  lastActivity: string;
  activeEndpoint?: string;
  cursor?: CursorPosition;
  selection?: SelectionRange;
}

export interface CursorPosition {
  line: number;
  column: number;
}

export interface SelectionRange {
  start: CursorPosition;
  end: CursorPosition;
}

export interface CodeChange {
  endpointId: string;
  changes: any[];
  version: number;
  timestamp: string;
}

// ===== DOCUMENTATION TYPES =====
export interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    description?: string;
    version: string;
    contact?: {
      name: string;
      email: string;
      url?: string;
    };
    license?: {
      name: string;
      url?: string;
    };
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
    securitySchemes: Record<string, any>;
  };
  security: Array<Record<string, any>>;
  tags?: Array<{
    name: string;
    description?: string;
  }>;
  externalDocs?: {
    description: string;
    url: string;
  };
}

export interface DocumentationAnalytics {
  totalEndpoints: number;
  documentedEndpoints: number;
  documentationCoverage: number;
  totalExecutions: number;
  mostUsedEndpoints: Array<{
    id: string;
    name: string;
    path: string;
    method: HttpMethod;
    executions: number;
  }>;
  endpointsByMethod: Record<HttpMethod, number>;
  avgResponseTime: number;
  errorRate: number;
}

// ===== EXPORT/IMPORT TYPES =====
export interface ProjectExport {
  id: string;
  projectId: string;
  userId: string;
  format: ExportFormat;
  include?: Record<string, boolean>;
  fileUrl?: string;
  status: ExportStatus;
  error?: string;
  createdAt: string;
  project?: Project;
  user?: User;
}

export interface ExportRequest {
  format: ExportFormat;
  include?: {
    endpoints?: boolean;
    mockData?: boolean;
    environments?: boolean;
    webhooks?: boolean;
    settings?: boolean;
  };
}

export interface ExportResult {
  success: boolean;
  data?: {
    content: string;
    contentType: string;
    filename: string;
    url?: string;
  };
  error?: string;
}

export interface ImportRequest {
  file: string;
  format: ExportFormat;
  name?: string;
  description?: string;
  options?: {
    includeEndpoints?: boolean;
    includeMockData?: boolean;
    includeEnvironments?: boolean;
    includeWebhooks?: boolean;
  };
}

export interface ExportFormatInfo {
  id: ExportFormat;
  name: string;
  description: string;
  extensions: string[];
  mimeType: string;
}

// ===== ANALYTICS TYPES =====
export interface ProjectAnalytics {
  period: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorRate: number;
  endpoints: Array<{
    id: string;
    name: string;
    path: string;
    method: HttpMethod;
    requestCount: number;
    successRate: number;
    averageResponseTime: number;
    errorRate: number;
  }>;
  usageByDay: Array<{
    date: string;
    requests: number;
    errors: number;
    uniqueUsers: number;
    totalResponseTime: number;
  }>;
  topUsers: Array<{
    userId: string;
    name: string;
    email: string;
    requestCount: number;
  }>;
  statusCodes: Record<string, number>;
}

export interface UserAnalytics {
  period: string;
  projects: number;
  endpoints: number;
  totalExecutions: number;
  aiUsage: {
    requests: number;
    tokens: number;
    cost: number;
    byAction: Record<AiAction, number>;
  };
  activeDays: number;
  mostUsedProject?: {
    id: string;
    name: string;
    executions: number;
  };
  dailyActivity: Array<{
    date: string;
    executions: number;
    aiRequests: number;
  }>;
}

export interface EndpointAnalytics {
  endpointId: string;
  period: string;
  totalRequests: number;
  successRate: number;
  averageResponseTime: number;
  errorRate: number;
  requestsByHour: Array<{
    hour: string;
    count: number;
  }>;
  statusCodes: Record<string, number>;
  requestSizeStats: {
    min: number;
    max: number;
    avg: number;
    p95: number;
  };
  responseSizeStats: {
    min: number;
    max: number;
    avg: number;
    p95: number;
  };
  users: Array<{
    userId: string;
    count: number;
  }>;
}

// ===== PAGINATION TYPES =====
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// ===== RESPONSE TYPES =====
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: any[];
  timestamp: string;
  path?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  errors?: any[];
  stack?: string;
  timestamp: string;
}

// ===== REAL-TIME TYPES =====
export interface SocketEvents {
  // Connection
  'authenticate': { token: string; projectId: string };
  'authenticated': { userId: string; timestamp: string };
  'authentication-failed': { error: string };
  
  // Project Collaboration
  'join-project': { projectId: string; endpointId?: string };
  'leave-project': { projectId: string };
  'user-joined': { user: User; activeEndpoint?: string; timestamp: string };
  'user-left': { userId: string; timestamp: string };
  'collaborators-list': { collaborators: CollaborationUser[] };
  
  // Code Editing
  'code-change': CodeChange;
  'code-update': CodeChange & { userId: string; timestamp: string };
  
  // Cursor & Selection
  'cursor-move': { endpointId: string; position: CursorPosition };
  'cursor-update': { endpointId: string; userId: string; position: CursorPosition; timestamp: string };
  'selection-change': { endpointId: string; selection: SelectionRange };
  'selection-update': { endpointId: string; userId: string; selection: SelectionRange; timestamp: string };
  
  // Execution
  'execution-started': { projectId: string; endpointId: string; executionId: string; startedBy: string; timestamp: string };
  'execution-completed': { projectId: string; endpointId: string; executionId: string; result: ExecutionResult; completedBy: string; timestamp: string };
  
  // Project Updates
  'project-update': { projectId: string; update: UpdateProjectData };
  'project-updated': { projectId: string; update: UpdateProjectData; updatedBy: string; timestamp: string };
  
  // Endpoint Changes
  'endpoint-change': { projectId: string; endpointId: string; changes: UpdateEndpointData };
  'endpoint-changed': { projectId: string; endpointId: string; changes: UpdateEndpointData; changedBy: string; timestamp: string };
  
  // AI Events
  'ai-generation-started': { projectId: string; endpointId?: string; userId: string; action: AiAction };
  'ai-generation-completed': { projectId: string; endpointId?: string; userId: string; action: AiAction; result: any };
  
  // System
  'ping': void;
  'pong': { timestamp: number };
  'error': { message: string; code?: string };
  'server-shutdown': { message: string; timestamp: string };
}

// ===== SANDBOX TYPES =====
export interface SandboxHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  sandbox: {
    activeContainers: number;
    maxContainers: number;
    availableContainers: number;
    averageStartupTime: number;
  };
  executions: {
    totalUsers: number;
    totalExecutions: number;
    rateLimit: number;
    concurrentExecutions: number;
  };
  system: {
    memory: {
      total: number;
      used: number;
      free: number;
      percentage: number;
    };
    cpu: {
      usage: number;
      cores: number;
    };
    uptime: number;
  };
  lastCheck: string;
}

// ===== FILE UPLOAD TYPES =====
export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  createdAt: string;
}

export interface UploadResponse {
  success: boolean;
  data: FileUpload;
  error?: string;
}