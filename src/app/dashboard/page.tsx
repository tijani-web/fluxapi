'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { 
  Plus, 
  Zap, 
  Code2, 
  Users, 
  Folder, 
  ArrowRight,
  FileCode,
  Loader2,
  Sparkles,
  Search,
  Database,
  Cpu,
  Cloud,
  Lock,
  Globe,
  Users2,
  EyeOff,
  ChevronRight,
  Home,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { Project, PaginatedResponse } from '@/types/types'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth()
  const toast = useToast()
  
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [creatingProject, setCreatingProject] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalEndpoints: 0,
    activeCollaborators: 0
  })

  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDashboardData()
    }
  }, [isAuthenticated, user])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Get first page of projects
      const projectsRes = await api.getProjects({ 
        page: 1, 
        limit: 20 
      })
      
      console.log('Projects API response:', projectsRes)
      
      let projectsData: Project[] = []
      let totalProjects = 0
      
      // Handle the actual response structure
      if (projectsRes && typeof projectsRes === 'object') {
        // Check for projects property
        if ('projects' in projectsRes && Array.isArray(projectsRes.projects)) {
          projectsData = projectsRes.projects
          totalProjects = projectsRes.pagination?.total || projectsData.length
        } 
        // Check for paginated response format
        else if ('items' in projectsRes && Array.isArray(projectsRes.items)) {
          projectsData = projectsRes.items
          totalProjects = projectsRes.pagination?.total || projectsData.length
        }
        // Check for array directly
        else if (Array.isArray(projectsRes)) {
          projectsData = projectsRes
          totalProjects = projectsRes.length
        }
      }
      
      console.log('Extracted projects data:', projectsData)
      
      setAllProjects(projectsData)
      
      // Calculate total endpoints from ALL projects
      const totalEndpoints = projectsData.reduce((sum: number, project: Project) => {
        if (!project || typeof project !== 'object') return sum
        
        // Check for endpoints count in various possible locations
        if (project._count && typeof project._count === 'object') {
          return sum + (Number(project._count.endpoints) || 0)
        }
        
        if ('endpointCount' in project) {
          return sum + (Number(project.endpointCount) || 0)
        }
        
        if ('endpoints' in project && Array.isArray(project.endpoints)) {
          return sum + project.endpoints.length
        }
        
        return sum
      }, 0)
      
      // Try to get collaboration stats if endpoint exists
      let activeCollaborators = 0
      try {
        const collabStats = await api.getCollaborationStats()
        activeCollaborators = collabStats?.activeUsers || 
                             collabStats?.activeCollaborators || 
                             collabStats?.collaborators || 0
      } catch (error) {
        console.log('Collaboration stats endpoint not available')
        activeCollaborators = 0
      }

      setStats({
        totalProjects,
        totalEndpoints,
        activeCollaborators
      })

      // Set pagination state
      if (projectsData.length < 20) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }
      setCurrentPage(1)

    } catch (error: any) {
      console.error('Dashboard fetch error:', error)
      toast.error('Failed to load dashboard data')
      setAllProjects([])
      setStats({
        totalProjects: 0,
        totalEndpoints: 0,
        activeCollaborators: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const loadMoreProjects = useCallback(async () => {
    if (loadingMore || !hasMore) return
    
    setLoadingMore(true)
    try {
      const nextPage = currentPage + 1
      const projectsRes = await api.getProjects({ 
        page: nextPage, 
        limit: 20 
      })
      
      let newProjects: Project[] = []
      
      if (projectsRes && typeof projectsRes === 'object') {
        if ('projects' in projectsRes && Array.isArray(projectsRes.projects)) {
          newProjects = projectsRes.projects
        } else if ('items' in projectsRes && Array.isArray(projectsRes.items)) {
          newProjects = projectsRes.items
        } else if (Array.isArray(projectsRes)) {
          newProjects = projectsRes
        }
      }
      
      if (newProjects.length > 0) {
        setAllProjects(prev => [...prev, ...newProjects])
        setCurrentPage(nextPage)
        
        // Update total endpoints count with new projects
        const newEndpoints = newProjects.reduce((sum: number, project: Project) => {
          if (!project || typeof project !== 'object') return sum
          
          if (project._count && typeof project._count === 'object') {
            return sum + (Number(project._count.endpoints) || 0)
          }
          
          if ('endpointCount' in project) {
            return sum + (Number(project.endpointCount) || 0)
          }
          
          return sum
        }, 0)
        
        setStats(prev => ({
          ...prev,
          totalEndpoints: prev.totalEndpoints + newEndpoints
        }))
      }
      
      // Check if there's more to load
      if (newProjects.length < 20) {
        setHasMore(false)
      }
      
    } catch (error) {
      console.error('Error loading more projects:', error)
      toast.error('Failed to load more projects')
    } finally {
      setLoadingMore(false)
    }
  }, [currentPage, hasMore, loadingMore, toast])

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          loadMoreProjects()
        }
      },
      { threshold: 0.5 }
    )
    
    observer.observe(loadMoreRef.current)
    observerRef.current = observer
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loadMoreProjects, hasMore, loadingMore])

  // Filter projects based on search query
  const filteredProjects = allProjects.filter(project => {
    if (!searchQuery.trim()) return true
    
    const query = searchQuery.toLowerCase()
    return (
      project.name.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query) ||
      project.slug?.toLowerCase().includes(query)
    )
  })

  const handleCreateProject = async () => {
    setCreatingProject(true)
    try {
      router.push('/projects/create')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create project')
    } finally {
      setCreatingProject(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC':
        return <Globe className="h-3 w-3 text-blue-500" />
      case 'TEAM':
        return <Users2 className="h-3 w-3 text-green-500" />
      case 'PRIVATE':
        return <Lock className="h-3 w-3 text-amber-500" />
      default:
        return <EyeOff className="h-3 w-3 text-gray-500" />
    }
  }

  const getVisibilityText = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC':
        return 'Public'
      case 'TEAM':
        return 'Team'
      case 'PRIVATE':
        return 'Private'
      default:
        return 'Private'
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
    setMobileMenuOpen(false)
  }

  if (authLoading || loading) {
      return (
       <div className="min-h-screen flex items-center justify-center bg-black">
         <div className="text-center">
           <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
           <p className="mt-4 text-white">Loading dashboard...</p>
         </div>
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left side: Logo with Breadcrumb */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Breadcrumb Home Link */}
              <Link 
                href="/" 
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors group"
              >
                <Home className="h-5 w-5 group-hover:text-primary transition-colors" />
                <span className="sr-only">Home</span>
              </Link>
              
              {/* Separator */}
              <ChevronRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
              
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Code2 className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xl font-bold hidden sm:inline">
                  <span className="text-primary">Flux</span> API
                </span>
                <span className="text-xl font-bold sm:hidden">Flux</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/docs')}
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Docs
              </Button>
              
              {/* User Profile */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium hidden md:inline">{user?.name}</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="sm:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Menu Overlay - SIMPLIFIED */}
          {mobileMenuOpen && (
            <div className="sm:hidden absolute left-4 right-4 top-full mt-2 bg-card/95 backdrop-blur-xl border border-border/40 rounded-lg shadow-xl animate-in slide-in-from-top-5 duration-200">
              <div className="p-4 space-y-4">
                {/* User Profile Mobile */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-base font-medium">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">Dashboard</p>
                  </div>
                </div>

                {/* Mobile Navigation Links - SIMPLIFIED */}
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    onClick={() => {
                      router.push('/docs')
                      setMobileMenuOpen(false)
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                    Documentation
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section - RESPONSIVE */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Developer'} 👋
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Your personal API workspace. Build, test, and deploy APIs instantly.
          </p>
        </div>

        {/* Quick Stats - RESPONSIVE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="sm:col-span-1">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Projects</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.totalProjects}</p>
                </div>
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Folder className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="sm:col-span-1">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Endpoints</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.totalEndpoints}</p>
                </div>
                <div className="p-2 rounded-lg bg-green-500/10">
                  <FileCode className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-1">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Collaborators</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.activeCollaborators}</p>
                </div>
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Recent Projects - RESPONSIVE */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl">Your Projects</CardTitle>
                  <CardDescription className="text-sm">
                    {allProjects.length} project{allProjects.length !== 1 ? 's' : ''} total
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search projects..."
                      className="pl-9 w-full sm:w-48 text-sm h-9 sm:h-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleCreateProject}
                    disabled={creatingProject}
                    className="gap-2 text-sm h-9 sm:h-10"
                    size="sm"
                  >
                    {creatingProject ? (
                      <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                    ) : (
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    )}
                    <span className="hidden xs:inline">New</span> Project
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="max-h-[500px] overflow-y-auto">
                {filteredProjects.length > 0 ? (
                  <div className="space-y-3">
                    {filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-border/40 hover:border-primary/20 transition-colors cursor-pointer hover:bg-accent/5 active:scale-[0.99]"
                        onClick={() => router.push(`/projects/${project.id}`)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 flex-shrink-0">
                            <Folder className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-sm sm:text-base truncate">{project.name}</h3>
                            <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mt-0.5">
                              <span className="flex items-center gap-1 flex-shrink-0">
                                <FileCode className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                {project?._count?.endpoints || 
                                 project?.endpointCount || 
                                 (project?.endpoints ? project.endpoints.length : 0)} endpoints
                              </span>
                              <span className="text-muted-foreground/50">•</span>
                              <span className="flex items-center gap-1 flex-shrink-0">
                                {getVisibilityIcon(project?.visibility || 'PRIVATE')}
                                {getVisibilityText(project?.visibility || 'PRIVATE')}
                              </span>
                              {project.description && (
                                <>
                                  <span className="text-muted-foreground/50">•</span>
                                  <span className="truncate text-xs hidden sm:inline">
                                    {project.description}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0 ml-2" />
                      </div>
                    ))}
                    
                    {/* Load more trigger */}
                    {hasMore && (
                      <div ref={loadMoreRef} className="py-4 text-center">
                        {loadingMore ? (
                          <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mx-auto text-muted-foreground" />
                        ) : (
                          <p className="text-xs sm:text-sm text-muted-foreground">Scroll to load more</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-3 sm:mb-4">
                      <Folder className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg mb-1.5 sm:mb-2">No projects found</h3>
                    <p className="text-muted-foreground text-sm sm:text-base mb-3 sm:mb-4 max-w-sm mx-auto">
                      {searchQuery ? 'No projects match your search' : 'Create your first API project to get started'}
                    </p>
                    <Button 
                      onClick={handleCreateProject} 
                      disabled={creatingProject}
                      size="sm"
                      className="sm:size-default"
                    >
                      {creatingProject ? (
                        <>
                          <Loader2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create First Project'
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Start & Features - RESPONSIVE */}
          <div className="space-y-6 sm:space-y-8">
            {/* Quick Start */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg sm:text-xl">Quick Start</CardTitle>
                <CardDescription className="text-sm">
                  Start building in seconds
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto py-3 sm:py-4"
                  onClick={handleCreateProject}
                  disabled={creatingProject}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                      <Plus className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base">Create New Project</p>
                      <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1 truncate">
                        Start from scratch with a blank project
                      </p>
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Features Preview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg sm:text-xl">Workspace Features</CardTitle>
                <CardDescription className="text-sm">
                  Everything you need in one place
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/10 flex-shrink-0">
                    <Code2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base">API Builder</p>
                    <p className="text-xs text-muted-foreground truncate">Visual endpoint creation</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-green-500/10 flex-shrink-0">
                    <Database className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base">Mock Data</p>
                    <p className="text-xs text-muted-foreground truncate">In-browser database</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-amber-500/10 flex-shrink-0">
                    <Cpu className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base">Code Execution</p>
                    <p className="text-xs text-muted-foreground truncate">Sandboxed JavaScript</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/10 flex-shrink-0">
                    <Cloud className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base">Collaboration</p>
                    <p className="text-xs text-muted-foreground truncate">Real-time team editing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav for Quick Actions */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border/40 py-2 px-4 z-40">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3"
            onClick={() => router.push('/docs')}
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-xs">Docs</span>
          </Button>
          
          <Button
            variant="default"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-full"
            onClick={handleCreateProject}
            disabled={creatingProject}
          >
            {creatingProject ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span className="text-xs">New</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="text-xs">Logout</span>
          </Button>
        </div>
      </div>

      {/* Add padding for mobile bottom nav */}
      <div className="pb-16 sm:pb-0"></div>
    </div>
  )
}