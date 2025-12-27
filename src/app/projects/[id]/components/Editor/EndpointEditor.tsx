'use client'

import { useState, useEffect } from 'react'
import { Endpoint, CreateEndpointData, UpdateEndpointData } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Key,
  Loader2
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface EndpointEditorProps {
  endpoint?: Endpoint
  projectId: string
  onSave: (data: CreateEndpointData | UpdateEndpointData) => Promise<void>
  isNew?: boolean
  isSaving?: boolean
}

export function EndpointEditor({ endpoint, projectId, onSave, isNew = false, isSaving = false }: EndpointEditorProps) {
  const [formData, setFormData] = useState<CreateEndpointData | UpdateEndpointData>({
    path: endpoint?.path || '/api/endpoint',
    method: endpoint?.method || 'GET',
    name: endpoint?.name || 'New Endpoint',
    description: endpoint?.description || '',
    code: endpoint?.code || '// Write your endpoint logic here\nreturn { message: "Hello World" };',
    headers: endpoint?.headers || { 'Content-Type': 'application/json' },
    queryParams: endpoint?.queryParams || {},
    pathParams: endpoint?.pathParams || {},
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']

  const handleSave = async () => {
    try {
      await onSave(formData)
    } catch (error) {
      // Error is handled by parent component
      throw error
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-500/20 text-blue-600 border-blue-500/30'
      case 'POST': return 'bg-green-500/20 text-green-600 border-green-500/30'
      case 'PUT': return 'bg-amber-500/20 text-amber-600 border-amber-500/30'
      case 'DELETE': return 'bg-red-500/20 text-red-600 border-red-500/30'
      case 'PATCH': return 'bg-purple-500/20 text-purple-600 border-purple-500/30'
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30'
    }
  }

  // Update form when endpoint changes
  useEffect(() => {
    if (endpoint) {
      setFormData({
        path: endpoint.path,
        method: endpoint.method,
        name: endpoint.name,
        description: endpoint.description || '',
        code: endpoint.code,
        headers: endpoint.headers || { 'Content-Type': 'application/json' },
        queryParams: endpoint.queryParams || {},
        pathParams: endpoint.pathParams || {},
      })
    }
  }, [endpoint])

  const addHeader = () => {
    setFormData(prev => ({
      ...prev,
      headers: { ...(prev.headers || {}), '': '' }
    }))
  }

  const updateHeader = (key: string, value: string, oldKey?: string) => {
    const currentHeaders = formData.headers || {}
    const newHeaders = { ...currentHeaders }
    
    if (oldKey && oldKey !== key) {
      delete newHeaders[oldKey]
    }
    
    if (key.trim()) {
      newHeaders[key.trim()] = value
    } else {
      delete newHeaders[oldKey || key]
    }
    
    setFormData(prev => ({
      ...prev,
      headers: newHeaders
    }))
  }

  const removeHeader = (key: string) => {
    const currentHeaders = formData.headers || {}
    const newHeaders = { ...currentHeaders }
    delete newHeaders[key]
    setFormData(prev => ({
      ...prev,
      headers: newHeaders
    }))
  }

  const addQueryParam = () => {
    setFormData(prev => ({
      ...prev,
      queryParams: { ...(prev.queryParams || {}), '': '' }
    }))
  }

  const updateQueryParam = (key: string, value: string, oldKey?: string) => {
    const currentParams = formData.queryParams || {}
    const newParams = { ...currentParams }
    
    if (oldKey && oldKey !== key) {
      delete newParams[oldKey]
    }
    
    if (key.trim()) {
      newParams[key.trim()] = value
    } else {
      delete newParams[oldKey || key]
    }
    
    setFormData(prev => ({
      ...prev,
      queryParams: newParams
    }))
  }

  const removeQueryParam = (key: string) => {
    const currentParams = formData.queryParams || {}
    const newParams = { ...currentParams }
    delete newParams[key]
    setFormData(prev => ({
      ...prev,
      queryParams: newParams
    }))
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Endpoint Name *</Label>
          <Input
            id="name"
            value={formData.name as string || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Get Users"
            disabled={isSaving}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="method">HTTP Method *</Label>
          <Select
            value={formData.method as string || 'GET'}
            onValueChange={(value: string) => 
              setFormData((prev) => ({ 
                ...prev, 
                method: value 
              } as CreateEndpointData | UpdateEndpointData))
            }
            disabled={isSaving}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {methods.map((method) => (
                <SelectItem key={method} value={method}>
                  <div className="flex items-center gap-2">
                    <Badge className={getMethodColor(method)}>
                      {method}
                    </Badge>
                    <span>{method}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Path */}
      <div className="space-y-2">
        <Label htmlFor="path">Endpoint Path *</Label>
        <div className="flex gap-2">
          <div className="flex items-center px-3 border border-border/40 rounded-l bg-muted/50">
            <span className="text-sm text-muted-foreground">/</span>
          </div>
          <Input
            id="path"
            value={(formData.path as string || '').startsWith('/') ? (formData.path as string || '').substring(1) : (formData.path as string || '')}
            onChange={(e) => setFormData(prev => ({ ...prev, path: `/${e.target.value}` }))}
            placeholder="api/users"
            className="flex-1 rounded-l-none"
            disabled={isSaving}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Use :param for path parameters (e.g., /users/:id)
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description as string || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe what this endpoint does..."
          rows={2}
          disabled={isSaving}
        />
      </div>

      {/* Advanced Settings Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        disabled={isSaving}
        className="w-full flex items-center justify-between p-3 rounded-lg border border-border/40 hover:border-primary/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4" />
          <span className="font-medium">Advanced Settings</span>
        </div>
        {showAdvanced ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="space-y-6 border border-border/40 rounded-lg p-4">
          {/* Headers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Request Headers</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addHeader}
                className="h-7 gap-1"
                disabled={isSaving}
              >
                <Plus className="h-3 w-3" />
                Add Header
              </Button>
            </div>
            
            <div className="space-y-2">
              {Object.entries(formData.headers || {}).map(([key, value], index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Header name"
                    value={key}
                    onChange={(e) => updateHeader(e.target.value, value as string, key)}
                    className="font-mono text-sm"
                    disabled={isSaving}
                  />
                  <Input
                    placeholder="Header value"
                    value={value as string}
                    onChange={(e) => updateHeader(key, e.target.value)}
                    className="font-mono text-sm"
                    disabled={isSaving}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeHeader(key)}
                    className="h-10 w-10"
                    disabled={isSaving}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Query Parameters */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Query Parameters</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addQueryParam}
                className="h-7 gap-1"
                disabled={isSaving}
              >
                <Plus className="h-3 w-3" />
                Add Parameter
              </Button>
            </div>
            
            <div className="space-y-2">
              {Object.entries(formData.queryParams || {}).map(([key, value], index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Parameter name"
                    value={key}
                    onChange={(e) => updateQueryParam(e.target.value, value as string, key)}
                    className="font-mono text-sm"
                    disabled={isSaving}
                  />
                  <Input
                    placeholder="Parameter value"
                    value={value as string}
                    onChange={(e) => updateQueryParam(key, e.target.value)}
                    className="font-mono text-sm"
                    disabled={isSaving}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQueryParam(key)}
                    className="h-10 w-10"
                    disabled={isSaving}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Path Parameters Detection */}
          {(formData.path as string)?.includes(':') && (
            <div className="space-y-3">
              <Label>Path Parameters Detected</Label>
              <div className="p-3 rounded-lg bg-muted/30">
                <pre className="text-sm font-mono">
                  {JSON.stringify(formData.pathParams || {}, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Save Button */}
      <div className="pt-4 border-t border-border/40">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isNew ? 'Create Endpoint' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}