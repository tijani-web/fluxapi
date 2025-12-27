'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Save, 
  Play, 
  Terminal,
  ChevronLeft,
  MoreVertical,
  Download,
  Share2,
  ExternalLink,
  RefreshCw,
  Menu
} from 'lucide-react'
import { ApiClient } from '@/lib/api-client'
import { Project } from '@/types/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderBarProps {
  projectId: string
  onSave?: () => Promise<void>
  onExecute?: () => Promise<void>
  onToggleConsole?: () => void
  consoleOpen?: boolean
  isSaving?: boolean
  isExecuting?: boolean
  onMobileMenuToggle?: () => void
}

export function HeaderBar({
  projectId,
  onSave,
  onExecute,
  onToggleConsole,
  consoleOpen = false,
  isSaving = false,
  isExecuting = false,
  onMobileMenuToggle
}: HeaderBarProps) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [sandboxHealth, setSandboxHealth] = useState(true)
  const [isVerySmallScreen, setIsVerySmallScreen] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsVerySmallScreen(width < 375) // iPhone 5/6 is 320-375px
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  useEffect(() => {
    loadProject()
    checkHealth()
  }, [projectId])

  const loadProject = async () => {
    try {
      const data = await ApiClient.getProject(projectId)
      setProject(data)
    } catch (error) {
      console.error('Failed to load project:', error)
    }
  }

  const checkHealth = async () => {
    try {
      const health = await ApiClient.checkHealth()
      setSandboxHealth(!!health)
    } catch {
      setSandboxHealth(false)
    }
  }

  const handleSave = async () => {
    if (onSave) {
      try {
        await onSave()
      } catch (error) {
        console.error('Save failed:', error)
      }
    }
  }

  const handleExecute = async () => {
    if (onExecute) {
      try {
        await onExecute()
      } catch (error) {
        console.error('Execution failed:', error)
      }
    }
  }

  return (
    <header className="h-14 border-b border-border/40 bg-card/50 flex items-center justify-between px-2 sm:px-3 md:px-4">
      {/* Left: Mobile menu + Back button */}
      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuToggle}
          className={isVerySmallScreen ? "h-8 w-8" : "h-9 w-9 lg:hidden"}
        >
          <Menu className={isVerySmallScreen ? "h-4 w-4" : "h-5 w-5"} />
        </Button>
        
        {/* Back button - Icon only on very small screens */}
        <Button
          variant="ghost"
          size={isVerySmallScreen ? "icon" : "sm"}
          onClick={() => router.push('/dashboard')}
          className={isVerySmallScreen ? "h-8 w-8 min-w-0" : "gap-1 sm:gap-2"}
          aria-label="Back to dashboard"
        >
          <ChevronLeft className={isVerySmallScreen ? "h-4 w-4" : "h-4 w-4"} />
          {!isVerySmallScreen && (
            <span className="hidden xs:inline">Dashboard</span>
          )}
        </Button>
        
        {/* Project info - Optimized for very small screens */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Health indicator - smaller on tiny screens */}
          <div 
            className={`
              ${isVerySmallScreen ? 'p-1' : 'p-1.5'} 
              rounded-md 
              ${sandboxHealth ? 'bg-green-500/10' : 'bg-red-500/10'}
              flex-shrink-0
            `}
            aria-label={sandboxHealth ? "Sandbox is healthy" : "Sandbox is unhealthy"}
          >
            <div 
              className={`
                ${isVerySmallScreen ? 'w-1.5 h-1.5' : 'w-2 h-2'} 
                rounded-full 
                ${sandboxHealth ? 'bg-green-500' : 'bg-red-500'}
              `} 
            />
          </div>
          
          {/* Project name and status - optimized for very small screens */}
          <div className="min-w-0">
            {/* Project name - priority info */}
            <h1 
              className={`
                font-semibold truncate
                ${isVerySmallScreen ? 'text-xs max-w-[80px]' : 'text-sm max-w-[200px]'}
              `}
              title={project?.name || 'Loading...'}
            >
              {project?.name || 'Loading...'}
            </h1>
            
            {/* Status info - show on appropriate screens */}
            {!isVerySmallScreen && (
              <p className="text-xs text-muted-foreground truncate">
                {project?.visibility || 'PRIVATE'} • {sandboxHealth ? 'Healthy' : 'Unhealthy'}
              </p>
            )}
            
            {/* Ultra-compact status for very small screens */}
            {isVerySmallScreen && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span className="truncate max-w-[60px]">
                  {project?.visibility?.charAt(0) || 'P'}
                </span>
                <span>•</span>
                <span className="truncate max-w-[40px]">
                  {sandboxHealth ? 'OK' : 'ERR'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center: Action buttons - Optimized for very small screens */}
      <div className="flex items-center gap-1">
        {/* Save button */}
        <Button
          variant="outline"
          size={isVerySmallScreen ? "icon" : "sm"}
          onClick={handleSave}
          disabled={isSaving || !onSave}
          className={isVerySmallScreen ? "h-8 w-8" : "gap-1 sm:gap-2 min-h-[36px]"}
          aria-label={isSaving ? "Saving..." : "Save"}
        >
          {isSaving ? (
            <RefreshCw className={isVerySmallScreen ? "h-3 w-3" : "h-4 w-4"} />
          ) : (
            <Save className={isVerySmallScreen ? "h-3 w-3" : "h-4 w-4"} />
          )}
          {!isVerySmallScreen && (
            <span className="hidden sm:inline">
              {isSaving ? 'Saving...' : 'Save'}
            </span>
          )}
        </Button>

        {/* Run button */}
        <Button
          size={isVerySmallScreen ? "icon" : "sm"}
          onClick={handleExecute}
          disabled={isExecuting || !onExecute}
          className={isVerySmallScreen ? "h-8 w-8" : "gap-1 sm:gap-2 min-h-[36px]"}
          aria-label={isExecuting ? "Running..." : "Run"}
        >
          {isExecuting ? (
            <RefreshCw className={isVerySmallScreen ? "h-3 w-3" : "h-4 w-4"} />
          ) : (
            <Play className={isVerySmallScreen ? "h-3 w-3" : "h-4 w-4"} />
          )}
          {!isVerySmallScreen && (
            <span className="hidden sm:inline">
              {isExecuting ? 'Running...' : 'Run'}
            </span>
          )}
        </Button>
      </div>

      {/* Right: Actions - Optimized for very small screens */}
      <div className="flex items-center gap-1 min-w-0">
        {/* Mobile Actions Dropdown - Always show on small screens, hide on larger */}
        <div className={isVerySmallScreen ? "block" : "sm:hidden"}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={isVerySmallScreen ? "h-8 w-8" : "h-9 w-9"}
                aria-label="More actions"
              >
                <MoreVertical className={isVerySmallScreen ? "h-3 w-3" : "h-4 w-4"} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              <DropdownMenuItem 
                onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/project/${projectId}`, '_blank')}
                className="text-xs"
              >
                <ExternalLink className="h-3 w-3 mr-2" />
                Open API
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="text-xs"
              >
                <Share2 className="h-3 w-3 mr-2" />
                Share Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop Actions - Hide on very small screens */}
        {!isVerySmallScreen && (
          <div className="hidden sm:flex items-center gap-1">
            {/* Share button - compact on medium screens */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1 min-h-[36px]"
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              aria-label="Share project"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden md:inline text-xs">Share</span>
            </Button>
            
            {/* Open API button - show only on desktop */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1 min-h-[36px] hidden lg:flex"
              onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/project/${projectId}`, '_blank')}
              aria-label="Open API"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="text-xs">API</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}