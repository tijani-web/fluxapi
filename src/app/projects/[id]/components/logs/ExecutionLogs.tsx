// app/project/[id]/components/Logs/ExecutionLogs.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { ExecutionLog, HttpMethod } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Eye,
  Copy,
  Calendar,
  Server,
  User,
  Key,
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatDistanceToNow } from 'date-fns'

interface ExecutionLogsProps {
  projectId: string
  endpointId?: string
}

type LogStatus = 'success' | 'error' | 'all'
type TimeRange = '1h' | '24h' | '7d' | '30d' | 'all'

export function ExecutionLogs({ projectId, endpointId }: ExecutionLogsProps) {
  const { toast } = useToast()
  const [logs, setLogs] = useState<ExecutionLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<LogStatus>('all')
  const [timeRange, setTimeRange] = useState<TimeRange>('all') // CHANGED: Default to 'all'
  const [selectedLog, setSelectedLog] = useState<ExecutionLog | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [total, setTotal] = useState(0)
  
  // Load execution logs
  const loadLogs = useCallback(async () => {
    setLoading(true)
    try {
      let response: ExecutionLog[] = []
      
      if (endpointId) {
        response = await api.getExecutionHistory(endpointId, 100)
      } else {
        toast({
          title: 'Info',
          description: 'Showing logs from first endpoint. Use endpoint-specific view for more logs.',
          variant: 'default'
        })
        response = []
      }
      
      // Filter based on client-side filters
      const filtered = response.filter(log => {
        if (statusFilter === 'success' && log.statusCode >= 400) return false
        if (statusFilter === 'error' && log.statusCode < 400) return false
        
        // Apply time range filter
        const logDate = new Date(log.createdAt)
        const now = new Date()
        const hoursDiff = (now.getTime() - logDate.getTime()) / (1000 * 60 * 60)
        
        switch (timeRange) {
          case '1h': if (hoursDiff > 1) return false; break
          case '24h': if (hoursDiff > 24) return false; break
          case '7d': if (hoursDiff > 24 * 7) return false; break
          case '30d': if (hoursDiff > 24 * 30) return false; break
          case 'all': break // 'all' shows everything
        }
        
        // Apply search filter
        const searchLower = searchQuery.toLowerCase()
        return (
          log.path.toLowerCase().includes(searchLower) ||
          log.method.toLowerCase().includes(searchLower) ||
          (log.error?.toLowerCase() || '').includes(searchLower) ||
          (log.endpoint?.name?.toLowerCase() || '').includes(searchLower)
        )
      })
      
      // Apply pagination
      const startIndex = (page - 1) * limit
      const paginatedLogs = filtered.slice(startIndex, startIndex + limit)
      
      setLogs(paginatedLogs)
      setTotal(filtered.length)
      
    } catch (error) {
      console.error('Failed to load execution logs:', error)
      toast({
        title: 'Error',
        description: 'Failed to load execution logs. Please try again.',
        variant: 'destructive'
      })
      setLogs([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [projectId, endpointId, page, limit, searchQuery, statusFilter, timeRange, toast])
  
  useEffect(() => {
    loadLogs()
  }, [loadLogs])
  
  // Copy log details
  const handleCopyLog = (log: ExecutionLog) => {
    const logText = JSON.stringify({
      id: log.id,
      endpoint: `${log.method} ${log.path}`,
      statusCode: log.statusCode,
      responseTime: log.responseTime,
      timestamp: log.createdAt,
      error: log.error
    }, null, 2)
    
    navigator.clipboard.writeText(logText)
    toast({
      title: 'Copied',
      description: 'Log details copied to clipboard'
    })
  }
  
  // Format status code badge
  const getStatusCodeColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return 'bg-green-500/20 text-green-600'
    if (statusCode >= 300 && statusCode < 400) return 'bg-blue-500/20 text-blue-600'
    if (statusCode >= 400 && statusCode < 500) return 'bg-amber-500/20 text-amber-600'
    return 'bg-red-500/20 text-red-600'
  }
  
  // Format method badge
  const getMethodColor = (method: HttpMethod) => {
    switch (method) {
      case 'GET': return 'bg-blue-500/20 text-blue-600'
      case 'POST': return 'bg-green-500/20 text-green-600'
      case 'PUT': return 'bg-amber-500/20 text-amber-600'
      case 'DELETE': return 'bg-red-500/20 text-red-600'
      case 'PATCH': return 'bg-purple-500/20 text-purple-600'
      default: return 'bg-gray-500/20 text-gray-600'
    }
  }
  
  // Format time
  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }
  
  // Calculate pagination
  const totalPages = Math.ceil(total / limit)
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading execution logs...</p>
        </div>
      </div>
    )
  }
  
  return (
    // CHANGED: Made entire container scrollable
    <div className="h-full flex flex-col space-y-4 mt-4 overflow-hidden">
      {/* Header - Fixed at top */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <p className="text-sm text-muted-foreground">
            {endpointId ? 'Endpoint execution history' : 'Project execution logs'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={logs.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={loadLogs}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Filters - Fixed at top */}
      <Card className="flex-shrink-0">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={(value: LogStatus) => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="success">Success (2xx, 3xx)</SelectItem>
                  <SelectItem value="error">Errors (4xx, 5xx)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Time Range</Label>
              <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {/* CHANGED: "All time" first */}
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="1h">Last hour</SelectItem>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats - Fixed at top */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Executions</p>
                <h3 className="text-2xl font-bold">{total}</h3>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <h3 className="text-2xl font-bold">
                  {logs.length > 0 
                    ? `${Math.round((logs.filter(l => l.statusCode < 400).length / logs.length) * 100)}%`
                    : '0%'
                  }
                </h3>
              </div>
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <h3 className="text-2xl font-bold">
                  {logs.length > 0
                    ? formatTime(logs.reduce((acc, log) => acc + log.responseTime, 0) / logs.length)
                    : '0ms'
                  }
                </h3>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Error Rate</p>
                <h3 className="text-2xl font-bold">
                  {logs.length > 0
                    ? `${Math.round((logs.filter(l => l.statusCode >= 400).length / logs.length) * 100)}%`
                    : '0%'
                  }
                </h3>
              </div>
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Scrollable Logs Section - This part scrolls */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader>
            <CardTitle>Recent Executions</CardTitle>
            <CardDescription>
              {logs.length} logs found
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <div className="h-full overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No execution logs found</p>
                        {searchQuery && (
                          <p className="text-sm mt-2">Try clearing your search filters</p>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(log.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <Badge className={getMethodColor(log.method)}>
                                {log.method}
                              </Badge>
                              <span className="font-medium truncate max-w-[200px]">
                                {log.endpoint?.name || log.path}
                              </span>
                            </div>
                            <code className="text-xs text-muted-foreground truncate">
                              {log.path}
                            </code>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusCodeColor(log.statusCode)}>
                            {log.statusCode}
                          </Badge>
                          {log.error && (
                            <span className="text-xs text-red-500 ml-2 truncate block">
                              {log.error.substring(0, 30)}...
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono">{formatTime(log.responseTime)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {log.user ? (
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{log.user.name}</p>
                                <p className="text-xs text-muted-foreground">{log.user.email}</p>
                              </div>
                            </div>
                          ) : log.apiKey ? (
                            <div className="flex items-center gap-2">
                              <Key className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{log.apiKey.name}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">Anonymous</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedLog(log)
                                setShowDetails(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCopyLog(log)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          
          {/* Pagination - Fixed at bottom of scrollable area */}
          {totalPages > 1 && (
            <div className="border-t p-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} logs
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <span className="px-4">
                    Page {page} of {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
      
      {/* Log Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Execution Log Details</DialogTitle>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Request Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Endpoint</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getMethodColor(selectedLog.method)}>
                          {selectedLog.method}
                        </Badge>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {selectedLog.path}
                        </code>
                      </div>
                      {selectedLog.endpoint?.name && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {selectedLog.endpoint.name}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Status</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusCodeColor(selectedLog.statusCode)}>
                          {selectedLog.statusCode}
                        </Badge>
                        <span className="text-sm">
                          {selectedLog.statusCode < 400 ? 'Success' : 'Error'}
                        </span>
                      </div>
                      {selectedLog.error && (
                        <p className="text-sm text-red-500 mt-2">{selectedLog.error}</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Timing</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Response Time:</span>
                          <span className="font-medium">{formatTime(selectedLog.responseTime)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Timestamp:</span>
                          <span className="font-medium">
                            {new Date(selectedLog.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Memory Usage</h4>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Memory Used:</span>
                        <span className="font-medium">
                          {selectedLog.memoryUsed ? `${(selectedLog.memoryUsed / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Request Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Request Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Headers */}
                  {selectedLog.headers && Object.keys(selectedLog.headers).length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Headers</h4>
                      <pre className="text-sm bg-muted p-3 rounded overflow-auto max-h-40">
                        {JSON.stringify(selectedLog.headers, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {/* Query Parameters */}
                  {selectedLog.queryParams && Object.keys(selectedLog.queryParams).length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Query Parameters</h4>
                      <pre className="text-sm bg-muted p-3 rounded overflow-auto max-h-40">
                        {JSON.stringify(selectedLog.queryParams, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {/* Path Parameters */}
                  {selectedLog.pathParams && Object.keys(selectedLog.pathParams).length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Path Parameters</h4>
                      <pre className="text-sm bg-muted p-3 rounded overflow-auto max-h-40">
                        {JSON.stringify(selectedLog.pathParams, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {/* Request Body */}
                  {selectedLog.requestBody && (
                    <div>
                      <h4 className="font-semibold mb-2">Request Body</h4>
                      <pre className="text-sm bg-muted p-3 rounded overflow-auto max-h-40">
                        {typeof selectedLog.requestBody === 'string' 
                          ? selectedLog.requestBody 
                          : JSON.stringify(selectedLog.requestBody, null, 2)
                        }
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Response Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Response Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Response Body */}
                  {selectedLog.responseBody && (
                    <div>
                      <h4 className="font-semibold mb-2">Response Body</h4>
                      <pre className="text-sm bg-muted p-3 rounded overflow-auto max-h-40">
                        {typeof selectedLog.responseBody === 'string'
                          ? selectedLog.responseBody
                          : JSON.stringify(selectedLog.responseBody, null, 2)
                        }
                      </pre>
                    </div>
                  )}
                  
                  {/* Execution Logs */}
                  {selectedLog.logs && selectedLog.logs.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Execution Logs</h4>
                      <div className="space-y-1">
                        {selectedLog.logs.map((log, index) => (
                          <div key={index} className="text-sm bg-muted p-2 rounded">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => selectedLog && handleCopyLog(selectedLog)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Details
            </Button>
            <Button onClick={() => setShowDetails(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}