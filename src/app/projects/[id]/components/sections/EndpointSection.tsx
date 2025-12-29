'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { api } from '@/lib/api'
import { Endpoint, CreateEndpointData, UpdateEndpointData, HttpMethod, PaginatedResponse, ExecutionResult, MockDataCollection, Environment } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Play, 
  Copy, 
  Trash2,
  Zap,
  Sparkles,
  Code2,
  Save,
  History,
  TestTube,
  FileText,
  ArrowDown,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  Globe,
  Eye,
  EyeOff,
  Terminal,
  BookOpen,
  FileCode,
  Menu,
  X,
  Download,
  Upload,
  ArrowRight,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  FileJson,
  Shield,
  AlertTriangle
} from 'lucide-react'
import { CodeEditor } from '../Editor/CodeEditor'
import { TestPanel } from '../Panel/TestPanel'
import { DocsPanel } from '../Panel/DocsPanel'
import { ExecutionLogs } from '../logs/ExecutionLogs'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface EndpointSectionProps {
  projectId: string
  initialEndpointId?: string
  initialTab?: 'endpoints' | 'test' | 'docs' | 'logs'
  onEndpointSelect?: (endpoint: Endpoint) => void
}

// Persistent state interface
interface EndpointLocalState {
  id: string
  code: string
  executionResult?: ExecutionResult | null
  lastTestedAt?: string
}

//  CODE TEMPLATES - PROFESSIONAL & EASY TO USE WAZAAAAAAAAAA
const CODE_TEMPLATES = {
  // ============================================
  // 🚀 GET STARTED
  // ============================================
  default: `// 🚀 Welcome to your endpoint!
// Access mock data and environment variables

// 📌 TODO: Change 'users' to your actual collection name
const collectionName = 'users';
const data = mockData[collectionName] || [];

// 🌍 Access environment variables (optional)
const apiKey = environment.API_KEY;
const apiUrl = environment.API_URL || 'https://api.example.com';

return Response.json({
  success: true,
  message: "Endpoint is ready!",
  timestamp: new Date().toISOString(),
  data: {
    items: data.slice(0, 5), // Show first 5 items
    total: data.length,
    config: {
      apiKeyConfigured: !!apiKey,
      apiUrl: apiUrl
    },
    // Show what's available in your project
    availableCollections: Object.keys(mockData || {}),
    availableEnvVars: Object.keys(environment || {})
  }
});`,

  // ============================================
  // 📋 GET ALL ITEMS
  // ============================================
  getCollection: `// 📋 GET all items from a collection
// 
// USAGE: Call your endpoint with ?page=2&limit=20
//
// 📌 TODO: Change 'users' to your actual collection name
const collectionName = request.query.collection || 'users';
const data = mockData[collectionName] || [];

// Optional pagination
const page = parseInt(request.query.page) || 1;
const limit = parseInt(request.query.limit) || 10;
const startIndex = (page - 1) * limit;
const endIndex = page * limit;

const paginatedData = data.slice(startIndex, endIndex);

return Response.json({
  success: true,
  message: \`Found \${data.length} items in \${collectionName}\`,
  timestamp: new Date().toISOString(),
  data: paginatedData,
  pagination: {
    page,
    limit,
    total: data.length,
    pages: Math.ceil(data.length / limit),
    hasNext: endIndex < data.length,
    hasPrev: page > 1
  }
});`,

  // ============================================
  // 🔍 GET SINGLE ITEM BY ID
  // ============================================
  getById: `// 🔍 GET single item by ID
// 
// USAGE: Call your endpoint with /{id} in the URL
// Example: If endpoint is /api/items/:id, call /api/items/123
//
// 📌 TODO: Change 'users' to your actual collection name
const collectionName = 'users';
const itemId = request.params.id; // Gets the ID from URL
const data = mockData[collectionName] || [];

// Find item by ID (exact match)
const item = data.find(item => item.id === itemId);

if (!item) {
  // Try alternative ID fields
  const alternativeProduct = data.find(item => 
    item._id === itemId || 
    item.ID === itemId
  );
  
  if (alternativeProduct) {
    return Response.json({
      success: true,
      message: \`Item "\${itemId}" found\`,
      timestamp: new Date().toISOString(),
      data: alternativeProduct
    });
  }
  
  // Still not found
  return Response.error(
    \`Item with ID "\${itemId}" not found\`,
    404
  );
}

return Response.json({
  success: true,
  message: "Item found successfully",
  timestamp: new Date().toISOString(),
  data: item
});`,

  // ============================================
  // ➕ CREATE NEW ITEM (POST)
  // ============================================
  createItem: `// ➕ POST create new item
//
// USAGE: POST to your endpoint with JSON body
// Body: JSON object matching your data structure
// Example: { "name": "New Item", "price": 50 }
//
// 📌 TODO: Change 'productCollection' to your actual collection name
const COLLECTION_NAME = 'productCollection';
const data = mockData[COLLECTION_NAME] || [];

if (!request.body) {
  return Response.error("Request body required", 400);
}

// Generate ID (auto-increment like p001, p002, p003)
let itemId = request.body.id;
if (!itemId) {
  const existingIds = data.map(item => item.id).filter(id => 
    id && typeof id === 'string' && id.startsWith('p')
  );
  
  if (existingIds.length > 0) {
    const lastNum = Math.max(...existingIds.map(id => {
      const num = id.replace('p', '');
      return parseInt(num) || 0;
    }));
    itemId = \`p\${String(lastNum + 1).padStart(3, '0')}\`;
  } else {
    itemId = 'p001';
  }
}

// Create item with timestamps
const newItem = {
  id: itemId,
  ...request.body,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

data.push(newItem);

// Save operation
const saveOperation = {
  type: 'save_mock_data',
  collectionName: COLLECTION_NAME,
  data: data,
  executionId: \`exec_\${Date.now()}\`,
  timestamp: new Date().toISOString()
};

return Response.json({
  success: true,
  message: \`Created \${itemId}\`,
  data: newItem,
  _saveOperation: saveOperation
}, 201);`,

  // ============================================
  // ✏️ UPDATE ITEM BY ID (PUT/PATCH)
  // ============================================
  updateItem: `// ✏️ PUT/PATCH update existing item
//
// USAGE: PUT to your endpoint with /{id} and JSON body
// Body: JSON with fields to update
// Example: { "name": "Updated Name", "price": 149 }
//
// 📌 TODO: Change 'productCollection' to your actual collection name
const COLLECTION_NAME = 'productCollection';
const data = mockData[COLLECTION_NAME] || [];
const itemId = request.params.id; // Gets ID from URL

// Find item
const itemIndex = data.findIndex(item => item.id === itemId);

if (itemIndex === -1) {
  return Response.error(\`Item with ID "\${itemId}" not found\`, 404);
}

// Validate update data
if (!request.body || Object.keys(request.body).length === 0) {
  return Response.error("Please provide update data", 400);
}

// Preserve original
const originalItem = data[itemIndex];

// Update item (keep ID)
const updatedItem = {
  ...originalItem,
  ...request.body,
  id: itemId, // Keep original ID
  updatedAt: new Date().toISOString()
};

data[itemIndex] = updatedItem;

// Save operation
const saveOperation = {
  type: 'save_mock_data',
  collectionName: COLLECTION_NAME,
  data: data,
  executionId: \`exec_\${Date.now()}\`,
  timestamp: new Date().toISOString()
};

return Response.json({
  success: true,
  message: \`Item "\${itemId}" updated\`,
  data: updatedItem,
  changes: {
    original: originalItem,
    updated: updatedItem
  },
  _saveOperation: saveOperation
});`,

  // ============================================
  // ❌ DELETE ITEM BY ID
  // ============================================
  deleteItem: `// ❌ DELETE remove item
//
// USAGE: DELETE to your endpoint with /{id} in URL
//
// 📌 TODO: Change 'productCollection' to your actual collection name
const COLLECTION_NAME = 'productCollection';
const data = mockData[COLLECTION_NAME] || [];
const itemId = request.params.id; // Gets ID from URL

// Find item
const itemIndex = data.findIndex(item => item.id === itemId);

if (itemIndex === -1) {
  return Response.error(\`Item with ID "\${itemId}" not found\`, 404);
}

// Remove item
const deletedItem = data[itemIndex];
data.splice(itemIndex, 1);

// Save operation
const saveOperation = {
  type: 'save_mock_data',
  collectionName: COLLECTION_NAME,
  data: data,
  executionId: \`exec_\${Date.now()}\`,
  timestamp: new Date().toISOString()
};

return Response.json({
  success: true,
  message: \`Item "\${itemId}" deleted\`,
  data: deletedItem,
  _saveOperation: saveOperation
});`,

  // ============================================
  // 🔍 FILTER & SORT
  // ============================================
  filterAndSort: `// 🔍 Filter and sort collection data
//
// USAGE: Add query parameters to your GET request
// Examples: 
// ?q=search+term (search all fields)
// ?filterBy=status&filterValue=active (filter by field)
// ?sortBy=price&sortOrder=desc (sort results)
//
// 📌 TODO: Change 'users' to your actual collection name
const collectionName = 'users';
const data = mockData[collectionName] || [];

// Get query parameters
const filterBy = request.query.filterBy;
const filterValue = request.query.filterValue;
const sortBy = request.query.sortBy || 'createdAt';
const sortOrder = request.query.sortOrder || 'desc';
const searchQuery = request.query.q;

let filteredData = [...data];

// Search all fields
if (searchQuery) {
  filteredData = filteredData.filter(item =>
    JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
  );
}

// Filter by specific field
if (filterBy && filterValue !== undefined) {
  filteredData = filteredData.filter(item => 
    String(item[filterBy]) === String(filterValue)
  );
}

// Sort
filteredData.sort((a, b) => {
  const aVal = a[sortBy];
  const bVal = b[sortBy];
  
  if (typeof aVal === 'string' && typeof bVal === 'string') {
    return sortOrder === 'desc' 
      ? bVal.localeCompare(aVal)
      : aVal.localeCompare(bVal);
  }
  
  return sortOrder === 'desc' 
    ? new Date(bVal).getTime() - new Date(aVal).getTime()
    : new Date(aVal).getTime() - new Date(bVal).getTime();
});

return Response.json({
  success: true,
  message: \`Found \${filteredData.length} of \${data.length} items\`,
  timestamp: new Date().toISOString(),
  data: filteredData,
  filters: { filterBy, filterValue, sortBy, sortOrder, searchQuery }
});`,

  // ============================================
  // 🌍 USE ENVIRONMENT VARIABLES
  // ============================================
  useEnvironment: `// 🌍 Use environment variables
//
// USAGE: Call endpoint to check environment variables
//
// 📌 TODO: Update variable names to match your environment
const requiredEnvVars = {
  API_KEY: environment.API_KEY,
  API_URL: environment.API_URL,
  NODE_ENV: environment.NODE_ENV || 'development'
};

// Check for required variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  return Response.error(
    \`Missing environment variables: \${missingVars.join(', ')}\`,
    500
  );
}

return Response.json({
  success: true,
  message: "Environment variables loaded",
  timestamp: new Date().toISOString(),
  config: {
    baseUrl: requiredEnvVars.API_URL,
    environment: requiredEnvVars.NODE_ENV
  },
  availableVariables: Object.keys(environment || {})
});`,

  // ============================================
  // 🎯 COMBINED MOCK & ENVIRONMENT
  // ============================================
  mockAndEnv: `// 🎯 Combined mock data and environment usage
//
// USAGE: Environment variables control data behavior
//
// 📌 TODO: Configure for your use case
const collectionName = 'users'; // Your collection
const requiredEnvVar = 'API_KEY'; // Required env var

// Load data
const data = mockData[collectionName] || [];
const envValue = environment[requiredEnvVar];

// Validate
if (!envValue) {
  return Response.error(\`Missing \${requiredEnvVar}\`, 500);
}

// Use environment to modify behavior
const maxItems = parseInt(environment.MAX_ITEMS) || 10;
const sortOrder = environment.SORT_ORDER || 'asc';

let resultData = [...data];

// Apply limit
resultData = resultData.slice(0, maxItems);

// Apply sorting
resultData.sort((a, b) => {
  if (sortOrder === 'asc') {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  } else {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }
});

return Response.json({
  success: true,
  message: \`Showing \${resultData.length} of \${data.length} items\`,
  timestamp: new Date().toISOString(),
  data: resultData,
  config: {
    collection: collectionName,
    maxItems,
    sortOrder,
    requiredEnvVar: "configured"
  }
});`,

  // ============================================
  // 💾 SAVE MOCK DATA
  // ============================================
  saveMockData: `// 💾 Save mock data changes to database
//
// USAGE: Changes made to mockData will be saved
//
// 📌 TODO: Change 'users' to your collection name
const collectionName = 'users';
const data = mockData[collectionName] || [];

// Example modification
const newItem = {
  id: 'item_' + Date.now(),
  name: 'New Item',
  createdAt: new Date().toISOString()
};

data.push(newItem);

// Save operation
try {
  const saveResult = await saveMockDataToDatabase(data, collectionName);
  
  if (saveResult.success) {
    return Response.json({
      success: true,
      message: \`Saved \${data.length} items\`,
      timestamp: new Date().toISOString(),
      data: data,
      saveResult: saveResult
    });
  } else {
    return Response.error(\`Save failed: \${saveResult.error}\`, 500);
  }
} catch (error) {
  return Response.error(\`Error: \${error.message}\`, 500);
}`
};

export function EndpointSection({ 
  projectId, 
  initialEndpointId, 
  initialTab,
  onEndpointSelect 
}: EndpointSectionProps) {
  const { toast } = useToast()
  const [endpoints, setEndpoints] = useState<Endpoint[]>([])
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [projectData, setProjectData] = useState<any>(null)
  const [totalEndpoints, setTotalEndpoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null)
  
  // RESPONSIVE STATE
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  
  // MOCK DATA AND ENVIRONMENTS
  const [mockDataCollections, setMockDataCollections] = useState<MockDataCollection[]>([])
  const [environments, setEnvironments] = useState<Environment[]>([])
  const [selectedMockData, setSelectedMockData] = useState<MockDataCollection | null>(null)
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment | null>(null)

  // PERSISTENT LOCAL STATES
  const [endpointLocalStates, setEndpointLocalStates] = useState<Record<string, EndpointLocalState>>({})
  const [activeTab, setActiveTab] = useState<'endpoints' | 'test' | 'docs' | 'logs'>(
    initialTab || 'endpoints'
  )

  // UI STATE
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [endpointToDelete, setEndpointToDelete] = useState<string | null>(null)
  const [executing, setExecuting] = useState(false)
  const [showScrollHint, setShowScrollHint] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  
  const outputRef = useRef<HTMLDivElement>(null)

  // RESPONSIVE EFFECT
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      
      if (width >= 768 && showMobileMenu) {
        setShowMobileMenu(false)
      }
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [showMobileMenu])

  const loadProjectData = async () => {
  try {
    const project = await api.getProject(projectId)
    setProjectData(project)
    
    // Calculate total endpoints 
    const endpointCount = project?._count?.endpoints || 
                         (project as any)?.endpointCount || 
                         endpoints.length
    setTotalEndpoints(endpointCount)
    
  } catch (error) {
    console.error('Failed to load project data:', error)
    setProjectData(null)
    setTotalEndpoints(endpoints.length)
  }
}
  // LOAD ENDPOINTS WITH MOCK DATA & ENVIRONMENTS
  const loadEndpoints = useCallback(async () => {
    try {
      console.log(' Loading endpoints with mock data...')
      const response = await api.getEndpoints(projectId) as PaginatedResponse<Endpoint>
      const endpointsList = response.data || []
      
      const sortedEndpoints = [...endpointsList].sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      )
      
      setEndpoints(sortedEndpoints)

      await loadProjectData()
      
      // Load mock data collections
      try {
        const mockData = await api.getMockDataCollections(projectId)
        setMockDataCollections(mockData)
        if (mockData.length > 0) {
          setSelectedMockData(mockData[0])
          // console.log(`📊 Loaded ${mockData.length} mock data collections`)
        }
      } catch (error) {
        console.error('Failed to load mock data:', error)
      }
      
      // Load environments
      try {
        const envs = await api.getEnvironments(projectId)
        setEnvironments(envs)
        if (envs.length > 0) {
          const defaultEnv = envs.find(e => e.isDefault) || envs[0]
          setSelectedEnvironment(defaultEnv)
          // console.log(`🌍 Loaded ${envs.length} environments`)
        }
      } catch (error) {
        console.error('Failed to load environments:', error)
      }
      
      // Load saved states
      const savedStates = localStorage.getItem(`endpoint_states_${projectId}`)
      if (savedStates) {
        setEndpointLocalStates(JSON.parse(savedStates))
      }
      
      // Select endpoint
      let endpointToSelect = null
      if (initialEndpointId) {
        endpointToSelect = endpointsList.find(ep => ep.id === initialEndpointId)
      }
      
      if (!endpointToSelect && sortedEndpoints.length > 0) {
        endpointToSelect = sortedEndpoints[0]
      }
      
      if (endpointToSelect) {
        const savedState = savedStates ? JSON.parse(savedStates)[endpointToSelect.id] : null
        
        const endpointWithSavedCode = {
          ...endpointToSelect,
          code: savedState?.code || endpointToSelect.code
        }
        
        setSelectedEndpoint(endpointWithSavedCode)
        onEndpointSelect?.(endpointWithSavedCode)
      }
      
    } catch (error: any) {
      console.error('Failed to load endpoints:', error)
      toast({
        title: 'Error',
        description: 'Failed to load endpoints',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [projectId, initialEndpointId, toast, onEndpointSelect])

  useEffect(() => {
  if (!projectData) {
    setTotalEndpoints(endpoints.length)
  } else {
    const endpointCount = projectData?._count?.endpoints || 
                         (projectData as any)?.endpointCount || 
                         endpoints.length
    setTotalEndpoints(endpointCount)
  }
}, [endpoints, projectData])
  
  useEffect(() => {
    loadEndpoints()
  }, [loadEndpoints])
  
  // SAVE LOCAL STATE
  const saveLocalState = useCallback((endpointId: string, updates: Partial<EndpointLocalState>) => {
    setEndpointLocalStates(prev => {
      const newState = {
        ...prev,
        [endpointId]: {
          ...(prev[endpointId] || {}),
          ...updates,
          id: endpointId
        }
      }
      
      localStorage.setItem(`endpoint_states_${projectId}`, JSON.stringify(newState))
      return newState
    })
  }, [projectId])
  
  const getCurrentLocalState = useCallback((): EndpointLocalState => {
    if (!selectedEndpoint) {
      return { id: '', code: '' }
    }
    
    return endpointLocalStates[selectedEndpoint.id] || { 
      id: selectedEndpoint.id, 
      code: selectedEndpoint.code 
    }
  }, [selectedEndpoint, endpointLocalStates])
  
  // SELECT ENDPOINT
  const handleSelectEndpoint = useCallback((endpoint: Endpoint) => {
    if (selectedEndpoint && selectedEndpoint.id !== endpoint.id) {
      const currentState = getCurrentLocalState()
      saveLocalState(selectedEndpoint.id, {
        code: currentState.code
      })
    }
    
    const savedState = endpointLocalStates[endpoint.id]
    
    const endpointWithSavedCode = {
      ...endpoint,
      code: savedState?.code || endpoint.code
    }
    
    setSelectedEndpoint(endpointWithSavedCode)
    onEndpointSelect?.(endpointWithSavedCode)
    setActiveTab('endpoints')
    
    if (isMobile) {
      setShowMobileMenu(false)
    }
  }, [selectedEndpoint, endpointLocalStates, onEndpointSelect, saveLocalState, getCurrentLocalState, isMobile])
  
  // CREATE ENDPOINT
  const handleCreateEndpoint = async (data: CreateEndpointData) => {
    try {
      const endpointData = {
        name: data.name || 'New Endpoint',
        path: data.path?.startsWith('/') ? data.path : `/${data.path}`,
        method: data.method || 'GET',
        description: data.description || '',
        code: data.code || CODE_TEMPLATES.default,
        timeout: 5000,
        memoryLimit: 128,
        isPublic: false,
        isActive: true
      }
      
      const endpoint = await api.createEndpoint(projectId, endpointData)
      const actualEndpoint = (endpoint as any)?.data || endpoint;
      
      setEndpoints(prev => [actualEndpoint, ...prev])
      
      saveLocalState(actualEndpoint.id, {
        code: actualEndpoint.code,
        executionResult: null
      })
      
      handleSelectEndpoint(actualEndpoint)
      
      toast({
        title: 'Success',
        description: 'Endpoint created successfully'
      })
    } catch (error: any) {
      console.error('❌ Failed to create endpoint:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to create endpoint',
        variant: 'destructive'
      })
    }
  }
  
  // UPDATE ENDPOINT
  const handleUpdateEndpoint = async (endpointId: string, data: UpdateEndpointData) => {
    try {
      const updated = await api.updateEndpoint(projectId, endpointId, data)
      setEndpoints(prev => prev.map(ep => ep.id === endpointId ? updated : ep))
      if (selectedEndpoint?.id === endpointId) {
        setSelectedEndpoint(updated)
        onEndpointSelect?.(updated)
      }
      
      if (data.code !== undefined) {
        saveLocalState(endpointId, { code: data.code })
      }
      
      toast({
        title: 'Success',
        description: 'Endpoint updated successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update endpoint',
        variant: 'destructive'
      })
    }
  }
  
  // DELETE ENDPOINT
  const handleDeleteEndpoint = async () => {
    if (!endpointToDelete) return
    
    try {
      await api.deleteEndpoint(projectId, endpointToDelete)
      setEndpoints(prev => prev.filter(ep => ep.id !== endpointToDelete))
      
      setEndpointLocalStates(prev => {
        const newState = { ...prev }
        delete newState[endpointToDelete]
        localStorage.setItem(`endpoint_states_${projectId}`, JSON.stringify(newState))
        return newState
      })
      
      if (selectedEndpoint?.id === endpointToDelete) {
        if (endpoints.length > 1) {
          const nextEndpoint = endpoints.find(ep => ep.id !== endpointToDelete)
          if (nextEndpoint) {
            handleSelectEndpoint(nextEndpoint)
          } else {
            setSelectedEndpoint(null)
          }
        } else {
          setSelectedEndpoint(null)
        }
      }
      
      toast({
        title: 'Success',
        description: 'Endpoint deleted successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete endpoint',
        variant: 'destructive'
      })
    } finally {
      setShowDeleteDialog(false)
      setEndpointToDelete(null)
    }
  }
  
  // DUPLICATE ENDPOINT
  const handleDuplicateEndpoint = async (endpoint: Endpoint) => {
    try {
      const duplicated = await api.duplicateEndpoint(projectId, endpoint.id)
      
      setEndpoints(prev => [duplicated, ...prev])
      
      const originalState = endpointLocalStates[endpoint.id]
      if (originalState) {
        saveLocalState(duplicated.id, {
          code: originalState.code || duplicated.code,
          executionResult: null
        })
      }
      
      handleSelectEndpoint(duplicated)
      
      toast({
        title: 'Success',
        description: 'Endpoint duplicated successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to duplicate endpoint',
        variant: 'destructive'
      })
    }
  }
  
  //  EXECUTE ENDPOINT WITH MOCK DATA & ENVIRONMENT
  const handleExecuteEndpoint = async (endpointId: string) => {
    if (!selectedEndpoint) return
    
    // Validate selections
    if (!selectedMockData) {
      toast({
        title: 'Warning',
        description: 'Please select a mock data collection first',
        variant: 'destructive'
      })
      return
    }
    
    if (!selectedEnvironment) {
      toast({
        title: 'Warning',
        description: 'Please select an environment first',
        variant: 'destructive'
      })
      return
    }
    
    setExecuting(true)
    console.log('🚀 Executing endpoint with:', {
      mockDataId: selectedMockData.id,
      environmentId: selectedEnvironment.id,
      collectionName: selectedMockData.name
    })
    
    try {
      const result = await api.executeEndpoint(projectId, endpointId, {
        body: {},
        query: {},
        params: {},
        headers: {},
        mockDataCollectionId: selectedMockData.id, 
        environmentId: selectedEnvironment.id       
      })
      
      console.log('✅ Execution result:', result)
      
      saveLocalState(endpointId, {
        executionResult: result,
        lastTestedAt: new Date().toISOString()
      })
      
      toast({
        title: result.success ? 'Success' : 'Error',
        description: result.success 
          ? `Executed in ${result.executionTime}ms` 
          : result.error || 'Execution failed',
        variant: result.success ? 'default' : 'destructive'
      })
      
    } catch (error: any) {
      console.error('❌ Execution failed:', error)
      const errorResult = {
        success: false,
        error: error.message || 'Failed to execute endpoint',
        logs: [],
        executionTime: 0,
        timestamp: new Date().toISOString()
      }
      
      saveLocalState(endpointId, {
        executionResult: errorResult,
        lastTestedAt: new Date().toISOString()
      })
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to execute endpoint',
        variant: 'destructive'
      })
    } finally {
      setExecuting(false)
    }
  }
  
  const getCurrentExecutionResult = useCallback(() => {
    const localState = getCurrentLocalState()
    return localState?.executionResult || null
  }, [getCurrentLocalState])
  
  // APPLY TEMPLATE WITH COLLECTION NAME
  const applyTemplate = (templateKey: keyof typeof CODE_TEMPLATES) => {
    if (!selectedEndpoint) return
    
    let templateCode = CODE_TEMPLATES[templateKey]
    
    // If we have a selected mock data collection, pre-fill collection name
    if (selectedMockData) {
      const collectionName = selectedMockData.name
      templateCode = templateCode.replace(
        /const collectionName = ['"`].*?['"`]/,
        `const collectionName = '${collectionName}'`
      )
    }
    
    const updatedEndpoint = {
      ...selectedEndpoint,
      code: templateCode
    }
    
    setSelectedEndpoint(updatedEndpoint)
    saveLocalState(selectedEndpoint.id, { code: templateCode })
    
    toast({
      title: 'Template Applied',
      description: `Applied ${templateKey} template${selectedMockData ? ` with "${selectedMockData.name}" collection` : ''}`
    })
  }
  
  // SAVE MOCK DATA TO DATABASE
const handleSaveMockData = async () => {
  if (!selectedMockData || !selectedEndpoint) return
  
  try {
    console.log('💾 Saving mock data:', {
      collectionId: selectedMockData.id,
      collectionName: selectedMockData.name,
      data: selectedMockData.data,
      dataIsArray: Array.isArray(selectedMockData.data),
      dataLength: Array.isArray(selectedMockData.data) ? selectedMockData.data.length : 'not array'
    });
    
    // Validate data is array
    if (!Array.isArray(selectedMockData.data)) {
      toast({
        title: 'Error',
        description: 'Mock data is not in array format',
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: 'Saving...',
      description: 'Saving mock data changes to database'
    });
    
    // Get current collection data
    const collectionData = selectedMockData.data || [];
    
    console.log('📤 Making API call with:', {
      collectionId: selectedMockData.id,
      dataLength: collectionData.length,
      executionContext: {
        endpointId: selectedEndpoint.id,
        executionId: `exec_${Date.now()}`
      }
    });
    
    // Call save API
    const result = await api.saveMockDataFromExecution(
      projectId,
      selectedMockData.id,
      collectionData,
      {
        endpointId: selectedEndpoint.id,
        executionId: `exec_${Date.now()}`
      }
    );
    
    console.log('✅ Save result:', result);
    
    toast({
      title: 'Success',
      description: `Saved ${result.collection?.itemCount || 0} items to mock data`
    });
    
  } catch (error: any) {
    console.error('❌ Save failed:', {
      message: error.message,
      response: error.response,
      data: error.data
    });
    
    toast({
      title: 'Error',
      description: error.message || 'Failed to save mock data',
      variant: 'destructive'
    });
  }
};
  
  // FILTER ENDPOINTS
  const filteredEndpoints = endpoints.filter(endpoint => {
    if (!searchQuery) return true
    
    return (
      endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (endpoint.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    )
  })
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading endpoints...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border/40 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex items-center gap-3">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="h-10 w-10 min-h-[44px] min-w-[44px]"
                  aria-label={showMobileMenu ? "Close menu" : "Open menu"}
                >
                  {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              )}
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Endpoints</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {endpoints.length} endpoint{endpoints.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            {isMobile && (
              <Button 
                onClick={() => setShowCreateModal(true)} 
                size="sm"
                className="min-h-[44px]"
              >
                <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="sm:hidden">Create</span>
                <span className="hidden sm:inline">Create Endpoint</span>
              </Button>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search endpoints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "pl-9 w-full",
                  "min-h-[44px]",
                  isMobile ? "min-w-full" : "sm:w-[200px] md:w-[250px]"
                )}
              />
            </div>
            
            {/* Help Button */}
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowHelp(true)}
              className="min-h-[44px] min-w-[44px]"
              title="Quick Help"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
            
            {/* Create Button */}
            {!isMobile && (
              <Button onClick={() => setShowCreateModal(true)} className="min-h-[44px]">
                <Plus className="h-4 w-4 mr-2" />
                Create Endpoint
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as any)} className="h-full">
          {/* Tabs */}
          <div className="border-b">
            <TabsList className={cn(
              "h-12 px-2 sm:px-4",
              isMobile ? "justify-start overflow-x-auto w-full [&>*]:min-w-[80px]" : "justify-start"
            )}>
              <TabsTrigger value="endpoints" className={cn(
                "h-10 text-xs sm:text-sm",
                isMobile ? "min-w-[80px] px-3" : "min-w-[100px] sm:min-w-[120px]"
              )}>
                <Code2 className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Endpoints</span>
              </TabsTrigger>
              <TabsTrigger value="test" className={cn(
                "h-10 text-xs sm:text-sm",
                isMobile ? "min-w-[80px] px-3" : "min-w-[100px] sm:min-w-[120px]"
              )}>
                <TestTube className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Test Runner</span>
              </TabsTrigger>
              <TabsTrigger value="docs" className={cn(
                "h-10 text-xs sm:text-sm",
                isMobile ? "min-w-[80px] px-3" : "min-w-[100px] sm:min-w-[120px]"
              )}>
                <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Documentation</span>
              </TabsTrigger>
              <TabsTrigger value="logs" className={cn(
                "h-10 text-xs sm:text-sm",
                isMobile ? "min-w-[80px] px-3" : "min-w-[100px] sm:min-w-[120px]"
              )}>
                <History className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Execution Logs</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Endpoints Tab */}
          <TabsContent value="endpoints" className="h-[calc(100%-48px)] p-0 m-0 overflow-hidden">
            {endpoints.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-4 sm:p-8">
                <div className="text-center max-w-md">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                    <Code2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">No endpoints yet</h3>
                  <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                    Create your first endpoint to get started
                  </p>
                  <Button onClick={() => setShowCreateModal(true)} size="lg" className="min-h-[44px]">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Endpoint
                  </Button>
                </div>
              </div>
            ) : (
              <div className={cn(
                "h-full",
                isMobile && showMobileMenu ? "grid grid-cols-1" : 
                isMobile ? "grid grid-cols-1" :
                isTablet ? "grid grid-cols-1 lg:grid-cols-5" :
                "grid grid-cols-1 lg:grid-cols-5"
              )}>
                {/* Left Panel: Endpoint List */}
                <div className={cn(
                  "border-r overflow-y-auto bg-background",
                  isMobile && !showMobileMenu ? "hidden" : "block",
                  !isMobile && "lg:col-span-2"
                )}>
                  <div className="space-y-3 p-3 sm:p-4">
                    {filteredEndpoints.map((endpoint) => {
                      const localState = endpointLocalStates[endpoint.id]
                      const hasRecentTest = localState?.lastTestedAt
                      
                      return (
                        <Card 
                          key={endpoint.id}
                          className={`cursor-pointer transition-all hover:border-primary/40 ${
                            selectedEndpoint?.id === endpoint.id ? 'border-primary bg-primary/5' : ''
                          }`}
                          onClick={() => handleSelectEndpoint(endpoint)}
                        >
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <Badge className={
                                    endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-600 text-xs' :
                                    endpoint.method === 'POST' ? 'bg-green-500/20 text-green-600 text-xs' :
                                    endpoint.method === 'PUT' ? 'bg-amber-500/20 text-amber-600 text-xs' :
                                    endpoint.method === 'DELETE' ? 'bg-red-500/20 text-red-600 text-xs' :
                                    'bg-gray-500/20 text-gray-600 text-xs'
                                  }>
                                    {endpoint.method}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {endpoint.isActive ? 'Published' : 'Draft'}
                                  </Badge>
                                  {hasRecentTest && (
                                    <Badge variant="outline" className="text-xs bg-green-500/10">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Tested
                                    </Badge>
                                  )}
                                </div>
                                
                                <h4 className="font-semibold mb-1 truncate">{endpoint.name}</h4>
                                <p className="text-xs sm:text-sm text-muted-foreground mb-2 truncate">
                                  {endpoint.path}
                                </p>
                                
                                {endpoint.description && (
                                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 mb-2">
                                    {endpoint.description}
                                  </p>
                                )}
                                
                                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Zap className="h-3 w-3" />
                                    {endpoint.callCount || 0} calls
                                  </span>
                                  {hasRecentTest && (
                                    <span className="flex items-center gap-1">
                                      <TestTube className="h-3 w-3" />
                                      Last test: {new Date(localState.lastTestedAt!).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 min-h-[32px] min-w-[32px] ml-2">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation()
                                    handleDuplicateEndpoint(endpoint)
                                  }}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation()
                                    handleSelectEndpoint(endpoint)
                                    setActiveTab('test')
                                  }}>
                                    <TestTube className="h-4 w-4 mr-2" />
                                    Test
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setEndpointToDelete(endpoint.id)
                                      setShowDeleteDialog(true)
                                    }}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                    
                    {filteredEndpoints.length === 0 && searchQuery && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No endpoints match "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Right Panel: Endpoint Editor */}
                <div className={cn(
                  "overflow-y-auto",
                  isMobile && showMobileMenu ? "hidden" : "block",
                  !isMobile && "lg:col-span-3"
                )}>
                  {selectedEndpoint ? (
                    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
                      {/* Mobile Back Button */}
                      {isMobile && !showMobileMenu && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowMobileMenu(true)}
                          className="mb-2 min-h-[44px]"
                        >
                          ← Back to Endpoints
                        </Button>
                      )}
                      
                      {/* Endpoint Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold truncate">{selectedEndpoint.name}</h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <Badge className="text-xs sm:text-sm">
                              {selectedEndpoint.method}
                            </Badge>
                            <code className="text-xs sm:text-sm bg-muted px-2 py-1 rounded truncate min-w-0">
                              {selectedEndpoint.path}
                            </code>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleExecuteEndpoint(selectedEndpoint.id)}
                            disabled={executing || !selectedMockData || !selectedEnvironment}
                            className="min-h-[44px] flex-1 sm:flex-none"
                          >
                            {executing ? (
                              <span className="animate-spin">⟳</span>
                            ) : (
                              <Play className="h-4 w-4 mr-2" />
                            )}
                            {executing ? 'Running...' : 'Run Endpoint'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const currentCode = getCurrentLocalState().code
                              handleUpdateEndpoint(selectedEndpoint.id, {
                                name: selectedEndpoint.name,
                                path: selectedEndpoint.path,
                                method: selectedEndpoint.method,
                                description: selectedEndpoint.description,
                                code: currentCode,
                                isPublic: selectedEndpoint.isPublic,
                                isActive: selectedEndpoint.isActive
                              })
                            }}
                            className="min-h-[44px] flex-1 sm:flex-none"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      </div>
                      
                      {/* Quick Info Banner */}
                      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                Using: {selectedMockData?.name || 'No mock data'} • {selectedEnvironment?.name || 'No environment'}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-8 text-blue-600 hover:text-blue-800"
                              onClick={() => setShowHelp(true)}
                            >
                              <HelpCircle className="h-3 w-3 mr-1" />
                              Need help?
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Execution Context Section */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Execution Context
                          </CardTitle>
                          <CardDescription className="text-sm">
                            Select mock data and environment for testing
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label className="flex items-center gap-2 text-sm sm:text-base">
                              <Database className="h-4 w-4" />
                              Mock Data Collection
                            </Label>
                            <Select
                              value={selectedMockData?.id || ''}
                              onValueChange={(value) => {
                                const mockData = mockDataCollections.find(md => md.id === value)
                                setSelectedMockData(mockData || null)
                              }}
                            >
                              <SelectTrigger className="min-h-[44px]">
                                <SelectValue placeholder="Select mock data" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockDataCollections.length === 0 ? (
                                  <SelectItem value="" disabled>
                                    <div className="flex items-center gap-2">
                                      <Database className="h-3 w-3 opacity-50" />
                                      <span className="text-sm">No mock data collections</span>
                                    </div>
                                  </SelectItem>
                                ) : (
                                  mockDataCollections.map(mockData => (
                                    <SelectItem key={mockData.id} value={mockData.id}>
                                      <div className="flex items-center gap-2">
                                        <Database className="h-3 w-3" />
                                        <span className="text-sm truncate">{mockData.name}</span>
                                        <Badge variant="outline" className="text-xs ml-auto">
                                          {Array.isArray(mockData.data) ? mockData.data.length : 0} items
                                        </Badge>
                                      </div>
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                            {selectedMockData && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Access in code as: <code className="bg-muted px-1 rounded">mockData.{selectedMockData.name}</code>
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <Label className="flex items-center gap-2 text-sm sm:text-base">
                              <Globe className="h-4 w-4" />
                              Environment
                            </Label>
                            <Select
                              value={selectedEnvironment?.id || ''}
                              onValueChange={(value) => {
                                const env = environments.find(e => e.id === value)
                                setSelectedEnvironment(env || null)
                              }}
                            >
                              <SelectTrigger className="min-h-[44px]">
                                <SelectValue placeholder="Select environment" />
                              </SelectTrigger>
                              <SelectContent>
                                {environments.length === 0 ? (
                                  <SelectItem value="" disabled>
                                    <div className="flex items-center gap-2">
                                      <Globe className="h-3 w-3 opacity-50" />
                                      <span className="text-sm">No environments</span>
                                    </div>
                                  </SelectItem>
                                ) : (
                                  environments.map(env => (
                                    <SelectItem key={env.id} value={env.id}>
                                      <div className="flex items-center gap-2">
                                        <Globe className="h-3 w-3" />
                                        <span className="text-sm truncate">{env.name}</span>
                                        {env.isDefault && (
                                          <Badge className="text-xs bg-green-500/20 text-green-600 ml-auto">
                                            Default
                                          </Badge>
                                        )}
                                      </div>
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                            {selectedEnvironment && (
                              <div className="mt-2 text-xs text-muted-foreground">
                                <span className="font-medium">Variables:</span> {Object.keys(selectedEnvironment.variables || {}).length}
                              </div>
                            )}
                          </div>
                          
                          {/* Save Button */}
                          {selectedMockData && (
                            <div className="pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSaveMockData}
                                className="w-full min-h-[44px] border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                              >
                                <Save className="h-4 w-4 mr-2" />
                                Save Mock Data Changes to Database
                              </Button>
                              <p className="text-xs text-muted-foreground mt-1 text-center">
                                Changes made in execution will be saved to "{selectedMockData.name}"
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      
                      {/* Code Editor with Templates */}
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <CardTitle className="text-lg">Endpoint Code</CardTitle>
                              <CardDescription className="text-sm">
                                Write JavaScript logic for this endpoint
                              </CardDescription>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm" className="min-h-[44px]">
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Templates
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 max-h-[60vh] overflow-y-auto">
                                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                    CRUD Operations
                                  </div>
                                  <DropdownMenuItem onClick={() => applyTemplate('getCollection')}>
                                    <FileCode className="h-4 w-4 mr-2" />
                                    <div>
                                      <div className="text-sm">GET All Items</div>
                                      <div className="text-xs text-muted-foreground">Read entire collection</div>
                                    </div>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => applyTemplate('getById')}>
                                    <FileCode className="h-4 w-4 mr-2" />
                                    <div>
                                      <div className="text-sm">GET Single Item</div>
                                      <div className="text-xs text-muted-foreground">Find by ID</div>
                                    </div>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => applyTemplate('createItem')}>
                                    <FileCode className="h-4 w-4 mr-2" />
                                    <div>
                                      <div className="text-sm">POST Create</div>
                                      <div className="text-xs text-muted-foreground">Add new item</div>
                                    </div>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => applyTemplate('updateItem')}>
                                    <FileCode className="h-4 w-4 mr-2" />
                                    <div>
                                      <div className="text-sm">PUT/PATCH Update</div>
                                      <div className="text-xs text-muted-foreground">Modify existing</div>
                                    </div>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => applyTemplate('deleteItem')}>
                                    <FileCode className="h-4 w-4 mr-2" />
                                    <div>
                                      <div className="text-sm">DELETE Remove</div>
                                      <div className="text-xs text-muted-foreground">Delete item</div>
                                    </div>
                                  </DropdownMenuItem>
                                  
                                  <DropdownMenuSeparator />
                                  
                                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                    Advanced Operations
                                  </div>
                                  <DropdownMenuItem onClick={() => applyTemplate('filterAndSort')}>
                                    <Filter className="h-4 w-4 mr-2" />
                                    <div>
                                      <div className="text-sm">Filter & Sort</div>
                                      <div className="text-xs text-muted-foreground">Search and organize data</div>
                                    </div>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => applyTemplate('useEnvironment')}>
                                    <Globe className="h-4 w-4 mr-2" />
                                    <div>
                                      <div className="text-sm">Use Environment</div>
                                      <div className="text-xs text-muted-foreground">Access env variables</div>
                                    </div>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => applyTemplate('saveMockData')}>
                                    <Save className="h-4 w-4 mr-2" />
                                    <div>
                                      <div className="text-sm">Save to Database</div>
                                      <div className="text-xs text-muted-foreground">Persist changes</div>
                                    </div>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-hidden rounded-lg border" style={{ height: isMobile ? "250px" : isTablet ? "350px" : "400px" }}>
                            <CodeEditor
                              key={selectedEndpoint.id}
                              code={getCurrentLocalState().code}
                              endpointId={selectedEndpoint.id}
                              projectId={projectId}
                              onSave={async (code) => {
                                await handleUpdateEndpoint(selectedEndpoint.id, { code })
                                saveLocalState(selectedEndpoint.id, { code })
                              }}
                              onExecute={() => handleExecuteEndpoint(selectedEndpoint.id)}
                              language="javascript"
                              onCodeChange={(code) => {
                                setSelectedEndpoint(prev => prev ? {
                                  ...prev,
                                  code: code
                                } : prev)
                                saveLocalState(selectedEndpoint.id, { code })
                              }}
                            />
                          </div>
                          
                          {/* Code Hints */}
                          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Terminal className="h-4 w-4" />
                              <span className="text-sm font-medium">Available in your code:</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  <Database className="h-3 w-3" />
                                  <span className="font-medium">Mock Data:</span>
                                </div>
                                <code className="block bg-background px-2 py-1 rounded text-xs">
                                  mockData.{selectedMockData?.name || 'collectionName'}
                                </code>
                                {selectedMockData && (
                                  <div className="text-muted-foreground">
                                    Current: "{selectedMockData.name}"
                                  </div>
                                )}
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  <span className="font-medium">Environment:</span>
                                </div>
                                <code className="block bg-background px-2 py-1 rounded text-xs">
                                  environment.VARIABLE_NAME
                                </code>
                                <div className="text-muted-foreground">
                                  {selectedEnvironment ? `${Object.keys(selectedEnvironment.variables || {}).length} variables` : 'No env selected'}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <span className="font-medium">Request Data:</span>
                                <div className="flex flex-wrap gap-1">
                                  <code className="bg-background px-2 py-1 rounded text-xs">request.body</code>
                                  <code className="bg-background px-2 py-1 rounded text-xs">request.query</code>
                                  <code className="bg-background px-2 py-1 rounded text-xs">request.params</code>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <span className="font-medium">Response Helpers:</span>
                                <div className="flex flex-wrap gap-1">
                                  <code className="bg-background px-2 py-1 rounded text-xs">Response.json(data)</code>
                                  <code className="bg-background px-2 py-1 rounded text-xs">Response.error(message)</code>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Execution Output */}
                      {getCurrentExecutionResult() && (
                        <div ref={outputRef} className="space-y-4">
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="flex flex-wrap items-center gap-2 text-lg">
                                <TestTube className="h-5 w-5" />
                                <span>Test Result</span>
                                <Badge variant="outline" className="ml-auto text-xs">
                                  {new Date(getCurrentExecutionResult()!.timestamp).toLocaleTimeString()}
                                </Badge>
                                {showScrollHint && (
                                  <div className="w-full sm:w-auto flex items-center gap-1 text-sm text-muted-foreground animate-pulse">
                                    <ArrowDown className="h-4 w-4" />
                                    <span className="text-xs">New results below</span>
                                  </div>
                                )}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex flex-wrap items-center gap-3">
                                <div className={`flex items-center gap-2 ${
                                  getCurrentExecutionResult()!.success 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-red-600 dark:text-red-400'
                                }`}>
                                  {getCurrentExecutionResult()!.success ? (
                                    <>
                                      <CheckCircle className="h-5 w-5" />
                                      <span className="font-medium text-sm sm:text-base">Success</span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="h-5 w-5" />
                                      <span className="font-medium text-sm sm:text-base">Failed</span>
                                    </>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {getCurrentExecutionResult()!.executionTime}ms
                                </div>
                                {getCurrentExecutionResult()!.statusCode && (
                                  <Badge variant="outline" className="text-xs">
                                    Status: {getCurrentExecutionResult()!.statusCode}
                                  </Badge>
                                )}
                                {getCurrentExecutionResult()!.data?.savedData && (
                                  <Badge className="text-xs bg-green-500/20 text-green-600">
                                    💾 {getCurrentExecutionResult()!.data.savedData.count} saves
                                  </Badge>
                                )}
                              </div>
                              
                              {getCurrentExecutionResult()!.data && (
                                <div>
                                  <h4 className="font-medium mb-2 text-sm sm:text-base">Response Data:</h4>
                                  <div className="overflow-hidden rounded-md">
                                    <pre className="bg-muted dark:bg-muted/50 p-3 sm:p-4 rounded-md text-xs sm:text-sm overflow-x-auto max-h-[300px]">
                                      {JSON.stringify(getCurrentExecutionResult()!.data, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              )}
                              
                              {getCurrentExecutionResult()!.error && (
                                <div>
                                  <h4 className="font-medium mb-2 text-red-600 dark:text-red-400 text-sm sm:text-base">Error:</h4>
                                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 sm:p-4 rounded-md">
                                    <code className="text-red-700 dark:text-red-300 whitespace-pre-wrap font-mono text-xs sm:text-sm">
                                      {getCurrentExecutionResult()!.error}
                                    </code>
                                  </div>
                                </div>
                              )}
                              
                              {getCurrentExecutionResult()!.logs && getCurrentExecutionResult()!.logs.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2 text-sm sm:text-base">Console Logs:</h4>
                                  <div className="bg-muted dark:bg-muted/50 p-3 sm:p-4 rounded-md text-xs sm:text-sm space-y-1 max-h-40 overflow-y-auto">
                                    {getCurrentExecutionResult()!.logs.map((log, index) => (
                                      <div key={index} className="font-mono text-xs border-l-2 border-blue-500 pl-2">
                                         {typeof log === 'object' ? JSON.stringify(log) : String(log)}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center p-4 sm:p-8">
                      <div className="text-center max-w-md">
                        <div className="inline-flex p-4 rounded-full bg-muted/50 mb-4">
                          <Code2 className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2">Select an Endpoint</h3>
                        <p className="text-muted-foreground text-sm sm:text-base">
                          Choose an endpoint from the list to edit
                        </p>
                        {isMobile && (
                          <Button
                            variant="outline"
                            onClick={() => setShowMobileMenu(true)}
                            className="mt-4 min-h-[44px]"
                          >
                            Show Endpoints List
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Other Tabs */}
          <TabsContent value="test" className="h-[calc(100%-48px)] p-0 m-0">
            {selectedEndpoint ? (
              <div className="h-full overflow-y-auto p-3 sm:p-4">
                <TestPanel 
                  endpoint={selectedEndpoint}
                  projectId={projectId}
                  mockDataCollections={mockDataCollections}
                  environments={environments}
                  initialExecutionResult={getCurrentExecutionResult()}
                  onExecutionComplete={(result) => {
                  saveLocalState(selectedEndpoint.id, {
                    executionResult: result,
                    lastTestedAt: new Date().toISOString()
                  })
                  }}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-4 sm:p-8">
                <div className="text-center max-w-md">
                  <TestTube className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Select an endpoint to test</h3>
                  <Button 
                    onClick={() => setActiveTab('endpoints')}
                    className="mt-4 min-h-[44px]"
                  >
                    Go to Endpoints
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="docs" className="h-[calc(100%-48px)] p-3 sm:p-4 overflow-y-auto">
            <DocsPanel 
              endpoint={selectedEndpoint}
              endpoints={endpoints}
            />
          </TabsContent>
          
          <TabsContent value="logs" className="h-[calc(100%-48px)] p-0 m-0">
            {selectedEndpoint ? (
              <div className="h-full overflow-y-auto">
                <ExecutionLogs 
                  endpointId={selectedEndpoint.id}
                  projectId={projectId}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-4 sm:p-8">
                <div className="text-center max-w-md">
                  <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Select an endpoint to view logs</h3>
                  <Button 
                    onClick={() => setActiveTab('endpoints')}
                    className="mt-4 min-h-[44px]"
                  >
                    Go to Endpoints
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Modals */}
      <CreateEndpointModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateEndpoint}
        projectId={projectId}
        codeTemplates={CODE_TEMPLATES}
      />
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl">Delete Endpoint</AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              Are you sure you want to delete this endpoint? This action cannot be undone.
              All execution logs for this endpoint will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-[44px]">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteEndpoint}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 min-h-[44px]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Create Endpoint Modal
interface CreateEndpointModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateEndpointData) => Promise<void>
  projectId: string
  codeTemplates: Record<string, string>
}

function CreateEndpointModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  projectId,
  codeTemplates
}: CreateEndpointModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('default')
  const [form, setForm] = useState<CreateEndpointData>({
    name: '',
    path: '',
    method: 'GET' as HttpMethod,
    description: '',
    code: codeTemplates.default
  })
  
  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert('Name is required')
      return
    }
    if (!form.path.trim()) {
      alert('Path is required')
      return
    }
    
    try {
      await onSubmit(form)
      onClose()
    } catch (error) {
      // Error is handled in parent
    }
  }
  
  const handleTemplateSelect = (templateName: string) => {
    setSelectedTemplate(templateName)
    setForm(prev => ({
      ...prev,
      code: codeTemplates[templateName] || codeTemplates.default
    }))
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Create New Endpoint</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Create a new API endpoint with custom JavaScript logic
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4 p-1">
          {/* Template Selection */}
          <div>
            <Label className="text-sm sm:text-base">Start with Template</Label>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {Object.entries({
                default: 'Default',
                getCollection: 'GET All Items',
                getById: 'GET Single Item',
                createItem: 'POST Create',
                updateItem: 'PUT Update',
                deleteItem: 'DELETE Remove',
                filterAndSort: 'Filter & Sort',
                useEnvironment: 'Use Environment',
                saveMockData: 'Save to Database'
              }).map(([key, label]) => (
                <Button
                  key={key}
                  type="button"
                  variant={selectedTemplate === key ? "default" : "outline"}
                  className="justify-start h-auto py-2 min-h-[44px] text-xs sm:text-sm"
                  onClick={() => handleTemplateSelect(key)}
                >
                  <FileCode className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{label}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="text-sm sm:text-base">Endpoint Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              placeholder="Get Users"
              className="min-h-[44px]"
            />
          </div>
          
          <div>
            <Label className="text-sm sm:text-base">Path *</Label>
            <div className="flex">
              <span className="flex items-center px-3 bg-muted border border-r-0 rounded-l text-sm">/</span>
              <Input
                value={form.path}
                onChange={(e) => setForm({...form, path: e.target.value})}
                placeholder="api/users"
                className="rounded-l-none min-h-[44px]"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm sm:text-base">HTTP Method</Label>
              <Select 
                value={form.method} 
                onValueChange={(value: string) => setForm({...form, method: value as HttpMethod})}
              >
                <SelectTrigger className="min-h-[44px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET" className="text-sm">GET</SelectItem>
                  <SelectItem value="POST" className="text-sm">POST</SelectItem>
                  <SelectItem value="PUT" className="text-sm">PUT</SelectItem>
                  <SelectItem value="DELETE" className="text-sm">DELETE</SelectItem>
                  <SelectItem value="PATCH" className="text-sm">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label className="text-sm sm:text-base">Description (optional)</Label>
            <Textarea
              value={form.description || ''}
              onChange={(e) => setForm({...form, description: e.target.value})}
              placeholder="What does this endpoint do?"
              rows={2}
              className="min-h-[44px]"
            />
          </div>
          
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
              <Label className="text-sm sm:text-base mb-1 sm:mb-0">Initial Code</Label>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Using <span className="font-medium">{selectedTemplate}</span> template
              </div>
            </div>
            <Textarea
              value={form.code || ''}
              onChange={(e) => setForm({...form, code: e.target.value})}
              rows={8}
              className="font-mono text-xs sm:text-sm min-h-[200px]"
            />
            <div className="mt-2 text-xs sm:text-sm text-muted-foreground">
              <p>💡 In your code, you can access:</p>
              <ul className="pl-4 space-y-1 mt-1">
                <li><code className="bg-muted px-1 rounded text-xs">mockData.collectionName</code> - Your mock data</li>
                <li><code className="bg-muted px-1 rounded text-xs">environment.VARIABLE_NAME</code> - Environment variables</li>
                <li><code className="bg-muted px-1 rounded text-xs">request.body/query/params</code> - Request data</li>
                <li><code className="bg-muted px-1 rounded text-xs">Response.json(data)</code> - Return responses</li>
              </ul>
            </div>
          </div>
        </div>
        
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose} className="min-h-[44px] flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="min-h-[44px] flex-1 sm:flex-none">
            Create Endpoint
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}