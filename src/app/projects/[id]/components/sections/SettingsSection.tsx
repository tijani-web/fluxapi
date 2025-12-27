'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Project, UpdateProjectData, ProjectCollaborator } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Save, 
  Users, 
  Globe, 
  Shield, 
  Trash2, 
  Copy, 
  Eye,
  EyeOff,
  Key,
  Download,
  Upload,
  Archive,
  AlertCircle,
  CheckCircle,
  Mail,
  UserPlus,
  UserMinus,
  MoreVertical,
  FileText,
  Menu,
  X
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SettingsSectionProps {
  projectId: string
}

export function SettingsSection({ projectId }: SettingsSectionProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [collaborators, setCollaborators] = useState<ProjectCollaborator[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'PRIVATE' as 'PRIVATE' | 'TEAM' | 'PUBLIC',
    settings: {}
  })
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileTabs, setShowMobileTabs] = useState(false)
  
  // Invitation form
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('EDITOR')
  const [inviting, setInviting] = useState(false)
  
  // RESPONSIVE: Check mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Load project data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectData, collaboratorsData] = await Promise.all([
          api.getProject(projectId),
          api.getCollaborators(projectId)
        ])
        
        setProject(projectData)
        setCollaborators(collaboratorsData)
        setFormData({
          name: projectData.name,
          description: projectData.description || '',
          visibility: projectData.visibility,
          settings: projectData.settings || {}
        })
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load settings', variant: 'destructive' })
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [projectId, toast])
  
  // Save project settings
  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await api.updateProject(projectId, formData)
      setProject(updated)
      toast({ title: 'Success', description: 'Settings saved' })
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }
  
  // Delete project
  const handleDeleteProject = async () => {
    if (!confirm('Are you sure? This will permanently delete the project and all its data.')) return
    
    try {
      await api.deleteProject(projectId)
      toast({ title: 'Success', description: 'Project deleted' })
      router.push('/dashboard')
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    }
  }
  
  // Send invitation
  const handleSendInvitation = async () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
      toast({ title: 'Error', description: 'Please enter a valid email', variant: 'destructive' })
      return
    }
    
    setInviting(true)
    try {
      await api.sendInvitation(projectId, inviteEmail, inviteRole)
      setInviteEmail('')
      toast({ title: 'Success', description: 'Invitation sent successfully' })
      
      // Refresh collaborators list
      const updatedCollaborators = await api.getCollaborators(projectId)
      setCollaborators(updatedCollaborators)
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } finally {
      setInviting(false)
    }
  }
  
  // Remove collaborator
  const handleRemoveCollaborator = async (userId: string) => {
    if (!confirm('Remove this collaborator?')) return
    
    try {
      await api.removeCollaborator(projectId, userId)
      setCollaborators(prev => prev.filter(c => c.userId !== userId))
      toast({ title: 'Success', description: 'Collaborator removed' })
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    }
  }
  
  // Update collaborator role
  const isValidCollaboratorRole = (role: string): role is 'VIEWER' | 'EDITOR' | 'ADMIN' => {
    return ['VIEWER', 'EDITOR', 'ADMIN'].includes(role)
  }

  // Update collaborator role
  const handleUpdateCollaboratorRole = async (userId: string, role: string) => {
    if (!isValidCollaboratorRole(role)) {
      toast({ 
        title: 'Error', 
        description: 'Invalid role selected', 
        variant: 'destructive' 
      })
      return
    }
    
    try {
      await api.updateCollaborator(projectId, userId, { role })
      setCollaborators(prev => prev.map(c => 
        c.userId === userId ? { ...c, role } : c
      ))
      toast({ title: 'Success', description: 'Role updated' })
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    }
  }
  
  // Export project
  const handleExportProject = async () => {
    try {
      const exportData = await api.exportProject(projectId, {
            includeEndpoints: true,
            includeMockData: true,
            includeEnvironments: true,
            format: 'json'
      })
      
      // Create download link
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${project?.name || 'project'}-export.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({ title: 'Success', description: 'Project exported successfully' })
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }
  
  if (!project) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="text-center max-w-md p-4">
          <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-destructive mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-bold mb-2">Project not found</h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            The project you're trying to access doesn't exist
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header - Fixed height */}
      <div className="border-b border-border/40 p-3 sm:p-4 md:p-6 flex-shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileTabs(!showMobileTabs)}
                className="h-10 w-10 min-h-[44px] min-w-[44px]"
                aria-label={showMobileTabs ? "Close menu" : "Open menu"}
              >
                {showMobileTabs ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
            <div className="p-2 rounded-lg bg-primary/10 hidden xs:block">
              <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">Project Settings</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Manage project configuration and team</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleSave} 
              disabled={saving}
              size="sm"
              className="min-h-[44px]"
            >
              <Save className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save Changes'}</span>
              <span className="sm:hidden">Save</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Tabs Area */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value)
          if (isMobile) setShowMobileTabs(false)
        }} className="h-full">
          {/* Tab Navigation */}
          <div className={cn(
            "border-b flex-shrink-0",
            isMobile && !showMobileTabs ? "hidden" : "block"
          )}>
            <TabsList className={cn(
              "h-12 px-2 sm:px-4",
              isMobile ? "grid grid-cols-2 gap-1" : "grid grid-cols-4"
            )}>
              <TabsTrigger value="general" className="h-10 text-xs sm:text-sm px-2 sm:px-3">
                <Settings className="h-4 w-4 mr-2" />
                <span className="truncate">General</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="h-10 text-xs sm:text-sm px-2 sm:px-3">
                <Users className="h-4 w-4 mr-2" />
                <span className="truncate">Team</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="h-10 text-xs sm:text-sm px-2 sm:px-3">
                <Key className="h-4 w-4 mr-2" />
                <span className="truncate">API Access</span>
              </TabsTrigger>
              <TabsTrigger value="danger" className="h-10 text-xs sm:text-sm px-2 sm:px-3">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="truncate">Danger Zone</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* General Settings */}
          <TabsContent value="general" className="h-[calc(100%-48px)] p-0 m-0 overflow-y-auto">
            <div className="p-3 sm:p-4 md:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  {/* Basic Info */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm sm:text-base md:text-lg">Basic Information</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Update your project name and description
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm sm:text-base">Project Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="My API Project"
                          className="min-h-[44px] text-sm sm:text-base"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm sm:text-base">Description</Label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          placeholder="Describe your project..."
                          rows={4}
                          className="text-sm sm:text-base"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm sm:text-base">Project Slug</Label>
                        <Input
                          value={project.slug}
                          readOnly
                          className="font-mono text-xs sm:text-sm min-h-[44px]"
                        />
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Used in API URLs: https://api.yourapi.com/{project.slug}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Visibility */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm sm:text-base md:text-lg">Visibility</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Control who can access this project
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3 sm:gap-0">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-500/10 flex-shrink-0">
                              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm sm:text-base">Private</h4>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                Only you and invited collaborators can access
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={formData.visibility === 'PRIVATE'}
                            onCheckedChange={() => setFormData({...formData, visibility: 'PRIVATE'})}
                            className="sm:ml-4"
                          />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3 sm:gap-0">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 flex-shrink-0">
                              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm sm:text-base">Team</h4>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                All team members can access
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={formData.visibility === 'TEAM'}
                            onCheckedChange={() => setFormData({...formData, visibility: 'TEAM'})}
                            className="sm:ml-4"
                          />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3 sm:gap-0">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/10 flex-shrink-0">
                              <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm sm:text-base">Public</h4>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                Anyone can view (read-only)
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={formData.visibility === 'PUBLIC'}
                            onCheckedChange={() => setFormData({...formData, visibility: 'PUBLIC'})}
                            className="sm:ml-4"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Project Info Sidebar */}
                <div className="space-y-4 sm:space-y-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm sm:text-base md:text-lg">Project Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Created</p>
                        <p className="font-medium text-sm sm:text-base">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Last Updated</p>
                        <p className="font-medium text-sm sm:text-base">
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Project ID</p>
                        <code className="text-xs sm:text-sm bg-muted px-2 py-1 rounded truncate block">
                          {project.id}
                        </code>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">API Base URL</p>
                        <code className="text-xs sm:text-sm bg-muted px-2 py-1 rounded truncate block">
                          https://api.yourapi.com/{project.slug}
                        </code>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm sm:text-base md:text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start min-h-[44px] text-sm"
                        onClick={handleExportProject}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Project
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start min-h-[44px] text-sm"
                        onClick={() => window.open('/docs', '_blank')}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        API Documentation
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Team Settings */}
          <TabsContent value="team" className="h-[calc(100%-48px)] p-0 m-0 overflow-y-auto">
            <div className="p-3 sm:p-4 md:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  {/* Collaborators List */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm sm:text-base md:text-lg">Team Members</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Manage who has access to this project
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {/* Owner */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="font-semibold text-primary">
                                {project.owner.name.charAt(0)}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm sm:text-base truncate">{project.owner.name}</h4>
                                <Badge className="bg-purple-500/20 text-purple-600 text-xs">Owner</Badge>
                              </div>
                              <p className="text-xs sm:text-sm text-muted-foreground truncate">{project.owner.email}</p>
                            </div>
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            Joined {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        
                        {/* Collaborators */}
                        {collaborators.map(collaborator => (
                          <div key={collaborator.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                <span className="font-semibold">
                                  {collaborator.user.name.charAt(0)}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-sm sm:text-base truncate">{collaborator.user.name}</h4>
                                  <Badge variant="outline" className="text-xs">{collaborator.role}</Badge>
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground truncate">{collaborator.user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 self-end sm:self-center">
                              <Select
                                value={collaborator.role}
                                onValueChange={(role: string) => handleUpdateCollaboratorRole(collaborator.userId, role)}
                              >
                                <SelectTrigger className="w-full sm:w-32 text-xs sm:text-sm min-h-[44px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="VIEWER" className="text-sm">Viewer</SelectItem>
                                  <SelectItem value="EDITOR" className="text-sm">Editor</SelectItem>
                                  <SelectItem value="ADMIN" className="text-sm">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveCollaborator(collaborator.userId)}
                                className="h-9 w-9 text-destructive hover:text-destructive"
                              >
                                <UserMinus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        {collaborators.length === 0 && (
                          <div className="text-center py-6 sm:py-8">
                            <Users className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto text-muted-foreground mb-3" />
                            <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-2">No team members yet</h3>
                            <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto">
                              Invite collaborators to work on this project together
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Invite Form */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm sm:text-base md:text-lg">Invite Collaborator</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Add team members by email address
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex-1">
                            <Input
                              placeholder="collaborator@example.com"
                              type="email"
                              value={inviteEmail}
                              onChange={(e) => setInviteEmail(e.target.value)}
                              className="min-h-[44px] text-sm sm:text-base"
                            />
                          </div>
                          <div className="w-full sm:w-32">
                            <Select value={inviteRole} onValueChange={setInviteRole}>
                              <SelectTrigger className="min-h-[44px] text-sm sm:text-base">
                                <SelectValue placeholder="Role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="VIEWER" className="text-sm">Viewer</SelectItem>
                                <SelectItem value="EDITOR" className="text-sm">Editor</SelectItem>
                                <SelectItem value="ADMIN" className="text-sm">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button 
                          className="w-full min-h-[44px]" 
                          onClick={handleSendInvitation}
                          disabled={inviting || !inviteEmail}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          <span className="text-sm">{inviting ? 'Sending...' : 'Send Invitation'}</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Permissions Sidebar */}
                <div className="space-y-4 sm:space-y-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm sm:text-base md:text-lg">Role Permissions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base mb-2">Viewer</h4>
                        <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>View endpoints and documentation</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Test endpoints</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span>Cannot edit or delete</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base mb-2">Editor</h4>
                        <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>All Viewer permissions</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Create and edit endpoints</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span>Cannot manage team or delete project</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base mb-2">Admin</h4>
                        <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>All Editor permissions</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Manage team members</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Project settings and deletion</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* API Access */}
          <TabsContent value="api" className="h-[calc(100%-48px)] p-0 m-0 overflow-y-auto">
            <div className="p-3 sm:p-4 md:p-6">
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base md:text-lg">API Keys</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Manage API keys for programmatic access
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-sm sm:text-base">Authentication Methods</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Choose how clients authenticate with your API
                          </p>
                        </div>
                        <Button className="min-h-[44px]" size="sm">
                          <Key className="h-4 w-4 mr-2" />
                          <span className="text-sm">Create API Key</span>
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Card>
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 rounded-lg bg-blue-500/10 flex-shrink-0">
                                <Key className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm sm:text-base">API Key</h4>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                  Bearer token authentication
                                </p>
                              </div>
                            </div>
                            <Switch defaultChecked />
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 rounded-lg bg-green-500/10 flex-shrink-0">
                                <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm sm:text-base">JWT</h4>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                  JSON Web Token authentication
                                </p>
                              </div>
                            </div>
                            <Switch />
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base md:text-lg">CORS Settings</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Configure Cross-Origin Resource Sharing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm sm:text-base">Allowed Origins</Label>
                        <Textarea
                          placeholder="https://example.com&#10;https://app.example.com"
                          rows={4}
                          className="text-sm sm:text-base"
                        />
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          One origin per line. Use * to allow all origins (not recommended for production).
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <Label className="text-sm sm:text-base">Allow Credentials</Label>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Include cookies and authentication headers
                          </p>
                        </div>
                        <Switch className="sm:ml-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Danger Zone */}
          <TabsContent value="danger" className="h-[calc(100%-48px)] p-0 m-0 overflow-y-auto">
            <div className="p-3 sm:p-4 md:p-6">
              <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
                <Card className="border-destructive">
                  <CardHeader>
                    <CardTitle className="text-destructive text-sm sm:text-base md:text-lg">Delete Project</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Permanently delete this project and all its data. This action cannot be undone.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        <strong>Warning:</strong> This will immediately delete:
                      </p>
                      <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 list-disc pl-4">
                        <li>All API endpoints and their code</li>
                        <li>All mock data collections</li>
                        <li>All execution logs and analytics</li>
                        <li>All webhooks and configurations</li>
                        <li>All environment variables</li>
                        <li>All team collaborations</li>
                      </ul>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <Input
                          placeholder="Type 'delete' to confirm"
                          className="flex-1 min-h-[44px] text-sm sm:text-base"
                          id="deleteConfirm"
                        />
                        <Button 
                          variant="destructive"
                          onClick={() => {
                            const confirmInput = document.getElementById('deleteConfirm') as HTMLInputElement
                            if (confirmInput.value === 'delete') {
                              handleDeleteProject()
                            } else {
                              toast({ 
                                title: 'Error', 
                                description: 'Please type "delete" to confirm', 
                                variant: 'destructive' 
                              })
                            }
                          }}
                          className="min-h-[44px] w-full sm:w-auto"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          <span className="text-sm">Delete Project</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm sm:text-base md:text-lg">Export Project Data</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Download a complete backup of your project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start min-h-[44px] text-sm"
                        onClick={handleExportProject}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export as JSON
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start min-h-[44px] text-sm"
                        onClick={() => window.open(`/api/projects/${projectId}/openapi`, '_blank')}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Export as OpenAPI
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start min-h-[44px] text-sm"
                        onClick={() => window.open(`/api/projects/${projectId}/postman`, '_blank')}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Export as Postman Collection
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}