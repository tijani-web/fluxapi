'use client'

import { useState, useEffect, useRef } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { 
  Terminal, 
  Code2, 
  FileCode, 
  Hash, 
  ArrowUp,
  Menu,
  X,
  Search,
  Github,
  Copy,
  Check,
  BookOpen,
  AlertCircle,
  Zap,
  Database,
  Globe,
  Cpu as CpuIcon,
  Shield,
  Settings as SettingsIcon,
  Key,
  Variable,
  Box,
  Layers,
  Network,
  MemoryStick,
  Clock,
  Lock,
  RefreshCw,
  AlertTriangle,
  Info,
  HelpCircle,
  MessageSquare,
  Bell,
  Send,
  Activity,
  Users,
  ShoppingCart,
  CreditCard,
  Building,
  Calendar,
  Mail,
  Package,
  BarChart3,
  PieChart,
  LineChart,
  TrendingDown,
  BellRing,
  DatabaseZap,
  Rocket,
  FileCode as FileCodeIcon,
  FileJson,
  FileText,
  Webhook,
  Bug,
  BugPlay,
  ServerCrash,
  HardDrive,
  AlertCircle as DatabaseAlert,
  CloudCog,
  TimerOff,
  Timer,
  LifeBuoy,
  ShieldCheck,
  Gauge,
  CheckCircle,
  XCircle,
  Send as SendIcon,
  Activity as ActivityIcon,
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
import Link from 'next/link'

export default function TroubleshootingPage() {
  const [copied, setCopied] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState('common-errors')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Refs for section scrolling
  const commonErrorsRef = useRef<HTMLDivElement>(null)
  const mockDataErrorsRef = useRef<HTMLDivElement>(null)
  const environmentErrorsRef = useRef<HTMLDivElement>(null)
  const executionErrorsRef = useRef<HTMLDivElement>(null)
  const webhookErrorsRef = useRef<HTMLDivElement>(null)
  const performanceRef = useRef<HTMLDivElement>(null)
  const debugGuideRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (sectionId: string) => {
    const sectionMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
      'common-errors': commonErrorsRef,
      'mockdata-errors': mockDataErrorsRef,
      'environment-errors': environmentErrorsRef,
      'execution-errors': executionErrorsRef,
      'webhook-errors': webhookErrorsRef,
      'performance': performanceRef,
      'debug-guide': debugGuideRef
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
        { id: 'common-errors', ref: commonErrorsRef },
        { id: 'mockdata-errors', ref: mockDataErrorsRef },
        { id: 'environment-errors', ref: environmentErrorsRef },
        { id: 'execution-errors', ref: executionErrorsRef },
        { id: 'webhook-errors', ref: webhookErrorsRef },
        { id: 'performance', ref: performanceRef },
        { id: 'debug-guide', ref: debugGuideRef }
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
      description: "Debug code copied to clipboard"
    })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Troubleshooting Code Blocks
  const commonErrorsCode = `// ====================================
// COMMON ERRORS & SOLUTIONS
// ====================================

// ERROR 1: "mockData is not defined"
// CAUSE: Mock data not selected in endpoint editor
// SOLUTION: 
console.log('DEBUG: Checking mockData availability');
if (typeof mockData === 'undefined') {
  // 1. Go to endpoint editor UI
  // 2. Click "Mock Data" dropdown
  // 3. Select your collection
  // 4. Save and run again
  return {
    error: 'mockData not defined',
    help: 'Select mock data in UI dropdown',
    availableCollections: [] // Will show after selection
  };
}

// ERROR 2: "environment is not defined"
// CAUSE: Environment not selected
// SOLUTION:
if (typeof environment === 'undefined') {
  // 1. Go to endpoint editor UI
  // 2. Click "Environment" dropdown
  // 3. Select an environment (Development/Production)
  // 4. Save and run again
  return {
    error: 'environment not defined',
    help: 'Select environment in UI dropdown',
    availableEnvironments: [] // Will show after selection
  };
}

// ERROR 3: TypeError - Cannot read property of undefined
// EXAMPLE: mockData.users.map(...) throws error
// SOLUTION: Always check data existence
const users = mockData.users || []; // ✅ Safe access
if (!Array.isArray(users)) {
  return { error: 'users is not an array' };
}

// Safe operations
const activeUsers = users.filter(user => user.isActive);
const userCount = users.length;

// ERROR 4: Infinite Loop / Timeout
// CAUSE: Code running too long (max 30 seconds)
// SOLUTION: Add termination conditions
function processData(data) {
  const maxIterations = 1000; // Safety limit
  let iteration = 0;
  
  while (/* condition */ && iteration < maxIterations) {
    iteration++;
    // Your logic here
  }
  
  if (iteration >= maxIterations) {
    throw new Error('Max iterations reached');
  }
}

// ERROR 5: Memory Limit Exceeded
// CAUSE: Processing too much data (max 128MB)
// SOLUTION: Process in chunks
function processLargeArray(data) {
  const chunkSize = 100;
  const results = [];
  
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const chunkResult = processChunk(chunk);
    results.push(...chunkResult);
  }
  
  return results;
}

// ERROR 6: Syntax Error
// CAUSE: Invalid JavaScript code
// SOLUTION: Use try-catch blocks
try {
  // Your code here
  const result = JSON.parse(invalidJson);
} catch (error) {
  return {
    error: 'Syntax/parsing error',
    message: error.message,
    stack: environment.DEBUG === 'true' ? error.stack : undefined
  };
}

// ERROR 7: Network/External API Calls
// CAUSE: Sandbox has no network access
// SOLUTION: Use mock data or environment variables
// ❌ DON'T DO THIS:
// fetch('https://api.example.com') // Will fail

// ✅ DO THIS INSTEAD:
const apiData = environment.EXTERNAL_API_DATA 
  ? JSON.parse(environment.EXTERNAL_API_DATA) 
  : mockData.externalData;

// ERROR 8: File System Access
// CAUSE: Sandbox is read-only
// SOLUTION: Store data in environment variables
// ❌ DON'T DO THIS:
// fs.readFileSync() // Will fail

// ✅ DO THIS INSTEAD:
const config = JSON.parse(environment.CONFIG_DATA || '{}');`

  const mockDataErrorsCode = `// ====================================
// MOCK DATA SPECIFIC ERRORS
// ====================================

// ERROR 1: "mockData.collection is undefined"
// CAUSE: Collection name doesn't exist or wrong case
// DEBUG: Check available collections
console.log('Available collections:', Object.keys(mockData));
console.log('Keys are case-sensitive!');

// EXAMPLE DEBUG CODE:
const debugInfo = {
  availableCollections: Object.keys(mockData),
  requestedCollection: 'users', // Your collection name
  exists: 'users' in mockData,
  exactMatch: Object.keys(mockData).find(key => 
    key.toLowerCase() === 'users'.toLowerCase()
  )
};

return {
  error: 'Collection not found',
  debug: debugInfo,
  help: 'Check collection name spelling and case'
};

// ERROR 2: "mockData.users.map is not a function"
// CAUSE: Data is not an array
// SOLUTION: Validate data type
const users = mockData.users;

if (!users) {
  return { error: 'users collection is undefined' };
}

if (!Array.isArray(users)) {
  console.log('users type:', typeof users);
  console.log('users value:', users);
  
  // Try to convert if it's an object
  if (users && typeof users === 'object') {
    const usersArray = Object.values(users);
    if (Array.isArray(usersArray)) {
      return { data: usersArray };
    }
  }
  
  return { error: 'users is not an array' };
}

// ERROR 3: Incorrect data structure
// CAUSE: Mock data doesn't have expected properties
// SOLUTION: Validate structure
function validateUserSchema(user) {
  const required = ['id', 'name', 'email'];
  const missing = required.filter(field => !user[field]);
  
  if (missing.length > 0) {
    console.warn('User missing fields:', missing, user);
    return false;
  }
  
  return true;
}

// Process with validation
const validUsers = users.filter(validateUserSchema);
const invalidUsers = users.filter(u => !validateUserSchema(u));

if (invalidUsers.length > 0) {
  console.warn('Found invalid users:', invalidUsers.length);
}

// ERROR 4: Large data sets causing timeouts
// CAUSE: Processing too many items
// SOLUTION: Limit and paginate
const page = parseInt(request.query.page) || 1;
const limit = Math.min(parseInt(request.query.limit) || 50, 1000); // Max 1000
const startIndex = (page - 1) * limit;

const paginatedData = users.slice(startIndex, startIndex + limit);

// ERROR 5: Data not updating
// CAUSE: Mock data is read-only during execution
// SOLUTION: Create new objects, don't modify original
// ❌ DON'T DO THIS:
// users[0].name = 'New Name'; // Won't persist

// ✅ DO THIS INSTEAD:
const updatedUsers = users.map(user => ({
  ...user,
  processed: true,
  processedAt: new Date().toISOString()
}));

// ERROR 6: Nested data access issues
// CAUSE: Trying to access deeply nested undefined properties
// SOLUTION: Use optional chaining and nullish coalescing
const user = users[0];

// ❌ RISKY:
const city = user.address.city; // Error if address is undefined

// ✅ SAFE:
const safeCity = user?.address?.city || 'Unknown';
const zipCode = user?.address?.zipCode ?? '00000'; // Nullish coalescing

// ERROR 7: Date parsing errors
// CAUSE: Invalid date strings in mock data
// SOLUTION: Validate and convert dates
function safeDateParse(dateString) {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

const usersWithDates = users.map(user => ({
  ...user,
  createdAt: safeDateParse(user.createdAt),
  updatedAt: safeDateParse(user.updatedAt)
}));

// ERROR 8: Circular references
// CAUSE: Objects referencing themselves
// SOLUTION: Break cycles or use serialization
function safeStringify(obj) {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular Reference]';
      }
      seen.add(value);
    }
    return value;
  });
}`

  const environmentErrorsCode = `// ====================================
// ENVIRONMENT VARIABLE ERRORS
// ====================================

// ERROR 1: "environment.VAR is undefined"
// CAUSE: Variable not set in selected environment
// DEBUG: Check all available variables
console.log('Available environment variables:', Object.keys(environment));
console.log('Current environment:', environment.NODE_ENV);

// SAFE ACCESS PATTERN:
const apiKey = environment.API_KEY;
if (!apiKey) {
  return {
    error: 'API_KEY not configured',
    help: 'Set API_KEY in environment variables',
    currentEnv: environment.NODE_ENV || 'unknown'
  };
}

// ERROR 2: Type conversion errors
// CAUSE: Trying to use string as number
// SOLUTION: Safe conversion with defaults
const port = parseInt(environment.PORT);
if (isNaN(port)) {
  console.warn('PORT is not a number, using default');
  const defaultPort = 3000;
  return {
    warning: 'Using default port',
    port: defaultPort,
    originalValue: environment.PORT
  };
}

// SAFE CONVERSION FUNCTIONS:
function getNumber(key, defaultValue = 0) {
  const value = environment[key];
  if (!value) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

function getBoolean(key, defaultValue = false) {
  const value = environment[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
}

function getJSON(key, defaultValue = {}) {
  const value = environment[key];
  if (!value) return defaultValue;
  try {
    return JSON.parse(value);
  } catch {
    return defaultValue;
  }
}

// ERROR 3: Missing required variables
// CAUSE: Critical config not set
// SOLUTION: Validate on startup
function validateEnvironment() {
  const required = ['API_KEY', 'DATABASE_URL', 'NODE_ENV'];
  const missing = required.filter(key => !environment[key]);
  
  if (missing.length > 0) {
    return {
      valid: false,
      missing,
      message: \`Missing environment variables: \${missing.join(', ')}\`
    };
  }
  
  return { valid: true };
}

// ERROR 4: Environment-specific issues
// CAUSE: Different behavior per environment
// SOLUTION: Environment-aware code
const isProduction = environment.NODE_ENV === 'production';
const isDevelopment = environment.NODE_ENV === 'development';
const isTesting = environment.NODE_ENV === 'test';

// Use different settings per environment
const config = {
  logLevel: isProduction ? 'error' : 'debug',
  cacheEnabled: isProduction,
  debugMode: !isProduction,
  timeout: isProduction ? 5000 : 30000 // Longer timeout in dev
};

// ERROR 5: Sensitive data exposure
// CAUSE: Logging environment variables
// SOLUTION: Never log sensitive data
// ❌ DON'T DO THIS:
// console.log('API Key:', environment.API_KEY);

// ✅ DO THIS INSTEAD:
console.log('API Key configured:', !!environment.API_KEY);
console.log('Database URL configured:', !!environment.DATABASE_URL);

// Mask sensitive data in responses
function maskSensitiveData(obj) {
  const sensitive = ['API_KEY', 'SECRET', 'PASSWORD', 'TOKEN'];
  const masked = { ...obj };
  
  sensitive.forEach(key => {
    if (masked[key]) {
      masked[key] = '***' + masked[key].slice(-4);
    }
  });
  
  return masked;
}

// ERROR 6: Variable naming conflicts
// CAUSE: Using reserved names or bad naming
// SOLUTION: Use consistent naming convention
// Good: UPPERCASE_WITH_UNDERSCORES
const goodVars = {
  API_BASE_URL: environment.API_BASE_URL,
  DATABASE_POOL_SIZE: getNumber('DATABASE_POOL_SIZE', 10),
  LOG_LEVEL: environment.LOG_LEVEL || 'info'
};

// ERROR 7: Environment switching issues
// CAUSE: Cached environment data
// SOLUTION: Force refresh in development
if (isDevelopment) {
  console.log('Development mode - environment may be cached');
  console.log('If variables seem wrong, restart the endpoint');
}

// ERROR 8: Complex configuration errors
// CAUSE: Nested config in environment variables
// SOLUTION: Use JSON strings for complex config
const featureFlags = getJSON('FEATURE_FLAGS', {
  newUI: false,
  betaFeatures: false,
  analytics: true
});

const databaseConfig = getJSON('DATABASE_CONFIG', {
  host: 'localhost',
  port: 5432,
  username: 'default',
  pool: { max: 10, min: 2 }
});`

  const executionErrorsCode = `// ====================================
// EXECUTION & RUNTIME ERRORS
// ====================================

// ERROR 1: Timeout Error (30 second limit)
// CAUSE: Code running too long
// DEBUG: Add progress logging
console.log('Starting execution at:', new Date().toISOString());

// Add timeout safety
function withTimeout(fn, timeoutMs = 25000) {
  return async function(...args) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(\`Function timed out after \${timeoutMs}ms\`));
      }, timeoutMs);
      
      Promise.resolve(fn(...args))
        .then(resolve)
        .catch(reject)
        .finally(() => clearTimeout(timeoutId));
    });
  };
}

// Use with heavy operations
const processDataSafely = withTimeout(async (data) => {
  // Your processing logic here
  return data.map(item => ({ ...item, processed: true }));
}, 20000); // 20 second timeout

// ERROR 2: Memory Limit Exceeded (128MB)
// CAUSE: Storing too much data in memory
// SOLUTION: Stream processing
function processInBatches(data, batchSize = 100, processFn) {
  const results = [];
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const batchResult = processFn(batch);
    results.push(...batchResult);
    
    // Clear references to help GC
    batch.length = 0;
  }
  
  return results;
}

// ERROR 3: Infinite Recursion
// CAUSE: Recursive function without base case
// SOLUTION: Add depth limit
function recursiveProcess(data, depth = 0, maxDepth = 100) {
  if (depth >= maxDepth) {
    throw new Error(\`Max recursion depth (\${maxDepth}) exceeded\`);
  }
  
  // Base case
  if (!data || data.length === 0) {
    return [];
  }
  
  // Recursive case with depth tracking
  return recursiveProcess(data.slice(1), depth + 1, maxDepth);
}

// ERROR 4: Unhandled Promise Rejections
// CAUSE: Async operations without error handling
// SOLUTION: Always catch promises
async function safeAsyncOperation() {
  try {
    const result = await someAsyncFunction();
    return { success: true, data: result };
  } catch (error) {
    console.error('Async operation failed:', error);
    return { 
      success: false, 
      error: error.message,
      stack: environment.DEBUG === 'true' ? error.stack : undefined
    };
  }
}

// ERROR 5: Console.log flooding
// CAUSE: Too many console statements
// SOLUTION: Conditional logging
const logLevel = environment.LOG_LEVEL || 'info';
const logLevels = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = logLevels[logLevel] || 1;

function debugLog(message, data, level = 'info') {
  if (logLevels[level] <= currentLevel) {
    console.log(\`[\${level.toUpperCase()}] \${message}\`, data || '');
  }
}

// ERROR 6: Date/Timezone issues
// CAUSE: Inconsistent date handling
// SOLUTION: Use ISO strings and UTC
const now = new Date();
const safeDate = {
  iso: now.toISOString(), // Always use this for storage
  timestamp: now.getTime(),
  local: now.toLocaleString(),
  utc: now.toUTCString()
};

// ERROR 7: Random number generation issues
// CAUSE: Math.random() predictability
// SOLUTION: Use crypto for better randomness (if available)
function generateId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return \`id_\${timestamp}_\${random}\`;
}

// ERROR 8: Module/import errors
// CAUSE: Trying to use external modules
// REMEMBER: Sandbox only has built-in Node.js modules
// Available: console, Date, Math, JSON, Object, Array, String, Number, etc.
// Not available: fs, path, http, crypto (restricted), etc.

// Workaround for missing modules:
const missingModuleWorkarounds = {
  // Instead of lodash:
  chunk: (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },
  
  // Instead of uuid:
  generateUUID: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
};`

  const webhookErrorsCode = `// ====================================
// WEBHOOK SPECIFIC ERRORS
// ====================================

// ERROR 1: Webhook not triggering
// CAUSE: Webhook is inactive or misconfigured
// DEBUG: Check webhook status
console.log('Webhook debug info:');
console.log('- Environment:', environment.NODE_ENV);
console.log('- Webhook URL configured:', !!environment.WEBHOOK_URL);
console.log('- Webhook secret configured:', !!environment.WEBHOOK_SECRET);

if (!environment.WEBHOOK_URL) {
  return {
    error: 'Webhook URL not configured',
    help: 'Set WEBHOOK_URL in environment variables',
    currentEnv: environment.NODE_ENV
  };
}

// ERROR 2: Signature verification failed
// CAUSE: Secret mismatch or timing issues
// SOLUTION: Verify signature properly
function verifyWebhookSignature(body, signature, timestamp) {
  const secret = environment.WEBHOOK_SECRET;
  if (!secret) {
    console.error('WEBHOOK_SECRET not configured');
    return false;
  }
  
  // Check timestamp (prevent replay attacks)
  const requestTime = parseInt(timestamp);
  const currentTime = Date.now();
  const timeDiff = Math.abs(currentTime - requestTime);
  
  if (timeDiff > 300000) { // 5 minutes tolerance
    console.error('Webhook timestamp too old:', timeDiff);
    return false;
  }
  
  // Generate expected signature
  const payload = typeof body === 'string' ? body : JSON.stringify(body);
  const expectedSignature = generateSignature(payload, secret, timestamp);
  
  // Constant-time comparison
  return signature === expectedSignature;
}

// ERROR 3: Webhook delivery timeout
// CAUSE: Target server not responding (10s limit)
// SOLUTION: Implement retry logic
async function deliverWebhookWithRetry(payload, maxRetries = 3) {
  const webhookUrl = environment.WEBHOOK_URL;
  const secret = environment.WEBHOOK_SECRET;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(\`Webhook attempt \${attempt}/\${maxRetries}\`);
      
      const timestamp = Date.now();
      const signature = generateSignature(
        JSON.stringify(payload),
        secret,
        timestamp
      );
      
      // Simulate webhook delivery
      const result = {
        success: true,
        attempt,
        timestamp: new Date().toISOString()
      };
      
      return result;
      
    } catch (error) {
      console.error(\`Webhook attempt \${attempt} failed:\`, error.message);
      
      if (attempt === maxRetries) {
        throw new Error(\`Webhook failed after \${maxRetries} attempts\`);
      }
      
      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// ERROR 4: Webhook payload too large (1MB limit)
// CAUSE: Sending too much data
// SOLUTION: Compress or split payload
function optimizeWebhookPayload(data) {
  // Remove unnecessary fields
  const optimized = {
    event: data.event,
    timestamp: data.timestamp,
    data: data.data,
    // Remove debug info in production
    debug: environment.NODE_ENV === 'production' ? undefined : data.debug
  };
  
  // Check size
  const payloadSize = JSON.stringify(optimized).length;
  const maxSize = 1024 * 1024; // 1MB
  
  if (payloadSize > maxSize) {
    console.warn(\`Payload too large: \${payloadSize} bytes\`);
    
    // Split large data
    if (Array.isArray(optimized.data) && optimized.data.length > 100) {
      optimized.data = optimized.data.slice(0, 100);
      optimized.truncated = true;
      optimized.originalCount = data.data.length;
    }
  }
  
  return optimized;
}

// ERROR 5: Circular references in webhook data
// CAUSE: Objects referencing themselves
// SOLUTION: Clean data before sending
function prepareWebhookData(data) {
  const seen = new WeakSet();
  
  function clean(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    
    if (seen.has(obj)) {
      return '[Circular Reference]';
    }
    
    seen.add(obj);
    
    if (Array.isArray(obj)) {
      return obj.map(clean);
    }
    
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip sensitive data
      if (key.toLowerCase().includes('secret') || 
          key.toLowerCase().includes('password')) {
        cleaned[key] = '***REDACTED***';
        continue;
      }
      
      cleaned[key] = clean(value);
    }
    
    return cleaned;
  }
  
  return clean(data);
}

// ERROR 6: Webhook rate limiting
// CAUSE: Too many webhook calls
// SOLUTION: Implement rate limiting
class WebhookRateLimiter {
  constructor(maxRequests = 100, windowMs = 3600000) { // 100/hour
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }
  
  canMakeRequest() {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Clean old requests
    this.requests = this.requests.filter(time => time > windowStart);
    
    if (this.requests.length >= this.maxRequests) {
      const oldest = this.requests[0];
      const waitTime = Math.ceil((oldest + this.windowMs - now) / 1000);
      return {
        allowed: false,
        waitSeconds: waitTime,
        message: \`Rate limit exceeded. Try again in \${waitTime} seconds.\`
      };
    }
    
    this.requests.push(now);
    return { allowed: true };
  }
}

// ERROR 7: Webhook response parsing errors
// CAUSE: Invalid response from target server
// SOLUTION: Handle various response formats
async function parseWebhookResponse(response) {
  try {
    const text = await response.text();
    
    // Try to parse as JSON
    try {
      const json = JSON.parse(text);
      return {
        success: response.ok,
        status: response.status,
        data: json,
        raw: text
      };
    } catch {
      // Not JSON, return as text
      return {
        success: response.ok,
        status: response.status,
        data: null,
        raw: text.substring(0, 500) // First 500 chars
      };
    }
  } catch (error) {
    return {
      success: false,
      status: 0,
      error: error.message,
      raw: null
    };
  }
}

// ERROR 8: Webhook security issues
// CAUSE: Not validating incoming webhooks
// SOLUTION: Always validate
function validateIncomingWebhook(request) {
  // Check required headers
  const requiredHeaders = [
    'x-webhook-signature',
    'x-webhook-timestamp',
    'x-webhook-event'
  ];
  
  const missing = requiredHeaders.filter(
    header => !request.headers[header]
  );
  
  if (missing.length > 0) {
    return {
      valid: false,
      error: \`Missing headers: \${missing.join(', ')}\`
    };
  }
  
  // Verify signature
  const isValid = verifyWebhookSignature(
    request.body,
    request.headers['x-webhook-signature'],
    request.headers['x-webhook-timestamp']
  );
  
  if (!isValid) {
    return {
      valid: false,
      error: 'Invalid signature'
    };
  }
  
  return { valid: true };
}`

  const debugGuideCode = `// ====================================
// DEBUGGING GUIDE & BEST PRACTICES
// ====================================

// 1. STRUCTURED LOGGING
// Instead of random console.log, use structured logging
const logger = {
  info: (message, data) => {
    console.log(JSON.stringify({
      level: 'INFO',
      timestamp: new Date().toISOString(),
      message,
      data,
      environment: environment.NODE_ENV
    }, null, 2));
  },
  
  error: (message, error, context) => {
    console.error(JSON.stringify({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      message,
      error: {
        name: error.name,
        message: error.message,
        stack: environment.DEBUG === 'true' ? error.stack : undefined
      },
      context,
      environment: environment.NODE_ENV
    }, null, 2));
  },
  
  debug: (message, data) => {
    if (environment.DEBUG === 'true') {
      console.debug(JSON.stringify({
        level: 'DEBUG',
        timestamp: new Date().toISOString(),
        message,
        data: environment.LOG_SENSITIVE === 'true' ? data : '***',
        environment: environment.NODE_ENV
      }, null, 2));
    }
  }
};

// 2. DEBUG ENDPOINT TEMPLATE
// Use this template for debugging endpoints
export async function GET() {
  const startTime = Date.now();
  
  try {
    logger.info('Endpoint execution started', {
      method: request.method,
      path: request.path,
      query: request.query,
      params: request.params
    });
    
    // Your main logic here
    const result = await processRequest();
    
    const executionTime = Date.now() - startTime;
    
    logger.info('Endpoint execution completed', {
      executionTime: \`\${executionTime}ms\`,
      resultSize: JSON.stringify(result).length,
      success: true
    });
    
    return result;
    
  } catch (error) {
    const executionTime = Date.now() - startTime;
    
    logger.error('Endpoint execution failed', error, {
      executionTime: \`\${executionTime}ms\`,
      method: request.method,
      path: request.path
    });
    
    return {
      status: 500,
      success: false,
      error: error.message,
      executionTime: \`\${executionTime}ms\`,
      debug: environment.DEBUG === 'true' ? error.stack : undefined
    };
  }
}

// 3. DATA VALIDATION MIDDLEWARE
function validateRequest(schema) {
  return function(req) {
    const errors = [];
    
    // Validate query parameters
    if (schema.query) {
      Object.entries(schema.query).forEach(([key, validator]) => {
        if (req.query[key] !== undefined) {
          try {
            validator(req.query[key]);
          } catch (error) {
            errors.push(\`Query param "\${key}": \${error.message}\`);
          }
        } else if (schema.query[key].required) {
          errors.push(\`Missing required query param: \${key}\`);
        }
      });
    }
    
    // Validate body
    if (schema.body && req.body) {
      Object.entries(schema.body).forEach(([key, validator]) => {
        if (req.body[key] !== undefined) {
          try {
            validator(req.body[key]);
          } catch (error) {
            errors.push(\`Body field "\${key}": \${error.message}\`);
          }
        } else if (schema.body[key].required) {
          errors.push(\`Missing required body field: \${key}\`);
        }
      });
    }
    
    if (errors.length > 0) {
      throw new Error(\`Validation failed: \${errors.join(', ')}\`);
    }
  };
}

// 4. PERFORMANCE MONITORING
class PerformanceMonitor {
  constructor() {
    this.markers = {};
    this.startTime = Date.now();
  }
  
  mark(name) {
    this.markers[name] = Date.now();
  }
  
  measure(from, to) {
    const start = this.markers[from];
    const end = this.markers[to] || Date.now();
    
    if (!start) {
      console.warn(\`Marker "\${from}" not found\`);
      return null;
    }
    
    return end - start;
  }
  
  getReport() {
    const totalTime = Date.now() - this.startTime;
    const report = {
      totalExecutionTime: totalTime,
      markers: {},
      percentages: {}
    };
    
    // Calculate time between markers
    const markerNames = Object.keys(this.markers);
    for (let i = 0; i < markerNames.length - 1; i++) {
      const from = markerNames[i];
      const to = markerNames[i + 1];
      const duration = this.measure(from, to);
      
      if (duration !== null) {
        report.markers[\`\${from}_to_\${to}\`] = duration;
        report.percentages[\`\${from}_to_\${to}\`] = (duration / totalTime * 100).toFixed(2) + '%';
      }
    }
    
    return report;
  }
}

// Usage:
const monitor = new PerformanceMonitor();
monitor.mark('start');
// ... your code ...
monitor.mark('processing_done');
// ... more code ...
monitor.mark('end');

const report = monitor.getReport();
logger.debug('Performance report', report);

// 5. MEMORY USAGE MONITORING
function monitorMemoryUsage() {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const memory = process.memoryUsage();
    return {
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024) + 'MB',
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024) + 'MB',
      rss: Math.round(memory.rss / 1024 / 1024) + 'MB',
      limit: '128MB'
    };
  }
  
  return { limit: '128MB', current: 'unknown' };
}

// 6. ERROR RECOVERY PATTERNS
async function withRetry(operation, maxRetries = 3, delayMs = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.debug(\`Attempt \${attempt}/\${maxRetries}\`, { operation: operation.name });
      return await operation();
    } catch (error) {
      lastError = error;
      logger.warn(\`Attempt \${attempt} failed\`, { error: error.message });
      
      if (attempt < maxRetries) {
        // Exponential backoff
        const backoffDelay = delayMs * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }
  
  throw new Error(\`Operation failed after \${maxRetries} attempts: \${lastError.message}\`);
}

// 7. CIRCUIT BREAKER PATTERN
class CircuitBreaker {
  constructor(failureThreshold = 5, resetTimeout = 60000) {
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
    this.failures = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  }
  
  async execute(operation) {
    if (this.state === 'OPEN') {
      const timeSinceFailure = Date.now() - this.lastFailureTime;
      if (timeSinceFailure > this.resetTimeout) {
        this.state = 'HALF_OPEN';
        logger.debug('Circuit breaker transitioning to HALF_OPEN');
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await operation();
      
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failures = 0;
        logger.debug('Circuit breaker reset to CLOSED');
      }
      
      return result;
    } catch (error) {
      this.failures++;
      this.lastFailureTime = Date.now();
      
      if (this.failures >= this.failureThreshold) {
        this.state = 'OPEN';
        logger.error('Circuit breaker opened due to failures', {
          failures: this.failures,
          threshold: this.failureThreshold
        });
      }
      
      throw error;
    }
  }
}

// 8. DEBUG HELPER FUNCTIONS
const debugHelpers = {
  // Log variable with type and value
  inspect: (name, value) => {
    console.log(\`\${name}:\`, {
      type: typeof value,
      value: value,
      isArray: Array.isArray(value),
      length: value?.length,
      keys: value && typeof value === 'object' ? Object.keys(value).slice(0, 10) : undefined
    });
  },
  
  // Measure function execution time
  time: async (name, fn) => {
    const start = Date.now();
    const result = await fn();
    const duration = Date.now() - start;
    console.log(\`\${name} took \${duration}ms\`);
    return result;
  },
  
  // Mock data for testing
  createMockData: (count = 10) => {
    return Array.from({ length: count }, (_, i) => ({
      id: \`item_\${i + 1}\`,
      name: \`Test Item \${i + 1}\`,
      value: Math.random() * 100,
      active: Math.random() > 0.5,
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    }));
  }
};`

  // Sidebar navigation
  const sidebarNav = [
    { id: 'common-errors', label: 'Common Errors', icon: Bug, badge: 'Quick Fix' },
    { id: 'mockdata-errors', label: 'Mock Data Errors', icon: DatabaseAlert, badge: 'Data' },
    { id: 'environment-errors', label: 'Environment Errors', icon: CloudCog, badge: 'Config' },
    { id: 'execution-errors', label: 'Execution Errors', icon: ServerCrash, badge: 'Runtime' },
    { id: 'webhook-errors', label: 'Webhook Errors', icon: Webhook, badge: 'Integrations' },
    { id: 'performance', label: 'Performance Issues', icon: Gauge, badge: 'Optimization' },
    { id: 'debug-guide', label: 'Debugging Guide', icon: LifeBuoy, badge: 'Advanced' },
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
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600">
                  <Bug className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Troubleshooting</h1>
                  <p className="text-xs text-gray-400">Debugging & Solutions</p>
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
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/docs/api-reference'}
                className="gap-2"
              >
                <Code2 className="h-4 w-4" />
                API Reference
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/docs/examples'}
                className="gap-2"
              >
                <FileCodeIcon className="h-4 w-4" />
                Examples
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                className="gap-2"
              >
                <Bug className="h-4 w-4" />
                Troubleshooting
              </Button>
            </div>
            
            {/* Search & GitHub */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search troubleshooting..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-gray-800 border-gray-700"
                />
              </div>
             <Link href="https://github.com/tijani-web" target="_blank">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
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
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <Bug className="h-5 w-5 text-white" />
                </div>
                <h2 className="font-semibold">Troubleshooting</h2>
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
                              ? "border-red-500/50 text-red-400" 
                              : "border-gray-700 text-gray-500"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {activeSection === item.id && (
                        <div className="ml-2 h-1.5 w-1.5 rounded-full bg-red-500" />
                      )}
                    </Button>
                  ))}
                </div>

                <Separator className="my-6 bg-gray-800" />

                {/* Quick Links */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Quick Fixes
                  </h3>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start border-gray-700 text-gray-300"
                      onClick={() => copyCode(commonErrorsCode, 'Common Errors Fixes')}
                    >
                      <Copy className="h-3.5 w-3.5 mr-2" />
                      Copy Error Fixes
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start border-gray-700 text-gray-300"
                      onClick={() => copyCode(debugGuideCode, 'Debugging Guide')}
                    >
                      <Copy className="h-3.5 w-3.5 mr-2" />
                      Copy Debug Guide
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
                <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-400 mb-4">
                  <Bug className="h-3 w-3" />
                  Troubleshooting Guide
                </div>
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                  Fix Errors & Debug Your APIs
                </h1>
                <p className="text-lg text-gray-400 mb-6">
                  Step-by-step solutions for common errors, performance issues, and debugging techniques for your endpoints.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => scrollToSection('common-errors')}
                  >
                    <Bug className="h-4 w-4 mr-2" />
                    View Common Errors
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-700"
                    onClick={() => scrollToSection('debug-guide')}
                  >
                    <LifeBuoy className="h-4 w-4 mr-2" />
                    Advanced Debugging
                  </Button>
                </div>
              </div>
            </div>

            {/* Common Errors Section */}
            <div id="common-errors" ref={commonErrorsRef} className="scroll-mt-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Bug className="h-6 w-6 text-red-400" />
                  Common Errors & Quick Fixes
                </h2>
                <Badge variant="outline" className="border-red-500/30 text-red-400">
                  Most Frequent
                </Badge>
              </div>
              
              <Card className="border-gray-800 bg-gray-900/50 mb-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      <div>
                        <CardTitle>Top Error Solutions</CardTitle>
                        <CardDescription className="text-gray-400">
                          Fixes for the most common endpoint errors
                        </CardDescription>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      onClick={() => copyCode(commonErrorsCode, 'Common Errors Solutions')}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Fixes
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
                    {commonErrorsCode}
                  </SyntaxHighlighter>
                </CardContent>
              </Card>

              {/* Error Quick Reference */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-red-500/20 bg-red-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-400">
                      <XCircle className="h-5 w-5" />
                      Critical Errors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">mockData is undefined</span>
                          <Badge variant="destructive" className="text-xs">Fix Now</Badge>
                        </div>
                        <p className="text-xs text-gray-400">
                          Select mock data collection in UI dropdown
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Timeout (30s)</span>
                          <Badge variant="destructive" className="text-xs">Optimize</Badge>
                        </div>
                        <p className="text-xs text-gray-400">
                          Code running too long - add termination conditions
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Memory Limit</span>
                          <Badge variant="destructive" className="text-xs">Chunk Data</Badge>
                        </div>
                        <p className="text-xs text-gray-400">
                          Process data in smaller batches (max 128MB)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-amber-500/20 bg-amber-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-400">
                      <AlertCircle className="h-5 w-5" />
                      Warning Errors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Undefined Properties</span>
                          <Badge variant="secondary" className="text-xs">Safe Access</Badge>
                        </div>
                        <p className="text-xs text-gray-400">
                          Use optional chaining: user?.address?.city
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Type Errors</span>
                          <Badge variant="secondary" className="text-xs">Validate</Badge>
                        </div>
                        <p className="text-xs text-gray-400">
                          Check data types before operations
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Console Flooding</span>
                          <Badge variant="secondary" className="text-xs">Conditional Log</Badge>
                        </div>
                        <p className="text-xs text-gray-400">
                          Use environment-based logging levels
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Mock Data Errors Section */}
            <div id="mockdata-errors" ref={mockDataErrorsRef} className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <DatabaseAlert className="h-6 w-6 text-purple-400" />
                Mock Data Specific Issues
              </h2>
              
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-purple-400" />
                      <div>
                        <CardTitle>Mock Data Debugging</CardTitle>
                        <CardDescription className="text-gray-400">
                          Solutions for data access, validation, and processing errors
                        </CardDescription>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                      onClick={() => copyCode(mockDataErrorsCode, 'Mock Data Errors')}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Solutions
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
                    {mockDataErrorsCode}
                  </SyntaxHighlighter>
                </CardContent>
              </Card>
            </div>

            {/* Environment Errors Section */}
            <div id="environment-errors" ref={environmentErrorsRef} className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <CloudCog className="h-6 w-6 text-blue-400" />
                Environment Variable Issues
              </h2>
              
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <SettingsIcon className="h-5 w-5 text-blue-400" />
                      <div>
                        <CardTitle>Environment Configuration</CardTitle>
                        <CardDescription className="text-gray-400">
                          Fixing missing, incorrect, or misconfigured environment variables
                        </CardDescription>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                      onClick={() => copyCode(environmentErrorsCode, 'Environment Errors')}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Solutions
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
                    {environmentErrorsCode}
                  </SyntaxHighlighter>
                </CardContent>
              </Card>
            </div>

            {/* Execution Errors Section */}
            <div id="execution-errors" ref={executionErrorsRef} className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <ServerCrash className="h-6 w-6 text-orange-400" />
                Execution & Runtime Problems
              </h2>
              
              <div className="space-y-6">
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TimerOff className="h-5 w-5 text-orange-400" />
                        <div>
                          <CardTitle>Runtime Error Solutions</CardTitle>
                          <CardDescription className="text-gray-400">
                            Handling timeouts, memory limits, and async issues
                          </CardDescription>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                        onClick={() => copyCode(executionErrorsCode, 'Execution Errors')}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Solutions
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
                      {executionErrorsCode}
                    </SyntaxHighlighter>
                  </CardContent>
                </Card>

                {/* Execution Limits */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="border-red-500/20 bg-red-500/5">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Timer className="h-4 w-4 text-red-400" />
                          <span className="text-sm font-medium">Timeout</span>
                        </div>
                        <div className="text-2xl font-bold">30 seconds</div>
                        <p className="text-xs text-gray-400">Max execution time</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-red-500/20 bg-red-500/5">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MemoryStick className="h-4 w-4 text-red-400" />
                          <span className="text-sm font-medium">Memory</span>
                        </div>
                        <div className="text-2xl font-bold">128 MB</div>
                        <p className="text-xs text-gray-400">Max memory usage</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-red-500/20 bg-red-500/5">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CpuIcon className="h-4 w-4 text-red-400" />
                          <span className="text-sm font-medium">CPU Priority</span>
                        </div>
                        <div className="text-lg font-semibold">Medium</div>
                        <p className="text-xs text-gray-400">512 CPU shares</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Webhook Errors Section */}
            <div id="webhook-errors" ref={webhookErrorsRef} className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Webhook className="h-6 w-6 text-emerald-400" />
                Webhook Integration Issues
              </h2>
              
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Send className="h-5 w-5 text-emerald-400" />
                      <div>
                        <CardTitle>Webhook Troubleshooting</CardTitle>
                        <CardDescription className="text-gray-400">
                          Fixing delivery, signature, and integration problems
                        </CardDescription>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                      onClick={() => copyCode(webhookErrorsCode, 'Webhook Errors')}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Solutions
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
                    {webhookErrorsCode}
                  </SyntaxHighlighter>
                </CardContent>
              </Card>
            </div>

            {/* Debugging Guide Section */}
            <div id="debug-guide" ref={debugGuideRef} className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <LifeBuoy className="h-6 w-6 text-blue-400" />
                Advanced Debugging Guide
              </h2>
              
              <div className="space-y-6">
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BugPlay className="h-5 w-5 text-blue-400" />
                        <div>
                          <CardTitle>Professional Debugging Techniques</CardTitle>
                          <CardDescription className="text-gray-400">
                            Structured logging, performance monitoring, and error recovery patterns
                          </CardDescription>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                        onClick={() => copyCode(debugGuideCode, 'Debugging Guide')}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Guide
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
                      {debugGuideCode}
                    </SyntaxHighlighter>
                  </CardContent>
                </Card>

                {/* Debug Tools */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-emerald-500/20 bg-emerald-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-emerald-400">
                        <ActivityIcon className="h-5 w-5" />
                        Debug Tools
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2"></div>
                          <div>
                            <p className="font-medium">Structured Logging</p>
                            <p className="text-sm text-gray-400">JSON-formatted logs with timestamps</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2"></div>
                          <div>
                            <p className="font-medium">Performance Monitor</p>
                            <p className="text-sm text-gray-400">Track execution time per operation</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2"></div>
                          <div>
                            <p className="font-medium">Memory Monitoring</p>
                            <p className="text-sm text-gray-400">Track heap usage and limits</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-500/20 bg-blue-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-400">
                        <ShieldCheck className="h-5 w-5" />
                        Error Recovery
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                          <div>
                            <p className="font-medium">Retry Pattern</p>
                            <p className="text-sm text-gray-400">Automatic retry with exponential backoff</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                          <div>
                            <p className="font-medium">Circuit Breaker</p>
                            <p className="text-sm text-gray-400">Prevent cascading failures</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                          <div>
                            <p className="font-medium">Graceful Degradation</p>
                            <p className="text-sm text-gray-400">Fallback when services fail</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-black">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MessageSquare className="h-6 w-6 text-red-400" />
                  Still Need Help?
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Can't find a solution? Our support team is here to help.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                        <Github className="h-5 w-5 text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold">GitHub Issues</h4>
                        <p className="text-sm text-gray-400">Report bugs and get technical help</p>
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
                        <h4 className="font-semibold">Community Support</h4>
                        <p className="text-sm text-gray-400">Get help from other developers</p>
                      </div>
                    </div>
                    <code className="block text-sm bg-gray-900 border border-gray-800 rounded px-3 py-2">
                      https://www.linkedin.com/in/basit-tijani/
                    </code>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-800 pt-6">
                <Button 
                  variant="outline" 
                  className="w-full border-gray-700"
                  onClick={scrollToTop}
                >
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Back to Top
                </Button>
              </CardFooter>
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
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <Bug className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">API Builder</p>
                  <p className="text-xs text-gray-500">Troubleshooting Guide</p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-6 bg-gray-800" />
              <div className="text-sm text-gray-500">
                Updated December 2025 • Version 2.0.0
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="/docs" className="hover:text-gray-300 transition-colors">Guide</a>
              <a href="/docs/api-reference" className="hover:text-gray-300 transition-colors">API Reference</a>
              <a href="/docs/examples" className="hover:text-gray-300 transition-colors">Examples</a>
              <span className="text-red-400">Troubleshooting</span>
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