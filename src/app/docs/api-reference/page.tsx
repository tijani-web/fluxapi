'use client'

import { useState, useEffect, useRef } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Link from 'next/link'
import { 
  Terminal, 
  Code2, 
  FileCode, 
  Hash, 
  // Link, 
  ArrowUp,
  Menu,
  X,
  Search,
  Github,
  ChevronRight,
  Copy,
  Check,
  BookOpen,
  AlertCircle,
  Zap,
  Database,
  Globe,
  Cpu,
  Server,
  Shield,
  Settings,
  Eye,
  Filter,
  Download,
  Key,
  Variable,
  Box,
  Layers,
  Network,
  MemoryStick,
  Clock,
  Cpu as CpuIcon,
  Lock,
  Play,
  Pause,
  RefreshCw,
  BarChart,
  TrendingUp,
  AlertTriangle,
  Info,
  HelpCircle,
  MessageSquare,  Bell,
  Send,
  Activity,
 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export default function ApiReferencePage() {
  const [copied, setCopied] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState('global-variables')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Refs for section scrolling
  const globalVarsRef = useRef<HTMLDivElement>(null)
  const mockDataApiRef = useRef<HTMLDivElement>(null)
  const environmentApiRef = useRef<HTMLDivElement>(null)
  const requestApiRef = useRef<HTMLDivElement>(null)
  const responseApiRef = useRef<HTMLDivElement>(null)
  const sandboxApiRef = useRef<HTMLDivElement>(null)
  const limitsRef = useRef<HTMLDivElement>(null)
  const webhooksApiRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (sectionId: string) => {
    const sectionMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
      'global-variables': globalVarsRef,
      'mockdata-api': mockDataApiRef,
      'environment-api': environmentApiRef,
      'request-api': requestApiRef,
      'response-api': responseApiRef,
      'sandbox-api': sandboxApiRef,
      'limits': limitsRef,
      'webhooks-api': webhooksApiRef
    }

    const ref = sectionMap[sectionId]
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(sectionId)
      setShowMobileMenu(false)
    }
  }

  // Auto-highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'global-variables', ref: globalVarsRef },
        { id: 'mockdata-api', ref: mockDataApiRef },
        { id: 'environment-api', ref: environmentApiRef },
        { id: 'request-api', ref: requestApiRef },
        { id: 'response-api', ref: responseApiRef },
        { id: 'sandbox-api', ref: sandboxApiRef },
        { id: 'limits', ref: limitsRef },
        { id: 'webhooks-api', ref: webhooksApiRef }
      ]

      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        const element = section.ref.current
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section.id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const copyCode = (code: string, name: string) => {
    navigator.clipboard.writeText(code)
    setCopied(name)
    setTimeout(() => setCopied(null), 2000)
    toast({
      title: "Code copied",
      description: "API reference copied to clipboard"
    })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // API Reference Code Examples
  const mockDataApiCode = `// ====================================
// MOCKDATA API REFERENCE
// ====================================

// 1. Access mock data collections
// Collections are accessible by their EXACT names
const users = mockData.users;
const products = mockData.ecommerceProducts;
const orders = mockData.customerOrders;

// 2. Available methods/properties on collections
const collection = mockData.users;

// Type: Array of objects
console.log(Array.isArray(collection)); // true

// Length of collection
const itemCount = collection.length;

// Array methods work as expected
const firstItem = collection[0];
const filtered = collection.filter(item => item.isActive);
const mapped = collection.map(item => ({ ...item, processed: true }));
const found = collection.find(item => item.id === '123');

// 3. Iterating over collections
for (const item of mockData.users) {
  console.log(item);
}

// 4. Checking if collection exists
if (mockData.users) {
  // Collection exists
}

// 5. Default empty array pattern
const safeCollection = mockData.users || [];

// 6. Getting all collection names
const collectionNames = Object.keys(mockData);
// Returns: ['users', 'products', 'orders', ...]

// 7. Dynamic collection access
const collectionName = 'users';
const dynamicCollection = mockData[collectionName];

// 8. Note: Collections are READ-ONLY in execution
// Changes won't persist between executions`

  const environmentApiCode = `// ====================================
// ENVIRONMENT API REFERENCE
// ====================================

// 1. Access environment variables
const apiKey = environment.API_KEY;
const baseUrl = environment.BASE_URL;
const debugMode = environment.DEBUG;

// 2. Type conversion
const port = parseInt(environment.PORT) || 3000;
const timeout = parseFloat(environment.TIMEOUT_MS) || 5000;
const maxConnections = Number(environment.MAX_CONNECTIONS) || 10;
const isProduction = environment.NODE_ENV === 'production';
const enableFeature = environment.FEATURE_FLAG === 'true';

// 3. Safe access patterns
// Default values for missing variables
const host = environment.HOST || 'localhost';
const logLevel = environment.LOG_LEVEL || 'info';
const retryCount = environment.RETRY_COUNT ? parseInt(environment.RETRY_COUNT) : 3;

// 4. Boolean handling
const isEnabled = environment.ENABLE_FEATURE === 'true';
const isDisabled = environment.DISABLE_FEATURE === 'true';
const shouldLog = !environment.SILENT_MODE;

// 5. Structured configuration
const config = {
  database: {
    url: environment.DATABASE_URL,
    poolSize: parseInt(environment.DB_POOL_SIZE) || 10
  },
  redis: {
    host: environment.REDIS_HOST,
    port: parseInt(environment.REDIS_PORT) || 6379
  },
  api: {
    timeout: parseInt(environment.API_TIMEOUT) || 30000,
    rateLimit: parseInt(environment.RATE_LIMIT) || 100
  }
};

// 6. Getting all environment variables
const allVars = Object.keys(environment);
// Returns: ['API_KEY', 'BASE_URL', 'DEBUG', ...]

// 7. Checking if variable exists
if ('API_KEY' in environment) {
  // Variable exists
}

if (environment.API_KEY !== undefined) {
  // Variable is defined (could be empty string)
}

// 8. Variable naming conventions
// Use UPPERCASE_WITH_UNDERSCORES
// environment.API_KEY (✅ correct)
// environment.apiKey (❌ avoid)
// environment.api-key (❌ avoid)`

  const requestApiCode = `// ====================================
// REQUEST OBJECT API REFERENCE
// ====================================

// Available in every endpoint execution
const request = {
  // 1. HTTP Method (uppercase)
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  
  // 2. Request Body (for POST, PUT, PATCH)
  body: {
    // Parsed JSON object
    // Example: { name: 'John', age: 30 }
  },
  
  // 3. Query Parameters
  query: {
    // URL query parameters as key-value pairs
    // Example: ?page=1&limit=20
    page: '1',
    limit: '20',
    sort: 'name',
    filter: 'active'
  },
  
  // 4. Path Parameters
  params: {
    // Dynamic route parameters
    // Example: /api/users/:id → params.id
    id: '123',
    slug: 'user-profile'
  },
  
  // 5. Headers
  headers: {
    // HTTP headers (lowercased keys)
    'content-type': 'application/json',
    'authorization': 'Bearer token123',
    'user-agent': 'API-Tester/1.0',
    'accept': 'application/json'
  }
};

// 6. TYPE SAFETY EXAMPLES
// All values are strings in query/params
const page = parseInt(request.query.page) || 1;
const limit = parseInt(request.query.limit) || 20;
const isActive = request.query.active === 'true';

// 7. ACCESS PATTERNS
// Body access (for POST/PUT/PATCH)
if (request.method === 'POST') {
  const { name, email, age } = request.body;
  const ageNumber = parseInt(age) || 0;
}

// Query parameter access
const searchTerm = request.query.search || '';
const pageNumber = parseInt(request.query.page) || 1;
const itemsPerPage = parseInt(request.query.limit) || 50;

// Path parameter access
const userId = request.params.id;
const productSlug = request.params.slug;

// Header access
const contentType = request.headers['content-type'];
const authToken = request.headers['authorization'];

// 8. VALIDATION HELPERS
function getNumberParam(param, defaultValue = 0) {
  const value = request.query[param];
  return value ? parseInt(value) : defaultValue;
}

function getBooleanParam(param, defaultValue = false) {
  const value = request.query[param];
  return value ? value === 'true' : defaultValue;
}

function getStringParam(param, defaultValue = '') {
  return request.query[param] || defaultValue;
}`

  const responseApiCode = `// ====================================
// RESPONSE API REFERENCE
// ====================================

// 1. BASIC RESPONSE FORMAT
// Return any JavaScript value
return {
  // Standard fields (recommended)
  success: true,
  data: { /* your data */ },
  message: 'Operation successful',
  timestamp: new Date().toISOString(),
  
  // Custom fields
  metadata: {
    page: 1,
    total: 100,
    version: '1.0.0'
  }
};

// 2. HTTP STATUS CODES
// Return status field for HTTP status
return {
  status: 200, // OK
  data: { message: 'Success' }
};

return {
  status: 201, // Created
  data: { id: 'new-id', ...request.body }
};

return {
  status: 400, // Bad Request
  error: 'Invalid input data'
};

return {
  status: 404, // Not Found
  error: 'Resource not found'
};

return {
  status: 500, // Internal Server Error
  error: 'Something went wrong'
};

// 3. ERROR RESPONSE PATTERNS
// Standard error format
return {
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid email format',
    details: {
      field: 'email',
      rule: 'must be valid email'
    },
    timestamp: new Date().toISOString()
  }
};

// 4. PAGINATION RESPONSE
return {
  success: true,
  data: items,
  pagination: {
    page: currentPage,
    limit: itemsPerPage,
    total: totalItems,
    pages: Math.ceil(totalItems / itemsPerPage),
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  }
};

// 5. BINARY/STREAM RESPONSE
// Return file data
return {
  type: 'file',
  filename: 'report.pdf',
  data: base64Data,
  contentType: 'application/pdf'
};

// 6. REDIRECT RESPONSE
return {
  redirect: 'https://api.example.com/new-location',
  status: 301 // Permanent redirect
};

// 7. CUSTOM HEADERS
return {
  data: { token: 'jwt-token' },
  headers: {
    'X-RateLimit-Limit': '100',
    'X-RateLimit-Remaining': '99',
    'Cache-Control': 'max-age=3600'
  }
};

// 8. HELPER FUNCTIONS
function successResponse(data, message = 'Success') {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  };
}

function errorResponse(message, code = 'ERROR', status = 400) {
  return {
    success: false,
    error: { code, message },
    status,
    timestamp: new Date().toISOString()
  };
}`

  const sandboxApiCode = `// ====================================
// SANDBOX API REFERENCE
// ====================================

// Available global objects in sandbox execution:

// 1. console OBJECT
// Captured and returned in execution logs
console.log('Info message', { data: 'value' });
console.warn('Warning message');
console.error('Error occurred');
console.info('Information');
console.debug('Debug info'); // Only in debug mode

// 2. Date OBJECT (standard JavaScript)
const now = new Date();
const timestamp = now.toISOString();
const dateString = now.toLocaleDateString();
const timeString = now.toLocaleTimeString();

// 3. Math OBJECT (standard JavaScript)
const random = Math.random();
const rounded = Math.round(3.7);
const max = Math.max(1, 2, 3);
const min = Math.min(1, 2, 3);
const floor = Math.floor(3.7);
const ceil = Math.ceil(3.2);

// 4. JSON OBJECT (standard JavaScript)
const jsonString = JSON.stringify({ data: 'value' });
const parsedObject = JSON.parse('{"data":"value"}');

// 5. Array METHODS
const numbers = [1, 2, 3];
numbers.map(x => x * 2);
numbers.filter(x => x > 1);
numbers.reduce((sum, x) => sum + x, 0);
numbers.find(x => x === 2);
numbers.includes(2);

// 6. String METHODS
const str = 'Hello World';
str.toUpperCase();
str.toLowerCase();
str.includes('World');
str.startsWith('Hello');
str.endsWith('World');
str.split(' ');
str.replace('World', 'Universe');

// 7. Number METHODS
const num = 123.456;
num.toFixed(2); // "123.46"
num.toString();
Number.isInteger(num);
Number.parseFloat('123.45');

// 8. Object METHODS
const obj = { a: 1, b: 2 };
Object.keys(obj); // ['a', 'b']
Object.values(obj); // [1, 2]
Object.entries(obj); // [['a', 1], ['b', 2]]

// 9. setTimeout/setInterval (RESTRICTED)
// Not available for security reasons
// ❌ setTimeout(() => {}, 1000);
// ❌ setInterval(() => {}, 1000);

// 10. Global functions
// parseInt, parseFloat, isNaN, isFinite
const int = parseInt('123');
const float = parseFloat('123.45');
const isValid = !isNaN(int);
const isFiniteNum = isFinite(float);`

const webhooksApiCode = `// ====================================
// WEBHOOKS API REFERENCE
// ====================================

// 1. AVAILABLE WEBHOOK EVENTS
// Automatic triggers for your webhooks

// Endpoint Events
'endpoint.created'    // New endpoint created
'endpoint.updated'    // Endpoint configuration changed
'endpoint.deleted'    // Endpoint removed
'endpoint.executed'   // Endpoint was called

// Mock Data Events  
'mockdata.created'    // New mock data collection added
'mockdata.updated'    // Mock data modified
'mockdata.deleted'    // Mock data collection deleted

// Project Events
'project.updated'     // Project settings changed

// AI Events
'ai.generated'        // AI generated code/endpoint

// Manual Trigger
'manual_trigger'      // Manually triggered via UI

// 2. WEBHOOK PAYLOAD STRUCTURE
// All webhooks receive this JSON format:
{
  "event": "endpoint.created",           // Event type
  "timestamp": "2024-01-15T10:30:00Z",   // ISO timestamp
  "webhookId": "wh_abc123",              // Your webhook ID
  
  // Event-specific data
  "data": {
    // Example for endpoint.created:
    "endpoint": {
      "id": "ep_123",
      "name": "Get Users",
      "path": "/api/users",
      "method": "GET",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    
    // Example for endpoint.executed:
    "execution": {
      "id": "ex_456",
      "duration": 145, // ms
      "success": true,
      "statusCode": 200
    }
  },
  
  // Project context
  "project": {
    "id": "proj_456",
    "name": "My Project"
  }
}

// 3. SIGNATURE VERIFICATION
// Webhooks are signed for security verification
const crypto = require('crypto');

function verifyWebhookSignature(request) {
  // Get signature from header
  const signature = request.headers['x-webhook-signature'];
  const timestamp = request.headers['x-webhook-timestamp'];
  
  if (!signature || !timestamp) {
    return false;
  }
  
  // Get your webhook secret (from webhook settings)
  const secret = environment.WEBHOOK_SECRET;
  
  // Create expected signature
  const payload = JSON.stringify(request.body);
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(\`\${timestamp}.\${payload}\`)
    .digest('hex');
  
  // Compare signatures (timing-safe)
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// 4. WEBHOOK RETRY LOGIC
// Failed webhooks are automatically retried
// Retry schedule: 1min, 5min, 15min, 1hr, 4hr, 12hr, 24hr
// Max retries: 7 attempts over ~48 hours

// 5. WEBHOOK SECURITY HEADERS
// Each webhook request includes:
// X-Webhook-Signature: HMAC-SHA256 signature
// X-Webhook-Timestamp: Unix timestamp in ms
// X-Webhook-Id: Webhook identifier
// X-Webhook-Event: Event type
// X-Webhook-Attempt: Retry attempt number (1-based)

// 6. WEBHOOK RESPONSE EXPECTATIONS
// Your server should:
// - Return 2xx status code within 10 seconds
// - Validate signature before processing
// - Handle duplicate deliveries (idempotent)
// - Log failed attempts for debugging

// 7. TESTING WEBHOOKS
// Manual test endpoint:
if (request.method === 'POST' && request.path === '/test-webhook') {
  const testEvent = {
    event: 'test',
    timestamp: new Date().toISOString(),
    data: {
      message: 'Test webhook payload',
      randomId: Math.random().toString(36).substr(2, 9)
    }
  };
  
  // Log for debugging
  console.log('Webhook test triggered:', testEvent);
  
  return {
    success: true,
    message: 'Test webhook sent',
    testData: testEvent,
    receivedHeaders: request.headers
  };
}

// 8. WEBHOOK MANAGEMENT
// Access webhook stats and logs
const webhookStats = {
  totalDeliveries: 156,
  successfulDeliveries: 148,
  failedDeliveries: 8,
  successRate: 94.9,
  lastDelivery: "2024-01-15T10:30:00Z",
  nextRetry: "2024-01-15T11:30:00Z"
};

// 9. RATE LIMITING
// Webhook delivery limits:
// - Max 1000 deliveries per hour per webhook
// - Max 10 concurrent deliveries per project
// - Max payload size: 1MB
// - Timeout: 10 seconds per delivery attempt

// 10. ERROR HANDLING
// Common webhook errors and solutions:
const webhookErrors = {
  "TIMEOUT": "Target server didn't respond within 10 seconds",
  "INVALID_SIGNATURE": "Signature verification failed",
  "NETWORK_ERROR": "DNS/connection issues",
  "HTTP_ERROR": "Non-2xx response from target",
  "RATE_LIMITED": "Too many requests to target",
  "PAYLOAD_TOO_LARGE": "Exceeds 1MB limit"
};`;

  // Sidebar navigation
  const sidebarNav = [
    { id: 'global-variables', label: 'Global Variables', icon: Variable, badge: 'Core' },
    { id: 'mockdata-api', label: 'mockData API', icon: Database, badge: 'Detailed' },
    { id: 'environment-api', label: 'environment API', icon: Key, badge: 'Config' },
    { id: 'request-api', label: 'Request Object', icon: Box, badge: 'Input' },
    { id: 'response-api', label: 'Response API', icon: Layers, badge: 'Output' },
    { id: 'sandbox-api', label: 'Sandbox APIs', icon: CpuIcon, badge: 'Built-in' },
    { id: 'limits', label: 'Limits & Security', icon: Shield, badge: 'Important' },
    { id: 'webhooks-api', label: 'Webhooks API', icon: Network, badge: 'Events' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Mobile Menu */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                  <Code2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">API Reference</h1>
                  <p className="text-xs text-gray-400">Technical Documentation</p>
                </div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/docs'}
                className="gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Guide
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                className="gap-2"
              >
                <FileCode className="h-4 w-4" />
                API Reference
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/docs/examples'}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Examples
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/docs/troubleshooting'}
                className="gap-2"
              >
                <AlertCircle className="h-4 w-4" />
                Troubleshooting
              </Button>
            </div>
            
            {/* Search & GitHub */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search API reference..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-gray-800 border-gray-700"
                />
              </div>
              <Link href="https://github.com/tijani-web" target="_blank">
                <Button variant="outline" size="sm" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)}>
          <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800 p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Code2 className="h-5 w-5 text-white" />
                </div>
                <h2 className="font-semibold">API Reference</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowMobileMenu(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {sidebarNav.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => scrollToSection(item.id)}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                  {item.badge && (
                    <Badge variant="outline" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <ScrollArea className="h-[calc(100vh-120px)] rounded-lg border border-gray-800 bg-gray-900/50 p-4">
                <div className="space-y-1">
                  {sidebarNav.map((item) => (
                    <Button
                      key={item.id}
                      variant={activeSection === item.id ? 'secondary' : 'ghost'}
                      className={cn(
                        "w-full justify-start h-10 px-3",
                        activeSection === item.id 
                          ? "bg-gray-800 text-white" 
                          : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                      )}
                      onClick={() => scrollToSection(item.id)}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "ml-2 text-xs",
                            activeSection === item.id 
                              ? "border-blue-500/50 text-blue-400" 
                              : "border-gray-700 text-gray-500"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {activeSection === item.id && (
                        <div className="ml-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
                      )}
                    </Button>
                  ))}
                </div>

                <Separator className="my-6 bg-gray-800" />

                {/* Quick Links */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Quick Reference
                  </h3>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start border-gray-700 text-gray-300"
                      onClick={() => copyCode(mockDataApiCode, 'mockData API')}
                    >
                      <Copy className="h-3.5 w-3.5 mr-2" />
                      Copy mockData API
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start border-gray-700 text-gray-300"
                      onClick={() => copyCode(environmentApiCode, 'environment API')}
                    >
                      <Copy className="h-3.5 w-3.5 mr-2" />
                      Copy environment API
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start border-gray-700 text-gray-300"
                      onClick={scrollToTop}
                    >
                      <ArrowUp className="h-3.5 w-3.5 mr-2" />
                      Back to Top
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Hero Section */}
            <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 mb-4">
                  <Code2 className="h-3 w-3" />
                  API Reference
                </div>
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                  Complete API Technical Reference
                </h1>
                <p className="text-lg text-gray-400 mb-6">
                  Detailed documentation of all available APIs, methods, parameters, and return values in the execution sandbox.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => scrollToSection('global-variables')}
                  >
                    <FileCode className="h-4 w-4 mr-2" />
                    Start with Global Variables
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-700"
                    onClick={() => scrollToSection('limits')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    View Limits & Security
                  </Button>
                </div>
              </div>
            </div>

            {/* Global Variables Section */}
            <div id="global-variables" ref={globalVarsRef} className="scroll-mt-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Variable className="h-6 w-6 text-blue-400" />
                  Global Variables
                </h2>
                <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                  Automatically Available
                </Badge>
              </div>
              
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-blue-400" />
                    Available Global Objects
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    These variables are automatically injected into every endpoint execution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* mockData */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                          <Database className="h-4 w-4 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold">
                            <code className="text-lg font-mono">mockData</code>
                          </h4>
                          <p className="text-sm text-gray-400">Your mock data collections</p>
                        </div>
                      </div>
                      <div className="pl-11">
                        <p className="text-sm text-gray-300 mb-2">
                          Type: <code className="bg-gray-800 px-2 py-1 rounded text-xs">Object&lt;string, Array&lt;any&gt;&gt;</code>
                        </p>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>• Access collections by name: <code className="bg-gray-800 px-2 py-0.5 rounded">mockData.collectionName</code></p>
                          <p>• Returns array of objects from your mock data</p>
                          <p>• Read-only during execution</p>
                        </div>
                      </div>
                    </div>

                    {/* environment */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                          <Key className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold">
                            <code className="text-lg font-mono">environment</code>
                          </h4>
                          <p className="text-sm text-gray-400">Environment variables</p>
                        </div>
                      </div>
                      <div className="pl-11">
                        <p className="text-sm text-gray-300 mb-2">
                          Type: <code className="bg-gray-800 px-2 py-1 rounded text-xs">Object&lt;string, string&gt;</code>
                        </p>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>• Access variables: <code className="bg-gray-800 px-2 py-0.5 rounded">environment.VARIABLE_NAME</code></p>
                          <p>• All values are strings</p>
                          <p>• Use type conversion for numbers/booleans</p>
                        </div>
                      </div>
                    </div>

                    {/* request */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <Box className="h-4 w-4 text-amber-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold">
                            <code className="text-lg font-mono">request</code>
                          </h4>
                          <p className="text-sm text-gray-400">HTTP request data</p>
                        </div>
                      </div>
                      <div className="pl-11">
                        <p className="text-sm text-gray-300 mb-2">
                          Type: <code className="bg-gray-800 px-2 py-1 rounded text-xs">RequestObject</code>
                        </p>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>• Contains: <code className="bg-gray-800 px-2 py-0.5 rounded">method</code>, <code className="bg-gray-800 px-2 py-0.5 rounded">body</code>, <code className="bg-gray-800 px-2 py-0.5 rounded">query</code>, <code className="bg-gray-800 px-2 py-0.5 rounded">params</code>, <code className="bg-gray-800 px-2 py-0.5 rounded">headers</code></p>
                          <p>• Automatically parsed from HTTP request</p>
                          <p>• Available in all endpoint executions</p>
                        </div>
                      </div>
                    </div>

                    {/* console */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-500/10 border border-gray-500/20">
                          <Terminal className="h-4 w-4 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold">
                            <code className="text-lg font-mono">console</code>
                          </h4>
                          <p className="text-sm text-gray-400">Logging utility</p>
                        </div>
                      </div>
                      <div className="pl-11">
                        <p className="text-sm text-gray-300 mb-2">
                          Type: <code className="bg-gray-800 px-2 py-1 rounded text-xs">Console</code>
                        </p>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>• Methods: <code className="bg-gray-800 px-2 py-0.5 rounded">log</code>, <code className="bg-gray-800 px-2 py-0.5 rounded">warn</code>, <code className="bg-gray-800 px-2 py-0.5 rounded">error</code>, <code className="bg-gray-800 px-2 py-0.5 rounded">info</code>, <code className="bg-gray-800 px-2 py-0.5 rounded">debug</code></p>
                          <p>• Output captured in execution logs</p>
                          <p>• Useful for debugging and monitoring</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* mockData API Section */}
            <div id="mockdata-api" ref={mockDataApiRef} className="scroll-mt-24">
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-purple-400" />
                      <div>
                        <CardTitle>mockData API Reference</CardTitle>
                        <CardDescription className="text-gray-400">
                          Complete reference for accessing and manipulating mock data
                        </CardDescription>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                      onClick={() => copyCode(mockDataApiCode, 'mockData API Reference')}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy API Reference
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <SyntaxHighlighter
                    language="javascript"
                    style={atomDark}
                    showLineNumbers
                    customStyle={{
                      margin: 0,
                      padding: '1.5rem',
                      fontSize: '14px',
                      background: '#0f172a'
                    }}
                  >
                    {mockDataApiCode}
                  </SyntaxHighlighter>
                </CardContent>
              </Card>
            </div>

            {/* environment API Section */}
            <div id="environment-api" ref={environmentApiRef} className="scroll-mt-24">
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-emerald-400" />
                      <div>
                        <CardTitle>environment API Reference</CardTitle>
                        <CardDescription className="text-gray-400">
                          Complete reference for environment variable access and type conversion
                        </CardDescription>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                      onClick={() => copyCode(environmentApiCode, 'environment API Reference')}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy API Reference
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <SyntaxHighlighter
                    language="javascript"
                    style={atomDark}
                    showLineNumbers
                    customStyle={{
                      margin: 0,
                      padding: '1.5rem',
                      fontSize: '14px',
                      background: '#0f172a'
                    }}
                  >
                    {environmentApiCode}
                  </SyntaxHighlighter>
                </CardContent>
              </Card>
            </div>

            {/* Request API Section */}
            <div id="request-api" ref={requestApiRef} className="scroll-mt-24">
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Box className="h-5 w-5 text-amber-400" />
                      <div>
                        <CardTitle>Request Object API Reference</CardTitle>
                        <CardDescription className="text-gray-400">
                          Complete reference for HTTP request data access and parsing
                        </CardDescription>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                      onClick={() => copyCode(requestApiCode, 'Request Object API Reference')}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy API Reference
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <SyntaxHighlighter
                    language="javascript"
                    style={atomDark}
                    showLineNumbers
                    customStyle={{
                      margin: 0,
                      padding: '1.5rem',
                      fontSize: '14px',
                      background: '#0f172a'
                    }}
                  >
                    {requestApiCode}
                  </SyntaxHighlighter>
                </CardContent>
              </Card>
            </div>

            {/* Response API Section */}
            <div id="response-api" ref={responseApiRef} className="scroll-mt-24">
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Layers className="h-5 w-5 text-blue-400" />
                      <div>
                        <CardTitle>Response API Reference</CardTitle>
                        <CardDescription className="text-gray-400">
                          Complete reference for response formats, status codes, and helpers
                        </CardDescription>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                      onClick={() => copyCode(responseApiCode, 'Response API Reference')}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy API Reference
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <SyntaxHighlighter
                    language="javascript"
                    style={atomDark}
                    showLineNumbers
                    customStyle={{
                      margin: 0,
                      padding: '1.5rem',
                      fontSize: '14px',
                      background: '#0f172a'
                    }}
                  >
                    {responseApiCode}
                  </SyntaxHighlighter>
                </CardContent>
              </Card>
            </div>

            {/* Sandbox API Section */}
            <div id="sandbox-api" ref={sandboxApiRef} className="scroll-mt-24">
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CpuIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <CardTitle>Sandbox Built-in APIs</CardTitle>
                        <CardDescription className="text-gray-400">
                          Available JavaScript APIs in the execution sandbox
                        </CardDescription>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-gray-500/30 text-gray-400 hover:bg-gray-500/10"
                      onClick={() => copyCode(sandboxApiCode, 'Sandbox API Reference')}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy API Reference
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <SyntaxHighlighter
                    language="javascript"
                    style={atomDark}
                    showLineNumbers
                    customStyle={{
                      margin: 0,
                      padding: '1.5rem',
                      fontSize: '14px',
                      background: '#0f172a'
                    }}
                  >
                    {sandboxApiCode}
                  </SyntaxHighlighter>
                </CardContent>
              </Card>
            </div>

            {/* Limits & Security Section */}
            <div id="limits" ref={limitsRef} className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Shield className="h-6 w-6 text-red-400" />
                Limits & Security
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-red-500/20 bg-red-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-400">
                      <AlertTriangle className="h-5 w-5" />
                      Execution Limits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-red-400" />
                          <span className="text-sm">Max Execution Time</span>
                        </div>
                        <Badge variant="outline" className="border-red-500/50 text-red-400">
                          30 seconds
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MemoryStick className="h-4 w-4 text-red-400" />
                          <span className="text-sm">Memory Limit</span>
                        </div>
                        <Badge variant="outline" className="border-red-500/50 text-red-400">
                          128 MB
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CpuIcon className="h-4 w-4 text-red-400" />
                          <span className="text-sm">CPU Priority</span>
                        </div>
                        <Badge variant="outline" className="border-red-500/50 text-red-400">
                          Medium (512 shares)
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-500/20 bg-blue-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-400">
                      <Lock className="h-5 w-5" />
                      Security Restrictions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500 mt-2"></div>
                        <div>
                          <p className="font-medium">No Network Access</p>
                          <p className="text-sm text-gray-400">Containers run without network</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500 mt-2"></div>
                        <div>
                          <p className="font-medium">No File System Write</p>
                          <p className="text-sm text-gray-400">Read-only filesystem</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500 mt-2"></div>
                        <div>
                          <p className="font-medium">No Child Processes</p>
                          <p className="text-sm text-gray-400">Cannot spawn processes</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500 mt-2"></div>
                        <div>
                          <p className="font-medium">No External Modules</p>
                          <p className="text-sm text-gray-400">Only built-in Node.js modules</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>                                     
            {/* Webhooks API Section - Add this before the Contact Section */}
<div id="webhooks-api" ref={webhooksApiRef} className="scroll-mt-24">
  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
    <Network className="h-6 w-6 text-purple-400" />
    Webhooks API
  </h2>
  
  <Card className="border-gray-800 bg-gray-900/50 mb-8">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-purple-400" />
          <div>
            <CardTitle>Webhooks Events & Payloads</CardTitle>
            <CardDescription className="text-gray-400">
              Real-time event notifications and integration triggers
            </CardDescription>
          </div>
        </div>
        <Button 
          size="sm"
          variant="outline"
          className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
          onClick={() => copyCode(webhooksApiCode, 'Webhooks API Reference')}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy API Reference
        </Button>
      </div>
    </CardHeader>
    <CardContent className="p-0">
      <SyntaxHighlighter
        language="javascript"
        style={atomDark}
        showLineNumbers
        customStyle={{
          margin: 0,
          padding: '1.5rem',
          fontSize: '14px',
          background: '#0f172a'
        }}
      >
        {`// ====================================
// WEBHOOKS API REFERENCE
// ====================================

// 1. AVAILABLE WEBHOOK EVENTS
// Automatic triggers for your webhooks

// Endpoint Events
'endpoint.created'    // New endpoint created
'endpoint.updated'    // Endpoint configuration changed
'endpoint.deleted'    // Endpoint removed
'endpoint.executed'   // Endpoint was called

// Mock Data Events  
'mockdata.created'    // New mock data collection added
'mockdata.updated'    // Mock data modified
'mockdata.deleted'    // Mock data collection deleted

// Project Events
'project.updated'     // Project settings changed

// AI Events
'ai.generated'        // AI generated code/endpoint

// Manual Trigger
'manual_trigger'      // Manually triggered via UI

// 2. WEBHOOK PAYLOAD STRUCTURE
// All webhooks receive this JSON format:
{
  "event": "endpoint.created",           // Event type
  "timestamp": "2024-01-15T10:30:00Z",   // ISO timestamp
  "webhookId": "wh_abc123",              // Your webhook ID
  
  // Event-specific data
  "data": {
    // Example for endpoint.created:
    "endpoint": {
      "id": "ep_123",
      "name": "Get Users",
      "path": "/api/users",
      "method": "GET",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    
    // Example for endpoint.executed:
    "execution": {
      "id": "ex_456",
      "duration": 145, // ms
      "success": true,
      "statusCode": 200
    }
  },
  
  // Project context
  "project": {
    "id": "proj_456",
    "name": "My Project"
  }
}

// 3. SIGNATURE VERIFICATION
// Webhooks are signed for security verification
const crypto = require('crypto');

function verifyWebhookSignature(request) {
  // Get signature from header
  const signature = request.headers['x-webhook-signature'];
  const timestamp = request.headers['x-webhook-timestamp'];
  
  if (!signature || !timestamp) {
    return false;
  }
  
  // Get your webhook secret (from webhook settings)
  const secret = environment.WEBHOOK_SECRET;
  
  // Create expected signature
  const payload = JSON.stringify(request.body);
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(\`\${timestamp}.\${payload}\`)
    .digest('hex');
  
  // Compare signatures (timing-safe)
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// 4. WEBHOOK RETRY LOGIC
// Failed webhooks are automatically retried
// Retry schedule: 1min, 5min, 15min, 1hr, 4hr, 12hr, 24hr
// Max retries: 7 attempts over ~48 hours

// 5. WEBHOOK SECURITY HEADERS
// Each webhook request includes:
// X-Webhook-Signature: HMAC-SHA256 signature
// X-Webhook-Timestamp: Unix timestamp in ms
// X-Webhook-Id: Webhook identifier
// X-Webhook-Event: Event type
// X-Webhook-Attempt: Retry attempt number (1-based)

// 6. WEBHOOK RESPONSE EXPECTATIONS
// Your server should:
// - Return 2xx status code within 10 seconds
// - Validate signature before processing
// - Handle duplicate deliveries (idempotent)
// - Log failed attempts for debugging

// 7. TESTING WEBHOOKS
// Manual test endpoint:
if (request.method === 'POST' && request.path === '/test-webhook') {
  const testEvent = {
    event: 'test',
    timestamp: new Date().toISOString(),
    data: {
      message: 'Test webhook payload',
      randomId: Math.random().toString(36).substr(2, 9)
    }
  };
  
  // Log for debugging
  console.log('Webhook test triggered:', testEvent);
  
  return {
    success: true,
    message: 'Test webhook sent',
    testData: testEvent,
    receivedHeaders: request.headers
  };
}

// 8. WEBHOOK MANAGEMENT
// Access webhook stats and logs
const webhookStats = {
  totalDeliveries: 156,
  successfulDeliveries: 148,
  failedDeliveries: 8,
  successRate: 94.9,
  lastDelivery: "2024-01-15T10:30:00Z",
  nextRetry: "2024-01-15T11:30:00Z"
};

// 9. RATE LIMITING
// Webhook delivery limits:
// - Max 1000 deliveries per hour per webhook
// - Max 10 concurrent deliveries per project
// - Max payload size: 1MB
// - Timeout: 10 seconds per delivery attempt

// 10. ERROR HANDLING
// Common webhook errors and solutions:
const webhookErrors = {
  "TIMEOUT": "Target server didn't respond within 10 seconds",
  "INVALID_SIGNATURE": "Signature verification failed",
  "NETWORK_ERROR": "DNS/connection issues",
  "HTTP_ERROR": "Non-2xx response from target",
  "RATE_LIMITED": "Too many requests to target",
  "PAYLOAD_TOO_LARGE": "Exceeds 1MB limit"
};`}
      </SyntaxHighlighter>
    </CardContent>
  </Card>

  {/* Webhook Examples Grid */}
  <div className="grid md:grid-cols-2 gap-6 mb-8">
    <Card className="border-emerald-500/20 bg-emerald-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emerald-400">
          <Send className="h-5 w-5" />
          Receiving Webhooks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Express.js Example</h4>
            <SyntaxHighlighter
              language="javascript"
              style={atomDark}
              customStyle={{
                background: 'rgba(0,0,0,0.3)',
                fontSize: '12px',
                borderRadius: '6px'
              }}
            >
{`// Express endpoint to receive webhooks
app.post('/webhooks', async (req, res) => {
  try {
    // Verify signature
    const isValid = verifyWebhookSignature(req);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // Process event
    const { event, data, timestamp } = req.body;
    
    switch(event) {
      case 'endpoint.created':
        await handleNewEndpoint(data.endpoint);
        break;
      case 'endpoint.executed':
        await logExecution(data.execution);
        break;
    }
    
    // Respond quickly
    res.status(200).json({ received: true });
    
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
});`}
            </SyntaxHighlighter>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="border-blue-500/20 bg-blue-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Shield className="h-5 w-5" />
          Security Best Practices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2"></div>
            <div>
              <p className="font-medium">Always Verify Signatures</p>
              <p className="text-sm text-gray-400">Check X-Webhook-Signature header</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2"></div>
            <div>
              <p className="font-medium">Validate Timestamp</p>
              <p className="text-sm text-gray-400">Reject old requests (`{'>'}` 5 minutes)</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2"></div>
            <div>
              <p className="font-medium">Use Idempotent Handlers</p>
              <p className="text-sm text-gray-400">Handle duplicate deliveries safely</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2"></div>
            <div>
              <p className="font-medium">Respond Quickly</p>
              <p className="text-sm text-gray-400">Return within 5 seconds to avoid timeouts</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  {/* Webhook Status Codes */}
  <Card className="border-gray-800 bg-gray-900/50">
    <CardHeader>
      <CardTitle className="flex items-center gap-3">
        <Activity className="h-5 w-5 text-blue-400" />
        Webhook Status & Monitoring
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-left py-3 px-4 font-medium">Code</th>
              <th className="text-left py-3 px-4 font-medium">Meaning</th>
              <th className="text-left py-3 px-4 font-medium">Retry</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-800/50">
              <td className="py-3 px-4">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Success</Badge>
              </td>
              <td className="py-3 px-4 font-mono">2xx</td>
              <td className="py-3 px-4">Webhook delivered successfully</td>
              <td className="py-3 px-4">No</td>
            </tr>
            <tr className="border-b border-gray-800/50">
              <td className="py-3 px-4">
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Failed</Badge>
              </td>
              <td className="py-3 px-4 font-mono">4xx</td>
              <td className="py-3 px-4">Client error (bad request, auth)</td>
              <td className="py-3 px-4">No</td>
            </tr>
            <tr className="border-b border-gray-800/50">
              <td className="py-3 px-4">
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Retry</Badge>
              </td>
              <td className="py-3 px-4 font-mono">5xx</td>
              <td className="py-3 px-4">Server error (temporary)</td>
              <td className="py-3 px-4">Yes</td>
            </tr>
            <tr>
              <td className="py-3 px-4">
                <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Timeout</Badge>
              </td>
              <td className="py-3 px-4 font-mono">-</td>
              <td className="py-3 px-4">No response within 10s</td>
              <td className="py-3 px-4">Yes</td>
            </tr>
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
</div>

            {/* Contact Section */}
            <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-black">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <HelpCircle className="h-6 w-6 text-blue-400" />
                  Need Technical Help?
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Contact our technical team for API-related questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <Github className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold">GitHub Issues</h4>
                        <p className="text-sm text-gray-400">Report bugs & request features</p>
                      </div>
                    </div>
                    <code className="block text-sm bg-gray-900 border border-gray-800 rounded px-3 py-2">
                      https://github.com/tijani-web
                    </code>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-800 border border-gray-700">
                        <MessageSquare className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Discord Community</h4>
                        <p className="text-sm text-gray-400">Live technical support</p>
                      </div>
                    </div>
                    <code className="block text-sm bg-gray-900 border border-gray-800 rounded px-3 py-2">
                      https://www.linkedin.com/in/basit-tijani/
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Code2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">API Builder</p>
                  <p className="text-xs text-gray-500">Technical Reference</p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-6 bg-gray-800" />
              <div className="text-sm text-gray-500">
                API Version: 2.0.0 • Updated December 2025
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="/docs" className="hover:text-gray-300 transition-colors">Guide</a>
              <span className="text-blue-400">API Reference</span>
              <a href="/docs/examples" className="hover:text-gray-300 transition-colors">Examples</a>
              <a href="/docs/troubleshooting" className="hover:text-gray-300 transition-colors">Troubleshooting</a>
              <a href="#" className="hover:text-gray-300 transition-colors">© 2024</a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-10 w-10 rounded-full bg-gray-800 border border-gray-700 shadow-lg hover:bg-gray-700 z-40"
        onClick={scrollToTop}
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </div>
  )
}