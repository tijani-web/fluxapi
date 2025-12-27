// app/workspace/[projectId]/components/sections/CollaborationSection.tsx
'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { ProjectCollaborator } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MailCheck,
  Activity,
  Shield,
  Zap,
  Search,
  RefreshCw,
  Send,
  Calendar,
  Crown,
  ArrowUpRight,
  Copy as CopyIcon,
  Code,
  MessageSquare,
  TextCursor,
  GitBranch,
  GitPullRequest,
  GitMerge,
  GitCommit,
  Lock,
  Menu,
  X
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

interface CollaborationSectionProps {
  projectId: string
}

type CollaboratorRole = 'VIEWER' | 'EDITOR' | 'ADMIN'
type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'REVOKED' | 'EXPIRED'

interface Invitation {
  id: string
  email: string
  role: CollaboratorRole
  token: string
  status: InvitationStatus
  invitedById: string
  userId?: string
  createdAt: string
  expiresAt: string
  user?: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  invitedBy?: {
    id: string
    name: string
    email: string
  }
  project?: {
    name: string
  }
}

interface ActiveCollaborator {
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  socketId: string
  joinedAt: string
  activeEndpoint: string
  cursor: any | null
  selection: any | null
}

export function CollaborationSection({ projectId }: CollaborationSectionProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('team')
  const [collaborators, setCollaborators] = useState<ProjectCollaborator[]>([])
  const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>([])
  const [activeCollaborators, setActiveCollaborators] = useState<ActiveCollaborator[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [userSearchResults, setUserSearchResults] = useState<any[]>([])
  const [searchingUsers, setSearchingUsers] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  
  // Invitation form
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<CollaboratorRole>('EDITOR')
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
  
  // Load all collaboration data
  useEffect(() => {
    loadCollaborationData()
  }, [projectId])
  
  const loadCollaborationData = async () => {
    setLoading(true)
    try {
      const [collaboratorsData, invitationsData, activeData] = await Promise.all([
        api.getCollaborators(projectId),
        api.getPendingInvitations(projectId),
        api.getActiveCollaborators(projectId)
      ])
      
      setCollaborators(collaboratorsData)
      setPendingInvitations(invitationsData)
      setActiveCollaborators(activeData)
    } catch (error) {
      console.error('Failed to load collaboration data:', error)
      toast({ title: 'Error', description: 'Failed to load collaboration data', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  // Search users for inviting
  const handleSearchUsers = async (query: string) => {
    if (query.length < 2) {
      setUserSearchResults([])
      return
    }
    
    setSearchingUsers(true)
    try {
      const results = await api.searchCollaborationUsers(query)
      setUserSearchResults(results)
    } catch (error) {
      console.error('Failed to search users:', error)
    } finally {
      setSearchingUsers(false)
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
      
      // Refresh pending invitations
      const updatedInvitations = await api.getPendingInvitations(projectId)
      setPendingInvitations(updatedInvitations)
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } finally {
      setInviting(false)
    }
  }
  
  // Cancel invitation
  const handleCancelInvitation = async (invitationId: string) => {
    if (!confirm('Cancel this invitation?')) return
    
    try {
      // Note: You need to add cancelInvitation to your API
      // await api.cancelInvitation(invitationId)
      toast({ title: 'Success', description: 'Invitation cancelled' })
      
      // Refresh pending invitations
      const updatedInvitations = await api.getPendingInvitations(projectId)
      setPendingInvitations(updatedInvitations)
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    }
  }
  
  // Resend invitation
  const handleResendInvitation = async (invitationId: string) => {
    try {
      // Note: You need to add resendInvitation to your API
      // await api.resendInvitation(invitationId)
      toast({ title: 'Success', description: 'Invitation resent' })
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    }
  }
  
  // Remove collaborator
  const handleRemoveCollaborator = async (userId: string) => {
    if (!confirm('Remove this collaborator from the project?')) return
    
    try {
      await api.removeCollaborator(projectId, userId)
      setCollaborators(prev => prev.filter(c => c.userId !== userId))
      toast({ title: 'Success', description: 'Collaborator removed' })
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    }
  }
  
  // Update collaborator role
  const handleUpdateCollaboratorRole = async (userId: string, role: string) => {
    const validRole = role as CollaboratorRole
    
    if (!['VIEWER', 'EDITOR', 'ADMIN'].includes(validRole)) {
      toast({ 
        title: 'Error', 
        description: 'Invalid role selected', 
        variant: 'destructive' 
      })
      return
    }
    
    try {
      await api.updateCollaborator(projectId, userId, { role: validRole })
      setCollaborators(prev => prev.map(c => 
        c.userId === userId ? { ...c, role: validRole } : c
      ))
      toast({ title: 'Success', description: 'Role updated' })
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    }
  }
  
  // Copy invitation link
  const handleCopyInvitationLink = (token: string) => {
    const link = `${window.location.origin}/invite/${token}`
    navigator.clipboard.writeText(link)
    toast({ title: 'Copied', description: 'Invitation link copied to clipboard' })
  }
  
  // Get role badge color
  const getRoleColor = (role: CollaboratorRole) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-500/20 text-purple-600'
      case 'EDITOR': return 'bg-blue-500/20 text-blue-600'
      case 'VIEWER': return 'bg-gray-500/20 text-gray-600'
      default: return 'bg-gray-500/20 text-gray-600'
    }
  }
  
  // Get status badge color
  const getStatusColor = (status: InvitationStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-600'
      case 'ACCEPTED': return 'bg-green-500/20 text-green-600'
      case 'REJECTED': return 'bg-red-500/20 text-red-600'
      case 'REVOKED': return 'bg-gray-500/20 text-gray-600'
      case 'EXPIRED': return 'bg-gray-500/20 text-gray-600'
      default: return 'bg-gray-500/20 text-gray-600'
    }
  }
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] sm:min-h-[400px] space-y-4 sm:space-y-6">
        <div className="relative">
          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border flex items-center justify-center">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <div className="absolute -inset-3 sm:-inset-4 border-2 border-primary/20 rounded-3xl animate-pulse"></div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-base sm:text-lg font-semibold">Loading Collaboration</h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md px-4">
            Loading team members and collaboration data...
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header - RESPONSIVE */}
      <div className="border-b border-border/40 p-3 sm:p-4 md:p-6 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border hidden xs:block">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight truncate">Collaboration</h1>
                <Badge variant="outline" className="px-2 py-1 text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Real-time</span>
                  <span className="sm:hidden">Live</span>
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                Manage team members, invitations, and live collaboration
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="h-9 w-9"
              >
                <Search className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={loadCollaborationData}
              className="gap-1 sm:gap-2 min-h-[44px]"
              size="sm"
            >
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        {isMobile && showMobileSearch && (
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                handleSearchUsers(e.target.value)
              }}
              className="pl-9 w-full min-h-[44px]"
            />
            {userSearchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {userSearchResults.map((user) => (
                  <div 
                    key={user.id}
                    className="flex items-center justify-between p-3 hover:bg-muted cursor-pointer border-b last:border-0"
                    onClick={() => {
                      setInviteEmail(user.email)
                      setUserSearchResults([])
                      setSearchQuery('')
                      setShowMobileSearch(false)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          {/* Tabs - RESPONSIVE */}
          <TabsList className="mx-3 sm:mx-4 md:mx-6 mt-3 sm:mt-4 md:mt-6 grid grid-cols-4 gap-1 sm:gap-2 px-1 sm:px-2">
            <TabsTrigger value="team" className="gap-1 text-xs px-2 py-2 sm:px-3 sm:text-sm">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Team ({collaborators.length})</span>
            </TabsTrigger>
            <TabsTrigger value="invitations" className="gap-1 text-xs px-2 py-2 sm:px-3 sm:text-sm">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Invites ({pendingInvitations.length})</span>
            </TabsTrigger>
            <TabsTrigger value="active" className="gap-1 text-xs px-2 py-2 sm:px-3 sm:text-sm">
              <Activity className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Active ({activeCollaborators.length})</span>
            </TabsTrigger>
            <TabsTrigger value="permissions" className="gap-1 text-xs px-2 py-2 sm:px-3 sm:text-sm">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Permissions</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Team Tab */}
          <TabsContent value="team" className="flex-1 overflow-auto p-0">
            <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
              {/* Invite New Member Card */}
              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm sm:text-base md:text-lg font-semibold flex items-center gap-2">
                    <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    Invite Team Member
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm md:text-base">
                    Add collaborators by email address
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
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
                    <div className="flex gap-2">
                      <Select value={inviteRole} onValueChange={(v: CollaboratorRole) => setInviteRole(v)}>
                        <SelectTrigger className="min-h-[44px] text-sm sm:text-base">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VIEWER" className="text-sm">Viewer</SelectItem>
                          <SelectItem value="EDITOR" className="text-sm">Editor</SelectItem>
                          <SelectItem value="ADMIN" className="text-sm">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        onClick={handleSendInvitation}
                        disabled={inviting || !inviteEmail}
                        className="min-h-[44px] px-3 sm:px-4 md:px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                      >
                        <Send className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
                        <span className="hidden sm:inline">{inviting ? 'Sending...' : 'Invite'}</span>
                        <span className="sm:hidden">Send</span>
                      </Button>
                    </div>
                  </div>
                  
                  {/* Quick Search - Hidden on mobile (shown in header) */}
                  {!isMobile && (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search for users..."
                        className="pl-9 text-sm sm:text-base"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          handleSearchUsers(e.target.value)
                        }}
                      />
                      
                      {userSearchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                          {userSearchResults.map((user) => (
                            <div 
                              key={user.id}
                              className="flex items-center justify-between p-3 hover:bg-muted cursor-pointer border-b last:border-0"
                              onClick={() => {
                                setInviteEmail(user.email)
                                setUserSearchResults([])
                                setSearchQuery('')
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="font-medium text-sm truncate">{user.name}</p>
                                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                </div>
                              </div>
                              <ArrowUpRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Team Members List */}
              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm sm:text-base md:text-lg font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    Team Members ({collaborators.length})
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm md:text-base">
                    All collaborators with access to this project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {collaborators.map((collaborator) => (
                      <div 
                        key={collaborator.id} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src={collaborator.user.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                              {collaborator.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                              <h4 className="font-semibold text-sm sm:text-base truncate">{collaborator.user.name}</h4>
                              {collaborator.userId === 'owner' && (
                                <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-xs px-2 py-1">
                                  <Crown className="h-3 w-3 mr-1" />
                                  <span className="hidden sm:inline">Owner</span>
                                  <span className="sm:hidden">Owner</span>
                                </Badge>
                              )}
                              <Badge className={`${getRoleColor(collaborator.role as CollaboratorRole)} text-xs px-2 py-1`}>
                                {collaborator.role}
                              </Badge>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate max-w-[140px] sm:max-w-none">{collaborator.user.email}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                <span>Joined {format(new Date(collaborator.createdAt), 'MMM d')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <Select
                            value={collaborator.role}
                            onValueChange={(role) => handleUpdateCollaboratorRole(collaborator.userId, role)}
                            disabled={collaborator.userId === 'owner'}
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
                            disabled={collaborator.userId === 'owner'}
                            className="h-9 w-9 text-destructive hover:text-destructive"
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {collaborators.length === 0 && (
                      <div className="text-center py-6 sm:py-8 md:py-12">
                        <Users className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto text-muted-foreground mb-3" />
                        <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-2">No team members yet</h3>
                        <p className="text-muted-foreground max-w-md mx-auto text-xs sm:text-sm md:text-base">
                          Start by inviting collaborators to work on this project together
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Invitations Tab */}
          <TabsContent value="invitations" className="flex-1 overflow-auto p-0">
            <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm sm:text-base md:text-lg font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    Pending Invitations ({pendingInvitations.length})
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm md:text-base">
                    Invitations that haven't been accepted yet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingInvitations.map((invitation) => (
                      <div key={invitation.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {invitation.user ? (
                            <Avatar className="h-10 w-10 flex-shrink-0">
                              <AvatarImage src={invitation.user.avatar} />
                              <AvatarFallback className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20">
                                {invitation.user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center flex-shrink-0">
                              <Mail className="h-5 w-5 text-yellow-600" />
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                              <h4 className="font-semibold text-sm sm:text-base truncate">
                                {invitation.user ? invitation.user.name : invitation.email}
                              </h4>
                              <Badge className={`${getStatusColor(invitation.status)} text-xs px-2 py-1`}>
                                {invitation.status}
                              </Badge>
                              <Badge className={`${getRoleColor(invitation.role)} text-xs px-2 py-1`}>
                                {invitation.role}
                              </Badge>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate max-w-[140px] sm:max-w-none">{invitation.email}</span>
                                {invitation.user && <span className="ml-1">(Registered)</span>}
                              </div>
                              
                              {invitation.invitedBy && (
                                <div className="flex items-center gap-1">
                                  <UserPlus className="h-3 w-3 flex-shrink-0" />
                                  <span>Invited by: {invitation.invitedBy.name}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 flex-shrink-0" />
                                <span>Sent {format(new Date(invitation.createdAt), 'MMM d')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyInvitationLink(invitation.token)}
                            className="h-9 gap-1 text-xs px-2 sm:px-3"
                          >
                            <CopyIcon className="h-3 w-3" />
                            <span className="hidden sm:inline">Copy</span>
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResendInvitation(invitation.id)}
                            className="h-9 gap-1 text-xs px-2 sm:px-3"
                          >
                            <RefreshCw className="h-3 w-3" />
                            <span className="hidden sm:inline">Resend</span>
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelInvitation(invitation.id)}
                            className="h-9 gap-1 text-xs px-2 sm:px-3 text-destructive hover:text-destructive"
                          >
                            <XCircle className="h-3 w-3" />
                            <span className="hidden sm:inline">Cancel</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {pendingInvitations.length === 0 && (
                      <div className="text-center py-6 sm:py-8 md:py-12">
                        <MailCheck className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto text-muted-foreground mb-3" />
                        <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-2">No pending invitations</h3>
                        <p className="text-muted-foreground max-w-md mx-auto text-xs sm:text-sm md:text-base">
                          All invitations have been accepted or no invitations have been sent yet
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Card className="border-primary/10 shadow-sm">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Collaborators</p>
                        <p className="text-xl sm:text-2xl font-bold mt-1">{collaborators.length}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/10 shadow-sm">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">Pending Invitations</p>
                        <p className="text-xl sm:text-2xl font-bold mt-1">{pendingInvitations.length}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-yellow-500/10">
                        <Mail className="h-5 w-5 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/10 shadow-sm">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">Active Now</p>
                        <p className="text-xl sm:text-2xl font-bold mt-1">{activeCollaborators.length}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <Activity className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Active Collaborators Tab */}
          <TabsContent value="active" className="flex-1 overflow-auto p-0">
            <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm sm:text-base md:text-lg font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    Active Collaborators ({activeCollaborators.length})
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm md:text-base">
                    Team members currently working on the project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeCollaborators.map((collaborator) => (
                      <div 
                        key={collaborator.socketId} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="relative">
                            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-green-500 ring-offset-2">
                              <AvatarImage src={collaborator.user.avatar} />
                              <AvatarFallback className="bg-gradient-to-br from-green-500/20 to-green-600/20">
                                {collaborator.user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-green-500 border-2 border-background"></div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                              <h4 className="font-semibold text-sm sm:text-base truncate">{collaborator.user.name}</h4>
                              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-xs px-2 py-1">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-1"></div>
                                <span className="hidden sm:inline">Online</span>
                                <span className="sm:hidden">On</span>
                              </Badge>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 flex-shrink-0" />
                                <span>Joined {format(new Date(collaborator.joinedAt), 'h:mm a')}</span>
                              </div>
                              {collaborator.activeEndpoint && (
                                <div className="flex items-center gap-1">
                                  <Code className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate max-w-[120px] sm:max-w-none">
                                    Editing: {collaborator.activeEndpoint.slice(0, 15)}...
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 gap-1 text-xs px-2 sm:px-3"
                          >
                            <MessageSquare className="h-3 w-3" />
                            <span className="hidden sm:inline">Message</span>
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 gap-1 text-xs px-2 sm:px-3"
                          >
                            <TextCursor className="h-3 w-3" />
                            <span className="hidden sm:inline">Follow</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {activeCollaborators.length === 0 && (
                      <div className="text-center py-6 sm:py-8 md:py-12">
                        <Activity className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto text-muted-foreground mb-3" />
                        <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-2">No active collaborators</h3>
                        <p className="text-muted-foreground max-w-md mx-auto text-xs sm:text-sm md:text-base">
                          Team members will appear here when they start working on the project
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Live Activity Feed */}
              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm sm:text-base md:text-lg font-semibold flex items-center gap-2">
                    <GitBranch className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm md:text-base">
                    Recent collaboration events and changes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="p-2 rounded-lg bg-blue-500/10 flex-shrink-0">
                        <GitCommit className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">John Doe pushed changes</p>
                        <p className="text-xs text-muted-foreground truncate">
                          Updated endpoint configuration • Just now
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="p-2 rounded-lg bg-green-500/10 flex-shrink-0">
                        <GitPullRequest className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">Jane Smith created a new endpoint</p>
                        <p className="text-xs text-muted-foreground truncate">
                          POST /api/users • 5 minutes ago
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="p-2 rounded-lg bg-purple-500/10 flex-shrink-0">
                        <GitMerge className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">Merge conflict resolved</p>
                        <p className="text-xs text-muted-foreground truncate">
                          Resolved by Alex Johnson • 15 minutes ago
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Permissions Tab */}
          <TabsContent value="permissions" className="flex-1 overflow-auto p-0">
            <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm sm:text-base md:text-lg font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    Role Permissions
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm md:text-base">
                    What each role can do in this project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Viewer Card */}
                    <Card className="border-gray-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-sm">Viewer</CardTitle>
                            <CardDescription className="text-xs">Read-only access</CardDescription>
                          </div>
                          <Badge variant="outline" className="bg-gray-500/10 text-gray-600 text-xs">
                            Basic
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs">View endpoints and docs</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs">Test endpoints</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs">View execution history</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs">Cannot edit endpoints</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Editor Card */}
                    <Card className="border-blue-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-sm">Editor</CardTitle>
                            <CardDescription className="text-xs">Full edit access</CardDescription>
                          </div>
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 text-xs">
                            Recommended
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs">All Viewer permissions</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs">Create & edit endpoints</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs">Manage mock data</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs">Cannot manage team</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Admin Card */}
                    <Card className="border-purple-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-sm">Admin</CardTitle>
                            <CardDescription className="text-xs">Full control</CardDescription>
                          </div>
                          <Badge variant="outline" className="bg-purple-500/10 text-purple-600 text-xs">
                            Full Access
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs">All Editor permissions</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs">Manage team members</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs">Change project settings</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs">Export project data</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
              
              {/* Security Settings */}
              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm sm:text-base md:text-lg font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    Security Settings
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm md:text-base">
                    Configure security and access controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-sm">Require 2FA for admins</p>
                      <p className="text-xs text-muted-foreground">
                        Administrators must use two-factor authentication
                      </p>
                    </div>
                    <Switch className="sm:ml-4" />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-sm">Session timeout</p>
                      <p className="text-xs text-muted-foreground">
                        Automatically log out inactive users
                      </p>
                    </div>
                    <Select defaultValue="2h">
                      <SelectTrigger className="text-sm w-full sm:w-32 mt-2 sm:mt-0 sm:ml-4">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30m" className="text-sm">30 minutes</SelectItem>
                        <SelectItem value="1h" className="text-sm">1 hour</SelectItem>
                        <SelectItem value="2h" className="text-sm">2 hours</SelectItem>
                        <SelectItem value="4h" className="text-sm">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-sm">IP restriction</p>
                      <p className="text-xs text-muted-foreground">
                        Allow access only from specific IP addresses
                      </p>
                    </div>
                    <Switch className="sm:ml-4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}