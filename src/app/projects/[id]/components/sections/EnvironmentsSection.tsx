'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { Environment, CreateEnvironment, UpdateEnvironment } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  Globe, 
  Plus, 
  Trash2, 
  Copy, 
  CheckCircle, 
  Eye,
  EyeOff,
  Lock,
  Key,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import dynamic from 'next/dynamic'

const JSONInput = dynamic(() => import('react-json-editor-ajrm').then(mod => (mod as any).default), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-muted rounded-md flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading JSON editor...</div>
    </div>
  )
})

interface EnvironmentsSectionProps {
  projectId: string
}

export function EnvironmentsSection({ projectId }: EnvironmentsSectionProps) {
  const { toast } = useToast()
  const [environments, setEnvironments] = useState<Environment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEnv, setSelectedEnv] = useState<Environment | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJSONEditor, setShowJSONEditor] = useState(false)
  const [variables, setVariables] = useState<Record<string, any>>({})
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  
  // alias dynamic JSON editor to any to satisfy TS props usage
  const JSONEditor: any = JSONInput
  
  // Load environments
  const loadEnvironments = useCallback(async () => {
    try {
      const data = await api.getEnvironments(projectId)
      setEnvironments(data)
      
      if (data.length > 0) {
        const defaultEnv = data.find(e => e.isDefault) || data[0]
        setSelectedEnv(defaultEnv)
        setVariables(defaultEnv.variables || {})
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load environments', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [projectId, toast])
  
  useEffect(() => {
    loadEnvironments()
  }, [loadEnvironments])
  
  // Create environment
  const handleCreateEnvironment = async (data: CreateEnvironment) => {
    try {
      const env = await api.createEnvironment(projectId, data)
      setEnvironments(prev => [env, ...prev])
      
      if (data.isDefault) {
        // If this is set as default, update others
        await Promise.all(
          environments.map(e => 
            e.isDefault ? api.updateEnvironment(e.id, { isDefault: false }) : Promise.resolve()
          )
        )
        const updatedEnvs = environments.map(e => ({ ...e, isDefault: false }))
        setEnvironments([env, ...updatedEnvs])
      }
      
      setSelectedEnv(env)
      setVariables(env.variables || {})
      toast({ title: 'Success', description: 'Environment created' })
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to create environment', variant: 'destructive' })
    }
  }
  
  // Update environment
  const handleUpdateEnvironment = async (envId: string, data: UpdateEnvironment) => {
    try {
      const updated = await api.updateEnvironment(envId, data)
      setEnvironments(prev => prev.map(e => e.id === envId ? updated : e))
      if (selectedEnv?.id === envId) {
        setSelectedEnv(updated)
        setVariables(updated.variables || {})
      }
      toast({ title: 'Success', description: 'Environment updated' })
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to update environment', variant: 'destructive' })
    }
  }
  
  // Delete environment
  const handleDeleteEnvironment = async (envId: string) => {
    try {
      await api.deleteEnvironment(envId)
      setEnvironments(prev => prev.filter(e => e.id !== envId))
      if (selectedEnv?.id === envId) {
        if (environments.length > 1) {
          const nextEnv = environments.find(e => e.id !== envId)
          setSelectedEnv(nextEnv || null)
          setVariables(nextEnv?.variables || {})
        } else {
          setSelectedEnv(null)
          setVariables({})
        }
      }
      toast({ title: 'Success', description: 'Environment deleted' })
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to delete environment', variant: 'destructive' })
    }
  }
  
  // Duplicate environment
  const handleDuplicateEnvironment = async (env: Environment) => {
    try {
      const duplicated = await api.createEnvironment(projectId, {
        name: `${env.name} (Copy)`,
        variables: env.variables,
        isDefault: false
      })
      setEnvironments(prev => [duplicated, ...prev])
      setSelectedEnv(duplicated)
      setVariables(duplicated.variables || {})
      toast({ title: 'Success', description: 'Environment duplicated' })
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to duplicate environment', variant: 'destructive' })
    }
  }
  
  // Set as default
  const handleSetDefault = async (env: Environment) => {
    try {
      // Update all environments to not default
      await Promise.all(
        environments.map(e => 
          e.isDefault ? api.updateEnvironment(e.id, { isDefault: false }) : Promise.resolve()
        )
      )
      
      // Set this one as default
      const updated = await api.updateEnvironment(env.id, { isDefault: true })
      
      // Update local state
      setEnvironments(prev => 
        prev.map(e => ({
          ...e,
          isDefault: e.id === env.id
        }))
      )
      
      setSelectedEnv(updated)
      toast({ title: 'Success', description: 'Default environment updated' })
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to set as default', variant: 'destructive' })
    }
  }
  
  // Add new variable
  const handleAddVariable = () => {
    const key = `NEW_VARIABLE_${Date.now()}`
    const newVariables = { ...variables, [key]: '' }
    setVariables(newVariables)
    if (selectedEnv) {
      handleUpdateEnvironment(selectedEnv.id, { variables: newVariables })
    }
  }
  
  // Update variable
  const handleUpdateVariable = (key: string, value: string) => {
    const newVariables = { ...variables, [key]: value }
    setVariables(newVariables)
    if (selectedEnv) {
      handleUpdateEnvironment(selectedEnv.id, { variables: newVariables })
    }
  }
  
  // Delete variable
  const handleDeleteVariable = (key: string) => {
    const newVariables = { ...variables }
    delete newVariables[key]
    setVariables(newVariables)
    if (selectedEnv) {
      handleUpdateEnvironment(selectedEnv.id, { variables: newVariables })
    }
  }
  
  // Toggle secret visibility
  const toggleSecretVisibility = (key: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }
  
  // Check if variable looks like a secret
  const isSecret = (key: string) => {
    const secretKeywords = ['SECRET', 'KEY', 'PASSWORD', 'TOKEN', 'API_KEY', 'PRIVATE']
    return secretKeywords.some(kw => key.toUpperCase().includes(kw))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground text-sm md:text-base">Loading environments...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      {/* Header - Responsive padding and font sizes */}
      <div className="border-b p-4 sm:p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 shrink-0">
              <Globe className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Environments</h2>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base">Manage environment variables</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)} 
            className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base"
            size="sm"
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            New Environment
          </Button>
        </div>
      </div>
      
      {/* Main Content - Responsive grid layout */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 h-full">
          {/* Environment List - Stacks vertically on mobile, side panel on desktop */}
          <div className="space-y-2 sm:space-y-3 lg:space-y-4">
            <div className="lg:hidden mb-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Environments</h3>
            </div>
            {environments.map(env => (
              <Card 
                key={env.id} 
                className={`cursor-pointer transition-all hover:border-primary/40 border-2 ${
                  selectedEnv?.id === env.id 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : 'border-transparent'
                }`}
                onClick={() => {
                  setSelectedEnv(env)
                  setVariables(env.variables || {})
                }}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 flex-wrap">
                        <h4 className="font-semibold text-sm sm:text-base truncate">{env.name}</h4>
                        {env.isDefault && (
                          <Badge 
                            className="bg-green-500/20 text-green-600 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5"
                            variant="secondary"
                          >
                            <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {Object.keys(env.variables || {}).length} variables
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDuplicateEnvironment(env)
                        }}
                      >
                        <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                      <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${
                        selectedEnv?.id === env.id ? 'rotate-90' : ''
                      }`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {environments.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-6 sm:p-8 text-center">
                  <Globe className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-3 sm:mb-4" />
                  <h3 className="font-semibold text-sm sm:text-base mb-1.5 sm:mb-2">No environments yet</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">
                    Create your first environment to store variables
                  </p>
                  <Button 
                    onClick={() => setShowCreateModal(true)} 
                    size="sm"
                    className="text-sm sm:text-base min-h-[44px]"
                  >
                    <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                    Create Environment
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Variables Editor - Full width on mobile, 2/3 on desktop */}
          <div className="lg:col-span-2">
            {selectedEnv ? (
              <Card className="h-full">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg sm:text-xl font-bold truncate">{selectedEnv.name}</span>
                      {selectedEnv.isDefault && (
                        <Badge variant="outline" className="text-[10px] sm:text-xs shrink-0">
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                        onClick={() => setShowJSONEditor(true)}
                      >
                        JSON Editor
                      </Button>
                      {!selectedEnv.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                          onClick={() => handleSetDefault(selectedEnv)}
                        >
                          Set as Default
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 w-8 sm:h-9 sm:w-9"
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this environment?')) {
                            await handleDeleteEnvironment(selectedEnv.id)
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
                  {/* Quick Stats - Responsive grid */}
                  <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                    <Card className="shadow-sm">
                      <CardContent className="p-3 sm:p-4">
                        <div className="text-center">
                          <div className="text-xl sm:text-2xl md:text-3xl font-bold tabular-nums">
                            {Object.keys(variables).length}
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Variables</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                      <CardContent className="p-3 sm:p-4">
                        <div className="text-center">
                          <div className="text-xl sm:text-2xl md:text-3xl font-bold tabular-nums">
                            {Object.keys(variables).filter(k => isSecret(k)).length}
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Secrets</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                      <CardContent className="p-3 sm:p-4">
                        <div className="text-center">
                          <div className="text-xl sm:text-2xl md:text-3xl font-bold tabular-nums">
                            {new Set(Object.values(variables).map(v => typeof v)).size}
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Data Types</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Variables Table - Responsive table */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
                      <h3 className="font-semibold text-sm sm:text-base">Variables</h3>
                      <Button 
                        size="sm" 
                        onClick={handleAddVariable}
                        className="text-xs sm:text-sm h-8 sm:h-9 w-full sm:w-auto"
                      >
                        <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                        Add Variable
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      {/* Table Header - Responsive grid */}
                      <div className="hidden sm:grid sm:grid-cols-12 gap-4 p-3 border-b bg-muted/50">
                        <div className="sm:col-span-4 md:col-span-4 font-medium text-sm">Key</div>
                        <div className="sm:col-span-6 md:col-span-6 font-medium text-sm">Value</div>
                        <div className="sm:col-span-2 md:col-span-2 font-medium text-sm text-center">Actions</div>
                      </div>
                      
                      {/* Mobile Table Header */}
                      <div className="sm:hidden p-3 border-b bg-muted/50">
                        <div className="font-medium text-sm">Environment Variables</div>
                      </div>
                      
                      {Object.entries(variables).map(([key, value]) => {
                        const secret = isSecret(key)
                        return (
                          <div 
                            key={key} 
                            className="border-b last:border-b-0 p-3 sm:p-4"
                          >
                            {/* Mobile View - Stacked */}
                            <div className="sm:hidden space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <code className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[70%]">
                                    {key}
                                  </code>
                                  {secret && (
                                    <Lock className="h-3 w-3 text-amber-500 shrink-0" />
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive shrink-0"
                                  onClick={() => {
                                    if (confirm(`Delete variable "${key}"?`)) {
                                      handleDeleteVariable(key)
                                    }
                                  }}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {secret && !showSecrets[key] ? (
                                  <div className="flex-1 flex items-center">
                                    <Input
                                      type="password"
                                      value="••••••••••••"
                                      readOnly
                                      className="font-mono text-xs h-9"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="ml-2 h-9 w-9 shrink-0"
                                      onClick={() => toggleSecretVisibility(key)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex-1 flex items-center">
                                    <Input
                                      type={secret ? "password" : "text"}
                                      value={String(value)}
                                      onChange={(e) => handleUpdateVariable(key, e.target.value)}
                                      className="font-mono text-xs h-9"
                                    />
                                    {secret && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="ml-2 h-9 w-9 shrink-0"
                                        onClick={() => toggleSecretVisibility(key)}
                                      >
                                        <EyeOff className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Desktop View - Grid */}
                            <div className="hidden sm:grid sm:grid-cols-12 gap-4 items-center">
                              <div className="sm:col-span-4 md:col-span-4 min-w-0">
                                <div className="flex items-center gap-2">
                                  <code className="text-sm bg-muted px-2 py-1 rounded truncate flex-1">
                                    {key}
                                  </code>
                                  {secret && (
                                    <Lock className="h-3 w-3 text-amber-500 shrink-0" />
                                  )}
                                </div>
                              </div>
                              
                              <div className="sm:col-span-6 md:col-span-6 min-w-0">
                                <div className="flex items-center gap-2">
                                  {secret && !showSecrets[key] ? (
                                    <div className="flex-1 flex items-center">
                                      <Input
                                        type="password"
                                        value="••••••••••••"
                                        readOnly
                                        className="font-mono text-sm h-9"
                                      />
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="ml-2 h-9 w-9 shrink-0"
                                        onClick={() => toggleSecretVisibility(key)}
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex-1 flex items-center">
                                      <Input
                                        type={secret ? "password" : "text"}
                                        value={String(value)}
                                        onChange={(e) => handleUpdateVariable(key, e.target.value)}
                                        className="font-mono text-sm h-9"
                                      />
                                      {secret && (
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="ml-2 h-9 w-9 shrink-0"
                                          onClick={() => toggleSecretVisibility(key)}
                                        >
                                          <EyeOff className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="sm:col-span-2 md:col-span-2 flex justify-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 text-destructive"
                                  onClick={() => {
                                    if (confirm(`Delete variable "${key}"?`)) {
                                      handleDeleteVariable(key)
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      
                      {Object.keys(variables).length === 0 && (
                        <div className="p-6 sm:p-8 text-center">
                          <Key className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-3 sm:mb-4" />
                          <p className="text-muted-foreground text-sm sm:text-base mb-3 sm:mb-4">No variables yet</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-sm sm:text-base min-h-[44px]"
                            onClick={handleAddVariable}
                          >
                            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                            Add First Variable
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full">
                <CardContent className="h-full flex items-center justify-center p-6 sm:p-8">
                  <div className="text-center max-w-md">
                    <Globe className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4 sm:mb-6" />
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">Select an Environment</h3>
                    <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">
                      Choose an environment to manage its variables
                    </p>
                    <Button 
                      onClick={() => setShowCreateModal(true)}
                      className="text-sm sm:text-base min-h-[44px]"
                    >
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                      Create Environment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Create Environment Modal - Responsive dialog */}
      <CreateEnvironmentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateEnvironment}
        projectId={projectId}
        environmentsCount={environments.length}
        toast={toast}
      />
      
      {/* JSON Editor Modal - Responsive dialog */}
      {selectedEnv && (
        <Dialog open={showJSONEditor} onOpenChange={setShowJSONEditor}>
          <DialogContent className="max-w-4xl h-[80vh] sm:h-[85vh] md:h-[90vh] w-[95vw] sm:w-[90vw] md:w-[80vw]">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">JSON Editor: {selectedEnv.name}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto min-h-[200px]" id='env-json-editor' >
              <JSONEditor
                locale={{
                  format: 'Format',
                  array: 'Array',
                  object: 'Object',
                  string: 'String',
                  number: 'Number',
                  null: 'Null',
                  boolean: 'Boolean',
                  add_row: 'Add Row',
                  add_column: 'Add Column',
                  add_property: 'Add Property',
                  save: 'Save',
                  cancel: 'Cancel',
                  edit: 'Edit',
                  delete: 'Delete',
                  confirm: 'Confirm',
                }}
                theme={{
                  base00: '#0f172a',
                  base01: '#1e293b',
                  base02: '#451a03',
                  base03: '#94a3b8',
                  base04: '#64748b',
                  base05: '#f8fafc',
                  base06: '#34d399',
                  base07: '#60a5fa',
                  base08: '#f87171',
                  base09: '#60a5fa',
                }}
                style={{ 
                  body: { 
                    fontSize: '13px',
                    fontFamily: 'monospace'
                  }
                }}
                placeholder={variables}
                onChange={(e: any) => {
                  if (e.jsObject) {
                    setVariables(e.jsObject)
                  }
                }}
                waitAfterKeyPress={1000}
                height="400px"
                width="100%"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowJSONEditor(false)}
                className="order-2 sm:order-1 text-sm sm:text-base min-h-[44px]"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  handleUpdateEnvironment(selectedEnv.id, { variables })
                  setShowJSONEditor(false)
                  toast({ title: 'Success', description: 'JSON changes saved' })
                }}
                className="order-1 sm:order-2 text-sm sm:text-base min-h-[44px]"
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Create Environment Modal - Made responsive
function CreateEnvironmentModal({ isOpen, onClose, onSubmit, projectId, environmentsCount, toast }: any) {
  const [form, setForm] = useState({
    name: '',
    variables: '{\n  "NODE_ENV": "development",\n  "API_URL": "https://api.example.com",\n  "PORT": 3000\n}',
    isDefault: environmentsCount === 0
  })
  
  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast({ title: 'Error', description: 'Environment name is required', variant: 'destructive' })
      return
    }
    
    try {
      const variables = JSON.parse(form.variables)
      onSubmit({
        name: form.name,
        variables,
        isDefault: form.isDefault
      })
      onClose()
    } catch (error: any) {
      toast({ title: 'Error', description: 'Invalid JSON format. Please check your syntax.', variant: 'destructive' })
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[95vw] sm:w-[90vw] md:w-[80vw] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Create Environment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-5">
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Environment Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              placeholder="e.g., Development, Staging, Production"
              className="h-10 sm:h-11 text-sm sm:text-base"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Initial Variables (JSON)</Label>
            <textarea
              value={form.variables}
              onChange={(e) => setForm({...form, variables: e.target.value})}
              className="w-full h-32 sm:h-40 font-mono text-xs sm:text-sm p-2 sm:p-3 border rounded bg-background text-foreground resize-none"
              placeholder='{
  "NODE_ENV": "development",
  "API_URL": "https://api.example.com",
  "PORT": 3000
}'
            />
            <p className="text-xs text-muted-foreground">
              Use valid JSON format. Sample provided above.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={form.isDefault}
              onChange={(e) => setForm({...form, isDefault: e.target.checked})}
              className="rounded h-4 w-4"
            />
            <label htmlFor="isDefault" className="text-sm sm:text-base">
              Set as default environment
            </label>
          </div>
          
          <div className="text-sm text-muted-foreground bg-muted/30 p-3 sm:p-4 rounded-lg">
            <p className="font-medium mb-2">💡 Tips:</p>
            <ul className="list-disc pl-4 sm:pl-5 space-y-1">
              <li className="text-xs sm:text-sm">Use uppercase with underscores (e.g., API_KEY, DATABASE_URL)</li>
              <li className="text-xs sm:text-sm">Strings need quotes, numbers don't</li>
              <li className="text-xs sm:text-sm">Use booleans: true/false (without quotes)</li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-end">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="order-2 sm:order-1 text-sm sm:text-base min-h-[44px]"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="order-1 sm:order-2 text-sm sm:text-base min-h-[44px]"
          >
            Create Environment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}