'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'
import { ApiClient } from '@/lib/api-client'
import { Project } from '@/types/types'
import { Button } from '@/components/ui/button'
import { 
  Save, 
  Play, 
  Code2, 
  Globe, 
  Users, 
  Settings, 
  Terminal,
  ChevronLeft,
  MoreVertical,
  Download,
  Share2,
  RefreshCw,
  ExternalLink
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ProjectHeaderProps {
  projectId: string
  onToggleConsole: () => void
  consoleOpen: boolean
  onSave?: () => Promise<void>
  onExecute?: () => Promise<void>
  isSaving?: boolean
  isExecuting?: boolean
}

export function ProjectHeader({ 
  projectId, 
  onToggleConsole, 
  consoleOpen,
  onSave,
  onExecute,
  isSaving = false,
  isExecuting = false
}: ProjectHeaderProps) {
  const router = useRouter()
  const toast = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [sandboxHealth, setSandboxHealth] = useState<boolean>(true)

  useEffect(() => {
    loadProject()
    checkHealth()
    
    // Set up periodic health check
    const interval = setInterval(checkHealth, 30000) // Every 30 seconds
    
    return () => clearInterval(interval)
  }, [projectId])

  const loadProject = async () => {
    try {
      const data = await ApiClient.getProject(projectId)
      setProject(data)
    } catch (error: any) {
      toast.error(error.message)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const checkHealth = async () => {
    const health = await ApiClient.checkHealth()
    setSandboxHealth(!!health?.status)
  }

  const handleSave = async () => {
    if (onSave) {
      try {
        await onSave()
        toast.success('Changes saved successfully')
      } catch (error: any) {
        toast.error(error.message)
      }
    }
  }

  const handleExecute = async () => {
    if (onExecute) {
      try {
        await onExecute()
      } catch (error: any) {
        toast.error(error.message)
      }
    }
  }

  const handleExport = async () => {
    try {
      toast.info('Exporting project...')
      // TODO: Implement export
    } catch (error: any) {
      toast.error('Export failed')
    }
  }

  const handleSettings = () => {
    router.push(`/project/${projectId}/settings`)
  }

  if (loading) {
    return (
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm h-14 flex items-center px-4">
        <div className="flex items-center gap-3">
          <div className="animate-pulse h-4 w-32 bg-muted rounded" />
          <div className="animate-pulse h-3 w-24 bg-muted rounded" />
        </div>
      </header>
    )
  }

  return (
    <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm h-14 flex items-center justify-between px-4">
      {/* Left: Project Info & Navigation */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard')}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Dashboard
        </Button>

        <div className="flex items-center gap-3">
          <div className={cn(
            "p-1.5 rounded-md",
            sandboxHealth ? "bg-primary/10" : "bg-destructive/10"
          )}>
            <Code2 className={cn(
              "h-4 w-4",
              sandboxHealth ? "text-primary" : "text-destructive"
            )} />
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-sm">{project?.name}</h1>
              <Badge variant="outline" className="text-xs h-5">
                v{project?.version}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                {project?.visibility === 'PUBLIC' ? (
                  <>
                    <Globe className="h-3 w-3" />
                    Public
                  </>
                ) : project?.visibility === 'TEAM' ? (
                  <>
                    <Users className="h-3 w-3" />
                    Team
                  </>
                ) : (
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Private
                  </span>
                )}
              </div>
              
              <span>•</span>
              
              <div className="flex items-center gap-1">
                <span>Endpoints:</span>
                <Badge variant="secondary" className="h-4 px-1 text-xs">
                  {project?._count?.endpoints || 0}
                </Badge>
              </div>
              
              <span>•</span>
              
              <div className={cn(
                "flex items-center gap-1",
                sandboxHealth ? "text-green-500" : "text-destructive"
              )}>
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  sandboxHealth ? "bg-green-500" : "bg-destructive animate-pulse"
                )} />
                <span>Sandbox</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={isSaving || !onSave}
          className="gap-2 min-w-[90px]"
        >
          {isSaving ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? 'Saving...' : 'Save'}
        </Button>

        <Button
          size="sm"
          onClick={handleExecute}
          disabled={isExecuting || !onExecute}
          className="gap-2 min-w-[90px]"
        >
          {isExecuting ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {isExecuting ? 'Running...' : 'Run'}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleConsole}
          className={cn("gap-2", consoleOpen && "bg-muted")}
        >
          <Terminal className="h-4 w-4" />
          Console
        </Button>
      </div>

      {/* Right: Project Actions */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="gap-2" onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              toast.success('Project link copied')
            }}>
              <Share2 className="h-4 w-4" />
              Copy Project Link
            </DropdownMenuItem>
            
            <DropdownMenuItem className="gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export Project
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="gap-2" onClick={() => {
              window.open(`/api/proxy/${projectId}`, '_blank')
            }}>
              <ExternalLink className="h-4 w-4" />
              Open API Base URL
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="gap-2" onClick={handleSettings}>
              <Settings className="h-4 w-4" />
              Project Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}