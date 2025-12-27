'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ApiClient } from '@/lib/api-client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Users,
  UserPlus,
  MessageSquare,
  Video,
  Phone,
  MoreVertical,
  Crown,
  Edit,
  Eye,
  Clock,
  MapPin,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ScreenShare,
  StopCircle,
  Send,
  Smile,
  Paperclip,
  RefreshCw
} from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

interface Collaborator {
  id: string
  name: string
  avatar?: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  active: boolean
  endpoint?: string
  cursor?: { line: number; column: number }
  lastActive: string
  color: string
}

interface Message {
  id: string
  userId: string
  userName: string
  avatar?: string
  content: string
  timestamp: string
  type: 'text' | 'code' | 'system'
}

export function CollaborationPanel() {
  const params = useParams()
  const projectId = params.id as string
  const toast = useToast()
  
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isCallActive, setIsCallActive] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [audioMuted, setAudioMuted] = useState(false)
  const [videoMuted, setVideoMuted] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load active collaborators
  useEffect(() => {
    loadCollaborators()
  }, [projectId])

  const loadCollaborators = async () => {
    try {
      setLoading(true)
      const data = await ApiClient.getActiveCollaborators(projectId)
      setCollaborators(data || [])
    } catch (error) {
      console.error('Failed to load collaborators:', error)
      // Fallback to demo data
      setCollaborators([
        {
          id: '1',
          name: 'You',
          role: 'owner',
          active: true,
          endpoint: '/api/users',
          cursor: { line: 25, column: 10 },
          lastActive: new Date().toISOString(),
          color: '#3B82F6'
        },
        {
          id: '2',
          name: 'Alex Chen',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
          role: 'editor',
          active: true,
          endpoint: '/api/products',
          cursor: { line: 42, column: 5 },
          lastActive: new Date().toISOString(),
          color: '#10B981'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const activeCollaborators = collaborators.filter(c => c.active)
  const inactiveCollaborators = collaborators.filter(c => !c.active)

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      userId: '1', // Current user
      userName: 'You',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
    
    // In real app, send via WebSocket
    // socket.emit('chat-message', message)
  }

  const toggleCall = () => {
    setIsCallActive(!isCallActive)
  }

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner': return <Badge className="bg-purple-500/20 text-purple-600 border-purple-500/30"><Crown className="h-3 w-3" /></Badge>
      case 'admin': return <Badge variant="default" className="h-5">Admin</Badge>
      case 'editor': return <Badge variant="secondary" className="h-5">Editor</Badge>
      case 'viewer': return <Badge variant="outline" className="h-5">Viewer</Badge>
      default: return null
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-2">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading collaborators...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="font-medium">Collaboration</span>
          <Badge variant="secondary" className="h-5">
            {activeCollaborators.length} online
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadCollaborators}
            className="h-7 gap-1"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {/* Invite people */}}
            className="h-7 gap-1"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Invite
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden grid grid-cols-3">
        {/* Left: Active Collaborators */}
        <div className="col-span-2 border-r border-border/40 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Active Now ({activeCollaborators.length})</h3>
            <div className="flex gap-1">
              <Button
                variant={isCallActive ? "default" : "outline"}
                size="sm"
                onClick={toggleCall}
                className="h-7 gap-1"
              >
                {isCallActive ? (
                  <Phone className="h-3.5 w-3.5" />
                ) : (
                  <Video className="h-3.5 w-3.5" />
                )}
                {isCallActive ? 'End Call' : 'Start Call'}
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[calc(100%-2rem)]">
            <div className="space-y-3">
              {activeCollaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="p-3 rounded-lg border border-border/40 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={collaborator.avatar} />
                        <AvatarFallback 
                          className="text-xs"
                          style={{ backgroundColor: collaborator.color }}
                        >
                          {getInitials(collaborator.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">
                          {collaborator.name}
                        </span>
                        {getRoleBadge(collaborator.role)}
                      </div>
                      
                      {collaborator.endpoint && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3" />
                          <span className="font-mono truncate">
                            {collaborator.endpoint}
                          </span>
                          {collaborator.cursor && (
                            <span className="text-xs">
                              (Ln {collaborator.cursor.line}, Col {collaborator.cursor.column})
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(collaborator.lastActive)}
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="h-7">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right: Chat */}
        <div className="p-4 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-3 pr-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${
                      message.userId === '1' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {message.userId !== 'system' && message.userId !== '1' && (
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={message.avatar} />
                        <AvatarFallback className="text-xs">
                          {getInitials(message.userName)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div
                      className={`max-w-[80%] ${
                        message.userId === '1'
                          ? 'bg-primary text-primary-foreground'
                          : message.userId === 'system'
                          ? 'bg-muted/50'
                          : 'bg-muted'
                      } rounded-lg px-3 py-2`}
                    >
                      {message.userId !== 'system' && (
                        <div className="text-xs font-medium mb-1">
                          {message.userName}
                        </div>
                      )}
                      <div className="text-sm">{message.content}</div>
                      <div className="text-xs opacity-70 mt-1 text-right">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Message Input */}
          <div className="pt-4 border-t border-border/40">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                className="flex-1"
              />
              <Button size="sm" onClick={sendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Call Controls (when call is active) */}
      {isCallActive && (
        <div className="px-4 py-2 border-t border-border/40 bg-muted/10 flex items-center justify-center gap-2">
          <Button
            variant={audioMuted ? "destructive" : "outline"}
            size="sm"
            onClick={() => setAudioMuted(!audioMuted)}
            className="h-8 w-8 p-0"
          >
            {audioMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          <Button
            variant={videoMuted ? "destructive" : "outline"}
            size="sm"
            onClick={() => setVideoMuted(!videoMuted)}
            className="h-8 w-8 p-0"
          >
            {videoMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          
          <Button
            variant={isScreenSharing ? "default" : "outline"}
            size="sm"
            onClick={toggleScreenShare}
            className="h-8 w-8 p-0"
          >
            {isScreenSharing ? <StopCircle className="h-4 w-4" /> : <ScreenShare className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={toggleCall}
            className="h-8 px-4"
          >
            End Call
          </Button>
        </div>
      )}
    </div>
  )
}