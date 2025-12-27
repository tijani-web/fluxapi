'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { Webhook, CreateWebhook, UpdateWebhook, WebhookDelivery } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Plus, 
  WebhookIcon, 
  MoreVertical, 
  Trash2, 
  Edit, 
  Copy, 
  Eye, 
  Send,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Activity,
  Zap,
  Bell,
  Shield,
  AlertCircle,
  Download,
  Filter,
  Search,
  Link,
  Globe,
  Calendar,
  BarChart,
  Hash,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Settings,
  History,
  TestTube,
  List,
  Grid,
  Menu,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format, formatDistanceToNow } from 'date-fns'

interface WebhooksSectionProps {
  projectId: string
}

type WebhookEvent = 'endpoint.created' | 'endpoint.updated' | 'endpoint.deleted' | 'endpoint.executed' | 'mockdata.created' | 'mockdata.updated' | 'mockdata.deleted' | 'project.updated' | 'ai.generated' | 'custom'

interface ToastOptions {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function WebhooksSection({ projectId }: WebhooksSectionProps) {
  const { toast } = useToast()
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTestModal, setShowTestModal] = useState(false)
  const [activeTab, setActiveTab] = useState('webhooks')
  const [testPayload, setTestPayload] = useState('{"event": "test", "data": {}}')
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileTableExpanded, setMobileTableExpanded] = useState<string | null>(null)
  
  // Check screen size - improved breakpoints
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      
      // Auto-open sidebar on desktop, close on mobile
      if (width >= 768) {
        setSidebarOpen(true)
        if (width < 1024 && viewMode === 'detail') {
          setViewMode('list')
        }
      } else {
        setSidebarOpen(false)
      }
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [viewMode])
  
  // Load webhooks
  const loadWebhooks = useCallback(async () => {
    try {
      const data = await api.getWebhooks(projectId)
      setWebhooks(data)
      // Auto-select first webhook if none selected
      if (!selectedWebhook && data.length > 0) {
        setSelectedWebhook(data[0])
      }
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to load webhooks', 
        variant: 'destructive' 
      })
    } finally {
      setLoading(false)
    }
  }, [projectId, toast, selectedWebhook])
  
  // Load deliveries for selected webhook
  const loadDeliveries = useCallback(async (webhookId: string) => {
    try {
      const data = await api.getWebhookDeliveries(webhookId, 50)
      setDeliveries(data)
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to load deliveries', 
        variant: 'destructive' 
      })
    }
  }, [toast])
  
  useEffect(() => {
    loadWebhooks()
  }, [loadWebhooks])
  
  useEffect(() => {
    if (selectedWebhook) {
      loadDeliveries(selectedWebhook.id)
    }
  }, [selectedWebhook, loadDeliveries])
  
  // Filter webhooks based on search
  const filteredWebhooks = webhooks.filter(webhook =>
    webhook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    webhook.url.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Create webhook
  const handleCreateWebhook = async (data: CreateWebhook) => {
    try {
      const webhook = await api.createWebhook(projectId, data)
      setWebhooks(prev => [webhook, ...prev])
      setSelectedWebhook(webhook)
      setViewMode('detail')
      setActiveTab('webhooks')
      setSidebarOpen(!isMobile)
      toast({ 
        title: 'Success', 
        description: 'Webhook created successfully' 
      })
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message, 
        variant: 'destructive' 
      })
    }
  }
  
  // Update webhook
  const handleUpdateWebhook = async (webhookId: string, data: UpdateWebhook) => {
    try {
      const updated = await api.updateWebhook(webhookId, data)
      setWebhooks(prev => prev.map(w => w.id === webhookId ? updated : w))
      if (selectedWebhook?.id === webhookId) setSelectedWebhook(updated)
      if (editingWebhook?.id === webhookId) setEditingWebhook(null)
      toast({ 
        title: 'Success', 
        description: 'Webhook updated successfully' 
      })
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message, 
        variant: 'destructive' 
      })
    }
  }
  
  // Delete webhook
  const handleDeleteWebhook = async (webhookId: string) => {
    if (!confirm('Are you sure you want to delete this webhook?')) return
    try {
      await api.deleteWebhook(webhookId)
      setWebhooks(prev => prev.filter(w => w.id !== webhookId))
      if (selectedWebhook?.id === webhookId) {
        const otherWebhooks = webhooks.filter(w => w.id !== webhookId)
        setSelectedWebhook(otherWebhooks.length > 0 ? otherWebhooks[0] : null)
      }
      toast({ 
        title: 'Success', 
        description: 'Webhook deleted successfully' 
      })
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message, 
        variant: 'destructive' 
      })
    }
  }
  
  // Trigger webhook
  const handleTriggerWebhook = async (webhookId: string, payload: any) => {
    try {
      const result = await api.triggerWebhook(webhookId, payload)
      toast({ 
        title: 'Webhook triggered', 
        description: 'Test webhook has been sent successfully' 
      })
      if (selectedWebhook?.id === webhookId) {
        loadDeliveries(webhookId)
      }
      return result
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message, 
        variant: 'destructive' 
      })
    }
  }
  
  // Toggle webhook active state
  const handleToggleActive = async (webhook: Webhook) => {
    await handleUpdateWebhook(webhook.id, { isActive: !webhook.isActive })
  }
  
  // Copy webhook URL
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({ 
      title: 'Copied to clipboard', 
      description: 'Webhook URL has been copied' 
    })
  }
  
  // Copy secret
  const handleCopySecret = (secret: string) => {
    navigator.clipboard.writeText(secret)
    toast({ 
      title: 'Copied to clipboard', 
      description: 'Secret has been copied' 
    })
  }

  // Format event name
  const formatEventName = (event: string) => {
    return event.replace('.', ' - ')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-fit">
            <div className="h-12 w-12 rounded-full border-2 border-primary/30"></div>
            <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
          <div>
            <p className="text-sm font-medium">Loading Webhooks</p>
            <p className="text-xs text-muted-foreground">Fetching your webhook configuration...</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header - Fully responsive */}
      <div className="border-b p-3 sm:p-4 md:p-6 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border">
              <WebhookIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-7 md:w-7 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight truncate">Webhooks</h1>
                {webhooks.length > 0 && (
                  <Badge variant="outline" className="px-2.5 py-1 text-xs font-medium hidden sm:inline-flex">
                    {webhooks.length} {webhooks.length === 1 ? 'webhook' : 'webhooks'}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base mt-0.5 sm:mt-1 line-clamp-2">
                Receive real-time notifications and integrate with external services
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-3 sm:mt-0">
            {webhooks.length > 0 && selectedWebhook && viewMode === 'detail' && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setViewMode('list')
                  setActiveTab('webhooks')
                }} 
                className="gap-1 sm:gap-2 min-h-[36px] px-2 sm:px-3"
                size="sm"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Back</span>
                <span className="sm:hidden text-xs">Back</span>
              </Button>
            )}
            <Button 
              onClick={() => setShowCreateModal(true)} 
              className="gap-1 sm:gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary min-h-[36px] px-2 sm:px-3 flex-1 sm:flex-none"
              size="sm"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Create Webhook</span>
              <span className="sm:hidden text-xs">Create</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Navigation Tabs - Touch-friendly */}
      <div className="border-b flex-shrink-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-2 sm:px-4 md:px-6">
            <TabsList className="grid grid-cols-3 w-full h-auto min-h-[44px]">
              <TabsTrigger value="webhooks" className="py-2.5 text-xs sm:text-sm min-h-[44px] flex items-center justify-center gap-1 sm:gap-2">
                <WebhookIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">Webhooks</span>
              </TabsTrigger>
              <TabsTrigger value="deliveries" className="py-2.5 text-xs sm:text-sm min-h-[44px] flex items-center justify-center gap-1 sm:gap-2" disabled={!selectedWebhook}>
                <Activity className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">Deliveries</span>
              </TabsTrigger>
              <TabsTrigger value="test" className="py-2.5 text-xs sm:text-sm min-h-[44px] flex items-center justify-center gap-1 sm:gap-2" disabled={!selectedWebhook}>
                <TestTube className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">Test</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          
          {/* Webhooks Tab Content */}
          <TabsContent value="webhooks" className="h-full p-0 m-0 overflow-y-auto">
            <div className="p-3 sm:p-4 md:p-6">
              {webhooks.length === 0 ? (
                // Empty State - Responsive
                <div className="min-h-[400px] flex items-center justify-center p-4">
                  <div className="max-w-md text-center space-y-4 sm:space-y-6">
                    <div className="relative mx-auto w-fit">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <WebhookIcon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-primary" />
                      </div>
                      <div className="absolute -top-2 -right-2 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold">No webhooks yet</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm">
                        Create your first webhook to receive real-time notifications about your API endpoints, mock data changes, and project updates.
                      </p>
                    </div>
                    <div className="pt-2 sm:pt-4">
                      <Button 
                        onClick={() => setShowCreateModal(true)} 
                        size="lg"
                        className="gap-2 w-full sm:w-auto min-h-[44px]"
                      >
                        <Plus className="h-4 w-4" />
                        Create Your First Webhook
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 pt-4 sm:pt-6 md:pt-8 text-xs sm:text-sm">
                      <div className="space-y-1">
                        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                          <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        </div>
                        <p className="font-medium truncate text-xs sm:text-sm">Real-time</p>
                      </div>
                      <div className="space-y-1">
                        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                          <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        </div>
                        <p className="font-medium truncate text-xs sm:text-sm">Logs</p>
                      </div>
                      <div className="space-y-1">
                        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                          <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        </div>
                        <p className="font-medium truncate text-xs sm:text-sm">Secure</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : viewMode === 'list' ? (
                // List View - Responsive grid
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-lg font-semibold">Your Webhooks</h2>
                      <p className="text-muted-foreground text-xs sm:text-sm hidden sm:block">
                        Select a webhook to view details, manage settings, and see delivery history
                      </p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 sm:flex-none sm:w-48">
                        <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search webhooks..."
                          className="pl-8 sm:pl-9 text-xs sm:text-sm h-9 sm:h-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button variant="outline" size="icon" className="hidden sm:inline-flex h-10 w-10">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid gap-3 sm:gap-4">
                    {filteredWebhooks.map((webhook) => (
                      <Card 
                        key={webhook.id}
                        className={`group hover:shadow-md transition-shadow cursor-pointer border ${selectedWebhook?.id === webhook.id ? 'ring-1 sm:ring-2 ring-primary' : ''}`}
                        onClick={() => {
                          setSelectedWebhook(webhook)
                          setViewMode('detail')
                          if (isMobile) {
                            setSidebarOpen(false)
                          }
                        }}
                      >
                        <CardContent className="p-3 sm:p-4 md:p-6">
                          <div className="flex items-start justify-between gap-2 sm:gap-3">
                            <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                              <div className="flex items-start gap-2 sm:gap-3">
                                <div className={`p-1.5 rounded-lg flex-shrink-0 ${webhook.isActive ? 'bg-green-500/10 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                  {webhook.isActive ? (
                                    <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                                  ) : (
                                    <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                    <h3 className="font-semibold text-sm sm:text-base md:text-lg truncate">{webhook.name}</h3>
                                    <Badge variant={webhook.isActive ? "default" : "secondary"} className="text-xs px-1.5 py-0">
                                      {webhook.isActive ? 'ACTIVE' : 'PAUSED'}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                                    <Link className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">{webhook.url}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm flex-wrap">
                                <div className="flex items-center gap-1 sm:gap-1.5">
                                  <Hash className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                  <span className="font-medium">{webhook.events.length}</span>
                                  <span className="text-muted-foreground hidden sm:inline">events</span>
                                  <span className="text-muted-foreground sm:hidden">ev</span>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-1.5">
                                  <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                                  <span className="font-medium text-green-600">{webhook.successCount}</span>
                                  <span className="text-muted-foreground hidden sm:inline">success</span>
                                  <span className="text-muted-foreground sm:hidden">ok</span>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-1.5">
                                  <XCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                                  <span className="font-medium text-red-600">{webhook.failureCount}</span>
                                  <span className="text-muted-foreground hidden sm:inline">failed</span>
                                  <span className="text-muted-foreground sm:hidden">fail</span>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-1 sm:gap-2 pt-1 sm:pt-2">
                                {webhook.events.slice(0, isMobile ? 1 : 2).map((event) => (
                                  <Badge key={event} variant="outline" className="text-xs font-normal px-1.5 py-0">
                                    {formatEventName(event)}
                                  </Badge>
                                ))}
                                {webhook.events.length > (isMobile ? 1 : 2) && (
                                  <Badge variant="outline" className="text-xs font-normal px-1.5 py-0">
                                    +{webhook.events.length - (isMobile ? 1 : 2)} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-0.5 sm:gap-1 ml-1 sm:ml-2 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 sm:h-8 sm:w-8 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedWebhook(webhook)
                                  setShowTestModal(true)
                                }}
                              >
                                <Send className="h-3.5 w-3.5" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-7 w-7 sm:h-8 sm:w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="min-w-[180px]">
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedWebhook(webhook)
                                    setViewMode('detail')
                                  }}>
                                    <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setEditingWebhook(webhook)}>
                                    <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                                    Edit Webhook
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleCopyUrl(webhook.url)}>
                                    <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                                    Copy URL
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedWebhook(webhook)
                                    setShowTestModal(true)
                                  }}>
                                    <TestTube className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                                    Test Webhook
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleToggleActive(webhook)}>
                                    {webhook.isActive ? (
                                      <>
                                        <Pause className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                                        Pause Webhook
                                      </>
                                    ) : (
                                      <>
                                        <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                                        Activate Webhook
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteWebhook(webhook.id)
                                    }}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                                    Delete Webhook
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground ml-0.5 hidden sm:block" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                // Detail View - Responsive
                <div className="space-y-4 sm:space-y-6">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between sm:hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSidebarOpen(true)}
                      className="h-9 w-9"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                    <h2 className="text-base font-semibold truncate px-2">
                      {selectedWebhook?.name}
                    </h2>
                    <div className="w-9"></div>
                  </div>

                  {/* Mobile Sidebar Drawer - Improved */}
                  {isMobile && sidebarOpen && (
                    <div className="fixed inset-0 z-50 bg-black/50 animate-in fade-in" onClick={() => setSidebarOpen(false)}>
                      <div 
                        className="absolute left-0 top-0 h-full w-full max-w-xs bg-background border-r shadow-lg animate-in slide-in-from-left"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-4 border-b flex items-center justify-between">
                          <h3 className="font-semibold text-sm">All Webhooks</h3>
                          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="h-8 w-8">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="h-[calc(100%-4rem)] overflow-y-auto p-2 space-y-1">
                          {webhooks.map((webhook) => (
                            <div
                              key={webhook.id}
                              className={`p-3 cursor-pointer transition-colors rounded-lg ${selectedWebhook?.id === webhook.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted'}`}
                              onClick={() => {
                                setSelectedWebhook(webhook)
                                setSidebarOpen(false)
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className={`h-2 w-2 rounded-full flex-shrink-0 ${webhook.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                                  <span className="font-medium truncate text-sm">{webhook.name}</span>
                                </div>
                                <Badge variant="outline" className="text-xs px-1.5 py-0 flex-shrink-0">
                                  {webhook.successCount}/{webhook.successCount + webhook.failureCount}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground truncate mt-1">{webhook.url}</p>
                            </div>
                          ))}
                          <div className="p-3 pt-4">
                            <Button 
                              onClick={() => {
                                setShowCreateModal(true)
                                setSidebarOpen(false)
                              }} 
                              className="w-full gap-2 min-h-[44px]"
                              variant="outline"
                              size="sm"
                            >
                              <Plus className="h-4 w-4" />
                              New Webhook
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* Webhook List Sidebar - Desktop */}
                    <div className="lg:col-span-1 space-y-4 hidden lg:block">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">All Webhooks</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="space-y-1">
                            {webhooks.map((webhook) => (
                              <div
                                key={webhook.id}
                                className={`p-3 cursor-pointer transition-colors ${selectedWebhook?.id === webhook.id ? 'bg-primary/10 border-r-2 border-primary' : 'hover:bg-muted'}`}
                                onClick={() => setSelectedWebhook(webhook)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className={`h-2 w-2 rounded-full flex-shrink-0 ${webhook.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                                    <span className="font-medium truncate text-sm">{webhook.name}</span>
                                  </div>
                                  <Badge variant="outline" className="text-xs px-1.5 py-0 flex-shrink-0">
                                    {webhook.successCount}/{webhook.successCount + webhook.failureCount}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground truncate mt-1">{webhook.url}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <Button 
                            onClick={() => setShowCreateModal(true)} 
                            className="w-full gap-2 min-h-[44px]"
                            variant="outline"
                          >
                            <Plus className="h-4 w-4" />
                            New Webhook
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Main Detail Area */}
                    <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <div className={`p-2 rounded-lg flex-shrink-0 ${selectedWebhook?.isActive ? 'bg-green-500/10 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                            {selectedWebhook?.isActive ? (
                              <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                            ) : (
                              <Pause className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">{selectedWebhook?.name}</h1>
                            <p className="text-muted-foreground text-xs sm:text-sm flex items-center gap-1 truncate">
                              <Globe className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{selectedWebhook?.url}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                          <Button
                            variant="outline"
                            onClick={() => selectedWebhook && handleToggleActive(selectedWebhook)}
                            disabled={!selectedWebhook}
                            size="sm"
                            className="flex-1 sm:flex-none min-h-[36px] px-2 sm:px-3"
                          >
                            {selectedWebhook?.isActive ? (
                              <>
                                <Pause className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Pause</span>
                                <span className="sm:hidden text-xs">Pause</span>
                              </>
                            ) : (
                              <>
                                <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Activate</span>
                                <span className="sm:hidden text-xs">Activate</span>
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => selectedWebhook && handleCopyUrl(selectedWebhook.url)}
                            disabled={!selectedWebhook}
                            size="sm"
                            className="flex-1 sm:flex-none min-h-[36px] px-2 sm:px-3"
                          >
                            <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Copy URL</span>
                            <span className="sm:hidden text-xs">Copy</span>
                          </Button>
                          <Button 
                            onClick={() => setShowTestModal(true)}
                            disabled={!selectedWebhook}
                            size="sm"
                            className="flex-1 sm:flex-none min-h-[36px] px-2 sm:px-3"
                          >
                            <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Test</span>
                            <span className="sm:hidden text-xs">Test</span>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid gap-4 sm:gap-6">
                        {/* Stats Cards - Fully responsive grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                          <Card>
                            <CardContent className="p-2.5 sm:p-3 md:p-4">
                              <div className="space-y-1 sm:space-y-2">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <div className="p-1 rounded-md sm:rounded-lg bg-green-500/10 flex-shrink-0">
                                    <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-green-600" />
                                  </div>
                                  <span className="text-xs sm:text-sm font-medium truncate">Success Rate</span>
                                </div>
                                <div className="text-base sm:text-lg md:text-2xl font-bold">
                                  {selectedWebhook && selectedWebhook.successCount + selectedWebhook.failureCount > 0
                                    ? Math.round((selectedWebhook.successCount / (selectedWebhook.successCount + selectedWebhook.failureCount)) * 100)
                                    : 0}%
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                  {selectedWebhook?.successCount} of {selectedWebhook && selectedWebhook.successCount + selectedWebhook.failureCount}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-2.5 sm:p-3 md:p-4">
                              <div className="space-y-1 sm:space-y-2">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <div className="p-1 rounded-md sm:rounded-lg bg-blue-500/10 flex-shrink-0">
                                    <Activity className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-blue-600" />
                                  </div>
                                  <span className="text-xs sm:text-sm font-medium truncate">Total Deliveries</span>
                                </div>
                                <div className="text-base sm:text-lg md:text-2xl font-bold">
                                  {selectedWebhook && selectedWebhook.successCount + selectedWebhook.failureCount}
                                </div>
                                <p className="text-xs text-muted-foreground">All time</p>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-2.5 sm:p-3 md:p-4">
                              <div className="space-y-1 sm:space-y-2">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <div className="p-1 rounded-md sm:rounded-lg bg-purple-500/10 flex-shrink-0">
                                    <Hash className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-purple-600" />
                                  </div>
                                  <span className="text-xs sm:text-sm font-medium truncate">Events</span>
                                </div>
                                <div className="text-base sm:text-lg md:text-2xl font-bold">
                                  {selectedWebhook?.events.length || 0}
                                </div>
                                <p className="text-xs text-muted-foreground">Trigger events</p>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-2.5 sm:p-3 md:p-4">
                              <div className="space-y-1 sm:space-y-2">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <div className="p-1 rounded-md sm:rounded-lg bg-orange-500/10 flex-shrink-0">
                                    <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-orange-600" />
                                  </div>
                                  <span className="text-xs sm:text-sm font-medium truncate">Created</span>
                                </div>
                                <div className="text-sm sm:text-base md:text-lg font-semibold">
                                  {selectedWebhook ? format(new Date(selectedWebhook.createdAt), 'MMM d') : '-'}
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                  {selectedWebhook ? formatDistanceToNow(new Date(selectedWebhook.createdAt), { addSuffix: true }) : '-'}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        {/* Events & Details - Stack on mobile */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                          <Card>
                            <CardHeader className="pb-2 sm:pb-3">
                              <CardTitle className="text-sm sm:text-base">Events</CardTitle>
                              <CardDescription className="text-xs sm:text-sm">Triggers for this webhook</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-1 sm:space-y-2">
                                {selectedWebhook?.events.map((event) => (
                                  <div key={event} className="flex items-center justify-between p-1.5 sm:p-2 hover:bg-muted rounded text-xs sm:text-sm">
                                    <span className="font-medium truncate pr-2">{formatEventName(event)}</span>
                                    <Badge variant="secondary" className="text-xs px-1.5 py-0 flex-shrink-0">Active</Badge>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2 sm:pb-3">
                              <CardTitle className="text-sm sm:text-base">Configuration</CardTitle>
                              <CardDescription className="text-xs sm:text-sm">Webhook settings</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 sm:space-y-4">
                              <div>
                                <Label className="text-sm font-medium">Secret Key</Label>
                                <div className="flex gap-1 sm:gap-2 mt-1">
                                  <Input 
                                    value="••••••••••••••••••••" 
                                    readOnly 
                                    className="font-mono text-xs sm:text-sm h-9 sm:h-10"
                                  />
                                  <Button 
                                    variant="outline" 
                                    onClick={() => selectedWebhook?.secret && handleCopySecret(selectedWebhook.secret)}
                                    disabled={!selectedWebhook?.secret}
                                    size="icon"
                                    className="flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10"
                                  >
                                    <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                  </Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Used to verify webhook signatures
                                </p>
                              </div>
                              
                              <div>
                                <Label className="text-sm font-medium">Status</Label>
                                <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
                                  <div className={`h-2 w-2 rounded-full ${selectedWebhook?.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                                  <span className="text-sm">{selectedWebhook?.isActive ? 'Active' : 'Paused'}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Deliveries Tab Content - Mobile-optimized table */}
          <TabsContent value="deliveries" className="h-full p-0 m-0 overflow-y-auto">
            <div className="p-3 sm:p-4 md:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold">Webhook Deliveries</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Recent delivery attempts for {selectedWebhook?.name || 'all webhooks'}
                  </p>
                </div>
                
                {deliveries.length > 0 ? (
                  <div className="space-y-4">
                    {/* Mobile deliveries view */}
                    {isMobile && (
                      <div className="space-y-3">
                        {deliveries.map((delivery) => (
                          <Card key={delivery.id} className="overflow-hidden">
                            <div 
                              className="p-3 cursor-pointer"
                              onClick={() => setMobileTableExpanded(mobileTableExpanded === delivery.id ? null : delivery.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge variant={delivery.success ? "default" : "destructive"} className="text-xs">
                                    {delivery.success ? '✓' : '✗'}
                                  </Badge>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">{delivery.event || 'Manual'}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {format(new Date(delivery.createdAt), 'MMM d, HH:mm')}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">
                                    {delivery.responseTime ? `${delivery.responseTime}ms` : '-'}
                                  </span>
                                  {mobileTableExpanded === delivery.id ? (
                                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {mobileTableExpanded === delivery.id && (
                              <div className="border-t p-3 space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Status:</span>
                                  <span>{delivery.statusCode}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Response:</span>
                                  <span className="truncate ml-2">
                                    {delivery.responseBody?.substring(0, 30)}
                                    {delivery.responseBody && delivery.responseBody.length > 30 && '...'}
                                  </span>
                                </div>
                                <div className="pt-2">
                                  <Button variant="outline" size="sm" className="w-full">
                                    <Eye className="h-3.5 w-3.5 mr-2" />
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Card>
                        ))}
                      </div>
                    )}
                    
                    {/* Desktop table view */}
                    {!isMobile && (
                      <div className="overflow-x-auto rounded-lg border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[120px] text-xs sm:text-sm">Time</TableHead>
                              <TableHead className="w-[80px] text-xs sm:text-sm">Status</TableHead>
                              <TableHead className="text-xs sm:text-sm">Event</TableHead>
                              <TableHead className="text-xs sm:text-sm">Response</TableHead>
                              <TableHead className="w-[100px] text-xs sm:text-sm">Duration</TableHead>
                              <TableHead className="w-[60px] text-xs sm:text-sm">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {deliveries.map((delivery) => (
                              <TableRow key={delivery.id}>
                                <TableCell className="font-medium text-xs sm:text-sm">
                                  {format(new Date(delivery.createdAt), 'MMM d, HH:mm')}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={delivery.success ? "default" : "destructive"} className="text-xs">
                                    {delivery.success ? 'Success' : 'Failed'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="max-w-[120px] md:max-w-[200px] truncate text-xs sm:text-sm">
                                  {delivery.event || 'Manual'}
                                </TableCell>
                                <TableCell className="max-w-[150px] md:max-w-[300px]">
                                  <div className="truncate text-xs sm:text-sm">
                                    {delivery.statusCode} {delivery.responseBody?.substring(0, 30)}
                                    {delivery.responseBody && delivery.responseBody.length > 30 && '...'}
                                  </div>
                                </TableCell>
                                <TableCell className="text-xs sm:text-sm">
                                  {delivery.responseTime ? `${delivery.responseTime}ms` : '-'}
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                                    <Eye className="h-3.5 w-3.5" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <Activity className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto text-muted-foreground mb-2 sm:mb-3 md:mb-4" />
                    <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">No deliveries yet</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      {selectedWebhook 
                        ? 'Trigger this webhook to see delivery logs' 
                        : 'Select a webhook to view its delivery history'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Test Tab Content */}
          <TabsContent value="test" className="h-full p-0 m-0 overflow-y-auto">
            <div className="p-3 sm:p-4 md:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold">Test Webhook</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Manually trigger a webhook with custom payload
                  </p>
                </div>
                <Card>
                  <CardContent className="space-y-3 sm:space-y-4 md:space-y-6 pt-3 sm:pt-4 md:pt-6">
                    <div>
                      <Label className="text-sm">Select Webhook</Label>
                      <Select 
                        value={selectedWebhook?.id} 
                        onValueChange={(id) => {
                          const webhook = webhooks.find((w) => w.id === id)
                          setSelectedWebhook(webhook || null)
                        }}
                      >
                        <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                          <SelectValue placeholder="Choose a webhook to test" />
                        </SelectTrigger>
                        <SelectContent>
                          {webhooks.map((webhook) => (
                            <SelectItem key={webhook.id} value={webhook.id} className="text-xs sm:text-sm">
                              <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${webhook.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                                <span className="truncate">{webhook.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedWebhook && (
                      <div className="space-y-1 sm:space-y-2">
                        <Label className="text-sm">Target URL</Label>
                        <div className="flex gap-1 sm:gap-2">
                          <Input 
                            value={selectedWebhook.url} 
                            readOnly 
                            className="font-mono text-xs sm:text-sm h-9 sm:h-10"
                          />
                          <Button 
                            variant="outline" 
                            onClick={() => handleCopyUrl(selectedWebhook.url)}
                            size="icon"
                            className="flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10"
                          >
                            <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <Label className="text-sm">Test Payload (JSON)</Label>
                      <Textarea
                        value={testPayload}
                        onChange={(e) => setTestPayload(e.target.value)}
                        className="font-mono min-h-[150px] sm:min-h-[180px] md:min-h-[200px] text-xs sm:text-sm"
                        placeholder='{"event": "test", "data": {...}}'
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <Button 
                        onClick={async () => {
                          try {
                            JSON.parse(testPayload)
                          } catch {
                            toast({ 
                              title: 'Error', 
                              description: 'Invalid JSON format', 
                              variant: 'destructive' 
                            })
                            return
                          }
                          
                          if (!selectedWebhook) {
                            toast({ 
                              title: 'Error', 
                              description: 'Please select a webhook first', 
                              variant: 'destructive' 
                            })
                            return
                          }
                          
                          await handleTriggerWebhook(selectedWebhook.id, JSON.parse(testPayload))
                        }}
                        disabled={!selectedWebhook}
                        className="gap-1 sm:gap-2 flex-1 min-h-[44px] text-sm"
                      >
                        <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Trigger Webhook
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setTestPayload(JSON.stringify({
                            event: "test",
                            data: {
                              message: "Test webhook payload",
                              timestamp: new Date().toISOString(),
                              projectId: projectId,
                              userId: "test-user-123",
                              metadata: {
                                environment: "testing",
                                version: "1.0.0",
                                source: "webhook-test-ui"
                              }
                            }
                          }, null, 2))
                        }}
                        className="gap-1 sm:gap-2 flex-1 min-h-[44px] text-sm"
                      >
                        <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Load Sample
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Modals */}
      <CreateWebhookModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateWebhook}
        projectId={projectId}
        toast={toast}
      />
      
      {editingWebhook && (
        <EditWebhookModal
          webhook={editingWebhook}
          isOpen={!!editingWebhook}
          onClose={() => setEditingWebhook(null)}
          onSubmit={(data: UpdateWebhook) => handleUpdateWebhook(editingWebhook.id, data)}
          toast={toast}
        />
      )}
      
      {selectedWebhook && (
        <Dialog open={showTestModal} onOpenChange={setShowTestModal}>
          <DialogContent className="max-w-2xl w-[95vw] md:w-full">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                Test Webhook
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Send a test payload to {selectedWebhook.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label className="text-sm">Payload (JSON)</Label>
                <Textarea
                  value={testPayload}
                  onChange={(e) => setTestPayload(e.target.value)}
                  className="font-mono min-h-[120px] sm:min-h-[150px] md:min-h-[200px] text-xs sm:text-sm"
                  placeholder='{"event": "test", "data": {...}}'
                />
              </div>
              <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
                <span>The webhook will receive this exact JSON payload</span>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setShowTestModal(false)} className="w-full sm:w-auto min-h-[44px] text-sm">
                Cancel
              </Button>
              <Button onClick={async () => {
                try {
                  JSON.parse(testPayload)
                } catch {
                  toast({ 
                    title: 'Error', 
                    description: 'Invalid JSON format', 
                    variant: 'destructive' 
                  })
                  return
                }
                
                await handleTriggerWebhook(selectedWebhook.id, JSON.parse(testPayload))
                setShowTestModal(false)
              }} className="w-full sm:w-auto min-h-[44px] text-sm">
                <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                Send Test
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Create Webhook Modal Component - Made fully responsive
interface CreateWebhookModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateWebhook) => void
  projectId: string
  toast: (options: ToastOptions) => void
}

function CreateWebhookModal({ isOpen, onClose, onSubmit, toast }: CreateWebhookModalProps) {
  const [form, setForm] = useState({
    name: '',
    url: '',
    events: [] as string[],
    secret: '',
    isActive: true
  })
  
  const availableEvents: WebhookEvent[] = [
    'endpoint.created', 'endpoint.updated', 'endpoint.deleted', 'endpoint.executed',
    'mockdata.created', 'mockdata.updated', 'mockdata.deleted',
    'project.updated', 'ai.generated', 'custom'
  ]
  
  const eventCategories = {
    'Endpoints': ['endpoint.created', 'endpoint.updated', 'endpoint.deleted', 'endpoint.executed'],
    'Mock Data': ['mockdata.created', 'mockdata.updated', 'mockdata.deleted'],
    'Project': ['project.updated'],
    'AI': ['ai.generated'],
    'Custom': ['custom']
  }
  
  const handleSubmit = () => {
    if (!form.name || !form.url) {
      toast({ 
        title: 'Error', 
        description: 'Name and URL are required', 
        variant: 'destructive' 
      })
      return
    }
    
    if (form.events.length === 0) {
      toast({ 
        title: 'Error', 
        description: 'Select at least one event', 
        variant: 'destructive' 
      })
      return
    }
    
    onSubmit(form)
    setForm({
      name: '',
      url: '',
      events: [],
      secret: '',
      isActive: true
    })
    onClose()
  }
  
  const toggleEvent = (event: string) => {
    setForm(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }))
  }
  
  const toggleEventCategory = (categoryEvents: string[]) => {
    const allCategoryEventsSelected = categoryEvents.every(event => form.events.includes(event))
    
    setForm(prev => ({
      ...prev,
      events: allCategoryEventsSelected
        ? prev.events.filter(event => !categoryEvents.includes(event))
        : [...prev.events, ...categoryEvents.filter(event => !prev.events.includes(event))]
    }))
  }
  
  const generateSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let secret = ''
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setForm({ ...form, secret })
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[95vw] md:w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Create New Webhook</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Configure a webhook to receive real-time notifications
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="name" className="text-sm">Webhook Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                placeholder="Production Webhook"
                className="h-9 sm:h-10 text-sm"
              />
            </div>
            
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="url" className="text-sm">Destination URL *</Label>
              <Input
                id="url"
                value={form.url}
                onChange={(e) => setForm({...form, url: e.target.value})}
                placeholder="https://api.your-service.com/webhooks"
                type="url"
                className="h-9 sm:h-10 text-sm"
              />
            </div>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <Label className="text-sm">Events to Listen For *</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const allEvents = availableEvents
                  setForm(prev => ({
                    ...prev,
                    events: prev.events.length === allEvents.length ? [] : allEvents
                  }))
                }}
                className="w-full sm:w-auto text-xs h-8 sm:h-9"
              >
                {form.events.length === availableEvents.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            
            <div className="h-[200px] sm:h-[250px] border rounded-md p-3 sm:p-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {Object.entries(eventCategories).map(([category, events]) => (
                  <Card key={category} className="overflow-hidden">
                    <div 
                      className={`px-3 sm:px-4 py-2 sm:py-3 border-b cursor-pointer ${events.every(e => form.events.includes(e)) ? 'bg-primary/10 border-primary/20' : ''}`}
                      onClick={() => toggleEventCategory(events)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-xs sm:text-sm">{category}</span>
                        <div className={`h-4 w-4 rounded border flex items-center justify-center ${events.every(e => form.events.includes(e)) ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                          {events.every(e => form.events.includes(e)) && (
                            <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                      {events.map(event => (
                        <div key={event} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`event-${event}`}
                            checked={form.events.includes(event)}
                            onChange={() => toggleEvent(event)}
                            className="rounded h-3.5 w-3.5 sm:h-4 sm:w-4"
                          />
                          <label 
                            htmlFor={`event-${event}`} 
                            className="text-xs sm:text-sm cursor-pointer flex-1 truncate"
                            onClick={(e) => e.stopPropagation()}
                            title={event.replace('.', ' - ')}
                          >
                            {event.replace('.', ' - ')}
                          </label>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <Label htmlFor="secret" className="text-sm">Secret Key</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={generateSecret}
                className="w-full sm:w-auto text-xs h-8 sm:h-9"
              >
                Generate Secret
              </Button>
            </div>
            <div className="flex gap-1.5 sm:gap-2">
              <Input
                id="secret"
                value={form.secret}
                onChange={(e) => setForm({...form, secret: e.target.value})}
                placeholder="Leave empty to auto-generate"
                type="password"
                className="flex-1 h-9 sm:h-10 text-sm"
              />
              {form.secret && (
                <Button 
                  variant="outline" 
                  onClick={() => navigator.clipboard.writeText(form.secret)}
                  size="icon"
                  className="flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10"
                >
                  <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Used to verify webhook signatures. Keep this secret secure.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={form.isActive}
              onCheckedChange={(checked) => setForm({...form, isActive: checked})}
            />
            <Label htmlFor="active" className="text-sm">Active immediately</Label>
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2 pt-4 sm:pt-6">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto min-h-[44px] text-sm">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="w-full sm:w-auto min-h-[44px] text-sm">
            <WebhookIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            Create Webhook
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Edit Webhook Modal Component - Made responsive
interface EditWebhookModalProps {
  webhook: Webhook
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: UpdateWebhook) => void
  toast: (options: ToastOptions) => void
}

function EditWebhookModal({ webhook, isOpen, onClose, onSubmit, toast }: EditWebhookModalProps) {
  const [form, setForm] = useState({
    name: webhook.name,
    url: webhook.url,
    events: webhook.events,
    secret: webhook.secret || '',
    isActive: webhook.isActive
  })
  
  const availableEvents: WebhookEvent[] = [
    'endpoint.created', 'endpoint.updated', 'endpoint.deleted', 'endpoint.executed',
    'mockdata.created', 'mockdata.updated', 'mockdata.deleted',
    'project.updated', 'ai.generated', 'custom'
  ]
  
  const handleSubmit = () => {
    if (!form.name || !form.url) {
      toast({ 
        title: 'Error', 
        description: 'Name and URL are required', 
        variant: 'destructive' 
      })
      return
    }
    
    if (form.events.length === 0) {
      toast({ 
        title: 'Error', 
        description: 'Select at least one event', 
        variant: 'destructive' 
      })
      return
    }
    
    onSubmit(form)
    onClose()
  }
  
  const toggleEvent = (event: string) => {
    setForm(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }))
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[95vw] md:w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Edit Webhook</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Update webhook configuration
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Webhook Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                placeholder="My Webhook"
                className="h-9 sm:h-10 text-sm"
              />
            </div>
            
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">URL</Label>
              <Input
                value={form.url}
                onChange={(e) => setForm({...form, url: e.target.value})}
                placeholder="https://your-server.com/webhook"
                type="url"
                className="h-9 sm:h-10 text-sm"
              />
            </div>
          </div>
          
          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-sm">Events</Label>
            <div className="h-[200px] sm:h-[250px] border rounded-md p-3 sm:p-4 mt-1 sm:mt-2 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                {availableEvents.map(event => (
                  <div key={event} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`edit-event-${event}`}
                      checked={form.events.includes(event)}
                      onChange={() => toggleEvent(event)}
                      className="rounded h-3.5 w-3.5 sm:h-4 sm:w-4"
                    />
                    <label htmlFor={`edit-event-${event}`} className="text-xs sm:text-sm flex-1 truncate">
                      {event.replace('.', ' - ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-sm">Secret</Label>
            <div className="flex gap-1.5 sm:gap-2">
              <Input
                value={form.secret}
                onChange={(e) => setForm({...form, secret: e.target.value})}
                placeholder="Webhook secret"
                type="password"
                className="h-9 sm:h-10 text-sm"
              />
              {form.secret && (
                <Button 
                  variant="outline" 
                  onClick={() => navigator.clipboard.writeText(form.secret)}
                  size="icon"
                  className="flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10"
                >
                  <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={form.isActive}
              onCheckedChange={(checked) => setForm({...form, isActive: checked})}
            />
            <Label className="text-sm">Active</Label>
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2 pt-4 sm:pt-6">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto min-h-[44px] text-sm">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="w-full sm:w-auto min-h-[44px] text-sm">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}