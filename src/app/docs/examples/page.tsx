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
  MapPin,
  Package,
  BarChart3,
  PieChart,
  LineChart,
  TrendingDown,
  BellRing,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudSun,
  DatabaseZap,
  Rocket,
  Lightbulb,
  FlaskConical,
  TestTube,
  Beaker,
  FlaskRound,
  Wrench,
  Hammer,
  FileJson,
  FileText,
  FileSpreadsheet,
  FileCode as FileCodeIcon,
  FileOutput,
  FileInput,
  Folder,
  FolderOpen,
  FolderTree,
  Network as NetworkIcon,
  Webhook,
  GitBranch,
  GitCommit,
  GitPullRequest,
  GitMerge,
  GitCompare,
  GitFork,
  Star,
  Heart,
  ThumbsUp,
  Award,
  Trophy,
  Crown,
  Zap as ZapIcon,
  Target,
  CheckCircle,
  XCircle,
  AlertOctagon,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  Shield as ShieldIcon,
  Key as KeyIcon,
  Lock as LockIcon,
  Unlock,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  User,
  UserPlus,
  UserCheck,
  UserX,
  UserCog,
  Users as UsersIcon,
  UserCircle,
  UserSquare,
  LogIn,
  LogOut,
  Home,
  Settings as SettingsIcon,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Sun,
  Moon,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Mouse,
  Keyboard,
  Headphones,
  Speaker,
  Mic,
  Video,
  Camera,
  Image,
  Film,
  Music,
  Volume2,
  VolumeX,
  Download as DownloadIcon,
  Upload,
  Share2,
  ExternalLink,
  Link2,
  Bookmark,
  BookmarkCheck,
  BookOpen as BookOpenIcon,
  Book,
  BookKey,
  BookMarked,
  CalendarDays,
  Clock as ClockIcon,
  Timer,
  TimerOff,
  TimerReset,
  CalendarClock,
  CalendarRange,
  CalendarCheck,
  CalendarX,
  CalendarPlus,
  CalendarMinus,
  Map,
  Navigation,
  Compass,
  Globe as GlobeIcon,
  MapPin as MapPinIcon,
  Navigation2,
  Flag,
  Award as AwardIcon,
  Medal,
  Gift,
  Package as PackageIcon,
  ShoppingBag,
  ShoppingCart as ShoppingCartIcon,
  CreditCard as CreditCardIcon,
  DollarSign,
  Euro,
  PoundSterling,
  Bitcoin,
  Wallet,
  Banknote,
  Coins,
  Percent,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  LineChart as LineChartIcon,
  BarChart3 as BarChart3Icon,
  PieChart as PieChartIcon,
  AreaChart,
  ScatterChart,
  CandlestickChart,
  ChartNoAxesColumnIncreasing,
  ChartNoAxesColumnDecreasing,
  ChartColumn,
  ChartBar,
  ChartBarBig,
  ChartLine,
  ChartArea,
  ChartCandlestick,
  ChartPie,
  ChartScatter,
  ChartNoAxesCombined
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

export default function ExamplesPage() {
  const [copied, setCopied] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState('getting-started')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [activeExampleTab, setActiveExampleTab] = useState('basic')

  // Refs for section scrolling
  const gettingStartedRef = useRef<HTMLDivElement>(null)
  const basicExamplesRef = useRef<HTMLDivElement>(null)
  const crudExamplesRef = useRef<HTMLDivElement>(null)
  const authExamplesRef = useRef<HTMLDivElement>(null)
  const webhookExamplesRef = useRef<HTMLDivElement>(null)
  const dataProcessingRef = useRef<HTMLDivElement>(null)
  const realWorldRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (sectionId: string) => {
    const sectionMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
      'getting-started': gettingStartedRef,
      'basic-examples': basicExamplesRef,
      'crud-examples': crudExamplesRef,
      'auth-examples': authExamplesRef,
      'webhook-examples': webhookExamplesRef,
      'data-processing': dataProcessingRef,
      'real-world': realWorldRef
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
        { id: 'getting-started', ref: gettingStartedRef },
        { id: 'basic-examples', ref: basicExamplesRef },
        { id: 'crud-examples', ref: crudExamplesRef },
        { id: 'auth-examples', ref: authExamplesRef },
        { id: 'webhook-examples', ref: webhookExamplesRef },
        { id: 'data-processing', ref: dataProcessingRef },
        { id: 'real-world', ref: realWorldRef }
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
      description: "Example code copied to clipboard"
    })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Example Code Blocks
  const gettingStartedCode = `// ====================================
// GETTING STARTED - Your First Endpoint
// ====================================

// 1. BASIC HELLO WORLD
// GET /api/hello
export async function GET() {
  return {
    message: 'Hello World!',
    timestamp: new Date().toISOString(),
    success: true
  };
}

// 2. WITH MOCK DATA
// GET /api/users
export async function GET() {
  // Access your mock data collection
  const users = mockData.users || [];
  
  return {
    success: true,
    data: users,
    count: users.length,
    timestamp: new Date().toISOString()
  };
}

// 3. WITH ENVIRONMENT VARIABLES
// GET /api/config
export async function GET() {
  const config = {
    apiVersion: environment.API_VERSION || '1.0.0',
    environment: environment.NODE_ENV || 'development',
    debugMode: environment.DEBUG === 'true',
    maxRequests: parseInt(environment.MAX_REQUESTS) || 100
  };
  
  return {
    success: true,
    config: config,
    serverTime: new Date().toISOString()
  };
}

// 4. COMPLETE FIRST ENDPOINT
// GET /api/dashboard
export async function GET() {
  // Access multiple data sources
  const users = mockData.users || [];
  const products = mockData.products || [];
  const orders = mockData.orders || [];
  
  // Use environment variables
  const appName = environment.APP_NAME || 'My API';
  const isProduction = environment.NODE_ENV === 'production';
  
  // Process data
  const activeUsers = users.filter(user => user.isActive);
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  
  // Return structured response
  return {
    success: true,
    app: appName,
    environment: isProduction ? 'production' : 'development',
    stats: {
      totalUsers: users.length,
      activeUsers: activeUsers.length,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue: totalRevenue,
      avgOrderValue: avgOrderValue.toFixed(2)
    },
    timestamp: new Date().toISOString()
  };
}`

  const crudExampleCode = `// ====================================
// COMPLETE CRUD API EXAMPLE
// ====================================

// GET /api/products
export async function GET() {
  const products = mockData.products || [];
  
  // Get query parameters
  const page = parseInt(request.query.page) || 1;
  const limit = parseInt(request.query.limit) || 20;
  const category = request.query.category;
  const search = request.query.search;
  
  // Filtering
  let filteredProducts = products;
  
  if (category) {
    filteredProducts = filteredProducts.filter(p => 
      p.category?.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (search) {
    filteredProducts = filteredProducts.filter(p =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  return {
    success: true,
    data: paginatedProducts,
    pagination: {
      page,
      limit,
      total: filteredProducts.length,
      pages: Math.ceil(filteredProducts.length / limit),
      hasNext: endIndex < filteredProducts.length,
      hasPrev: page > 1
    }
  };
}

// GET /api/products/:id
export async function GET() {
  const products = mockData.products || [];
  const productId = request.params.id;
  
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return {
      status: 404,
      success: false,
      error: 'Product not found'
    };
  }
  
  return {
    success: true,
    data: product
  };
}

// POST /api/products
export async function POST() {
  const newProduct = {
    id: \`product_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`,
    ...request.body,
    createdAt: new Date().toISOString(),
    createdBy: environment.APP_NAME || 'API Builder',
    status: 'active'
  };
  
  // Validation
  if (!newProduct.name || !newProduct.price) {
    return {
      status: 400,
      success: false,
      error: 'Name and price are required'
    };
  }
  
  return {
    status: 201,
    success: true,
    message: 'Product created successfully',
    data: newProduct
  };
}

// PUT /api/products/:id
export async function PUT() {
  const products = mockData.products || [];
  const productId = request.params.id;
  
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return {
      status: 404,
      success: false,
      error: 'Product not found'
    };
  }
  
  const updatedProduct = {
    ...products[productIndex],
    ...request.body,
    updatedAt: new Date().toISOString(),
    updatedBy: environment.APP_NAME || 'API Builder'
  };
  
  return {
    success: true,
    message: 'Product updated successfully',
    data: updatedProduct
  };
}

// DELETE /api/products/:id
export async function DELETE() {
  const products = mockData.products || [];
  const productId = request.params.id;
  
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return {
      status: 404,
      success: false,
      error: 'Product not found'
    };
  }
  
  return {
    success: true,
    message: 'Product deleted successfully',
    deletedProduct: products[productIndex]
  };
}`

  const authExampleCode = `// ====================================
// AUTHENTICATION & AUTHORIZATION
// ====================================

// 1. API KEY AUTHENTICATION
// GET /api/protected
export async function GET() {
  const apiKey = request.headers['x-api-key'];
  const expectedKey = environment.API_KEY;
  
  if (!apiKey || apiKey !== expectedKey) {
    return {
      status: 401,
      success: false,
      error: 'Invalid API key'
    };
  }
  
  // Proceed with authenticated request
  const data = mockData.protectedData || [];
  
  return {
    success: true,
    data: data,
    message: 'Authenticated successfully'
  };
}

// 2. JWT TOKEN VERIFICATION
// GET /api/user/profile
export async function GET() {
  const authHeader = request.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      status: 401,
      success: false,
      error: 'No token provided'
    };
  }
  
  const token = authHeader.split(' ')[1];
  const jwtSecret = environment.JWT_SECRET;
  
  // Simple token validation (in real app, use proper JWT library)
  if (token !== 'valid-jwt-token-example') {
    return {
      status: 401,
      success: false,
      error: 'Invalid token'
    };
  }
  
  // Get user from token
  const userId = 'user_123'; // Extract from JWT in real app
  const users = mockData.users || [];
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return {
      status: 404,
      success: false,
      error: 'User not found'
    };
  }
  
  // Remove sensitive data
  const { password, ...safeUser } = user;
  
  return {
    success: true,
    data: safeUser
  };
}

// 3. ROLE-BASED ACCESS CONTROL
// POST /api/admin/users
export async function POST() {
  // Check for admin token
  const authHeader = request.headers['authorization'];
  const adminToken = environment.ADMIN_TOKEN;
  
  if (!authHeader || authHeader !== \`Bearer \${adminToken}\`) {
    return {
      status: 403,
      success: false,
      error: 'Admin access required'
    };
  }
  
  // Admin-only operation
  const newUser = {
    id: \`user_\${Date.now()}\`,
    ...request.body,
    role: 'user',
    createdAt: new Date().toISOString(),
    createdBy: 'admin'
  };
  
  return {
    status: 201,
    success: true,
    message: 'User created by admin',
    data: newUser
  };
}

// 4. RATE LIMITING
// GET /api/limited
export async function GET() {
  // Simulate rate limiting
  const clientIp = request.headers['x-forwarded-for'] || 'unknown';
  const rateLimitKey = \`rate_limit_\${clientIp}\`;
  
  // In real app, use Redis or similar for rate limiting
  const maxRequests = parseInt(environment.RATE_LIMIT) || 100;
  const windowMs = 60 * 1000; // 1 minute
  
  // Simple rate limiting logic
  const currentCount = 1; // Get from storage in real app
  
  if (currentCount > maxRequests) {
    return {
      status: 429,
      success: false,
      error: 'Too many requests',
      retryAfter: 60 // seconds
    };
  }
  
  return {
    success: true,
    message: 'Rate limited endpoint',
    remaining: maxRequests - currentCount,
    resetIn: windowMs / 1000
  };
}`

  const webhookExampleCode = `// ====================================
// WEBHOOK HANDLING & INTEGRATIONS
// ====================================

// 1. WEBHOOK RECEIVER ENDPOINT
// POST /api/webhooks
export async function POST() {
  // Verify webhook signature
  const signature = request.headers['x-webhook-signature'];
  const timestamp = request.headers['x-webhook-timestamp'];
  const webhookSecret = environment.WEBHOOK_SECRET;
  
  // Simple signature verification
  const expectedSignature = generateSignature(
    JSON.stringify(request.body),
    webhookSecret,
    timestamp
  );
  
  if (signature !== expectedSignature) {
    return {
      status: 401,
      success: false,
      error: 'Invalid webhook signature'
    };
  }
  
  // Process webhook event
  const { event, data } = request.body;
  
  switch (event) {
    case 'payment.completed':
      await handlePaymentCompleted(data);
      break;
      
    case 'user.registered':
      await handleUserRegistration(data);
      break;
      
    case 'order.shipped':
      await handleOrderShipped(data);
      break;
      
    default:
      console.log('Unknown webhook event:', event);
  }
  
  // Always return 200 to acknowledge receipt
  return {
    status: 200,
    success: true,
    message: 'Webhook received and processed'
  };
}

// Helper function for signature generation
function generateSignature(payload, secret, timestamp) {
  // In real app, use crypto library
  const data = \`\${timestamp}.\${payload}\`;
  return \`sha256=\${data}\`; // Simplified example
}

// 2. TRIGGER WEBHOOK FROM ENDPOINT
// POST /api/orders
export async function POST() {
  // Create order
  const newOrder = {
    id: \`order_\${Date.now()}\`,
    ...request.body,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  // Simulate webhook triggering
  if (environment.WEBHOOK_URL) {
    // In real app, this would be async
    console.log('Triggering order.created webhook');
    
    const webhookPayload = {
      event: 'order.created',
      timestamp: new Date().toISOString(),
      data: {
        order: newOrder,
        user: request.body.userId
      }
    };
    
    // Log webhook for debugging
    if (environment.DEBUG === 'true') {
      console.log('Webhook payload:', webhookPayload);
    }
  }
  
  return {
    status: 201,
    success: true,
    data: newOrder,
    message: 'Order created and webhook triggered'
  };
}

// 3. WEBHOOK RETRY HANDLER
// GET /api/webhooks/retry/:id
export async function GET() {
  const webhookId = request.params.id;
  const webhooks = mockData.webhookLogs || [];
  
  const webhook = webhooks.find(w => w.id === webhookId);
  
  if (!webhook) {
    return {
      status: 404,
      success: false,
      error: 'Webhook not found'
    };
  }
  
  // Retry logic
  if (webhook.attempts >= 3) {
    return {
      success: false,
      error: 'Max retry attempts reached',
      status: 'failed'
    };
  }
  
  // Simulate retry
  const retryResult = {
    ...webhook,
    attempts: webhook.attempts + 1,
    lastRetry: new Date().toISOString(),
    status: 'retrying'
  };
  
  return {
    success: true,
    message: 'Webhook retry initiated',
    data: retryResult
  };
}`

  const dataProcessingCode = `// ====================================
// DATA PROCESSING & TRANSFORMATIONS
// ====================================

// 1. DATA AGGREGATION
// GET /api/analytics/summary
export async function GET() {
  const orders = mockData.orders || [];
  const users = mockData.users || [];
  const products = mockData.products || [];
  
  // Time-based aggregation
  const now = new Date();
  const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
  
  const recentOrders = orders.filter(order => 
    new Date(order.createdAt) > lastMonth
  );
  
  // Calculate metrics
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const monthlyRevenue = recentOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  
  const activeUsers = users.filter(user => user.isActive).length;
  const newUsers = users.filter(user => 
    new Date(user.createdAt) > lastMonth
  ).length;
  
  // Product statistics
  const productStats = products.map(product => {
    const productOrders = orders.filter(order => 
      order.items?.some(item => item.productId === product.id)
    );
    
    const revenue = productOrders.reduce((sum, order) => {
      const item = order.items?.find(i => i.productId === product.id);
      return sum + (item?.quantity * item?.price || 0);
    }, 0);
    
    return {
      productId: product.id,
      productName: product.name,
      totalOrders: productOrders.length,
      totalRevenue: revenue,
      avgRating: product.rating || 0
    };
  });
  
  // Sort by revenue
  const topProducts = productStats
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);
  
  return {
    success: true,
    data: {
      overview: {
        totalOrders: orders.length,
        totalRevenue: totalRevenue,
        totalUsers: users.length,
        activeUsers: activeUsers
      },
      monthly: {
        orders: recentOrders.length,
        revenue: monthlyRevenue,
        newUsers: newUsers,
        growthRate: ((monthlyRevenue / (totalRevenue - monthlyRevenue)) * 100).toFixed(2)
      },
      topProducts: topProducts,
      timestamp: new Date().toISOString()
    }
  };
}

// 2. DATA TRANSFORMATION
// GET /api/products/export
export async function GET() {
  const products = mockData.products || [];
  const format = request.query.format || 'json';
  
  // Transform data for different formats
  const transformedData = products.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    stock: product.stock || 0,
    status: product.stock > 0 ? 'In Stock' : 'Out of Stock',
    lastUpdated: product.updatedAt || product.createdAt
  }));
  
  if (format === 'csv') {
    // Convert to CSV
    const headers = ['ID', 'Name', 'Description', 'Price', 'Category', 'Stock', 'Status', 'Last Updated'];
    const csvRows = transformedData.map(p => [
      p.id,
      \`"\${p.name}"\`,
      \`"\${p.description}"\`,
      p.price,
      p.category,
      p.stock,
      p.status,
      p.lastUpdated
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\\n');
    
    return {
      type: 'file',
      filename: \`products_\${new Date().toISOString().split('T')[0]}.csv\`,
      data: csvContent,
      contentType: 'text/csv'
    };
  }
  
  // Default JSON response
  return {
    success: true,
    data: transformedData,
    format: format,
    exportedAt: new Date().toISOString()
  };
}

// 3. BATCH PROCESSING
// POST /api/batch/process
export async function POST() {
  const { items, operation } = request.body;
  
  if (!Array.isArray(items)) {
    return {
      status: 400,
      success: false,
      error: 'Items must be an array'
    };
  }
  
  const results = [];
  const errors = [];
  
  // Process each item
  for (const item of items) {
    try {
      let result;
      
      switch (operation) {
        case 'validate':
          result = validateItem(item);
          break;
          
        case 'transform':
          result = transformItem(item);
          break;
          
        case 'enrich':
          result = await enrichItem(item);
          break;
          
        default:
          throw new Error(\`Unknown operation: \${operation}\`);
      }
      
      results.push({
        itemId: item.id,
        success: true,
        result: result
      });
    } catch (error) {
      errors.push({
        itemId: item.id,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  return {
    success: true,
    summary: {
      total: items.length,
      processed: results.length,
      failed: errors.length,
      successRate: ((results.length / items.length) * 100).toFixed(2) + '%'
    },
    results: results,
    errors: errors.length > 0 ? errors : undefined,
    processedAt: new Date().toISOString()
  };
}

// Helper functions
function validateItem(item) {
  // Basic validation logic
  const requiredFields = ['id', 'name'];
  const missing = requiredFields.filter(field => !item[field]);
  
  if (missing.length > 0) {
    throw new Error(\`Missing fields: \${missing.join(', ')}\`);
  }
  
  return { valid: true, message: 'Validation passed' };
}

function transformItem(item) {
  // Transformation logic
  return {
    ...item,
    processed: true,
    transformedAt: new Date().toISOString(),
    metadata: {
      originalType: typeof item,
      transformation: 'standard'
    }
  };
}

async function enrichItem(item) {
  // Simulate async enrichment
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        ...item,
        enriched: true,
        enrichmentData: {
          source: 'external-api',
          timestamp: new Date().toISOString()
        }
      });
    }, 100);
  });
}`

  const realWorldCode = `// ====================================
// REAL-WORLD APPLICATION EXAMPLES
// ====================================

// 1. E-COMMERCE API
// GET /api/store/products
export async function GET() {
  const products = mockData.products || [];
  
  // Get query parameters
  const category = request.query.category;
  const minPrice = parseFloat(request.query.minPrice);
  const maxPrice = parseFloat(request.query.maxPrice);
  const sort = request.query.sort || 'name';
  const inStock = request.query.inStock === 'true';
  
  // Filter products
  let filtered = products;
  
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  
  if (!isNaN(minPrice)) {
    filtered = filtered.filter(p => p.price >= minPrice);
  }
  
  if (!isNaN(maxPrice)) {
    filtered = filtered.filter(p => p.price <= maxPrice);
  }
  
  if (inStock) {
    filtered = filtered.filter(p => (p.stock || 0) > 0);
  }
  
  // Sort products
  filtered.sort((a, b) => {
    switch (sort) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });
  
  return {
    success: true,
    data: filtered,
    filters: {
      category,
      minPrice,
      maxPrice,
      inStock,
      sort
    },
    metadata: {
      total: filtered.length,
      categories: [...new Set(products.map(p => p.category))],
      priceRange: {
        min: Math.min(...products.map(p => p.price)),
        max: Math.max(...products.map(p => p.price))
      }
    }
  };
}

// 2. USER MANAGEMENT API
// GET /api/users
export async function GET() {
  const users = mockData.users || [];
  const query = request.query;
  
  // Advanced filtering
  let filteredUsers = users;
  
  // Role filter
  if (query.role) {
    filteredUsers = filteredUsers.filter(u => u.role === query.role);
  }
  
  // Status filter
  if (query.status) {
    filteredUsers = filteredUsers.filter(u => u.status === query.status);
  }
  
  // Search
  if (query.search) {
    const searchTerm = query.search.toLowerCase();
    filteredUsers = filteredUsers.filter(u =>
      u.name?.toLowerCase().includes(searchTerm) ||
      u.email?.toLowerCase().includes(searchTerm) ||
      u.username?.toLowerCase().includes(searchTerm)
    );
  }
  
  // Date range filter
  if (query.startDate || query.endDate) {
    filteredUsers = filteredUsers.filter(u => {
      const userDate = new Date(u.createdAt);
      
      if (query.startDate && userDate < new Date(query.startDate)) {
        return false;
      }
      
      if (query.endDate && userDate > new Date(query.endDate)) {
        return false;
      }
      
      return true;
    });
  }
  
  // Pagination
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
  // Remove sensitive data
  const safeUsers = paginatedUsers.map(({ password, ...user }) => user);
  
  return {
    success: true,
    data: safeUsers,
    pagination: {
      page,
      limit,
      total: filteredUsers.length,
      pages: Math.ceil(filteredUsers.length / limit),
      hasNext: endIndex < filteredUsers.length,
      hasPrev: page > 1
    },
    summary: {
      totalUsers: users.length,
      filteredCount: filteredUsers.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      inactiveUsers: users.filter(u => u.status === 'inactive').length
    }
  };
}

// 3. CONTENT MANAGEMENT API
// GET /api/content/posts
export async function GET() {
  const posts = mockData.blogPosts || [];
  const query = request.query;
  
  // Filtering logic
  let filteredPosts = posts;
  
  // Published only (unless admin)
  const showDrafts = query.includeDrafts === 'true' && 
    request.headers['x-admin-token'] === environment.ADMIN_TOKEN;
  
  if (!showDrafts) {
    filteredPosts = filteredPosts.filter(p => p.status === 'published');
  }
  
  // Category filter
  if (query.category) {
    filteredPosts = filteredPosts.filter(p => 
      p.categories?.includes(query.category)
    );
  }
  
  // Tag filter
  if (query.tag) {
    filteredPosts = filteredPosts.filter(p => 
      p.tags?.includes(query.tag)
    );
  }
  
  // Author filter
  if (query.author) {
    filteredPosts = filteredPosts.filter(p => p.authorId === query.author);
  }
  
  // Date range
  if (query.fromDate || query.toDate) {
    filteredPosts = filteredPosts.filter(p => {
      const postDate = new Date(p.publishedAt || p.createdAt);
      
      if (query.fromDate && postDate < new Date(query.fromDate)) {
        return false;
      }
      
      if (query.toDate && postDate > new Date(query.toDate)) {
        return false;
      }
      
      return true;
    });
  }
  
  // Search
  if (query.search) {
    const searchTerm = query.search.toLowerCase();
    filteredPosts = filteredPosts.filter(p =>
      p.title?.toLowerCase().includes(searchTerm) ||
      p.content?.toLowerCase().includes(searchTerm) ||
      p.excerpt?.toLowerCase().includes(searchTerm)
    );
  }
  
  // Sort
  const sortBy = query.sortBy || 'publishedAt';
  const sortOrder = query.sortOrder || 'desc';
  
  filteredPosts.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Handle dates
    if (sortBy.includes('At')) {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  // Pagination
  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 10, 50); // Max 50 per page
  const startIndex = (page - 1) * limit;
  
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit);
  
  // Calculate reading time
  const postsWithMeta = paginatedPosts.map(post => {
    const wordCount = post.content?.split(' ').length || 0;
    const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
    
    return {
      ...post,
      meta: {
        wordCount,
        readingTime,
        hasImage: !!post.featuredImage,
        tagsCount: post.tags?.length || 0
      }
    };
  });
  
  return {
    success: true,
    data: postsWithMeta,
    pagination: {
      page,
      limit,
      total: filteredPosts.length,
      pages: Math.ceil(filteredPosts.length / limit)
    },
    filters: {
      applied: Object.keys(query).length > 0,
      categories: [...new Set(posts.flatMap(p => p.categories || []))],
      tags: [...new Set(posts.flatMap(p => p.tags || []))],
      authors: [...new Set(posts.map(p => p.authorId))]
    },
    metadata: {
      totalPosts: posts.length,
      publishedPosts: posts.filter(p => p.status === 'published').length,
      draftPosts: posts.filter(p => p.status === 'draft').length
    }
  };
}`

  // Sidebar navigation
  const sidebarNav = [
    { id: 'getting-started', label: 'Getting Started', icon: Rocket, badge: 'Beginner' },
    { id: 'basic-examples', label: 'Basic Examples', icon: FileCodeIcon, badge: 'Simple' },
    { id: 'crud-examples', label: 'CRUD Examples', icon: DatabaseZap, badge: 'Essential' },
    { id: 'auth-examples', label: 'Auth Examples', icon: ShieldIcon, badge: 'Security' },
    { id: 'webhook-examples', label: 'Webhook Examples', icon: Webhook, badge: 'Integrations' },
    { id: 'data-processing', label: 'Data Processing', icon: BarChart3Icon, badge: 'Advanced' },
    { id: 'real-world', label: 'Real World Apps', icon: Building, badge: 'Production' },
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
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
                  <FileCodeIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Examples</h1>
                  <p className="text-xs text-gray-400">Practical Code Samples</p>
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
                variant="secondary" 
                size="sm"
                className="gap-2"
              >
                <FileCodeIcon className="h-4 w-4" />
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
                  placeholder="Search examples..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-gray-800 border-gray-700"
                />
              </div>
               <Link href="https://github.com/tijani-web" target="_blank">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
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
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <FileCodeIcon className="h-5 w-5 text-white" />
                </div>
                <h2 className="font-semibold">Examples</h2>
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
                              ? "border-emerald-500/50 text-emerald-400" 
                              : "border-gray-700 text-gray-500"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {activeSection === item.id && (
                        <div className="ml-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      )}
                    </Button>
                  ))}
                </div>

                <Separator className="my-6 bg-gray-800" />

                {/* Quick Links */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Quick Examples
                  </h3>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start border-gray-700 text-gray-300"
                      onClick={() => copyCode(gettingStartedCode, 'Getting Started Example')}
                    >
                      <Copy className="h-3.5 w-3.5 mr-2" />
                      Copy Hello World
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start border-gray-700 text-gray-300"
                      onClick={() => copyCode(crudExampleCode, 'CRUD Example')}
                    >
                      <Copy className="h-3.5 w-3.5 mr-2" />
                      Copy CRUD API
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
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400 mb-4">
                  <FileCodeIcon className="h-3 w-3" />
                  Practical Examples
                </div>
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                  Real Code for Real Applications
                </h1>
                <p className="text-lg text-gray-400 mb-6">
                  Copy-paste ready examples for common API patterns, from simple endpoints to production-ready applications.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => scrollToSection('getting-started')}
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    Start with Basics
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-700"
                    onClick={() => scrollToSection('real-world')}
                  >
                    <Building className="h-4 w-4 mr-2" />
                    View Real Apps
                  </Button>
                </div>
              </div>
            </div>

            {/* Getting Started Section */}
            <div id="getting-started" ref={gettingStartedRef} className="scroll-mt-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Rocket className="h-6 w-6 text-emerald-400" />
                  Getting Started Examples
                </h2>
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                  Beginner Friendly
                </Badge>
              </div>
              
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Play className="h-5 w-5 text-emerald-400" />
                      <div>
                        <CardTitle>Your First Endpoints</CardTitle>
                        <CardDescription className="text-gray-400">
                          Simple examples to get you started immediately
                        </CardDescription>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                      onClick={() => copyCode(gettingStartedCode, 'Getting Started Examples')}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy All Examples
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
                    {gettingStartedCode}
                  </SyntaxHighlighter>
                </CardContent>
              </Card>
            </div>

            {/* CRUD Examples Section */}
            <div id="crud-examples" ref={crudExamplesRef} className="scroll-mt-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <DatabaseZap className="h-6 w-6 text-blue-400" />
                  Complete CRUD API Examples
                </h2>
                <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                  Production Ready
                </Badge>
              </div>
              
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShoppingCartIcon className="h-5 w-5 text-blue-400" />
                      <div>
                        <CardTitle>Full Product CRUD API</CardTitle>
                        <CardDescription className="text-gray-400">
                          Complete REST API with filtering, pagination, and validation
                        </CardDescription>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                      onClick={() => copyCode(crudExampleCode, 'CRUD API Example')}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Full CRUD
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
                    {crudExampleCode}
                  </SyntaxHighlighter>
                </CardContent>
                <CardFooter className="border-t border-gray-800 bg-gray-900/50 p-4">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span>Includes pagination & filtering</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span>Proper error handling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span>Input validation</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Authentication Examples */}
            <div id="auth-examples" ref={authExamplesRef} className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <ShieldIcon className="h-6 w-6 text-amber-400" />
                Authentication & Security
              </h2>
              
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <LockIcon className="h-5 w-5 text-amber-400" />
                      <div>
                        <CardTitle>API Security Examples</CardTitle>
                        <CardDescription className="text-gray-400">
                          API key validation, JWT tokens, and role-based access control
                        </CardDescription>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                      onClick={() => copyCode(authExampleCode, 'Authentication Examples')}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Security Code
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
                    {authExampleCode}
                  </SyntaxHighlighter>
                </CardContent>
              </Card>
            </div>

            {/* Webhook Examples */}
            <div id="webhook-examples" ref={webhookExamplesRef} className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Webhook className="h-6 w-6 text-purple-400" />
                Webhook Integrations
              </h2>
              
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BellRing className="h-5 w-5 text-purple-400" />
                      <div>
                        <CardTitle>Webhook Handling Examples</CardTitle>
                        <CardDescription className="text-gray-400">
                          Receive, verify, and process webhooks from external services
                        </CardDescription>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                      onClick={() => copyCode(webhookExampleCode, 'Webhook Examples')}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Webhook Code
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
                    {webhookExampleCode}
                  </SyntaxHighlighter>
                </CardContent>
              </Card>
            </div>

            {/* Data Processing Examples */}
            <div id="data-processing" ref={dataProcessingRef} className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <BarChart3Icon className="h-6 w-6 text-blue-400" />
                Data Processing & Analytics
              </h2>
              
              <div className="grid gap-6">
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <LineChartIcon className="h-5 w-5 text-blue-400" />
                        <div>
                          <CardTitle>Advanced Data Processing</CardTitle>
                          <CardDescription className="text-gray-400">
                            Aggregation, transformation, and batch processing
                          </CardDescription>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                        onClick={() => copyCode(dataProcessingCode, 'Data Processing Examples')}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Code
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
                      {dataProcessingCode}
                    </SyntaxHighlighter>
                  </CardContent>
                </Card>

                {/* Data Processing Tips */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="border-emerald-500/20 bg-emerald-500/5">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10">
                          <TrendingUpIcon className="h-5 w-5 text-emerald-400" />
                        </div>
                        <h4 className="font-semibold">Aggregation</h4>
                      </div>
                      <p className="text-sm text-gray-400">
                        Calculate totals, averages, and trends from your data collections
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-500/20 bg-blue-500/5">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <FileJson className="h-5 w-5 text-blue-400" />
                        </div>
                        <h4 className="font-semibold">Transformation</h4>
                      </div>
                      <p className="text-sm text-gray-400">
                        Convert data between formats (JSON to CSV, filtering, mapping)
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-500/20 bg-purple-500/5">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                          <PackageIcon className="h-5 w-5 text-purple-400" />
                        </div>
                        <h4 className="font-semibold">Batch Processing</h4>
                      </div>
                      <p className="text-sm text-gray-400">
                        Process large datasets in chunks with error handling and progress tracking
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Real World Applications */}
            <div id="real-world" ref={realWorldRef} className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Building className="h-6 w-6 text-orange-400" />
                Real-World Applications
              </h2>
              
              <div className="space-y-6">
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ShoppingCartIcon className="h-5 w-5 text-orange-400" />
                        <div>
                          <CardTitle>Production-Ready APIs</CardTitle>
                          <CardDescription className="text-gray-400">
                            Complete examples for e-commerce, user management, and content systems
                          </CardDescription>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                        onClick={() => copyCode(realWorldCode, 'Real World Examples')}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy All Examples
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
                      {realWorldCode}
                    </SyntaxHighlighter>
                  </CardContent>
                </Card>

                {/* Application Types */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="border-emerald-500/20 bg-gray-900/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-emerald-400">
                        <ShoppingCartIcon className="h-5 w-5" />
                        E-Commerce API
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5"></div>
                          <span>Product catalog with filtering</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5"></div>
                          <span>Shopping cart management</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5"></div>
                          <span>Order processing & tracking</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5"></div>
                          <span>Inventory management</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-500/20 bg-gray-900/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-400">
                        <UsersIcon className="h-5 w-5" />
                        User Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                          <span>User registration & authentication</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                          <span>Profile management</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                          <span>Role-based access control</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                          <span>User analytics & reporting</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-500/20 bg-gray-900/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-purple-400">
                        <FileText className="h-5 w-5" />
                        Content Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5"></div>
                          <span>Blog posts & articles</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5"></div>
                          <span>Media management</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5"></div>
                          <span>Comments & reviews</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5"></div>
                          <span>SEO metadata & tags</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-black">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <HelpCircle className="h-6 w-6 text-emerald-400" />
                  Need More Examples?
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Looking for a specific use case? Our community can help.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <Github className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold">GitHub Templates</h4>
                        <p className="text-sm text-gray-400">Ready-to-use API templates</p>
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
                        <h4 className="font-semibold">Community Forum</h4>
                        <p className="text-sm text-gray-400">Share and discuss examples</p>
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
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <FileCodeIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">API Builder</p>
                  <p className="text-xs text-gray-500">Practical Examples</p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-6 bg-gray-800" />
              <div className="text-sm text-gray-500">
                Examples Version: 2.0.0 • Updated December 2025
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="/docs" className="hover:text-gray-300 transition-colors">Guide</a>
              <a href="/docs/api-reference" className="hover:text-gray-300 transition-colors">API Reference</a>
              <span className="text-emerald-400">Examples</span>
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