'use client'

import { useState, useEffect, useRef } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Link from 'next/link'
import { 
  Terminal, 
  Database, 
  Globe, 
  Code2, 
  Zap, 
  Play, 
  Copy, 
  Check, 
  AlertCircle,
  ChevronRight,
  Sparkles,
  Shield,
  Rocket,
  Mail,
  Github,
  Twitter,
  MessageSquare,
  FileCode,
  Cpu,
  Server,
  CheckCircle,
  XCircle,
  Search,
  Video,
  Download,
  Users,
  Home,
  Hash,
  // Link,
  ArrowUp,
  Menu,
  X,
  Settings,
  Filter,
  Eye,
  Component,
  Linkedin,
  Link2
} from 'lucide-react'
import ApiReferencePage from './api-reference/page'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export default function DocsPage() {
  const [copied, setCopied] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('guide')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSection, setActiveSection] = useState('introduction')
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Refs for ALL sections
  const introductionRef = useRef<HTMLDivElement>(null)
  const magicVariablesRef = useRef<HTMLDivElement>(null)
  const mockDataRef = useRef<HTMLDivElement>(null)
  const environmentRef = useRef<HTMLDivElement>(null)
  const quickExampleRef = useRef<HTMLDivElement>(null)
  const crudExampleRef = useRef<HTMLDivElement>(null)
  const bestPracticesRef = useRef<HTMLDivElement>(null)
  const troubleshootingRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const sectionMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
      'introduction': introductionRef,
      'magic-variables': magicVariablesRef,
      'mock-data': mockDataRef,
      'environment': environmentRef,
      'quick-example': quickExampleRef,
      'crud-example': crudExampleRef,
      'best-practices': bestPracticesRef,
      'troubleshooting': troubleshootingRef,
      'contact': contactRef
    }

    const ref = sectionMap[sectionId]
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(sectionId)
      setShowMobileMenu(false)
    }
  }

  // Auto-highlight active section while scrolling
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'introduction', ref: introductionRef },
        { id: 'magic-variables', ref: magicVariablesRef },
        { id: 'mock-data', ref: mockDataRef },
        { id: 'environment', ref: environmentRef },
        { id: 'quick-example', ref: quickExampleRef },
        { id: 'crud-example', ref: crudExampleRef },
        { id: 'best-practices', ref: bestPracticesRef },
        { id: 'troubleshooting', ref: troubleshootingRef },
        { id: 'contact', ref: contactRef }
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
      description: "Ready to paste in your endpoint"
    })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // =========================
  // ALL YOUR ORIGINAL CODE EXAMPLES (KEEP THEM ALL)
  // =========================
  
  const quickStartCode = `
// GET /api/users - Returns all users from mock data
export async function GET() {
  // Access mockData.users - automatically available
  const users = mockData.users || [];
  
  // Access environment variables
  const apiVersion = environment.API_VERSION || '1.0';
  const debugMode = environment.DEBUG === 'true';
  
  // Filter data if needed
  const activeUsers = users.filter(user => user.isActive);
  
  // Return structured response
  return {
    success: true,
    version: apiVersion,
    data: activeUsers,
    count: activeUsers.length,
    timestamp: new Date().toISOString(),
    debug: debugMode
  };
}`

  const mockDataExample = `// GOOD: Access your mock data collections by their EXACT names
// Your collection name: "userProfiles" (created in UI)
const profiles = mockData.userProfiles;  // ✅ CORRECT

// GOOD: Different collection names work the same
const products = mockData.ecommerceProducts;
const orders = mockData.customerOrders;
const settings = mockData.appSettings;

// BAD: Don't use incorrect casing or names
const wrong = mockData.UserProfiles;  // ❌ Wrong - case sensitive
const wrong2 = mockData.user_profiles; // ❌ Wrong - use camelCase
const wrong3 = mockData.users;         // ❌ Wrong - unless you named it "users"`

  const environmentExample = `// GOOD: Access environment variables
const apiKey = environment.API_KEY;                // ✅ Your API key
const baseUrl = environment.BASE_URL;              // ✅ Your base URL
const databaseUrl = environment.DATABASE_URL;      // ✅ Database connection
const featureFlags = environment.FEATURE_FLAGS;    // ✅ Feature toggles
const maxRequests = environment.MAX_REQUESTS;      // ✅ Configuration

// Handle missing variables with defaults
const port = environment.PORT || 3000;            // ✅ Safe access
const nodeEnv = environment.NODE_ENV || 'development';

// Use in conditional logic
if (environment.DEBUG === 'true') {
  console.log('Debug mode enabled');
  console.log('Current environment:', nodeEnv);
}

// BAD: Don't assume variables exist
const bad = environment.undefinedVar;  // ❌ Could be undefined`

  const crudExample = `// COMPLETE CRUD EXAMPLE
// Access mock data and environment variables

// GET /api/items/:id
if (request.method === 'GET' && request.params.id) {
  const items = mockData.inventoryItems || [];
  const item = items.find(item => item.id === request.params.id);
  
  if (!item) {
    return {
      status: 404,
      error: 'Item not found',
      requestedId: request.params.id
    };
  }
  
  return {
    status: 200,
    data: item,
    metadata: {
      fetchedAt: new Date().toISOString(),
      environment: environment.NODE_ENV
    }
  };
}

// POST /api/items
if (request.method === 'POST') {
  const newItem = {
    id: \`item_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`,
    ...request.body,
    createdAt: new Date().toISOString(),
    createdBy: environment.APP_NAME || 'API Builder'
  };
  
  // Log creation in debug mode
  if (environment.LOG_CREATIONS === 'true') {
    console.log('New item created:', newItem.id);
  }
  
  return {
    status: 201,
    data: newItem,
    message: 'Item created successfully'
  };
}`

  const bestPractices = `// ============================
// BEST PRACTICES FOR MOCK DATA
// ============================

// 1. USE DESCRIPTIVE COLLECTION NAMES
const good = mockData.ecommerceCustomers;      // ✅ Clear and specific
const bad = mockData.data1;                    // ❌ Vague and unclear

// 2. USE CAMELCASE FOR COLLECTION NAMES
const good2 = mockData.userProfiles;           // ✅ userProfiles (created as "userProfiles" in UI)
const bad2 = mockData.UserProfiles;            // ❌ Case sensitive - must match exactly
const bad3 = mockData.user_profiles;           // ❌ Use camelCase, not snake_case

// 3. VALIDATE DATA BEFORE USE
const users = mockData.users || [];            // ✅ Always provide fallback
if (!Array.isArray(users)) {
  return { error: 'Invalid users data format' };
}

// 4. USE ENVIRONMENT VARIABLES FOR CONFIGURATION
const config = {
  apiUrl: environment.API_URL || 'https://api.default.com',
  timeout: parseInt(environment.TIMEOUT_MS) || 5000,
  maxRetries: parseInt(environment.MAX_RETRIES) || 3,
  features: {
    caching: environment.ENABLE_CACHE === 'true',
    analytics: environment.ENABLE_ANALYTICS === 'true'
  }
};

// 5. STRUCTURED ERROR RESPONSES
try {
  const data = mockData[request.query.collection];
  if (!data) {
    return {
      success: false,
      error: \`Collection "\${request.query.collection}" not found\`,
      availableCollections: Object.keys(mockData)
    };
  }
  
  return { success: true, data };
} catch (error) {
  return {
    success: false,
    error: 'Internal server error',
    debug: environment.DEBUG === 'true' ? error.message : undefined
  };
}`

  const troubleshootingCode = `// ==============================
// COMMON ERRORS & SOLUTIONS
// ==============================

// ERROR 1: "mockData is not defined"
// SOLUTION: You forgot to select mock data in the UI
// FIX: Go to endpoint editor → Mock Data dropdown → Select your collection

// ERROR 2: "environment is not defined"  
// SOLUTION: You forgot to select an environment
// FIX: Go to endpoint editor → Environment dropdown → Select environment

// ERROR 3: "mockData.users is undefined"
// CAUSE: Collection named "users" doesn't exist
// CHECK: View Mock Data section to see your actual collection names
const availableCollections = Object.keys(mockData); // Debug what's available
console.log('Available collections:', availableCollections);

// ERROR 4: "environment.API_KEY is undefined"
// CAUSE: Variable not set in selected environment
// FIX 1: Check your environment variables in Environments section
// FIX 2: Provide default value
const apiKey = environment.API_KEY || 'default-key-fallback';

// ERROR 5: Timeout or memory limit
// CAUSE: Code running too long or using too much memory
// FIX: Optimize your code - max 30 seconds, 128MB memory`

  // Sidebar navigation items
  const sidebarNav = [
    { id: 'introduction', label: 'Introduction', icon: Home, badge: null },
    { id: 'magic-variables', label: 'Magic Variables', icon: Zap, badge: 'Core' },
    { id: 'mock-data', label: 'Mock Data Guide', icon: Database, badge: 'Detailed' },
    { id: 'environment', label: 'Environment', icon: Globe, badge: 'Config' },
    { id: 'quick-example', label: 'Quick Example', icon: Rocket, badge: 'Start Here' },
    { id: 'crud-example', label: 'CRUD Example', icon: FileCode, badge: 'Complete' },
    { id: 'best-practices', label: 'Best Practices', icon: Shield, badge: 'Pro' },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: AlertCircle, badge: 'Fix' },
    { id: 'contact', label: 'Contact & Support', icon: MessageSquare, badge: null },
  ]

  // Header navigation items
  const headerNav = [
    { id: 'guide', label: 'Guide', icon: Home,   },
    { id: 'reference', label: 'API Reference', icon: FileCode, component: ApiReferencePage },
    { id: 'examples', label: 'Examples', icon: Code2 },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: AlertCircle },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header with Working Tabs */}
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
                  <Terminal className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">API Builder Docs</h1>
                  <p className="text-xs text-gray-400">v2.0.0</p>
                </div>
              </div>
            </div>
            
            {/* Desktop Navigation Tabs */}
            <div className="hidden lg:flex items-center gap-1">
              {headerNav.map((item) => (
                <Button 
                  key={item.id}
                  variant={activeTab === item.id ? 'secondary' : 'ghost'} 
                  size="sm"
                  onClick={() => {
                    setActiveTab(item.id)
                    // In a real app, these would navigate to different pages
                    // For now, just show toast
                    toast({
                      title: `Navigating to ${item.label}`,
                      description: "In a real app, this would load different documentation sections"
                    })
                  }}
                  className="gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
            
            {/* Search & GitHub */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search documentation..."
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
                  <Terminal className="h-5 w-5 text-white" />
                </div>
                <h2 className="font-semibold">Navigation</h2>
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
            
            <Separator className="my-6 bg-gray-800" />
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-400">Documentation Sections</h3>
              {headerNav.map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  className="w-full justify-start border-gray-800"
                  onClick={() => {
                    setActiveTab(item.id)
                    setShowMobileMenu(false)
                    toast({
                      title: `Loading ${item.label} section`,
                      description: "Different documentation pages would load here"
                    })
                  }}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - INDEPENDENTLY SCROLLABLE & CLICKABLE */}
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
                    Quick Links
                  </h3>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start border-gray-700 text-gray-300"
                      onClick={() => copyCode(quickStartCode, 'Quick Start Code')}
                    >
                      <Copy className="h-3.5 w-3.5 mr-2" />
                      Copy Quick Start
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start border-gray-700 text-gray-300"
                      onClick={() => scrollToSection('troubleshooting')}
                    >
                      <AlertCircle className="h-3.5 w-3.5 mr-2" />
                      Common Issues
                    </Button>
                  </div>
                </div>

                <Separator className="my-6 bg-gray-800" />

                {/* On This Page */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    Jump To
                  </h3>
                  <div className="space-y-1 pl-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-xs h-8 text-gray-400 hover:text-white"
                      onClick={() => scrollToSection('mock-data')}
                    >
                      <ChevronRight className="h-3 w-3 mr-2" />
                      Mock Data Guide
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-xs h-8 text-gray-400 hover:text-white"
                      onClick={() => scrollToSection('crud-example')}
                    >
                      <ChevronRight className="h-3 w-3 mr-2" />
                      CRUD Example
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-xs h-8 text-gray-400 hover:text-white"
                      onClick={() => scrollToSection('best-practices')}
                    >
                      <ChevronRight className="h-3 w-3 mr-2" />
                      Best Practices
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Main Content Area - KEEPING ALL YOUR ORIGINAL CONTENT */}
          <div className="lg:col-span-3 space-y-12">
            {/* Introduction Section */}
            <div id="introduction" ref={introductionRef} className="scroll-mt-24">
              <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
                <div className="flex items-start justify-between">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400 mb-4">
                      <Rocket className="h-3 w-3" />
                      Getting Started
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">
                      Build APIs in minutes with zero setup
                    </h1>
                    <p className="text-lg text-gray-400 mb-6">
                      Write JavaScript endpoints that automatically access your mock data and environment variables.
                      No imports, no configuration—just start coding.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => scrollToSection('magic-variables')}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Building
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-gray-700"
                        onClick={() => scrollToSection('quick-example')}
                      >
                        <FileCode className="h-4 w-4 mr-2" />
                        View Examples
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="text-gray-400"
                        onClick={() => scrollToSection('troubleshooting')}
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Common Issues
                      </Button>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-600/20 to-blue-600/20 blur-xl"></div>
                      <div className="relative rounded-xl border border-gray-800 bg-gray-900 p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                          <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                        </div>
                        <SyntaxHighlighter
                          language="javascript"
                          style={atomDark}
                          customStyle={{
                            background: 'transparent',
                            fontSize: '13px',
                            margin: 0,
                            padding: 0
                          }}
                        >
                          {`// Your endpoint code
const users = mockData.users;
const apiKey = environment.API_KEY;

return {
  data: users,
  config: { apiKey }
};`}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Magic Variables Section */}
            <div id="magic-variables" ref={magicVariablesRef} className="scroll-mt-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Zap className="h-6 w-6 text-emerald-400" />
                  The Two Magic Variables
                </h2>
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                  No Setup Required
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Environment Card */}
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <Globe className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <code className="text-lg font-mono">environment</code>
                          <Badge variant="secondary" className="text-xs">Global</Badge>
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Access your environment variables
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 text-sm text-gray-300">How to access:</h4>
                        <SyntaxHighlighter
                          language="javascript"
                          style={atomDark}
                          customStyle={{
                            background: '#0f172a',
                            fontSize: '13px',
                            borderRadius: '6px'
                          }}
                        >
                          {environmentExample}
                        </SyntaxHighlighter>
                      </div>
                      
                      <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Settings className="h-4 w-4 text-blue-400" />
                          <h5 className="font-medium text-sm">UI Configuration</h5>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-400">
                          <li className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                            <span>Go to <strong>Environments</strong> section</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                            <span>Create environment (Development, Production)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                            <span>Add key-value pairs as variables</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                            <span>Select environment in endpoint editor dropdown</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Mock Data Card */}
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <Database className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <code className="text-lg font-mono">mockData</code>
                          <Badge variant="secondary" className="text-xs">Global</Badge>
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Access your mock data collections
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 text-sm text-gray-300">How to access:</h4>
                        <SyntaxHighlighter
                          language="javascript"
                          style={atomDark}
                          customStyle={{
                            background: '#0f172a',
                            fontSize: '13px',
                            borderRadius: '6px'
                          }}
                        >
                          {mockDataExample}
                        </SyntaxHighlighter>
                      </div>
                      
                      <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Filter className="h-4 w-4 text-purple-400" />
                          <h5 className="font-medium text-sm">Naming Convention</h5>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                              <span className="text-gray-300">Use camelCase</span>
                            </div>
                            <code className="text-xs bg-gray-800 px-2 py-1 rounded">userProfiles</code>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-red-400" />
                              <span className="text-gray-300">Don't use PascalCase</span>
                            </div>
                            <code className="text-xs bg-gray-800 px-2 py-1 rounded">UserProfiles</code>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-red-400" />
                              <span className="text-gray-300">Don't use snake_case</span>
                            </div>
                            <code className="text-xs bg-gray-800 px-2 py-1 rounded">user_profiles</code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Mock Data Deep Dive */}
            <div id="mock-data" ref={mockDataRef} className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Database className="h-6 w-6 text-purple-400" />
                Mock Data: Do's and Don'ts
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="border-emerald-500/20 bg-emerald-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle className="h-5 w-5" />
                      DO's - Correct Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2"></div>
                        <div>
                          <p className="font-medium">Use camelCase names</p>
                          <p className="text-sm text-gray-400">
                            Name collections as <code>userProfiles</code>, <code>productCatalog</code>, <code>orderHistory</code>
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2"></div>
                        <div>
                          <p className="font-medium">Check data existence</p>
                          <p className="text-sm text-gray-400">
                            Always use <code>mockData.collection || []</code> to prevent errors
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2"></div>
                        <div>
                          <p className="font-medium">Use descriptive names</p>
                          <p className="text-sm text-gray-400">
                            <code>ecommerceProducts</code> is better than <code>products</code>
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-red-500/20 bg-red-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-400">
                      <XCircle className="h-5 w-5" />
                      DON'Ts - Common Mistakes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500 mt-2"></div>
                        <div>
                          <p className="font-medium">Incorrect casing</p>
                          <p className="text-sm text-gray-400">
                            <code>mockData.UserProfiles</code> won't work if created as <code>userProfiles</code>
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500 mt-2"></div>
                        <div>
                          <p className="font-medium">Assuming data exists</p>
                          <p className="text-sm text-gray-400">
                            Never use <code>mockData.users.length</code> without checking <code>mockData.users</code> first
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500 mt-2"></div>
                        <div>
                          <p className="font-medium">Vague names</p>
                          <p className="text-sm text-gray-400">
                            <code>data1</code>, <code>collection2</code> are impossible to remember
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Working Example */}
            <div id="quick-example" ref={quickExampleRef} className="scroll-mt-24">
              <Card className="border-gray-800 bg-gray-900/50 overflow-hidden">
                <CardHeader className="border-b border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-3">
                        <FileCode className="h-5 w-5 text-emerald-400" />
                        Complete Working Example
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Copy and paste this endpoint to get started immediately
                      </CardDescription>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                      onClick={() => copyCode(quickStartCode, 'Quick Start Example')}
                    >
                      {copied === 'Quick Start Example' ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {copied === 'Quick Start Example' ? 'Copied!' : 'Copy Code'}
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
                    {quickStartCode}
                  </SyntaxHighlighter>
                </CardContent>
                <CardFooter className="border-t border-gray-800 bg-gray-900/50">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>This endpoint will work immediately after:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <span>Creating "users" mock data collection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span>Setting API_VERSION environment variable</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* CRUD Example */}
            <div id="crud-example" ref={crudExampleRef} className="scroll-mt-24">
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-3">
                        <Cpu className="h-5 w-5 text-blue-400" />
                        Complete CRUD API Example
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Full REST API with mock data and environment variables
                      </CardDescription>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                      onClick={() => copyCode(crudExample, 'CRUD Example')}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Full Example
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
                    {crudExample}
                  </SyntaxHighlighter>
                </CardContent>
              </Card>
            </div>

            {/* Best Practices */}
            <div id="best-practices" ref={bestPracticesRef} className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Shield className="h-6 w-6 text-amber-400" />
                Production Best Practices
              </h2>
              
              <Card className="border-gray-800 bg-gray-900/50">
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
                    {bestPractices}
                  </SyntaxHighlighter>
                </CardContent>
              </Card>
            </div>

            {/* Troubleshooting */}
            <div id="troubleshooting" ref={troubleshootingRef} className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-400" />
                Troubleshooting Guide
              </h2>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-gray-800">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <span>Error: "mockData is not defined"</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-6 space-y-4">
                      <p className="text-gray-400">
                        This error occurs when you haven't selected mock data in the UI.
                      </p>
                      <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                        <h4 className="font-medium mb-2 text-sm text-gray-300">Solution:</h4>
                        <ol className="space-y-2 text-sm text-gray-400 pl-5 list-decimal">
                          <li>Go to the <strong>Endpoint Editor</strong></li>
                          <li>Find the <strong>"Mock Data" dropdown</strong> (usually below the code editor)</li>
                          <li>Select your mock data collection</li>
                          <li>Click <strong>"Run"</strong> to test again</li>
                        </ol>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-gray-800">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <span>Error: "environment is not defined"</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-6 space-y-4">
                      <p className="text-gray-400">
                        This error occurs when you haven't selected an environment.
                      </p>
                      <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                        <h4 className="font-medium mb-2 text-sm text-gray-300">Solution:</h4>
                        <ol className="space-y-2 text-sm text-gray-400 pl-5 list-decimal">
                          <li>Go to the <strong>Endpoint Editor</strong></li>
                          <li>Find the <strong>"Environment" dropdown</strong></li>
                          <li>Select an environment (Development, Production, etc.)</li>
                          <li>Make sure the environment has your variables set</li>
                        </ol>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Card className="mt-6 border-gray-800 bg-gray-900/50">
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
                    {troubleshootingCode}
                  </SyntaxHighlighter>
                </CardContent>
              </Card>
            </div>

            {/* Contact Section */}
            <div id="contact" ref={contactRef} className="scroll-mt-24">
              <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-black">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <MessageSquare className="h-6 w-6 text-emerald-400" />
                    Need Help?
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Get support from our team and community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                          <Mail className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Email Support</h4>
                          <p className="text-sm text-gray-400">Get help directly</p>
                        </div>
                      </div>
                      <code className="block text-sm bg-gray-900 border border-gray-800 rounded px-3 py-2">
                        tijanibwebdev@gmail.com
                      </code>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-800 border border-gray-700">
                          <Github className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold">GitHub</h4>
                          <p className="text-sm text-gray-400">Issues & discussions</p>
                        </div>
                      </div>
                      <code className="block text-sm bg-gray-900 border border-gray-800 rounded px-3 py-2">
                        https://github.com/tijani-web
                      </code>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          <Linkedin className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Linkedln</h4>
                          <p className="text-sm text-gray-400">Updates & announcements</p>
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
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <Terminal className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">API Builder</p>
                  <p className="text-xs text-gray-500">Build APIs in minutes</p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-6 bg-gray-800" />
              <div className="text-sm text-gray-500">
                Version 2.0.0 • Updated December 2025
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-gray-300 transition-colors">Terms</a>
              <a href="/status" className="hover:text-gray-300 transition-colors">Status</a>
              <a href="/security" className="hover:text-gray-300 transition-colors">Security</a>
              <a href="#" className="hover:text-gray-300 transition-colors">© 2025</a>
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