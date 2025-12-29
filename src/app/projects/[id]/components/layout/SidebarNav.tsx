'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ChevronRight,
  ChevronDown,
  FileCode,
  Database,
  Globe,
  Settings,
  Users,
  History,
  Zap,
  Sparkles,
  Plus,
  Folder,
  RefreshCw,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  X  
} from 'lucide-react'
import { api } from '@/lib/api'  // CHANGE: Use api, not ApiClient
import { Endpoint, MockDataCollection, Environment, ProjectCollaborator, Project } from '@/types/types'

interface SidebarNavProps {
  projectId: string
  collapsed: boolean
  onToggle: () => void
  onSelectEndpoint?: (endpoint: Endpoint) => void
  onSelectMock?: (mock: MockDataCollection) => void
  onSelectEnvironment?: (env: Environment) => void
  selectedEndpointId?: string
  selectedMockId?: string
  selectedEnvironmentId?: string
  onRefresh?: () => void
  onMobileClose?: () => void  
}

export function SidebarNav({ 
  projectId, 
  collapsed, 
  onToggle,
  onSelectEndpoint,
  onSelectMock,
  onSelectEnvironment,
  selectedEndpointId,
  selectedMockId,
  selectedEnvironmentId,
  onRefresh,
  onMobileClose  
}: SidebarNavProps) {
  const router = useRouter()
  const [endpoints, setEndpoints] = useState<Endpoint[]>([])
  const [mockData, setMockData] = useState<MockDataCollection[]>([])
  const [environments, setEnvironments] = useState<Environment[]>([])
  const [collaborators, setCollaborators] = useState<ProjectCollaborator[]>([])
  const [projectData, setProjectData] = useState<Project | null>(null)  // ADD THIS
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    endpoints: true,
    mockdata: false,
    environments: false,
    team: false
  })

  useEffect(() => {
    if (projectId) {
      loadAllData()
    }
  }, [projectId])

  const loadAllData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadProjectData(),  // ADD THIS
        loadEndpoints(),
        loadMockData(),
        loadEnvironments(),
        loadCollaborators()
      ])
    } catch (error) {
      console.error('Failed to load sidebar data:', error)
    } finally {
      setLoading(false)
    }
  }

  // ADD THIS FUNCTION - Same as dashboard
  const loadProjectData = async () => {
    try {
      const project = await api.getProject(projectId)  // Use api directly
      setProjectData(project)
    } catch (error) {
      console.error('Failed to load project data:', error)
      setProjectData(null)
    }
  }

  const loadEndpoints = async () => {
    try {
      const data = await api.getEndpoints(projectId)  // Use api directly
      console.log('Sidebar endpoints response:', data)
      
      // Handle response like dashboard does
      let endpointsData: Endpoint[] = []
      
      if (data && typeof data === 'object') {
        // Check for endpoints property
        if ('endpoints' in data && Array.isArray(data.endpoints)) {
          endpointsData = data.endpoints
        } 
        // Check for array directly
        else if (Array.isArray(data)) {
          endpointsData = data
        }
      }
      
      setEndpoints(Array.isArray(endpointsData) ? endpointsData : [])
    } catch (error) {
      console.error('Failed to load endpoints:', error)
      setEndpoints([])
    }
  }

  const loadMockData = async () => {
    try {
      const data = await api.getMockDataCollections(projectId)  // Use api directly
      setMockData(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load mock data:', error)
      setMockData([])
    }
  }

  const loadEnvironments = async () => {
    try {
      const data = await api.getEnvironments(projectId)  // Use api directly
      setEnvironments(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load environments:', error)
      setEnvironments([])
    }
  }

  const loadCollaborators = async () => {
    try {
      const data = await api.getCollaborators(projectId)  // Use api directly
      setCollaborators(Array.isArray(data) ? data : [])
    } catch (error: any) {
      if (error.message.includes('404') || error.message.includes('not found')) {
        console.log('Collaborators route not available')
        setCollaborators([])
      } else {
        console.error('Failed to load collaborators:', error)
        setCollaborators([])
      }
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await loadAllData()
      onRefresh?.()
    } finally {
      setRefreshing(false)
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // ADD THIS FUNCTION - Get endpoint count like dashboard
  const getEndpointCount = () => {
    if (projectData) {
      // SAME LOGIC AS DASHBOARD
      return projectData?._count?.endpoints || 
             (projectData as any)?.endpointCount || 
             endpoints.length
    }
    return endpoints.length
  }

  if (collapsed) {
    return (
      <div className="h-full w-12 py-4 flex flex-col items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onToggle}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={refreshing}
          className="h-8 w-8"
          title="Refresh"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
        
        {/* Collapsed icons - show count badges */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleSection('endpoints')}
          className="h-8 w-8 relative"
          title="Endpoints"
        >
          <FileCode className="h-4 w-4" />
          {getEndpointCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {getEndpointCount()}
            </span>
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleSection('mockdata')}
          className="h-8 w-8 relative"
          title="Mock Data"
        >
          <Database className="h-4 w-4" />
          {mockData.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {mockData.length}
            </span>
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleSection('environments')}
          className="h-8 w-8 relative"
          title="Environments"
        >
          <Globe className="h-4 w-4" />
          {environments.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {environments.length}
            </span>
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/projects/${projectId}/history`)}
          className="h-8 w-8"
          title="History"
        >
          <History className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="h-full w-64 border-r border-border/40 flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">Project</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.push(`/projects/${projectId}/endpoints/create`)}
            title="Create Endpoint"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-sm">Loading...</span>
            </div>
          ) : (
            <>
              {/* Endpoints Section - UPDATED */}
              <div>
                <button
                  onClick={() => toggleSection('endpoints')}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 mb-2 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    <span className="text-sm font-medium">Endpoints</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {getEndpointCount()} {/* UPDATED */}
                    </Badge>
                    {expandedSections.endpoints ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </button>

                {expandedSections.endpoints && (
                  <div className="ml-6 space-y-1">
                    {endpoints.length > 0 ? (
                      endpoints.map((endpoint) => (
                        <button
                          key={endpoint.id}
                          onClick={() => onSelectEndpoint?.(endpoint)}
                          className={cn(
                            "w-full flex items-center gap-2 p-2 rounded text-sm hover:bg-muted/50 text-left transition-colors",
                            selectedEndpointId === endpoint.id && "bg-primary/10"
                          )}
                        >
                          <div className={cn(
                            "px-2 py-1 rounded text-xs font-mono",
                            endpoint.method === 'GET' && 'bg-blue-500/20 text-blue-600',
                            endpoint.method === 'POST' && 'bg-green-500/20 text-green-600',
                            endpoint.method === 'PUT' && 'bg-amber-500/20 text-amber-600',
                            endpoint.method === 'DELETE' && 'bg-red-500/20 text-red-600'
                          )}>
                            {endpoint.method}
                          </div>
                          <span className="truncate">{endpoint.name}</span>
                        </button>
                      ))
                    ) : (
                      <div className="text-xs text-muted-foreground italic py-2">
                        No endpoints yet
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mock Data Section - UNCHANGED */}
              <div>
                <button
                  onClick={() => toggleSection('mockdata')}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 mb-2 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span className="text-sm font-medium">Mock Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {mockData.length}
                    </Badge>
                    {expandedSections.mockdata ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </button>

                {expandedSections.mockdata && (
                  <div className="ml-6 space-y-1">
                    {mockData.length > 0 ? (
                      mockData.map((mock) => (
                        <button
                          key={mock.id}
                          onClick={() => onSelectMock?.(mock)}
                          className={cn(
                            "w-full flex items-center gap-2 p-2 rounded text-sm hover:bg-muted/50 text-left transition-colors",
                            selectedMockId === mock.id && "bg-primary/10"
                          )}
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="truncate">{mock.name}</span>
                        </button>
                      ))
                    ) : (
                      <div className="text-xs text-muted-foreground italic py-2">
                        No mock data collections
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Environments Section - UNCHANGED */}
              <div>
                <button
                  onClick={() => toggleSection('environments')}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 mb-2 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm font-medium">Environments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {environments.length}
                    </Badge>
                    {expandedSections.environments ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </button>

                {expandedSections.environments && (
                  <div className="ml-6 space-y-1">
                    {environments.length > 0 ? (
                      environments.map((env) => (
                        <button
                          key={env.id}
                          onClick={() => onSelectEnvironment?.(env)}
                          className={cn(
                            "w-full flex items-center gap-2 p-2 rounded text-sm hover:bg-muted/50 text-left transition-colors",
                            selectedEnvironmentId === env.id && "bg-primary/10"
                          )}
                        >
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            env.isDefault ? "bg-green-500" : "bg-purple-500"
                          )}></div>
                          <span className="truncate">{env.name}</span>
                        </button>
                      ))
                    ) : (
                      <div className="text-xs text-muted-foreground italic py-2">
                        No environments
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Team Section - UNCHANGED */}
              <div>
                <button
                  onClick={() => toggleSection('team')}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 mb-2 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">Team</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {collaborators.length}
                    </Badge>
                    {expandedSections.team ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </button>

                {expandedSections.team && (
                  <div className="ml-6 space-y-1">
                    {collaborators.length > 0 ? (
                      collaborators.map((collaborator) => (
                        <div
                          key={collaborator.id}
                          className="w-full flex items-center gap-2 p-2 rounded text-sm"
                        >
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                            {collaborator.user.name.charAt(0)}
                          </div>
                          <span className="truncate">{collaborator.user.name}</span>
                          <Badge variant="outline" className="text-xs ml-auto">
                            {collaborator.role}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-muted-foreground italic py-2">
                        No collaborators
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Other Navigation Items */}
              <div className="pt-2 border-t border-border/40">
                <div className="space-y-1">
                  <button
                    className="w-full flex items-center gap-2 p-3 rounded-lg text-sm hover:bg-muted/50 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}