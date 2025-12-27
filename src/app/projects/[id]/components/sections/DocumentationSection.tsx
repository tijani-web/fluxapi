// app/workspace/[projectId]/components/sections/DocumentationSection.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { OpenAPISpec, DocumentationAnalytics, ExportFormat } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Download, 
  Eye, 
  Code, 
  BookOpen,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Globe,
  Shield,
  Users,
  RefreshCw,
  Copy,
  ExternalLink,
  Sparkles,
  Search,
  Filter,
  ChevronRight,
  Play,
  Upload,
  Terminal,
  BookMarked,
  DownloadCloud,
  Check,
  X,
  Maximize2,
  Minimize2,
  Smartphone,
  Server,
  Menu,
  ChevronLeft,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'
import { format } from 'date-fns'

interface DocumentationSectionProps {
  projectId: string
}

export function DocumentationSection({ projectId }: DocumentationSectionProps) {
  const { toast } = useToast()
  const [openApiSpec, setOpenApiSpec] = useState<OpenAPISpec | null>(null)
  const [analytics, setAnalytics] = useState<DocumentationAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [activeView, setActiveView] = useState<'redoc' | 'swagger' | 'markdown'>('redoc')
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('OPENAPI')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [endpointFilter, setEndpointFilter] = useState('all')
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileTableExpanded, setMobileTableExpanded] = useState<string | null>(null)
  
  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 1024) // Sidebar collapses on < 1024px
      if (width >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])
  
  // Load documentation
  const loadDocumentation = useCallback(async () => {
    try {
      setLoading(true)
      const [spec, stats] = await Promise.all([
        api.generateDocumentation(projectId),
        api.getDocumentationAnalytics(projectId)
      ])
      setOpenApiSpec(spec)
      setAnalytics(stats)
      setLastGenerated(new Date())
      toast({ 
        title: 'Documentation loaded', 
        description: 'API documentation is ready to explore',
        variant: 'default'
      })
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to load documentation', 
        variant: 'destructive' 
      })
    } finally {
      setLoading(false)
    }
  }, [projectId, toast])
  
  useEffect(() => {
    loadDocumentation()
  }, [loadDocumentation])
  
  // Export documentation
  const handleExport = async (format: ExportFormat) => {
    setExporting(true)
    try {
      const result = await api.exportDocumentation(projectId, format.toLowerCase())
      
      if (result.data?.url) {
        // Download file
        window.open(result.data.url, '_blank')
      } else if (result.data?.content) {
        // Create blob and download
        const blob = new Blob([result.data.content], { type: result.data.contentType })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = result.data.filename || `api-docs.${format.toLowerCase()}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
      
      toast({ 
        title: 'Exported successfully', 
        description: `API documentation exported as ${format}` 
      })
    } catch (error) {
      toast({ 
        title: 'Export failed', 
        description: 'Failed to export documentation', 
        variant: 'destructive' 
      })
    } finally {
      setExporting(false)
    }
  }
  
  // Regenerate documentation
  const handleRegenerate = async () => {
    setLoading(true)
    try {
      const spec = await api.generateDocumentation(projectId)
      setOpenApiSpec(spec)
      setLastGenerated(new Date())
      toast({ 
        title: 'Documentation updated', 
        description: 'API documentation has been regenerated' 
      })
    } catch (error) {
      toast({ 
        title: 'Regeneration failed', 
        description: 'Failed to regenerate documentation', 
        variant: 'destructive' 
      })
    } finally {
      setLoading(false)
    }
  }
  
  // Copy API URL
  const handleCopyApiUrl = () => {
    const url = openApiSpec?.servers?.[0]?.url || 'https://api.example.com'
    navigator.clipboard.writeText(url)
    toast({ 
      title: 'URL copied', 
      description: 'API base URL copied to clipboard' 
    })
  }
  
  // Copy OpenAPI spec
  const handleCopySpec = () => {
    if (!openApiSpec) return
    const specStr = JSON.stringify(openApiSpec, null, 2)
    navigator.clipboard.writeText(specStr)
    toast({ 
      title: 'Spec copied', 
      description: 'OpenAPI specification copied to clipboard' 
    })
  }
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-4">
        <div className="relative">
          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border flex items-center justify-center">
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <div className="absolute -inset-4 border-2 border-primary/20 rounded-3xl animate-pulse"></div>
        </div>
        <div className="text-center space-y-2 mt-4 sm:mt-6">
          <h3 className="text-base sm:text-lg font-semibold">Generating Documentation</h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
            Creating beautiful API documentation from your endpoints...
          </p>
        </div>
        <div className="w-48 sm:w-64 h-1.5 bg-muted rounded-full overflow-hidden mt-4">
          <div className="h-full bg-primary rounded-full animate-[pulse_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    )
  }
  
  return (
    <div className={`h-full flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {/* Header */}
      <div className="border-b p-3 sm:p-4 md:p-6 flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Mobile Sidebar Toggle */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="h-9 w-9 flex-shrink-0"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border flex-shrink-0">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight truncate">API Documentation</h1>
                <Badge variant="outline" className="px-2.5 py-1 text-xs hidden sm:inline-flex">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Auto-generated
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm mt-0.5 sm:mt-1 truncate">
                Interactive API reference and testing playground
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0">
            <Button 
              variant="outline" 
              onClick={handleRegenerate}
              className="gap-1 sm:gap-2 h-9 sm:h-10 flex-1 sm:flex-none"
              size="sm"
            >
              <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Refresh</span>
              <span className="sm:hidden text-xs">Refresh</span>
            </Button>
            <Select value={selectedFormat} onValueChange={(v: ExportFormat) => setSelectedFormat(v)}>
              <SelectTrigger className="w-full sm:w-[160px] text-xs sm:text-sm h-9 sm:h-10">
                <SelectValue placeholder="Export format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPENAPI" className="text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <Code className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>OpenAPI JSON</span>
                  </div>
                </SelectItem>
                <SelectItem value="POSTMAN" className="text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>Postman Collection</span>
                  </div>
                </SelectItem>
                <SelectItem value="INSOMNIA" className="text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>Insomnia Workspace</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={() => handleExport(selectedFormat)} 
              disabled={exporting}
              className="gap-1 sm:gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary h-9 sm:h-10 flex-1 sm:flex-none"
              size="sm"
            >
              {exporting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                  <span className="hidden sm:inline">Exporting...</span>
                  <span className="sm:hidden text-xs">Exporting</span>
                </>
              ) : (
                <>
                  <DownloadCloud className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Export</span>
                  <span className="sm:hidden text-xs">Export</span>
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="h-9 w-9 sm:h-10 sm:w-10"
            >
              {isFullscreen ? (
                <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar Drawer */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 animate-in fade-in lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div 
            className="absolute left-0 top-0 h-full w-full max-w-sm bg-background border-r shadow-lg animate-in slide-in-from-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-sm">Documentation Info</h3>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-[calc(100%-4rem)] overflow-y-auto p-3 space-y-3">
              {/* Mobile API Info Card */}
              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium flex items-center gap-2">
                    <Server className="h-3.5 w-3.5" />
                    API Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {openApiSpec && (
                    <>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">API Title</p>
                        <h3 className="text-base font-semibold truncate">{openApiSpec.info.title}</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Version</p>
                          <Badge variant="secondary" className="font-mono text-xs">
                            v{openApiSpec.info.version}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Last Updated</p>
                          <div className="text-xs font-medium truncate">
                            {lastGenerated ? format(lastGenerated, 'MMM d, HH:mm') : 'Just now'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Base URL</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted/50 px-2 py-1 rounded flex-1 font-mono truncate">
                            {openApiSpec.servers?.[0]?.url || 'https://api.example.com'}
                          </code>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleCopyApiUrl}
                            className="shrink-0 h-8 w-8"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              {/* Mobile Quick Stats */}
              {analytics && (
                <Card className="border-primary/10 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium flex items-center gap-2">
                      <BarChart3 className="h-3.5 w-3.5" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1 text-center">
                        <div className="text-lg font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                          {analytics.totalEndpoints}
                        </div>
                        <p className="text-xs text-muted-foreground">Endpoints</p>
                      </div>
                      <div className="space-y-1 text-center">
                        <div className="text-lg font-bold bg-gradient-to-br from-green-500 to-green-600 bg-clip-text text-transparent">
                          {analytics.documentedEndpoints}
                        </div>
                        <p className="text-xs text-muted-foreground">Documented</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Coverage</span>
                        <span className="text-xs font-bold text-primary">
                          {analytics.documentationCoverage}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                          style={{ width: `${analytics.documentationCoverage}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Mobile Quick Actions */}
              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2 h-9 text-xs"
                    onClick={handleCopySpec}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy OpenAPI Spec
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2 h-9 text-xs"
                    onClick={() => {
                      const specStr = JSON.stringify(openApiSpec, null, 2)
                      const blob = new Blob([specStr], { type: 'application/json' })
                      const url = URL.createObjectURL(blob)
                      window.open(`https://redocly.github.io/redoc/?url=${encodeURIComponent(url)}`, '_blank')
                    }}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open in ReDoc
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full flex">
          {/* Left Panel - Analytics & Controls - Desktop */}
          {!isMobile && sidebarOpen && (
            <div className="w-64 lg:w-72 xl:w-80 border-r flex-shrink-0 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
              {/* API Info Card */}
              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
                    <Server className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    API Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  {openApiSpec && (
                    <>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">API Title</p>
                        <h3 className="text-base sm:text-lg font-semibold truncate">{openApiSpec.info.title}</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Version</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="font-mono text-xs">
                              v{openApiSpec.info.version}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Last Updated</p>
                          <div className="text-xs sm:text-sm font-medium truncate">
                            {lastGenerated ? format(lastGenerated, 'MMM d, HH:mm') : 'Just now'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Base URL</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs sm:text-sm bg-muted/50 px-2 sm:px-3 py-1.5 rounded flex-1 font-mono truncate">
                            {openApiSpec.servers?.[0]?.url || 'https://api.example.com'}
                          </code>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleCopyApiUrl}
                            className="shrink-0 h-8 w-8 sm:h-9 sm:w-9"
                          >
                            <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {openApiSpec.info.description && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Description</p>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
                            {openApiSpec.info.description}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
              
              {/* Quick Stats */}
              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  {analytics && (
                    <>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div className="space-y-1 text-center">
                          <div className="text-lg sm:text-xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                            {analytics.totalEndpoints}
                          </div>
                          <p className="text-xs text-muted-foreground">Endpoints</p>
                        </div>
                        <div className="space-y-1 text-center">
                          <div className="text-lg sm:text-xl font-bold bg-gradient-to-br from-green-500 to-green-600 bg-clip-text text-transparent">
                            {analytics.documentedEndpoints}
                          </div>
                          <p className="text-xs text-muted-foreground">Documented</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">Documentation Coverage</span>
                          <span className="text-xs font-bold text-primary">
                            {analytics.documentationCoverage}%
                          </span>
                        </div>
                        <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                            style={{ width: `${analytics.documentationCoverage}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <Play className="h-3 w-3 text-blue-500" />
                            <span>Total Executions</span>
                          </div>
                          <span className="font-semibold">{analytics.totalExecutions}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-amber-500" />
                            <span>Avg Response Time</span>
                          </div>
                          <span className="font-semibold">{analytics.avgResponseTime}ms</span>
                        </div>
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-3 w-3 text-red-500" />
                            <span>Error Rate</span>
                          </div>
                          <span className="font-semibold">{analytics.errorRate}%</span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              {/* Quick Actions */}
              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2 h-9 text-xs sm:text-sm"
                    onClick={handleCopySpec}
                  >
                    <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Copy OpenAPI Spec
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2 h-9 text-xs sm:text-sm"
                    onClick={() => {
                      const specStr = JSON.stringify(openApiSpec, null, 2)
                      const blob = new Blob([specStr], { type: 'application/json' })
                      const url = URL.createObjectURL(blob)
                      window.open(`https://redocly.github.io/redoc/?url=${encodeURIComponent(url)}`, '_blank')
                    }}
                  >
                    <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Open in ReDoc
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2 h-9 text-xs sm:text-sm"
                    onClick={() => setActiveView(activeView === 'swagger' ? 'redoc' : 'swagger')}
                  >
                    <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Switch to {activeView === 'swagger' ? 'ReDoc' : 'Swagger'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2 h-9 text-xs sm:text-sm"
                    onClick={() => handleExport('POSTMAN')}
                  >
                    <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Export to Postman
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Main Documentation Area */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Documentation Header */}
            <div className="border-b p-3 sm:p-4 md:p-6 flex-shrink-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${activeView === 'swagger' ? 'bg-blue-500/10 text-blue-600' : activeView === 'redoc' ? 'bg-purple-500/10 text-purple-600' : 'bg-gray-500/10 text-gray-600'}`}>
                      {activeView === 'swagger' ? <Globe className="h-4 w-4 sm:h-5 sm:w-5" /> : 
                       activeView === 'redoc' ? <Eye className="h-4 w-4 sm:h-5 sm:w-5" /> : 
                       <FileText className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-lg font-semibold truncate">
                        {activeView === 'swagger' ? 'Swagger UI' : 
                         activeView === 'redoc' ? 'ReDoc View' : 
                         'Markdown Documentation'}
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {activeView === 'swagger' ? 'Interactive API explorer with testing capabilities' : 
                         activeView === 'redoc' ? 'Beautiful, responsive documentation viewer' : 
                         'Clean, readable documentation format'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  {isMobile && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSidebarOpen(true)}
                      className="h-8 gap-1 flex-1 sm:flex-none"
                    >
                      <Menu className="h-3.5 w-3.5" />
                      <span className="text-xs">Info</span>
                    </Button>
                  )}
                  
                  <Select value={endpointFilter} onValueChange={setEndpointFilter}>
                    <SelectTrigger className="w-24 sm:w-28 md:w-32 text-xs sm:text-sm h-8 sm:h-9">
                      <Filter className="h-3.5 w-3.5 mr-1 sm:mr-2" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-xs sm:text-sm">All Methods</SelectItem>
                      <SelectItem value="get" className="text-xs sm:text-sm">GET</SelectItem>
                      <SelectItem value="post" className="text-xs sm:text-sm">POST</SelectItem>
                      <SelectItem value="put" className="text-xs sm:text-sm">PUT</SelectItem>
                      <SelectItem value="delete" className="text-xs sm:text-sm">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Tabs value={activeView} onValueChange={(v: any) => setActiveView(v)} className="w-full sm:w-auto">
                    <TabsList className="h-8 sm:h-9 w-full sm:w-auto">
                      <TabsTrigger value="swagger" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                        <Globe className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Swagger</span>
                        <span className="sm:hidden">Swagger</span>
                      </TabsTrigger>
                      <TabsTrigger value="redoc" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                        <Eye className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">ReDoc</span>
                        <span className="sm:hidden">ReDoc</span>
                      </TabsTrigger>
                      <TabsTrigger value="markdown" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                        <FileText className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Markdown</span>
                        <span className="sm:hidden">MD</span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </div>
            
            {/* Documentation Viewer */}
            <div className="flex-1 overflow-auto">
              <div className="min-h-full p-3 sm:p-4 md:p-6">
                {activeView === 'swagger' && openApiSpec && (
                  <div className="h-full">
                    <div className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                      Interactive API explorer - Click "Try it out" to test endpoints
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <SwaggerUI 
                        spec={openApiSpec} 
                        docExpansion="list"
                        defaultModelsExpandDepth={1}
                        displayOperationId={true}
                        showExtensions={true}
                      />
                    </div>
                  </div>
                )}
                
                {activeView === 'redoc' && openApiSpec && (
                  <div className="space-y-4 sm:space-y-6">
                    <Card className="border-primary/10 shadow-sm">
                      <CardHeader className="border-b p-3 sm:p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                          <div className="min-w-0">
                            <CardTitle className="text-base sm:text-lg truncate">ReDoc Documentation</CardTitle>
                            <CardDescription className="text-xs sm:text-sm truncate">
                              Professional API documentation with search and mobile support
                            </CardDescription>
                          </div>
                          <Button 
                            onClick={() => {
                              const specStr = JSON.stringify(openApiSpec, null, 2)
                              const blob = new Blob([specStr], { type: 'application/json' })
                              const url = URL.createObjectURL(blob)
                              window.open(`https://redocly.github.io/redoc/?url=${encodeURIComponent(url)}`, '_blank')
                            }}
                            className="gap-2 h-9 sm:h-10 text-xs sm:text-sm w-full sm:w-auto mt-2 sm:mt-0"
                          >
                            <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Open in ReDoc</span>
                            <span className="sm:hidden">Open ReDoc</span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-4 md:p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-4 sm:space-y-6">
                            <div className="rounded-xl border bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background p-4 sm:p-6">
                              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/10">
                                  <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-semibold text-sm sm:text-base truncate">ReDoc Features</h3>
                                  <p className="text-xs text-muted-foreground truncate">Professional documentation viewer</p>
                                </div>
                              </div>
                              <ul className="space-y-1.5 sm:space-y-2">
                                <li className="flex items-center gap-2 text-xs sm:text-sm">
                                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                                  <span>Responsive design for all devices</span>
                                </li>
                                <li className="flex items-center gap-2 text-xs sm:text-sm">
                                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                                  <span>Advanced search functionality</span>
                                </li>
                                <li className="flex items-center gap-2 text-xs sm:text-sm">
                                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                                  <span>Dark/light theme support</span>
                                </li>
                                <li className="flex items-center gap-2 text-xs sm:text-sm">
                                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                                  <span>Code samples generation</span>
                                </li>
                              </ul>
                            </div>
                            
                            <div className="space-y-3 sm:space-y-4">
                              <h4 className="font-semibold text-sm sm:text-base">Endpoints Preview</h4>
                              {Object.entries(openApiSpec.paths || {}).slice(0, 3).map(([path, methods]) => (
                                <Card key={path} className="border">
                                  <CardContent className="p-3 sm:p-4">
                                    <div className="space-y-2 sm:space-y-3">
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <code className="font-mono text-xs sm:text-sm font-semibold truncate">{path}</code>
                                        <div className="flex gap-1">
                                          {Object.keys(methods).map(method => (
                                            <Badge 
                                              key={method} 
                                              variant="outline"
                                              className="text-xs px-1.5 py-0"
                                              style={{
                                                backgroundColor: 
                                                  method === 'get' ? 'rgba(59, 130, 246, 0.1)' :
                                                  method === 'post' ? 'rgba(34, 197, 94, 0.1)' :
                                                  'rgba(156, 163, 175, 0.1)',
                                                color:
                                                  method === 'get' ? 'rgb(59, 130, 246)' :
                                                  method === 'post' ? 'rgb(34, 197, 94)' :
                                                  'rgb(156, 163, 175)'
                                              }}
                                            >
                                              {method.toUpperCase()}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                      {(methods as any).get?.summary && (
                                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                          {(methods as any).get.summary}
                                        </p>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-4 sm:space-y-6">
                            <div className="rounded-xl border p-4 sm:p-6">
                              <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-4">Open in ReDoc</h4>
                              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                                ReDoc provides a beautiful, responsive documentation experience with search functionality and code samples.
                              </p>
                              <Button 
                                onClick={() => {
                                  const specStr = JSON.stringify(openApiSpec, null, 2)
                                  const blob = new Blob([specStr], { type: 'application/json' })
                                  const url = URL.createObjectURL(blob)
                                  window.open(`https://redocly.github.io/redoc/?url=${encodeURIComponent(url)}`, '_blank')
                                }}
                                className="w-full gap-2 h-9 sm:h-10 text-xs sm:text-sm bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                              >
                                <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                Launch ReDoc Viewer
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                              <Card className="border">
                                <CardContent className="p-3 text-center">
                                  <Smartphone className="h-6 w-6 sm:h-7 sm:w-7 mx-auto text-muted-foreground mb-1 sm:mb-2" />
                                  <p className="text-xs sm:text-sm font-medium">Mobile Ready</p>
                                  <p className="text-xs text-muted-foreground">Perfect on phones</p>
                                </CardContent>
                              </Card>
                              <Card className="border">
                                <CardContent className="p-3 text-center">
                                  <Search className="h-6 w-6 sm:h-7 sm:w-7 mx-auto text-muted-foreground mb-1 sm:mb-2" />
                                  <p className="text-xs sm:text-sm font-medium">Search</p>
                                  <p className="text-xs text-muted-foreground">Find endpoints fast</p>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {activeView === 'markdown' && openApiSpec && (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {/* Mobile-friendly markdown view */}
                    <div className="rounded-xl border bg-gradient-to-br from-muted/50 to-background p-4 sm:p-6 mb-4 sm:mb-6">
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 truncate">{openApiSpec.info.title}</h1>
                      <p className="text-sm sm:text-base md:text-lg text-muted-foreground line-clamp-2">
                        {openApiSpec.info.description || 'API Documentation'}
                      </p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 my-4 sm:my-6">
                        <div className="border rounded-lg p-2 sm:p-3 md:p-4 text-center">
                          <div className="text-xs sm:text-sm font-semibold text-muted-foreground mb-1">Version</div>
                          <div className="text-base sm:text-lg md:text-xl font-bold truncate">{openApiSpec.info.version}</div>
                        </div>
                        <div className="border rounded-lg p-2 sm:p-3 md:p-4 text-center">
                          <div className="text-xs sm:text-sm font-semibold text-muted-foreground mb-1">Base URL</div>
                          <div className="text-xs font-mono truncate">{openApiSpec.servers?.[0]?.url}</div>
                        </div>
                        <div className="border rounded-lg p-2 sm:p-3 md:p-4 text-center">
                          <div className="text-xs sm:text-sm font-semibold text-muted-foreground mb-1">Endpoints</div>
                          <div className="text-base sm:text-lg md:text-xl font-bold">{Object.keys(openApiSpec.paths || {}).length}</div>
                        </div>
                        <div className="border rounded-lg p-2 sm:p-3 md:p-4 text-center">
                          <div className="text-xs sm:text-sm font-semibold text-muted-foreground mb-1">Last Updated</div>
                          <div className="text-xs sm:text-sm font-medium truncate">{format(new Date(), 'MMM d, yyyy')}</div>
                        </div>
                      </div>
                    </div>
                    
                    <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">API Endpoints</h2>
                    <div className="space-y-4 sm:space-y-6">
                      {Object.entries(openApiSpec.paths || {}).map(([path, methods]) => (
                        <div key={path} className="border rounded-xl overflow-hidden" data-path={path}>
                          <div 
                            className="bg-muted/50 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 border-b cursor-pointer"
                            onClick={() => {
                              if (isMobile) {
                                setMobileTableExpanded(mobileTableExpanded === path ? null : path)
                              }
                            }}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <code className="font-mono font-semibold text-sm sm:text-base md:text-lg truncate">{path}</code>
                              <div className="flex gap-1 sm:gap-2">
                                {Object.keys(methods).map(method => (
                                  <Badge 
                                    key={method}
                                    className={`text-xs px-1.5 py-0 ${isMobile ? 'text-xs' : ''} ${
                                      method === 'get' ? 'bg-blue-500 text-white' :
                                      method === 'post' ? 'bg-green-500 text-white' :
                                      method === 'put' ? 'bg-amber-500 text-white' :
                                      method === 'delete' ? 'bg-red-500 text-white' :
                                      method === 'patch' ? 'bg-purple-500 text-white' :
                                      'bg-gray-500 text-white'
                                    }`}
                                  >
                                    {method.toUpperCase()}
                                  </Badge>
                                ))}
                                {isMobile && (
                                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${
                                    mobileTableExpanded === path ? 'rotate-180' : ''
                                  }`} />
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Desktop view - always expanded */}
                          {!isMobile && (
                            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                              {Object.entries(methods).map(([method, details]: [string, any]) => (
                                <div key={method} className="border-l-4 border-muted pl-3 sm:pl-4">
                                  <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2 flex-wrap">
                                    <Badge 
                                      className={`text-xs sm:text-sm px-1.5 py-0 sm:px-2 sm:py-1 ${
                                        method === 'get' ? 'bg-blue-500' :
                                        method === 'post' ? 'bg-green-500' :
                                        method === 'put' ? 'bg-amber-500' :
                                        method === 'delete' ? 'bg-red-500' :
                                        'bg-gray-500'
                                      }`}
                                    >
                                      {method.toUpperCase()}
                                    </Badge>
                                    <h3 className="font-semibold text-sm sm:text-base truncate">{details.summary || 'Endpoint'}</h3>
                                  </div>
                                  
                                  {details.description && (
                                    <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                                      {details.description}
                                    </p>
                                  )}
                                  
                                  {details.parameters && details.parameters.length > 0 && (
                                    <div className="mb-3 sm:mb-4">
                                      <h4 className="text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">Parameters</h4>
                                      <div className="overflow-x-auto">
                                        <table className="w-full text-xs sm:text-sm border rounded-lg">
                                          <thead className="bg-muted/50">
                                            <tr>
                                              <th className="text-left p-2">Name</th>
                                              <th className="text-left p-2">Type</th>
                                              <th className="text-left p-2">Required</th>
                                              <th className="text-left p-2">Description</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {details.parameters.map((param: any, idx: number) => (
                                              <tr key={idx} className="border-t">
                                                <td className="p-2 font-mono font-medium truncate">{param.name}</td>
                                                <td className="p-2">
                                                  <Badge variant="outline" className="text-xs">
                                                    {param.schema?.type || 'string'}
                                                  </Badge>
                                                </td>
                                                <td className="p-2">
                                                  {param.required ? 
                                                    <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" /> : 
                                                    <X className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />}
                                                </td>
                                                <td className="p-2 truncate">{param.description || '-'}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {details.responses && (
                                    <div>
                                      <h4 className="text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">Responses</h4>
                                      <div className="space-y-1.5">
                                        {Object.entries(details.responses).map(([code, response]: [string, any]) => (
                                          <div key={code} className="flex items-start gap-2">
                                            <Badge variant="outline" className="shrink-0 text-xs">
                                              {code}
                                            </Badge>
                                            <span className="text-xs sm:text-sm truncate">{response.description}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Mobile view - expandable */}
                          {isMobile && mobileTableExpanded === path && (
                            <div className="p-3 space-y-4">
                              {Object.entries(methods).map(([method, details]: [string, any]) => (
                                <div key={method} className="border-l-4 border-muted pl-3">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <Badge 
                                      className={`text-xs px-1.5 py-0 ${
                                        method === 'get' ? 'bg-blue-500' :
                                        method === 'post' ? 'bg-green-500' :
                                        method === 'put' ? 'bg-amber-500' :
                                        method === 'delete' ? 'bg-red-500' :
                                        'bg-gray-500'
                                      }`}
                                    >
                                      {method.toUpperCase()}
                                    </Badge>
                                    <h3 className="font-semibold text-sm truncate">{details.summary || 'Endpoint'}</h3>
                                  </div>
                                  
                                  {details.description && (
                                    <p className="text-muted-foreground text-xs mb-2 line-clamp-3">
                                      {details.description}
                                    </p>
                                  )}
                                  
                                  {details.parameters && details.parameters.length > 0 && (
                                    <div className="mb-3">
                                      <h4 className="text-xs font-semibold mb-1.5">Parameters</h4>
                                      <div className="space-y-2">
                                        {details.parameters.slice(0, 3).map((param: any, idx: number) => (
                                          <div key={idx} className="flex items-start justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                              <code className="font-mono font-medium bg-muted/50 px-2 py-1 rounded">
                                                {param.name}
                                              </code>
                                              <Badge variant="outline" className="text-xs">
                                                {param.schema?.type || 'string'}
                                              </Badge>
                                            </div>
                                            <div>
                                              {param.required ? 
                                                <Check className="h-3 w-3 text-green-500" /> : 
                                                <X className="h-3 w-3 text-gray-400" />}
                                            </div>
                                          </div>
                                        ))}
                                        {details.parameters.length > 3 && (
                                          <div className="text-xs text-muted-foreground">
                                            +{details.parameters.length - 3} more parameters
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {details.responses && (
                                    <div>
                                      <h4 className="text-xs font-semibold mb-1.5">Responses</h4>
                                      <div className="space-y-1">
                                        {Object.entries(details.responses).slice(0, 3).map(([code, response]: [string, any]) => (
                                          <div key={code} className="flex items-start gap-2 text-xs">
                                            <Badge variant="outline" className="shrink-0">
                                              {code}
                                            </Badge>
                                            <span className="truncate">{response.description}</span>
                                          </div>
                                        ))}
                                        {Object.keys(details.responses).length > 3 && (
                                          <div className="text-xs text-muted-foreground">
                                            +{Object.keys(details.responses).length - 3} more responses
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Footer */}
      <div className="border-t px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-muted/20 flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0"></div>
              <span className="text-muted-foreground truncate">Documentation Ready</span>
            </div>
            <div className="text-muted-foreground truncate">
              {analytics?.totalEndpoints || 0} endpoints • {analytics?.documentationCoverage || 0}% documented
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto mt-1 sm:mt-0">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 sm:h-8 gap-1 sm:gap-2 flex-1 sm:flex-none text-xs"
              onClick={() => handleExport('OPENAPI')}
            >
              <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="hidden sm:inline">Export OpenAPI</span>
              <span className="sm:hidden">Export</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 sm:h-8 gap-1 sm:gap-2 flex-1 sm:flex-none text-xs"
              onClick={handleCopyApiUrl}
            >
              <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="hidden sm:inline">Copy Base URL</span>
              <span className="sm:hidden">Copy URL</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}