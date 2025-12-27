'use client'

import { useState, useEffect, useRef } from 'react'
import { Endpoint, ExecutionResult, ExecutionRequest, MockDataCollection, Environment } from '@/types/types'
import { ApiClient } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Play,
  Save,
  Copy,
  Check,
  Clock,
  Database,
  Globe,
  Shield,
  RefreshCw,
  Download,
  Upload,
  AlertCircle,
  Code,
  FileJson,
  Key,
  Eye,
  EyeOff,
  Zap,
  Settings
} from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// UPDATED INTERFACE TO ACCEPT MOCK DATA AND ENVIRONMENTS
interface TestPanelProps {
  endpoint: Endpoint
  projectId: string
  onExecutionComplete?: (result: ExecutionResult) => void
  mockDataCollections?: MockDataCollection[]
  environments?: Environment[]
  initialExecutionResult?: ExecutionResult | null
  initialTestPanelState?: any
  onStateChange?: (state: any) => void
}

export function TestPanel({ 
  endpoint, 
  projectId, 
  onExecutionComplete,
  mockDataCollections = [],
  environments = [],
  initialTestPanelState,
  onStateChange 
}: TestPanelProps) {
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('params')
  const [requestBody, setRequestBody] = useState('{\n  \n}')
  const [queryParams, setQueryParams] = useState<Record<string, string>>({})
  const [pathParams, setPathParams] = useState<Record<string, string>>({})
  const [headers, setHeaders] = useState<Record<string, string>>({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  })
  const [authToken, setAuthToken] = useState('')
  const [showAuthToken, setShowAuthToken] = useState(false)
  const [response, setResponse] = useState<ExecutionResult | null>(null)
  const [executing, setExecuting] = useState(false)
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [requestHistory, setRequestHistory] = useState<any[]>([])
  
  // NEW STATES FOR MOCK DATA AND ENVIRONMENT SELECTION
  const [selectedMockData, setSelectedMockData] = useState<string>('')
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('')
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  
  const responseRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    if (initialTestPanelState) {
      const { 
        requestBody, 
        queryParams, 
        pathParams, 
        headers, 
        authToken,
        selectedMockData,
        selectedEnvironment,
        showAdvancedSettings 
      } = initialTestPanelState;
      
      if (requestBody) setRequestBody(requestBody);
      if (queryParams) setQueryParams(queryParams);
      if (pathParams) setPathParams(pathParams);
      if (headers) setHeaders(headers);
      if (authToken) setAuthToken(authToken);
      if (selectedMockData) setSelectedMockData(selectedMockData);
      if (selectedEnvironment) setSelectedEnvironment(selectedEnvironment);
      if (showAdvancedSettings !== undefined) setShowAdvancedSettings(showAdvancedSettings);
    }
  }, [initialTestPanelState]);


  useEffect(() => {
    if (onStateChange) {
      onStateChange({
        requestBody,
        queryParams,
        pathParams,
        headers,
        authToken,
        selectedMockData,
        selectedEnvironment,
        showAdvancedSettings
      });
    }
  }, [
    requestBody, 
    queryParams, 
    pathParams, 
    headers, 
    authToken,
    selectedMockData,
    selectedEnvironment,
    showAdvancedSettings,
    onStateChange
  ]);

  // Parse path parameters from endpoint path
  useEffect(() => {
    const paramMatches = endpoint.path.match(/:\w+/g) || []
    const params: Record<string, string> = {}
    paramMatches.forEach(param => {
      const paramName = param.substring(1)
      params[paramName] = ''
    })
    setPathParams(params)
  }, [endpoint.path])

  // Initialize from endpoint defaults
  useEffect(() => {
    if (endpoint.queryParams) {
      setQueryParams(endpoint.queryParams)
    }
    if (endpoint.headers) {
      setHeaders(prev => ({ ...prev, ...endpoint.headers }))
    }
    
    // Get auth token from localStorage
    const token = localStorage.getItem('accessToken')
    if (token) {
      setAuthToken(token)
      setHeaders(prev => ({
        ...prev,
        'Authorization': `Bearer ${token}`
      }))
    }
    
    // Set default mock data and environment if available
    if (mockDataCollections.length > 0) {
      setSelectedMockData(mockDataCollections[0].id)
    }
    if (environments.length > 0) {
      const defaultEnv = environments.find(e => e.isDefault) || environments[0]
      setSelectedEnvironment(defaultEnv.id)
    }
  }, [endpoint, mockDataCollections, environments])

  const handleExecute = async () => {
    setExecuting(true)
    const startTime = Date.now()
    
    try {
      // Parse request body if it's JSON
      let parsedBody: any = {}
      try {
        parsedBody = requestBody.trim() ? JSON.parse(requestBody) : {}
      } catch (e) {
        toast.error('Invalid JSON in request body')
        return
      }

      // Prepare request data WITH MOCK DATA AND ENVIRONMENT
      const requestData: ExecutionRequest = {
        body: parsedBody,
        query: queryParams,
        params: pathParams,
        headers: headers,
        // ADD MOCK DATA AND ENVIRONMENT IDS
        mockDataCollectionId: selectedMockData || undefined,
        environmentId: selectedEnvironment || undefined
      }

      // console.log('🔍 Executing with context:', {
      //   mockDataId: selectedMockData,
      //   environmentId: selectedEnvironment,
      //   hasMockData: !!selectedMockData,
      //   hasEnvironment: !!selectedEnvironment
      // })

      // Execute endpoint
      const result = await ApiClient.executeEndpoint(projectId, endpoint.id, requestData)
      const endTime = Date.now()
      
      setResponse(result)
      setResponseTime(endTime - startTime)

      // Scroll to response
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 100)

      // Pass result to parent
      if (onExecutionComplete) {
        onExecutionComplete(result)
      }

      // Add to history
      const historyItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        endpoint: `${endpoint.method} ${endpoint.path}`,
        status: result.success ? 'success' : 'error',
        time: endTime - startTime,
        statusCode: result.statusCode,
        mockDataId: selectedMockData,
        environmentId: selectedEnvironment
      }
      
      setRequestHistory(prev => [historyItem, ...prev.slice(0, 9)])
      
      // Save to localStorage for persistence
      const savedHistory = JSON.parse(localStorage.getItem('requestHistory') || '[]')
      localStorage.setItem('requestHistory', JSON.stringify([historyItem, ...savedHistory.slice(0, 19)]))
      
      toast.success(`Request completed in ${endTime - startTime}ms`)
    } catch (error: any) {
      const errorResult = {
        success: false,
        error: error.message,
        logs: ['Execution failed'],
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        statusCode: 500
      };
      
      setResponse(errorResult);
      setResponseTime(Date.now() - startTime);
      
      // Scroll to error
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 100)

      // Pass error result too
      if (onExecutionComplete) {
        onExecutionComplete(errorResult)
      }
      
      toast.error('Request failed: ' + error.message)
    } finally {
      setExecuting(false)
    }
  }

  const addQueryParam = () => {
    setQueryParams(prev => ({ ...prev, '': '' }))
  }

  const updateQueryParam = (key: string, value: string, oldKey?: string) => {
    const newParams = { ...queryParams }
    
    if (oldKey && oldKey !== key) {
      delete newParams[oldKey]
    }
    
    if (key.trim()) {
      newParams[key.trim()] = value
    } else {
      delete newParams[oldKey || key]
    }
    
    setQueryParams(newParams)
  }

  const removeQueryParam = (key: string) => {
    const newParams = { ...queryParams }
    delete newParams[key]
    setQueryParams(newParams)
  }

  const updatePathParam = (key: string, value: string) => {
    setPathParams(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const addHeader = () => {
    setHeaders(prev => ({ ...prev, '': '' }))
  }

  const updateHeader = (key: string, value: string, oldKey?: string) => {
    const newHeaders = { ...headers }
    
    if (oldKey && oldKey !== key) {
      delete newHeaders[oldKey]
    }
    
    if (key.trim()) {
      newHeaders[key.trim()] = value
    } else {
      delete newHeaders[oldKey || key]
    }
    
    setHeaders(newHeaders)
  }

  const removeHeader = (key: string) => {
    const newHeaders = { ...headers }
    delete newHeaders[key]
    setHeaders(newHeaders)
  }

  const formatJson = (json: string) => {
    try {
      return JSON.stringify(JSON.parse(json), null, 2)
    } catch {
      return json
    }
  }

  const copyResponse = () => {
    if (response?.data) {
      navigator.clipboard.writeText(JSON.stringify(response.data, null, 2))
      toast.success('Response copied to clipboard')
    } else if (response?.error) {
      navigator.clipboard.writeText(response.error)
      toast.success('Error copied to clipboard')
    }
  }

  const saveRequest = () => {
    const request = {
      endpointId: endpoint.id,
      projectId,
      body: requestBody,
      queryParams,
      headers,
      mockDataId: selectedMockData,
      environmentId: selectedEnvironment,
      timestamp: new Date().toISOString()
    }
    
    const saved = JSON.parse(localStorage.getItem('savedRequests') || '[]')
    saved.push(request)
    localStorage.setItem('savedRequests', JSON.stringify(saved.slice(-20)))
    toast.success('Request saved')
  }

  const exportRequest = () => {
    const requestData = {
      endpoint: `${endpoint.method} ${endpoint.path}`,
      request: {
        body: JSON.parse(requestBody || '{}'),
        queryParams,
        headers
      },
      context: {
        mockDataId: selectedMockData,
        environmentId: selectedEnvironment
      },
      timestamp: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(requestData, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
    const exportFileDefaultName = `request-${endpoint.name.replace(/\s+/g, '-')}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const importRequest = () => {
    // TODO: Implement request import
    toast.info('Import functionality coming soon')
  }

  const handleUseAuthToken = () => {
    if (authToken) {
      setHeaders(prev => ({
        ...prev,
        'Authorization': `Bearer ${authToken}`
      }))
      toast.success('Auth token added to headers')
    }
  }

  // Function to scroll container to bottom
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }

  // Scroll to bottom when new response arrives
  useEffect(() => {
    if (response) {
      scrollToBottom()
    }
  }, [response])

  return (
    <div ref={containerRef} className="h-full overflow-y-auto space-y-6 p-1">
      {/* Advanced Settings */}
      <div className="rounded-lg border border-border/40 overflow-hidden">
        <div 
          className="px-4 py-3 border-b border-border/40 bg-muted/20 flex items-center justify-between cursor-pointer"
          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
        >
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <h3 className="font-medium">Execution Context</h3>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            {showAdvancedSettings ? '−' : '+'}
          </Button>
        </div>
        
        {showAdvancedSettings && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mock Data Selector */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Mock Data Collection
                </Label>
                <Select value={selectedMockData} onValueChange={setSelectedMockData}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mock data" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDataCollections.length === 0 ? (
                      <SelectItem value="none" disabled>
                        <div className="flex items-center gap-2">
                          <Database className="h-3 w-3 opacity-50" />
                          No mock data available
                        </div>
                      </SelectItem>
                    ) : (
                      <>
                        <SelectItem value="none">
                          <div className="flex items-center gap-2">
                            <Database className="h-3 w-3 opacity-50" />
                            No mock data
                          </div>
                        </SelectItem>
                        {mockDataCollections.map(mockData => (
                          <SelectItem key={mockData.id} value={mockData.id}>
                            <div className="flex items-center gap-2">
                              <Database className="h-3 w-3" />
                              <span>{mockData.name}</span>
                              <Badge variant="outline" className="text-xs ml-auto">
                                {mockData.data?.length || 0} items
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Environment Selector */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Environment
                </Label>
                <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    {environments.length === 0 ? (
                      <SelectItem value="none" disabled>
                        <div className="flex items-center gap-2">
                          <Globe className="h-3 w-3 opacity-50" />
                          No environments
                        </div>
                      </SelectItem>
                    ) : (
                      <>
                        <SelectItem value="none">
                          <div className="flex items-center gap-2">
                            <Globe className="h-3 w-3 opacity-50" />
                            No environment
                          </div>
                        </SelectItem>
                        {environments.map(env => (
                          <SelectItem key={env.id} value={env.id}>
                            <div className="flex items-center gap-2">
                              <Globe className="h-3 w-3" />
                              <span>{env.name}</span>
                              {env.isDefault && (
                                <Badge className="text-xs bg-green-500/20 text-green-600 ml-auto">
                                  Default
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground pt-2 border-t">
              <p>Mock data provides test data, environment provides variables for your endpoint execution.</p>
            </div>
          </div>
        )}
      </div>

      {/* Request Builder */}
      <div className="rounded-lg border border-border/40 overflow-hidden">
        <div className="px-4 py-3 border-b border-border/40 bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={
              endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-600 border-blue-500/30' :
              endpoint.method === 'POST' ? 'bg-green-500/20 text-green-600 border-green-500/30' :
              endpoint.method === 'PUT' ? 'bg-amber-500/20 text-amber-600 border-amber-500/30' :
              endpoint.method === 'DELETE' ? 'bg-red-500/20 text-red-600 border-red-500/30' :
              'bg-gray-500/20 text-gray-600 border-gray-500/30'
            }>
              {endpoint.method}
            </Badge>
            <span className="font-mono text-sm truncate">{endpoint.path}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={saveRequest}
              className="gap-2"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </Button>
            <Button
              size="sm"
              onClick={handleExecute}
              disabled={executing}
              className="gap-2"
            >
              {executing ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
              {executing ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="params">Query Params</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="auth">Auth</TabsTrigger>
          </TabsList>

          <TabsContent value="params" className="space-y-3 pt-4">
            <div className="space-y-2">
              {Object.entries(queryParams).map(([key, value], index) => (
                <div key={index} className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Key"
                    value={key}
                    onChange={(e) => updateQueryParam(e.target.value, value, key)}
                    className="font-mono text-sm"
                  />
                  <Input
                    placeholder="Value"
                    value={value}
                    onChange={(e) => updateQueryParam(key, e.target.value)}
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQueryParam(key)}
                    className="h-10"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addQueryParam}
                className="gap-1"
              >
                + Add Param
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="headers" className="space-y-3 pt-4">
            <div className="space-y-2">
              {Object.entries(headers).map(([key, value], index) => (
                <div key={index} className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Header name"
                    value={key}
                    onChange={(e) => updateHeader(e.target.value, value, key)}
                    className="font-mono text-sm"
                  />
                  <Input
                    placeholder="Header value"
                    value={value}
                    onChange={(e) => updateHeader(key, e.target.value)}
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHeader(key)}
                    className="h-10"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addHeader}
                className="gap-1"
              >
                + Add Header
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="body" className="pt-4">
            <div className="space-y-2">
              <Label>Request Body (JSON)</Label>
              <Textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="font-mono text-sm min-h-[200px] max-h-[400px] overflow-y-auto"
                placeholder="Enter request body (JSON)"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRequestBody(formatJson(requestBody))}
                >
                  Format JSON
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRequestBody('{\n  \n}')}
                >
                  Clear
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="auth" className="pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Authentication Type</Label>
                <select 
                  className="w-full p-2 rounded border border-border/40 bg-background"
                  onChange={(e) => {
                    if (e.target.value === 'bearer' && authToken) {
                      updateHeader('Authorization', `Bearer ${authToken}`)
                    }
                  }}
                >
                  <option value="none">No Auth</option>
                  <option value="bearer">Bearer Token</option>
                  <option value="apikey">API Key</option>
                  <option value="basic">Basic Auth</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Token / API Key</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAuthToken(!showAuthToken)}
                    className="h-6 gap-1"
                  >
                    {showAuthToken ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                    {showAuthToken ? 'Hide' : 'Show'}
                  </Button>
                </div>
                <div className="relative">
                  <Input 
                    placeholder="Enter your token" 
                    value={authToken}
                    onChange={(e) => setAuthToken(e.target.value)}
                    type={showAuthToken ? 'text' : 'password'}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleUseAuthToken}
                    className="absolute right-1 top-1 h-7"
                  >
                    <Key className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Tokens are stored locally in your browser</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Path Parameters (if any) */}
      {Object.keys(pathParams).length > 0 && (
        <div className="rounded-lg border border-border/40 overflow-hidden">
          <div className="px-4 py-3 border-b border-border/40 bg-muted/20">
            <h3 className="font-medium flex items-center gap-2">
              <Code className="h-4 w-4" />
              Path Parameters
            </h3>
          </div>
          <div className="p-4 space-y-2">
            {Object.entries(pathParams).map(([key, value], index) => (
              <div key={index} className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-muted-foreground">:{key}</span>
                </div>
                <Input
                  placeholder={`Enter value for ${key}`}
                  value={value}
                  onChange={(e) => updatePathParam(key, e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Response Viewer */}
      {response && (
        <div ref={responseRef} className="rounded-lg border border-border/40 overflow-hidden">
          <div className="px-4 py-3 border-b border-border/40 bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Response</span>
                <Badge variant={response.success ? 'default' : 'destructive'}>
                  {response.success ? 'Success' : 'Error'}
                </Badge>
              </div>
              
              {responseTime && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{responseTime}ms</span>
                </div>
              )}
              
              {response.executionTime && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Database className="h-3.5 w-3.5" />
                  <span>Sandbox: {response.executionTime}ms</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyResponse}
                className="gap-1"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setResponse(null)
                  setResponseTime(null)
                }}
                className="gap-1"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Clear
              </Button>
            </div>
          </div>
          
          <div className="p-4">
            <Tabs defaultValue="body">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="body">Body</TabsTrigger>
                <TabsTrigger value="headers">Headers</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="body" className="pt-4">
                <div className="rounded-lg bg-muted/30 p-4 overflow-auto max-h-[400px]">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {response.data ? 
                      JSON.stringify(response.data, null, 2) : 
                      response.error || 'No response data'
                    }
                  </pre>
                </div>
              </TabsContent>
              
              <TabsContent value="headers" className="pt-4">
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  <div className="flex justify-between p-2 rounded bg-muted/30">
                    <span className="font-medium">Content-Type</span>
                    <span className="font-mono">application/json</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-muted/30">
                    <span className="font-medium">X-Execution-Time</span>
                    <span className="font-mono">{response.executionTime}ms</span>
                  </div>
                  {selectedMockData && (
                    <div className="flex justify-between p-2 rounded bg-muted/30">
                      <span className="font-medium flex items-center gap-2">
                        <Database className="h-3 w-3" />
                        Mock Data
                      </span>
                      <span className="font-mono text-xs">
                        {mockDataCollections.find(md => md.id === selectedMockData)?.name || 'Unknown'}
                      </span>
                    </div>
                  )}
                  {selectedEnvironment && (
                    <div className="flex justify-between p-2 rounded bg-muted/30">
                      <span className="font-medium flex items-center gap-2">
                        <Globe className="h-3 w-3" />
                        Environment
                      </span>
                      <span className="font-mono text-xs">
                        {environments.find(env => env.id === selectedEnvironment)?.name || 'Unknown'}
                      </span>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="logs" className="pt-4">
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {response.logs.map((log, index) => (
                    <div key={index} className="p-2 rounded bg-muted/30 font-mono text-sm">
                      {log}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {/* Request History */}
      {requestHistory.length > 0 && (
        <div className="rounded-lg border border-border/40 overflow-hidden">
          <div className="px-4 py-3 border-b border-border/40 bg-muted/20 flex items-center justify-between">
            <h3 className="font-medium">Recent Requests</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={exportRequest}
                className="gap-1 h-7"
              >
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={importRequest}
                className="gap-1 h-7"
              >
                <Upload className="h-3.5 w-3.5" />
                Import
              </Button>
            </div>
          </div>
          
          <div className="divide-y divide-border/40 max-h-[300px] overflow-y-auto">
            {requestHistory.map((req, index) => (
              <div 
                key={index} 
                className="p-3 hover:bg-muted/20 cursor-pointer" 
                onClick={() => {
                  // TODO: Load request from history
                  toast.info('Loading from history coming soon')
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      req.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="font-mono text-sm truncate">{req.endpoint}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {req.time}ms
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(req.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                {(req.mockDataId || req.environmentId) && (
                  <div className="flex gap-2 mt-1">
                    {req.mockDataId && (
                      <Badge variant="outline" className="text-xs h-5">
                        <Database className="h-2.5 w-2.5 mr-1" />
                        Mock Data
                      </Badge>
                    )}
                    {req.environmentId && (
                      <Badge variant="outline" className="text-xs h-5">
                        <Globe className="h-2.5 w-2.5 mr-1" />
                        Environment
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!response && requestHistory.length === 0 && (
        <div className="text-center py-8">
          <div className="inline-flex p-3 rounded-full bg-muted/50 mb-4">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Requests Yet</h3>
          <p className="text-muted-foreground mb-4">
            Configure your request and click "Send Request" to test this endpoint
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-3.5 w-3.5" />
            <span>Use mock data and environments in Advanced Settings</span>
          </div>
        </div>
      )}
    </div>
  )
}