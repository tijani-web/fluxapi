'use client'

import { useState, useRef, useEffect } from 'react'
import { api } from '@/lib/api'
import { AIGenerateRequest, AIOptimizeRequest, AIDebugRequest, AITestRequest, AIDocumentationRequest } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Code, 
  Sparkles, 
  Bug, 
  TestTube, 
  FileText, 
  Send, 
  Copy, 
  Check, 
  Zap,
  Cpu,
  Clock,
  DollarSign,
  History,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  User as UserIcon,
  Loader2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { CodeBlock } from '../Editor/CodeBlock'

type AIAction = 'generate' | 'optimize' | 'debug' | 'test' | 'documentation'

interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  action?: AIAction
  tokens?: number
  cost?: number
}

interface ChatSession {
  id: string
  title: string
  messages: AIMessage[]
  lastUpdated: Date
  tokensUsed: number
}

export function AiSection({ projectId, endpointId }: { projectId: string; endpointId?: string }) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<AIAction>('generate')
  const [prompt, setPrompt] = useState('')
  const [contextCode, setContextCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [model, setModel] = useState('gemini-pro')
  const [provider, setProvider] = useState<'GEMINI' | 'OPENAI'>('GEMINI')
  const [copied, setCopied] = useState<string | null>(null)
  const [showChatHistory, setShowChatHistory] = useState(false)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'API Endpoint Creation',
      messages: [],
      lastUpdated: new Date(),
      tokensUsed: 0
    }
  ])
  const [currentSessionId, setCurrentSessionId] = useState('1')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatHistoryRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      lastUpdated: new Date(),
      tokensUsed: 0
    }
    setChatSessions(prev => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
    setMessages([])
  }

  const switchSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId)
    if (session) {
      setCurrentSessionId(sessionId)
      setMessages(session.messages)
      setShowChatHistory(false)
    }
  }

  const updateSessionTitle = (sessionId: string, newTitle: string) => {
    setChatSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, title: newTitle, lastUpdated: new Date() }
          : session
      )
    )
  }

  const handleAIAction = async () => {
    if (!prompt.trim()) {
      toast({ title: 'Error', description: 'Please enter a prompt', variant: 'destructive' })
      return
    }

    setLoading(true)
    
    // Add user message
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date(),
      action: activeTab
    }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)

    // Update session
    setChatSessions(prev => 
      prev.map(session => 
        session.id === currentSessionId 
          ? { 
              ...session, 
              messages: updatedMessages,
              title: session.title === 'New Chat' ? prompt.substring(0, 30) + (prompt.length > 30 ? '...' : '') : session.title,
              lastUpdated: new Date()
            }
          : session
      )
    )

    try {
      let response: any
      const baseRequest = {
        prompt,
        context: contextCode || undefined,
        projectId,
        endpointId,
        model,
        provider
      }

      switch (activeTab) {
        case 'generate':
          const generateRequest: AIGenerateRequest = baseRequest
          response = await api.generateCode(generateRequest)
          break
        case 'optimize':
          if (!contextCode.trim()) {
            throw new Error('Please provide code to optimize')
          }
          const optimizeRequest: AIOptimizeRequest = {
            ...baseRequest,
            code: contextCode,
            optimizationType: 'performance'
          }
          response = await api.optimizeCode(optimizeRequest)
          break
        case 'debug':
          if (!contextCode.trim()) {
            throw new Error('Please provide code to debug')
          }
          const debugRequest: AIDebugRequest = {
            ...baseRequest,
            code: contextCode,
            errorMessage: prompt
          }
          response = await api.debugCode(debugRequest)
          break
        case 'test':
          if (!contextCode.trim()) {
            throw new Error('Please provide code to test')
          }
          const testRequest: AITestRequest = {
            ...baseRequest,
            code: contextCode,
            testFramework: 'jest'
          }
          response = await api.generateTests(testRequest)
          break
        case 'documentation':
          if (!contextCode.trim()) {
            throw new Error('Please provide code to document')
          }
          const docRequest: AIDocumentationRequest = {
            ...baseRequest,
            code: contextCode,
            docType: 'jsdoc'
          }
          response = await api.generateAiDocumentation(docRequest)
          break
      }

      // Add AI response
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.code || response.documentation || response.explanation || 'No response',
        timestamp: new Date(),
        action: activeTab,
        tokens: response.usage?.inputTokens + response.usage?.outputTokens,
        cost: response.usage?.cost
      }
      const finalMessages = [...updatedMessages, aiMessage]
      setMessages(finalMessages)

      // Update session with AI response
      setChatSessions(prev => 
        prev.map(session => 
          session.id === currentSessionId 
            ? { 
                ...session, 
                messages: finalMessages,
                lastUpdated: new Date(),
                tokensUsed: (session.tokensUsed || 0) + (aiMessage.tokens || 0)
              }
            : session
        )
      )
      
      toast({ title: 'Success', description: 'AI response generated' })
      setPrompt('')
      
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message || 'AI request failed', 
        variant: 'destructive' 
      })
      
      // Add error message
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error.message}`,
        timestamp: new Date(),
        action: activeTab
      }
      const errorMessages = [...updatedMessages, errorMessage]
      setMessages(errorMessages)

      setChatSessions(prev => 
        prev.map(session => 
          session.id === currentSessionId 
            ? { ...session, messages: errorMessages, lastUpdated: new Date() }
            : session
        )
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text)
    setCopied(messageId)
    toast({ title: 'Copied!', description: 'Code copied to clipboard' })
    setTimeout(() => setCopied(null), 2000)
  }

  const handleClear = () => {
    setMessages([])
    setPrompt('')
    setContextCode('')
  }

  const getPlaceholder = (tab: AIAction) => {
    switch (tab) {
      case 'generate': return 'Describe the endpoint you want to create...'
      case 'optimize': return 'What should be optimized? (performance, readability, security)'
      case 'debug': return 'Describe the error or issue...'
      case 'test': return 'What kind of tests do you need?'
      case 'documentation': return 'Any specific documentation requirements?'
      default: return 'Ask the AI assistant...'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (hours < 48) return 'Yesterday'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      {/* Header - Responsive */}
      <div className="border-b p-3 sm:p-4 md:p-5 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 shrink-0">
              <Brain className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight truncate">AI Assistant</h2>
              <p className="text-muted-foreground text-xs sm:text-sm md:text-base truncate">Powered by Gemini & OpenAI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChatHistory(!showChatHistory)}
              className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
            >
              <History className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
              {showChatHistory ? 'Hide History' : 'Show History'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
            >
              Clear Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive layout with chat history */}
      <div className="flex-1 overflow-hidden flex">
        {/* Chat History Sidebar - Collapsible */}
        {showChatHistory && (
          <div 
            className="w-full sm:w-64 md:w-72 lg:w-80 border-r bg-muted/30 flex flex-col shrink-0"
            ref={chatHistoryRef}
          >
            <div className="p-3 sm:p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm sm:text-base">Chat History</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={createNewSession}
                  className="h-7 w-7 sm:h-8 sm:w-8"
                >
                  <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={createNewSession}
                className="w-full text-xs sm:text-sm h-8 sm:h-9 mb-3"
              >
                <PlusIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                New Chat
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1">
              {chatSessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => switchSession(session.id)}
                  className={`w-full text-left p-2 sm:p-3 rounded-lg transition-colors ${
                    currentSessionId === session.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-xs sm:text-sm truncate">
                        {session.title}
                      </span>
                      {session.tokensUsed > 0 && (
                        <span className="text-[10px] sm:text-xs opacity-70">
                          {session.tokensUsed.toLocaleString()} tokens
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[10px] sm:text-xs opacity-70">
                      <span>{session.messages.length} messages</span>
                      <span>{formatTime(session.lastUpdated)}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area - Scrollable */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6" ref={chatContainerRef}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 h-full">
              {/* Left Panel - Tools & Settings */}
              <div className="space-y-4 lg:col-span-1">
                <Card className="shadow-sm">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">AI Tools</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 p-4 sm:p-6 pt-0">
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AIAction)}>
                      <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-1 mb-3 sm:mb-4">
                        <TabsTrigger value="generate" className="text-[10px] xs:text-xs sm:text-sm">
                          <Code className="h-2.5 w-2.5 xs:h-3 xs:w-3 mr-1" />
                          <span className="truncate">Generate</span>
                        </TabsTrigger>
                        <TabsTrigger value="optimize" className="text-[10px] xs:text-xs sm:text-sm">
                          <Sparkles className="h-2.5 w-2.5 xs:h-3 xs:w-3 mr-1" />
                          <span className="truncate">Optimize</span>
                        </TabsTrigger>
                        <TabsTrigger value="debug" className="text-[10px] xs:text-xs sm:text-sm">
                          <Bug className="h-2.5 w-2.5 xs:h-3 xs:w-3 mr-1" />
                          <span className="truncate">Debug</span>
                        </TabsTrigger>
                        <TabsTrigger value="test" className="text-[10px] xs:text-xs sm:text-sm">
                          <TestTube className="h-2.5 w-2.5 xs:h-3 xs:w-3 mr-1" />
                          <span className="truncate">Tests</span>
                        </TabsTrigger>
                        <TabsTrigger value="documentation" className="text-[10px] xs:text-xs sm:text-sm">
                          <FileText className="h-2.5 w-2.5 xs:h-3 xs:w-3 mr-1" />
                          <span className="truncate">Docs</span>
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs sm:text-sm">AI Provider</Label>
                        <Select value={provider} onValueChange={(v: 'GEMINI' | 'OPENAI') => setProvider(v)}>
                          <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GEMINI" className="text-xs sm:text-sm">Google Gemini</SelectItem>
                            <SelectItem value="OPENAI" className="text-xs sm:text-sm">OpenAI GPT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs sm:text-sm">Model</Label>
                        <Select value={model} onValueChange={setModel}>
                          <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gemini-pro" className="text-xs sm:text-sm">Gemini Pro</SelectItem>
                            <SelectItem value="gpt-4" className="text-xs sm:text-sm">GPT-4</SelectItem>
                            <SelectItem value="gpt-3.5-turbo" className="text-xs sm:text-sm">GPT-3.5 Turbo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Context Code Input */}
                {(activeTab === 'optimize' || activeTab === 'debug' || activeTab === 'test' || activeTab === 'documentation') && (
                  <Card className="shadow-sm">
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="text-base sm:text-lg">Code Context</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                      <Textarea
                        value={contextCode}
                        onChange={(e) => setContextCode(e.target.value)}
                        placeholder="Paste your code here..."
                        className="font-mono text-xs sm:text-sm min-h-[120px] sm:min-h-[150px]"
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Quick Prompts */}
                <Card className="shadow-sm">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">Quick Prompts</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left text-xs sm:text-sm h-8 sm:h-9"
                      onClick={() => setPrompt('Create a REST API endpoint for user registration with validation')}
                    >
                      User registration endpoint
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left text-xs sm:text-sm h-8 sm:h-9"
                      onClick={() => setPrompt('Optimize this code for better performance')}
                    >
                      Optimize performance
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left text-xs sm:text-sm h-8 sm:h-9"
                      onClick={() => setPrompt('Generate unit tests for this function')}
                    >
                      Generate unit tests
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel - Chat Interface */}
              <div className="lg:col-span-2 flex flex-col space-y-3 sm:space-y-4 md:space-y-5">
                {/* Chat Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm sm:text-base md:text-lg">AI Chat</h3>
                    <Badge variant="outline" className="text-[10px] sm:text-xs">
                      {messages.filter(m => m.role === 'user').length} messages
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => api.getAIUsage()}
                    className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                  >
                    <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                    Usage
                  </Button>
                </div>

                {/* Chat Messages - Scrollable */}
                <Card className="flex-1 flex flex-col shadow-sm min-h-[300px]">
                  <CardContent className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-6 md:p-8">
                        <div className="p-3 sm:p-4 rounded-full bg-primary/10 mb-3 sm:mb-4">
                          <Brain className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary" />
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">Start a Conversation</h3>
                        <p className="text-muted-foreground text-sm sm:text-base max-w-md">
                          Ask the AI to generate code, optimize existing code, debug issues, create tests, or generate documentation.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 sm:space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-full xs:max-w-[90%] sm:max-w-[85%] md:max-w-[80%] rounded-lg p-3 sm:p-4 ${
                                message.role === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              {/* Message Header */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-2">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  {message.role === 'user' ? (
                                    <>
                                      <UserIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                      <span className="text-xs sm:text-sm font-medium">You</span>
                                    </>
                                  ) : (
                                    <>
                                      <Brain className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                      <span className="text-xs sm:text-sm font-medium">AI Assistant</span>
                                    </>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <span className="text-[10px] xs:text-xs opacity-70">
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  {message.role === 'assistant' && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 sm:h-7 sm:w-7"
                                      onClick={() => handleCopy(message.content, message.id)}
                                    >
                                      {copied === message.id ? (
                                        <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                      ) : (
                                        <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                      )}
                                    </Button>
                                  )}
                                </div>
                              </div>
                              
                              {/* Message Content */}
                              <div className="text-xs sm:text-sm md:text-base">
                                {message.action === 'generate' || message.action === 'optimize' || message.action === 'debug' || message.action === 'test' ? (
                                  <div className="max-h-[400px] overflow-y-auto">
                                    <CodeBlock code={message.content} language="javascript" />
                                  </div>
                                ) : message.action === 'documentation' ? (
                                  <div className="prose prose-sm dark:prose-invert max-w-none max-h-[400px] overflow-y-auto">
                                    <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm">
                                      {message.content}
                                    </pre>
                                  </div>
                                ) : (
                                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                                )}
                              </div>
                              
                              {/* Message Footer */}
                              {(message.tokens || message.cost) && (
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-opacity-20 text-[10px] xs:text-xs">
                                  {message.tokens && (
                                    <span className="flex items-center gap-1">
                                      <Cpu className="h-2.5 w-2.5 xs:h-3 xs:w-3" />
                                      {message.tokens.toLocaleString()} tokens
                                    </span>
                                  )}
                                  {message.cost && (
                                    <span className="flex items-center gap-1">
                                      <DollarSign className="h-2.5 w-2.5 xs:h-3 xs:w-3" />
                                      ${message.cost.toFixed(4)}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-2.5 w-2.5 xs:h-3 xs:w-3" />
                                    {formatTime(message.timestamp)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Prompt Input */}
                <Card className="shadow-sm">
                  <CardContent className="p-3 sm:p-4 md:p-5">
                    <div className="space-y-2 sm:space-y-3">
                      <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={getPlaceholder(activeTab)}
                        className="min-h-[80px] sm:min-h-[100px] text-xs sm:text-sm md:text-base resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                            e.preventDefault()
                            handleAIAction()
                          }
                        }}
                      />
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          Press{' '}
                          <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-muted rounded text-[10px] xs:text-xs">
                            Ctrl/Cmd + Enter
                          </kbd>
                          {' '}to send
                        </div>
                        <Button
                          onClick={handleAIAction}
                          disabled={loading || !prompt.trim()}
                          className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                              Send to AI
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Plus Icon Component
const PlusIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)