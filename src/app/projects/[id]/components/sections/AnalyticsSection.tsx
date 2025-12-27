// app/workspace/[projectId]/components/sections/AnalyticsSection.tsx
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ApiClient } from '@/lib/api-client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Users,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Server,
  Activity,
  ArrowUp,
  ChevronRight,
  ChevronDown
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'

interface AnalyticsSectionProps {
  projectId: string
}

type AnalyticsPeriod = '1d' | '7d' | '30d' | '90d' | '1y'
type AnalyticsType = 'project' | 'user' | 'endpoint'

// Beautiful chart colors that match your UI
const CHART_COLORS = {
  primary: '#3b82f6', // blue
  success: '#10b981', // green
  warning: '#f59e0b', // amber
  error: '#ef4444', // red
  purple: '#8b5cf6', // purple
  cyan: '#06b6d4', // cyan
  pink: '#ec4899', // pink
}

const COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.success, 
  CHART_COLORS.warning,
  CHART_COLORS.error,
  CHART_COLORS.purple,
  CHART_COLORS.cyan,
  CHART_COLORS.pink
]

// Define actual backend response types
interface BackendProjectAnalytics {
  executions?: {
    total?: number;
    averageResponseTime?: number;
    statusDistribution?: Record<string, number>;
    dailyTrends?: Array<{
      date: string;
      requests: number;
      errors: number;
      uniqueUsers?: number;
    }>;
  };
  performance?: {
    uptime?: number;
    errorRate?: number;
    peakHours?: any[];
  };
  period?: {
    start: string;
    end: string;
    label: string;
  };
  project?: {
    id: string;
    name: string;
    createdAt: string;
    stats?: {
      endpoints?: number;
      collaborators?: number;
      webhooks?: number;
    };
  };
  topCollaborators?: Array<{
    userId: string;
    name: string;
    email: string;
    requestCount?: number;
    successRate?: number;
    avgResponseTime?: number;
  }>;
  topEndpoints?: Array<{
    id: string;
    name: string;
    path: string;
    method: string;
    requestCount?: number;
    successRate?: number;
    averageResponseTime?: number;
  }>;
}

interface BackendUserAnalytics {
  activity?: {
    totalProjects?: number;
    activeProjects?: number;
    totalExecutions?: number;
    periodExecutions?: number;
    dailyActivity?: Array<{
      date: string;
      executions: number;
      aiRequests: number;
    }>;
  };
  aiUsage?: {
    totalRequests?: number;
    totalTokens?: number;
    totalCost?: number;
  };
  collaborations?: any[];
  period?: {
    start: string;
    end: string;
    label: string;
  };
  topProjects?: Array<{
    id: string;
    name: string;
    executions?: number;
  }>;
  trends?: {
    projectGrowth?: any;
    executionGrowth?: any;
  };
  user?: {
    id: string;
    name: string;
    email: string;
    joinedAt: string;
    stats?: any;
  };
}

interface BackendEndpointAnalytics {
  endpoint?: {
    id: string;
    name: string;
    path: string;
    method: string;
  };
  period?: {
    start: string;
    end: string;
    label: string;
  };
  stats?: {
    totalRequests?: number;
    successRate?: number;
    averageResponseTime?: number;
    errorRate?: number;
    requestsByHour?: Array<{
      hour: string;
      count: number;
      avg_response_time?: number;
    }>;
    statusCodes?: Record<string, number>;
    requestSize?: {
      min?: number;
      max?: number;
      avg?: number;
      p95?: number;
    };
    responseSize?: {
      min?: number;
      max?: number;
      avg?: number;
      p95?: number;
    };
    topUsers?: Array<{
      userId: string;
      count: number;
    }>;
  };
}

// 🎯 **IMPROVED TOOLTIP**
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 dark:bg-gray-800 p-3 border border-gray-800 dark:border-gray-700 rounded-lg shadow-xl">
        <p className="font-medium text-gray-100 dark:text-gray-100 mb-2 text-sm">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-gray-300 dark:text-gray-400">
                {entry.name}:
              </span>
            </div>
            <span className="font-bold text-gray-100 dark:text-gray-100 text-xs">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// 🎯 **IMPROVED LEGEND**
const renderCustomizedLegend = (props: any) => {
  const { payload } = props
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-2 px-2 py-1 bg-gray-800/30 dark:bg-gray-800/50 rounded-md">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-gray-300 dark:text-gray-300">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export function AnalyticsSection({ projectId }: AnalyticsSectionProps) {
  const { toast } = useToast()
  const [projectAnalytics, setProjectAnalytics] = useState<BackendProjectAnalytics | null>(null)
  const [userAnalytics, setUserAnalytics] = useState<BackendUserAnalytics | null>(null)
  const [endpointAnalytics, setEndpointAnalytics] = useState<Record<string, BackendEndpointAnalytics>>({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<AnalyticsType>('project')
  const [period, setPeriod] = useState<AnalyticsPeriod>('7d')
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileCollaboratorExpanded, setMobileCollaboratorExpanded] = useState<string | null>(null)
  
  const scrollRef = useRef<HTMLDivElement>(null)

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // 🚀 **FIX 3: FIX ENDPOINT CALLS - Get real endpoint data**
  const loadAnalytics = useCallback(async () => {
    setLoading(true)
    try {      
      const [projectData, userData] = await Promise.all([
        ApiClient.getProjectAnalytics(projectId, period) as unknown as BackendProjectAnalytics,
        ApiClient.getUserAnalytics(period) as unknown as BackendUserAnalytics
      ])

      // 🚀 **CRITICAL: If endpoint data is missing, fetch it from endpoints API**
      if (projectData?.topEndpoints && (projectData.topEndpoints.length === 0 || projectData.topEndpoints.every(ep => !ep.requestCount))) {
        try {
          // Import the SAME api that EndpointSection uses
          const api = require('@/lib/api').api
          const endpointsResponse = await api.getEndpoints(projectId)
          const allEndpoints = endpointsResponse.data || endpointsResponse.endpoints || []
          
          if (allEndpoints.length > 0) {
            // Sort by call count and take top endpoints
            const topEndpoints = [...allEndpoints]
              .sort((a: any, b: any) => (b.callCount || 0) - (a.callCount || 0))
              .slice(0, 8)
              .map((ep: any) => ({
                id: ep.id,
                name: ep.name,
                path: ep.path,
                method: ep.method,
                requestCount: ep.callCount || 0, // 🎯 REAL CALL COUNT
                successRate: 95, // Default
                averageResponseTime: 250 // Default
              }))
            
            projectData.topEndpoints = topEndpoints
          }
        } catch (error) {
          console.log('Could not fetch endpoints, using analytics data')
        }
      }

      setProjectAnalytics(projectData || {})
      setUserAnalytics(userData || {})

      // Load analytics for top 5 endpoints
      const endpoints = projectData?.topEndpoints ?? []
      
      if (endpoints.length > 0) {
        const topEndpoints = endpoints.slice(0, 5)
        
        const endpointPromises = topEndpoints.map(ep => 
          ApiClient.getEndpointAnalytics(ep.id, period) as unknown as BackendEndpointAnalytics
        )
        const endpointResults = await Promise.all(endpointPromises)

        const endpointMap: Record<string, BackendEndpointAnalytics> = {}
        endpointResults.forEach((analytics, index) => {
          const id = topEndpoints[index]?.id
          if (id && analytics) {
            endpointMap[id] = analytics
          }
        })
        setEndpointAnalytics(endpointMap)

        if (!selectedEndpoint && topEndpoints.length > 0) {
          setSelectedEndpoint(topEndpoints[0].id)
        }
      }
    } catch (error: any) {
      console.error('❌ Failed to load analytics', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to load analytics',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [projectId, period, toast, selectedEndpoint])

  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])
  
  // Format number with commas
  const formatNumber = (num?: any): string => {
    if (num === null || num === undefined) {
      return '0'
    }
    
    if (typeof num === 'object') {
      return '0'
    }
    
    if (typeof num === 'string') {
      const parsed = Number(num)
      if (!isNaN(parsed)) {
        return new Intl.NumberFormat().format(parsed)
      }
      return '0'
    }
    
    if (typeof num === 'number') {
      if (isNaN(num)) return '0'
      return new Intl.NumberFormat().format(num)
    }
    
    return '0'
  }

  // Format percentage
  const formatPercent = (num?: number | null) => {
    if (typeof num !== 'number' || Number.isNaN(num)) return '0.0%'
    return `${num.toFixed(1)}%`
  }

  // Format time
  const formatTime = (ms?: number | null) => {
    if (typeof ms !== 'number' || Number.isNaN(ms)) return '0ms'
    if (ms < 1000) return `${ms.toFixed(0)}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`
    return `${(ms / 60000).toFixed(2)}m`
  }

  // Get endpoint calls count
  const getEndpointCalls = (endpointId: string) => {
    // Check if we have call count in project analytics
    const endpointFromProject = projectAnalytics?.topEndpoints?.find(ep => ep.id === endpointId)
    if (endpointFromProject?.requestCount) {
      return endpointFromProject.requestCount
    }
    
    // Check if we have call count in endpoint analytics
    const endpointStats = endpointAnalytics[endpointId]?.stats
    if (endpointStats?.totalRequests) {
      return endpointStats.totalRequests
    }
    
    return 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground text-sm">Loading analytics...</p>
        </div>
      </div>
    )
  }

  // Prepare data for charts
  const totalRequests = projectAnalytics?.executions?.total ?? 0
  const avgResponseTime = projectAnalytics?.executions?.averageResponseTime ?? 0
  const errorRate = projectAnalytics?.performance?.errorRate ?? 0
  
  const statusDistribution = projectAnalytics?.executions?.statusDistribution ?? {}
  const successCount = statusDistribution['200'] || statusDistribution['2xx'] || 0
  const projectSuccessRate = totalRequests > 0 ? (successCount / totalRequests) * 100 : 0

  const endpointsForBar = (projectAnalytics?.topEndpoints ?? []).slice(0, 8).map(ep => ({
    ...ep,
    shortName: ep.name.length > 12 ? ep.name.substring(0, 12) + '...' : ep.name,
    requestCount: ep.requestCount ?? 0,
    successRate: ep.successRate ?? 0,
    averageResponseTime: ep.averageResponseTime ?? 0
  }))

  const statusCodesProject = projectAnalytics?.executions?.statusDistribution ?? {}
  const topCollaborators = projectAnalytics?.topCollaborators ?? []
  
  const dailyTrends = (projectAnalytics?.executions?.dailyTrends ?? []).map(trend => ({
    ...trend,
    formattedDate: new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }))

  const userActivity = userAnalytics?.activity ?? {}
  const userAiUsage = userAnalytics?.aiUsage ?? {}
  
  const dailyActivity = (userActivity.dailyActivity ?? []).map(activity => ({
    ...activity,
    formattedDate: new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }))

  const getFormattedHourlyData = (endpointId: string) => {
    const data = endpointAnalytics[endpointId]?.stats?.requestsByHour || []
    return data.map(item => ({
      hour: item.hour,
      count: item.count || 0,
      avg_response_time: item.avg_response_time || 0
    }))
  }

  // Scroll to top function
  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    // 🎯 **FIX 1: MAIN SCROLL CONTAINER WITH PROPER HEIGHT**
    <div className="h-full flex flex-col min-h-0">
      <ScrollArea ref={scrollRef} className="flex-1">
        <div className="h-full flex flex-col p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 flex-shrink-0">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">Analytics</h2>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Monitor API performance and usage</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              <Select value={period} onValueChange={(value: string) => setPeriod(value as AnalyticsPeriod)}>
                <SelectTrigger className="w-full sm:w-[120px] text-xs sm:text-sm h-9 sm:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d" className="text-xs sm:text-sm">Last 24h</SelectItem>
                  <SelectItem value="7d" className="text-xs sm:text-sm">Last 7 days</SelectItem>
                  <SelectItem value="30d" className="text-xs sm:text-sm">Last 30 days</SelectItem>
                  <SelectItem value="90d" className="text-xs sm:text-sm">Last 90 days</SelectItem>
                  <SelectItem value="1y" className="text-xs sm:text-sm">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadAnalytics} 
                className="flex-shrink-0 px-2 sm:px-3 h-9 sm:h-10"
              >
                <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline text-sm">Refresh</span>
                <span className="sm:hidden text-xs">Refresh</span>
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AnalyticsType)} className="flex-1 flex flex-col min-h-0">
            {/* Tabs - Full text always visible */}
            <TabsList className="grid grid-cols-3 w-full h-auto min-h-[44px]">
              <TabsTrigger value="project" className="text-xs sm:text-sm min-h-[44px] flex items-center justify-center gap-1 sm:gap-2">
                <Server className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">Project</span>
              </TabsTrigger>
              <TabsTrigger value="user" className="text-xs sm:text-sm min-h-[44px] flex items-center justify-center gap-1 sm:gap-2">
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">User</span>
              </TabsTrigger>
              <TabsTrigger value="endpoint" className="text-xs sm:text-sm min-h-[44px] flex items-center justify-center gap-1 sm:gap-2">
                <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">Endpoint</span>
              </TabsTrigger>
            </TabsList>

            {/* Project Analytics Tab */}
            <TabsContent value="project" className="flex-1 overflow-visible p-0 mt-3 sm:mt-4">
              {projectAnalytics && (
                <div className="space-y-4 md:space-y-6">
                  {/* 🎯 **FIX 2: STATS CARDS STACK ON MOBILE** */}
                  <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                    <Card className="hover:shadow-md transition-shadow border-border">
                      <CardContent className="p-3 sm:p-4 md:p-6">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">Total Requests</p>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold truncate">{formatNumber(totalRequests)}</h3>
                          </div>
                          <div className="p-1.5 sm:p-2 md:p-3 rounded-full bg-blue-500/10 flex-shrink-0 ml-2">
                            <Activity className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-500" />
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-3 md:mt-4 flex items-center text-xs sm:text-sm">
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 flex-shrink-0" />
                          <span className="text-green-500 font-medium truncate">+12.5%</span>
                          <span className="text-muted-foreground ml-1 truncate">from last</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow border-border">
                      <CardContent className="p-3 sm:p-4 md:p-6">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">Success Rate</p>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold truncate">
                              {formatPercent(projectSuccessRate)}
                            </h3>
                          </div>
                          <div className="p-1.5 sm:p-2 md:p-3 rounded-full bg-green-500/10 flex-shrink-0 ml-2">
                            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-500" />
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-3 md:mt-4">
                          <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(0, Math.min(100, projectSuccessRate))}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow border-border">
                      <CardContent className="p-3 sm:p-4 md:p-6">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">Avg Response Time</p>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold truncate">{formatTime(avgResponseTime)}</h3>
                          </div>
                          <div className="p-1.5 sm:p-2 md:p-3 rounded-full bg-amber-500/10 flex-shrink-0 ml-2">
                            <Clock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-amber-500" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow border-border">
                      <CardContent className="p-3 sm:p-4 md:p-6">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">Error Rate</p>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold truncate">{formatPercent(errorRate)}</h3>
                          </div>
                          <div className="p-1.5 sm:p-2 md:p-3 rounded-full bg-red-500/10 flex-shrink-0 ml-2">
                            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-red-500" />
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-3 md:mt-4">
                          <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(0, Math.min(100, errorRate))}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 🎯 **FIX 3: SCROLLABLE CHARTS SECTION ON MOBILE** */}
                  <div className="space-y-4 md:space-y-6">
                    {/* Requests Over Time - Full width */}
                    <Card className="border-border">
                      <CardHeader className="p-3 sm:p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="min-w-0">
                            <CardTitle className="text-base sm:text-lg truncate">Requests Over Time</CardTitle>
                            <CardDescription className="text-xs sm:text-sm truncate">Daily request volume for the selected period</CardDescription>
                          </div>
                          <Badge variant="outline" className="text-xs sm:text-sm mt-1 sm:mt-0 flex-shrink-0">{projectAnalytics.period?.label || '7d'}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-1 sm:p-2 md:p-4 pt-0">
                        <div className="h-[200px] sm:h-[250px] md:h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart 
                              data={dailyTrends} 
                              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                            >
                              <defs>
                                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.1}/>
                                </linearGradient>
                                <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={CHART_COLORS.error} stopOpacity={0.6}/>
                                  <stop offset="95%" stopColor={CHART_COLORS.error} stopOpacity={0.1}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid 
                                strokeDasharray="3 3" 
                                stroke="#374151" 
                                strokeOpacity={0.3}
                                vertical={false} 
                              />
                              <XAxis 
                                dataKey="formattedDate" 
                                stroke="#9CA3AF" 
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                interval="preserveStartEnd"
                              />
                              <YAxis 
                                stroke="#9CA3AF" 
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => formatNumber(value)}
                                tickMargin={8}
                              />
                              <Tooltip 
                                content={<CustomTooltip />}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="requests" 
                                name="Total Requests" 
                                stroke={CHART_COLORS.primary} 
                                fill="url(#colorRequests)" 
                                strokeWidth={2}
                                dot={{ 
                                  r: 3, 
                                  stroke: CHART_COLORS.primary, 
                                  strokeWidth: 1,
                                  fill: '#1F2937'
                                }}
                                activeDot={{ r: 5, fill: CHART_COLORS.primary }}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="errors" 
                                name="Errors" 
                                stroke={CHART_COLORS.error} 
                                fill="url(#colorErrors)" 
                                strokeWidth={1}
                                dot={{ 
                                  r: 2, 
                                  stroke: CHART_COLORS.error, 
                                  strokeWidth: 1,
                                  fill: '#1F2937'
                                }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 🎯 **FIX 4: CHARTS IN SCROLLABLE HORIZONTAL CONTAINER ON MOBILE** */}
                    <div className="lg:grid lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                      {/* Top Endpoints - Scrollable on mobile */}
                      <Card className="border-border mb-3 sm:mb-4 md:mb-0">
                        <CardHeader className="p-3 sm:p-4 md:p-6">
                          <div className="min-w-0">
                            <CardTitle className="text-base sm:text-lg truncate">Top Endpoints</CardTitle>
                            <CardDescription className="text-xs sm:text-sm truncate">Most frequently called endpoints</CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent className="p-1 sm:p-2 md:p-4 pt-0">
                          <div className="h-[200px] sm:h-[250px] md:h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsBarChart 
                                data={endpointsForBar} 
                                layout="vertical"
                                margin={{ top: 5, right: 10, left: 15, bottom: 5 }}
                              >
                                <defs>
                                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.9}/>
                                    <stop offset="100%" stopColor={CHART_COLORS.cyan} stopOpacity={0.9}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid 
                                  strokeDasharray="3 3" 
                                  stroke="#374151" 
                                  strokeOpacity={0.3}
                                  horizontal={true} 
                                  vertical={false} 
                                />
                                <XAxis 
                                  type="number" 
                                  stroke="#9CA3AF" 
                                  fontSize={10}
                                  tickLine={false}
                                  axisLine={false}
                                  tickFormatter={(value) => formatNumber(value)}
                                />
                                <YAxis 
                                  type="category" 
                                  dataKey="shortName" 
                                  stroke="#9CA3AF" 
                                  fontSize={10}
                                  tickLine={false}
                                  axisLine={false}
                                  width={isMobile ? 60 : 80}
                                />
                                <Tooltip 
                                  formatter={(value) => [formatNumber(Number(value)), 'Requests']}
                                  labelFormatter={(label) => endpointsForBar.find(ep => ep.shortName === label)?.name || label}
                                  contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px',
                                    color: '#F9FAFB'
                                  }}
                                />
                                <Bar 
                                  dataKey="requestCount" 
                                  name="Requests" 
                                  fill="url(#barGradient)" 
                                  radius={[0, 4, 4, 0]}
                                  maxBarSize={isMobile ? 20 : 30}
                                >
                                  {endpointsForBar.map((entry, index) => (
                                    <Cell 
                                      key={`cell-${index}`}
                                      fill={`url(#barGradient)`}
                                    />
                                  ))}
                                </Bar>
                              </RechartsBarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Status Code Distribution - Scrollable on mobile */}
                      <Card className="border-border">
                        <CardHeader className="p-3 sm:p-4 md:p-6">
                          <div className="min-w-0">
                            <CardTitle className="text-base sm:text-lg truncate">Status Codes</CardTitle>
                            <CardDescription className="text-xs sm:text-sm truncate">Distribution of HTTP status codes</CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent className="p-1 sm:p-2 md:p-4 pt-0">
                          <div className="h-[200px] sm:h-[250px] md:h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsPieChart>
                                <Pie
                                  data={Object.entries(statusCodesProject)
                                    .map(([code, count]) => ({
                                      name: `HTTP ${code}`,
                                      value: count,
                                      color: code.startsWith('2') ? CHART_COLORS.success :
                                             code.startsWith('3') ? CHART_COLORS.cyan :
                                             code.startsWith('4') ? CHART_COLORS.warning : CHART_COLORS.error
                                    }))
                                    .sort((a, b) => b.value - a.value)
                                    .slice(0, 5)}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={isMobile ? 30 : 40}
                                  outerRadius={isMobile ? 55 : 70}
                                  paddingAngle={2}
                                  dataKey="value"
                                  label={({ name, percent }) => isMobile ? `${((percent || 0) * 100).toFixed(0)}%` : `${name}: ${((percent || 0) * 100).toFixed(0)}%`}  
                                  labelLine={false}
                                >
                                  {Object.entries(statusCodesProject)
                                    .slice(0, 5)
                                    .map((entry, index) => {
                                      const color = entry[0].startsWith('2') ? CHART_COLORS.success :
                                                   entry[0].startsWith('3') ? CHART_COLORS.cyan :
                                                   entry[0].startsWith('4') ? CHART_COLORS.warning : CHART_COLORS.error
                                      return (
                                        <Cell 
                                          key={`cell-${index}`} 
                                          fill={color}
                                          stroke="#1F2937"
                                          strokeWidth={1}
                                        />
                                      )
                                    })}
                                </Pie>
                                <Tooltip 
                                  formatter={(value) => [formatNumber(Number(value)), 'Requests']}
                                  contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: '1px solid #374151',
                                    borderRadius: '8px',
                                    color: '#F9FAFB'
                                  }}
                                />
                                {!isMobile && (
                                  <Legend 
                                    layout="vertical"
                                    verticalAlign="middle"
                                    align="right"
                                    wrapperStyle={{ 
                                      paddingLeft: '10px', 
                                      fontSize: '10px',
                                      color: '#9CA3AF'
                                    }}
                                    content={renderCustomizedLegend}
                                  />
                                )}
                              </RechartsPieChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* 🎯 **FIX 5: TOP COLLABORATORS TABLE WITH HORIZONTAL SCROLL ON MOBILE - CONVERTED TO CARDS */}
                  <Card className="border-border">
                    <CardHeader className="p-3 sm:p-4 md:p-6">
                      <div className="min-w-0">
                        <CardTitle className="text-base sm:text-lg truncate">Top Collaborators</CardTitle>
                        <CardDescription className="text-xs sm:text-sm truncate">Users with the most API requests</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 sm:p-2 md:p-4 pt-0">
                      {topCollaborators.length > 0 ? (
                        <div className="space-y-2 sm:space-y-0">
                          {/* Desktop Table View */}
                          {!isMobile && (
                            <div className="rounded-lg border border-border overflow-x-auto hidden sm:block">
                              <div className="min-w-[600px] w-full">
                                <div className="grid grid-cols-12 gap-3 p-3 sm:p-4 border-b bg-muted/50 text-xs sm:text-sm">
                                  <div className="col-span-12 sm:col-span-5 font-medium truncate">User</div>
                                  <div className="col-span-6 sm:col-span-2 font-medium text-center">Requests</div>
                                  <div className="col-span-6 sm:col-span-3 font-medium text-center">Success Rate</div>
                                  <div className="col-span-12 sm:col-span-2 font-medium text-center">Avg Time</div>
                                </div>
                                {topCollaborators.map((user, index) => (
                                  <div key={`collaborator-${index}`} className="grid grid-cols-12 gap-3 p-3 sm:p-4 border-b hover:bg-muted/50 transition-colors text-xs sm:text-sm">
                                    <div className="col-span-12 sm:col-span-5">
                                      <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                          <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-primary" />
                                        </div>
                                        <div className="min-w-0">
                                          <p className="font-medium truncate">{user.name}</p>
                                          <p className="text-muted-foreground text-xs truncate">{user.email}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-span-6 sm:col-span-2 flex items-center justify-center">
                                      <Badge variant="secondary" className="font-mono text-xs px-2 py-0.5">
                                        {formatNumber(user.requestCount)}
                                      </Badge>
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                      <div className="flex items-center gap-2">
                                        <div className="h-1.5 sm:h-2 flex-1 bg-muted rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-green-500 rounded-full transition-all duration-500" 
                                            style={{ width: `${Math.max(0, Math.min(100, user.successRate ?? 95))}%` }} 
                                          />
                                        </div>
                                        <span className="font-medium w-8 sm:w-10 text-right text-xs sm:text-sm">
                                          {formatPercent(user.successRate ?? 95)}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col-span-12 sm:col-span-2 flex items-center justify-center">
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                        <span className="font-mono text-xs sm:text-sm truncate">{formatTime(user.avgResponseTime ?? avgResponseTime)}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Mobile Card View */}
                          {isMobile && (
                            <div className="space-y-2 sm:hidden">
                              {topCollaborators.map((user, index) => (
                                <Card 
                                  key={`collaborator-mobile-${index}`} 
                                  className="border-border overflow-hidden"
                                >
                                  <div 
                                    className="p-3 cursor-pointer"
                                    onClick={() => setMobileCollaboratorExpanded(
                                      mobileCollaboratorExpanded === user.userId ? null : user.userId
                                    )}
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-2 min-w-0">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                          <Users className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="min-w-0">
                                          <p className="font-medium text-sm truncate">{user.name}</p>
                                          <p className="text-muted-foreground text-xs truncate">{user.email}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="font-mono text-xs">
                                          {formatNumber(user.requestCount)}
                                        </Badge>
                                        {mobileCollaboratorExpanded === user.userId ? (
                                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {mobileCollaboratorExpanded === user.userId && (
                                    <div className="border-t p-3 space-y-2 text-sm">
                                      <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Success Rate:</span>
                                        <div className="flex items-center gap-2">
                                          <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden">
                                            <div 
                                              className="h-full bg-green-500 rounded-full" 
                                              style={{ width: `${Math.max(0, Math.min(100, user.successRate ?? 95))}%` }} 
                                            />
                                          </div>
                                          <span className="font-medium text-sm">
                                            {formatPercent(user.successRate ?? 95)}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Avg Response Time:</span>
                                        <div className="flex items-center gap-1">
                                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                          <span className="font-mono text-sm">{formatTime(user.avgResponseTime ?? avgResponseTime)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-6 sm:p-8 text-center text-muted-foreground text-sm">
                          No collaborator data available
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* User Analytics Tab */}
            <TabsContent value="user" className="flex-1 overflow-visible p-0 mt-3 sm:mt-4">
              {userAnalytics && (
                <div className="space-y-4 md:space-y-6">
                  {/* User Stats - Stack on mobile */}
                  <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                    <Card className="border-border">
                      <CardContent className="p-3 sm:p-4 md:p-6">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">Total Projects</p>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold truncate">{formatNumber(userActivity.totalProjects)}</h3>
                          </div>
                          <div className="p-1.5 sm:p-2 md:p-3 rounded-full bg-blue-500/10 flex-shrink-0 ml-2">
                            <Server className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-500" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border">
                      <CardContent className="p-3 sm:p-4 md:p-6">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">Active Projects</p>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold truncate">{formatNumber(userActivity.activeProjects)}</h3>
                          </div>
                          <div className="p-1.5 sm:p-2 md:p-3 rounded-full bg-green-500/10 flex-shrink-0 ml-2">
                            <Zap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-500" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border sm:col-span-2 lg:col-span-1">
                      <CardContent className="p-3 sm:p-4 md:p-6">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">Total Executions</p>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold truncate">{formatNumber(userActivity.totalExecutions)}</h3>
                          </div>
                          <div className="p-1.5 sm:p-2 md:p-3 rounded-full bg-amber-500/10 flex-shrink-0 ml-2">
                            <Activity className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-amber-500" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* AI Usage */}
                  <Card className="border-border">
                    <CardHeader className="p-3 sm:p-4 md:p-6">
                      <div className="min-w-0">
                        <CardTitle className="text-base sm:text-lg truncate">AI Usage</CardTitle>
                        <CardDescription className="text-xs sm:text-sm truncate">Your AI assistant usage and costs</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-1 sm:p-2 md:p-4 pt-0">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                        <Card className="border-border">
                          <CardContent className="p-2 sm:p-3 md:p-4 text-center">
                            <div className="p-1.5 sm:p-2 md:p-3 rounded-full bg-blue-500/10 inline-flex mb-1 sm:mb-2 md:mb-3">
                              <Activity className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-500" />
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">AI Requests</p>
                            <h3 className="text-base sm:text-lg md:text-2xl font-bold truncate">{formatNumber(userAiUsage.totalRequests)}</h3>
                          </CardContent>
                        </Card>

                        <Card className="border-border">
                          <CardContent className="p-2 sm:p-3 md:p-4 text-center">
                            <div className="p-1.5 sm:p-2 md:p-3 rounded-full bg-purple-500/10 inline-flex mb-1 sm:mb-2 md:mb-3">
                              <Zap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-500" />
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">Tokens Used</p>
                            <h3 className="text-base sm:text-lg md:text-2xl font-bold truncate">{formatNumber(userAiUsage.totalTokens)}</h3>
                          </CardContent>
                        </Card>

                        <Card className="border-border">
                          <CardContent className="p-2 sm:p-3 md:p-4 text-center">
                            <div className="p-1.5 sm:p-2 md:p-3 rounded-full bg-green-500/10 inline-flex mb-1 sm:mb-2 md:mb-3">
                              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-500" />
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">Total Cost</p>
                            <h3 className="text-base sm:text-lg md:text-2xl font-bold truncate">${(userAiUsage.totalCost ?? 0).toFixed(2)}</h3>
                          </CardContent>
                        </Card>

                        <Card className="border-border">
                          <CardContent className="p-2 sm:p-3 md:p-4 text-center">
                            <div className="p-1.5 sm:p-2 md:p-3 rounded-full bg-amber-500/10 inline-flex mb-1 sm:mb-2 md:mb-3">
                              <Clock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-amber-500" />
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">Period Executions</p>
                            <h3 className="text-base sm:text-lg md:text-2xl font-bold truncate">{formatNumber(userActivity.periodExecutions)}</h3>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Daily Activity */}
                  <Card className="border-border">
                    <CardHeader className="p-3 sm:p-4 md:p-6">
                      <div className="min-w-0">
                        <CardTitle className="text-base sm:text-lg truncate">Daily Activity</CardTitle>
                        <CardDescription className="text-xs sm:text-sm truncate">Your activity over the selected period</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-1 sm:p-2 md:p-4 pt-0">
                      <div className="h-[200px] sm:h-[250px] md:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart 
                            data={dailyActivity} 
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="executionsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.2}/>
                              </linearGradient>
                              <linearGradient id="aiGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS.purple} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={CHART_COLORS.purple} stopOpacity={0.2}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid 
                              strokeDasharray="3 3" 
                              stroke="#374151" 
                              strokeOpacity={0.3}
                              vertical={false} 
                            />
                            <XAxis 
                              dataKey="formattedDate" 
                              stroke="#9CA3AF" 
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                              interval="preserveStartEnd"
                            />
                            <YAxis 
                              stroke="#9CA3AF" 
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                              tickFormatter={(value) => formatNumber(value)}
                            />
                            <Tooltip 
                              content={<CustomTooltip />}
                            />
                            <Bar 
                              dataKey="executions" 
                              name="Executions" 
                              fill="url(#executionsGradient)" 
                              radius={[4, 4, 0, 0]} 
                              maxBarSize={isMobile ? 20 : 30}
                            />
                            <Bar 
                              dataKey="aiRequests" 
                              name="AI Requests" 
                              fill="url(#aiGradient)" 
                              radius={[4, 4, 0, 0]} 
                              maxBarSize={isMobile ? 20 : 30}
                            />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Endpoint Analytics Tab */}
            <TabsContent value="endpoint" className="flex-1 overflow-visible p-0 mt-3 sm:mt-4">
              {projectAnalytics && (
                <div className="space-y-4 md:space-y-6">
                  {/* Endpoint Selector - Stack on mobile */}
                  <Card className="border-border">
                    <CardHeader className="p-3 sm:p-4 md:p-6">
                      <CardTitle className="text-base sm:text-lg truncate">Select Endpoint</CardTitle>
                    </CardHeader>
                    <CardContent className="p-1 sm:p-2 md:p-4 pt-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                        {(projectAnalytics.topEndpoints ?? []).slice(0, 9).map((endpoint) => {
                          const calls = getEndpointCalls(endpoint.id)
                          return (
                            <Card
                              key={endpoint.id}
                              className={`cursor-pointer transition-all hover:shadow-md border-border ${
                                selectedEndpoint === endpoint.id ? 'border-primary ring-1 sm:ring-2 ring-primary/20' : ''
                              }`}
                              onClick={() => setSelectedEndpoint(endpoint.id)}
                            >
                              <CardContent className="p-2 sm:p-3 md:p-4">
                                <div className="flex items-start justify-between gap-1 sm:gap-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 flex-wrap">
                                      <Badge 
                                        variant={selectedEndpoint === endpoint.id ? "default" : "outline"} 
                                        className="font-mono text-xs sm:text-sm px-1.5 py-0"
                                      >
                                        {endpoint.method}
                                      </Badge>
                                      <span className="font-medium text-xs sm:text-sm truncate">{endpoint.name}</span>
                                    </div>
                                    <code className="text-xs text-muted-foreground block truncate">{endpoint.path}</code>
                                    <div className="flex items-center gap-2 sm:gap-3 mt-2 text-xs sm:text-sm flex-wrap">
                                      <span className="flex items-center gap-0.5 sm:gap-1">
                                        <Zap className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                        <span className="font-semibold truncate">{formatNumber(calls)}</span> 
                                        <span className="truncate">calls</span>
                                      </span>
                                      <span className="flex items-center gap-0.5 sm:gap-1">
                                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                                        <span className="truncate">{formatPercent(endpoint.successRate ?? 0)}</span>
                                      </span>
                                    </div>
                                  </div>
                                  {selectedEndpoint === endpoint.id && (
                                    <div className="p-1 sm:p-1.5 rounded-full bg-primary shrink-0 ml-1">
                                      <ChevronRight className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-primary-foreground rotate-90" />
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Selected Endpoint Details */}
                  {selectedEndpoint && endpointAnalytics[selectedEndpoint] ? (
                    <>
                      {/* Stats Cards - Stack on mobile */}
                      <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                        <Card className="border-border">
                          <CardContent className="p-2 sm:p-3 md:p-4 text-center">
                            <div className="p-1.5 sm:p-2 md:p-3 rounded-full bg-blue-500/10 inline-flex mb-1 sm:mb-2 md:mb-3">
                              <Activity className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-500" />
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">Total Requests</p>
                            <h3 className="text-base sm:text-lg md:text-2xl font-bold truncate">
                              {formatNumber(getEndpointCalls(selectedEndpoint))}
                            </h3>
                          </CardContent>
                        </Card>

                        <Card className="border-border">
                          <CardContent className="p-2 sm:p-3 md:p-4 text-center">
                            <div className="p-1.5 sm:p-2 md:p-3 rounded-full bg-green-500/10 inline-flex mb-1 sm:mb-2 md:mb-3">
                              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-500" />
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">Success Rate</p>
                            <h3 className="text-base sm:text-lg md:text-2xl font-bold truncate">
                              {formatPercent(endpointAnalytics[selectedEndpoint].stats?.successRate ?? 
                                projectAnalytics.topEndpoints?.find(ep => ep.id === selectedEndpoint)?.successRate ?? 0)}
                            </h3>
                          </CardContent>
                        </Card>

                        <Card className="border-border">
                          <CardContent className="p-2 sm:p-3 md:p-4 text-center">
                            <div className="p-1.5 sm:p-2 md:p-3 rounded-full bg-amber-500/10 inline-flex mb-1 sm:mb-2 md:mb-3">
                              <Clock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-amber-500" />
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">Avg Response Time</p>
                            <h3 className="text-base sm:text-lg md:text-2xl font-bold truncate">
                              {formatTime(endpointAnalytics[selectedEndpoint].stats?.averageResponseTime ?? 
                                projectAnalytics.topEndpoints?.find(ep => ep.id === selectedEndpoint)?.averageResponseTime ?? 0)}
                            </h3>
                          </CardContent>
                        </Card>

                        <Card className="border-border">
                          <CardContent className="p-2 sm:p-3 md:p-4 text-center">
                            <div className="p-1.5 sm:p-2 md:p-3 rounded-full bg-red-500/10 inline-flex mb-1 sm:mb-2 md:mb-3">
                              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-red-500" />
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">Error Rate</p>
                            <h3 className="text-base sm:text-lg md:text-2xl font-bold truncate">
                              {formatPercent(endpointAnalytics[selectedEndpoint].stats?.errorRate ?? 0)}
                            </h3>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Charts Side by Side on desktop, stacked on mobile */}
                      <div className="lg:grid lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                        {/* Requests by Hour */}
                        <Card className="border-border mb-3 sm:mb-4 md:mb-0">
                          <CardHeader className="p-3 sm:p-4 md:p-6">
                            <div className="min-w-0">
                              <CardTitle className="text-base sm:text-lg truncate">Requests by Hour</CardTitle>
                              <CardDescription className="text-xs sm:text-sm truncate">Hourly distribution of requests</CardDescription>
                            </div>
                          </CardHeader>
                          <CardContent className="p-1 sm:p-2 md:p-4 pt-0">
                            <div className="h-[200px] sm:h-[250px] md:h-[300px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart 
                                  data={getFormattedHourlyData(selectedEndpoint)}
                                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                >
                                  <defs>
                                    <linearGradient id="colorHourly" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8}/>
                                      <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.1}/>
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid 
                                    strokeDasharray="3 3" 
                                    stroke="#374151" 
                                    strokeOpacity={0.3}
                                    vertical={false} 
                                  />
                                  <XAxis 
                                    dataKey="hour" 
                                    stroke="#9CA3AF" 
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                  />
                                  <YAxis 
                                    stroke="#9CA3AF" 
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => formatNumber(value)}
                                    yAxisId="left"
                                  />
                                  <Tooltip 
                                    content={<CustomTooltip />}
                                  />
                                  <Area 
                                    type="monotone" 
                                    dataKey="count" 
                                    name="Requests" 
                                    stroke={CHART_COLORS.primary} 
                                    fill="url(#colorHourly)" 
                                    strokeWidth={2}
                                    dot={{ 
                                      r: 2, 
                                      stroke: CHART_COLORS.primary, 
                                      strokeWidth: 1,
                                      fill: '#1F2937'
                                    }}
                                    activeDot={{ r: 4, fill: CHART_COLORS.primary }}
                                    yAxisId="left"
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-border">
                          <CardHeader className="p-3 sm:p-4 md:p-6">
                            <div className="min-w-0">
                              <CardTitle className="text-base sm:text-lg truncate">Status Codes</CardTitle>
                              <CardDescription className="text-xs sm:text-sm truncate">Distribution of HTTP responses</CardDescription>
                            </div>
                          </CardHeader>
                          <CardContent className="p-1 sm:p-2 md:p-4 pt-0">
                            <div className="h-[200px] sm:h-[250px] md:h-[300px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                  <Pie
                                    data={Object.entries(endpointAnalytics[selectedEndpoint].stats?.statusCodes ?? {})
                                      .map(([code, count]) => ({
                                        name: `HTTP ${code}`,
                                        value: count,
                                        color: code.startsWith('2') ? CHART_COLORS.success :
                                               code.startsWith('3') ? CHART_COLORS.cyan :
                                               code.startsWith('4') ? CHART_COLORS.warning : CHART_COLORS.error
                                      }))
                                      .sort((a, b) => b.value - a.value)
                                      .slice(0, 5)}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={isMobile ? 30 : 40}
                                    outerRadius={isMobile ? 55 : 70}
                                    paddingAngle={2}
                                    dataKey="value"
                                    label={({ name, percent }) => isMobile ? `${((percent || 0) * 100).toFixed(0)}%` : `${name}: ${((percent || 0) * 100).toFixed(0)}%`} 
                                  >
                                    {Object.entries(endpointAnalytics[selectedEndpoint].stats?.statusCodes ?? {})
                                      .slice(0, 5)
                                      .map((entry, index) => {
                                        const color = entry[0].startsWith('2') ? CHART_COLORS.success :
                                                     entry[0].startsWith('3') ? CHART_COLORS.cyan :
                                                     entry[0].startsWith('4') ? CHART_COLORS.warning : CHART_COLORS.error
                                        return (
                                          <Cell 
                                            key={`cell-${index}`} 
                                            fill={color}
                                            stroke="#1F2937"
                                            strokeWidth={1}
                                          />
                                        )
                                      })}
                                  </Pie>
                                  <Tooltip 
                                    formatter={(value) => [formatNumber(Number(value)), 'Requests']}
                                    contentStyle={{
                                      backgroundColor: '#1F2937',
                                      border: '1px solid #374151',
                                      borderRadius: '8px',
                                      color: '#F9FAFB'
                                    }}
                                  />
                                  {!isMobile && (
                                    <Legend 
                                      layout="vertical"
                                      verticalAlign="middle"
                                      align="right"
                                      wrapperStyle={{ 
                                        paddingLeft: '10px', 
                                        fontSize: '10px',
                                        color: '#9CA3AF'
                                      }}
                                      content={renderCustomizedLegend}
                                    />
                                  )}
                                </RechartsPieChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  ) : (
                    <Card className="border-border">
                      <CardContent className="p-6 sm:p-8 md:p-12 text-center">
                        <div className="p-3 sm:p-4 rounded-full bg-muted inline-flex mb-3 sm:mb-4">
                          <Zap className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
                          {projectAnalytics.topEndpoints?.length === 0 
                            ? "No endpoints available for analytics" 
                            : "Select an endpoint to view analytics"}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {projectAnalytics.topEndpoints?.length === 0 
                            ? "Create and execute endpoints to see analytics data"
                            : "Click on an endpoint card above to view detailed analytics"}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Scroll to top button */}
          <div className="sticky bottom-3 sm:bottom-4 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={scrollToTop}
              className="bg-background/80 backdrop-blur-sm text-xs sm:text-sm h-8 sm:h-9"
            >
              <ArrowUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Scroll to top</span>
              <span className="sm:hidden">Top</span>
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}