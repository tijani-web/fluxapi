'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  FolderPlus, 
  Lock, 
  Users, 
  Globe, 
  Sparkles,
  Zap,
  Code2,
  FileCode,
  Database,
  Cloud,
  Cpu
} from 'lucide-react'

export default function CreateProjectPage() {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'PRIVATE' as const,
    template: 'blank' as 'blank' | 'rest-api' | 'graphql' | 'webhook'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Project name is required')
      return
    }
    
    setLoading(true)
    try {
      const project = await api.createProject({
        name: formData.name,
        description: formData.description,
        visibility: formData.visibility
      })
      
      toast.success('Project created successfully!')
      router.push(`/projects/${project.id}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  const templates = [
    {
      id: 'blank',
      name: 'Blank Project',
      description: 'Start from scratch with a clean slate',
      icon: FileCode,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'rest-api',
      name: 'REST API Template',
      description: 'Pre-configured REST API endpoints',
      icon: Code2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      id: 'graphql',
      name: 'GraphQL API',
      description: 'GraphQL schema and resolvers',
      icon: Database,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      id: 'webhook',
      name: 'Webhook Service',
      description: 'Webhook endpoints with event handling',
      icon: Cloud,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    }
  ]

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC':
        return <Globe className="h-4 w-4" />
      case 'TEAM':
        return <Users className="h-4 w-4" />
      case 'PRIVATE':
        return <Lock className="h-4 w-4" />
      default:
        return <Lock className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="p-2 rounded-lg bg-primary/10">
                <FolderPlus className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold">
                Create <span className="text-primary">Project</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Create New <span className="text-primary">API Project</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Build, test, and deploy your API in minutes. Choose a template or start from scratch.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column: Form */}
            <Card className="border-2 border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderPlus className="h-5 w-5 text-primary" />
                  Project Details
                </CardTitle>
                <CardDescription>
                  Configure your project settings
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  {/* Project Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base">
                      Project Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="My Awesome API"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="h-12 text-base"
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      A descriptive name for your API project
                    </p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base">
                      Description <span className="text-muted-foreground font-normal">(optional)</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what your API does, its purpose, or any special features..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Visibility */}
                  <div className="space-y-2">
                    <Label className="text-base">Visibility</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'PRIVATE', label: 'Private', icon: Lock, color: 'border-amber-500/20 hover:border-amber-500/40 bg-amber-500/5' },
                        { value: 'TEAM', label: 'Team', icon: Users, color: 'border-green-500/20 hover:border-green-500/40 bg-green-500/5' },
                        { value: 'PUBLIC', label: 'Public', icon: Globe, color: 'border-blue-500/20 hover:border-blue-500/40 bg-blue-500/5' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData({...formData, visibility: option.value as any})}
                          className={`
                            p-4 rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition-all
                            ${formData.visibility === option.value 
                              ? `${option.color} ring-2 ring-offset-2 ring-primary/20` 
                              : 'border-border hover:border-border/60'
                            }
                          `}
                        >
                          <option.icon className={`h-5 w-5 ${formData.visibility === option.value ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className={`font-medium ${formData.visibility === option.value ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {option.label}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• <span className="font-medium">Private</span>: Only you can access</p>
                      <p>• <span className="font-medium">Team</span>: Share with team members</p>
                      <p>• <span className="font-medium">Public</span>: Anyone can view</p>
                    </div>
                  </div>

                </CardContent>

                <CardFooter className="border-t pt-6">
                  <div className="flex items-center justify-between w-full">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Cancel
                    </Button>
                    
                    <Button
                      type="submit"
                      disabled={loading || !formData.name.trim()}
                      className="gap-2 px-8"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Creating Project...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" />
                          Create Project
                        </>
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </Card>

            {/* Right Column: Features & Info */}
            <div className="space-y-8">
              {/* Features Card */}
              <Card>
                <CardHeader>
                  <CardTitle>What You Get</CardTitle>
                  <CardDescription>
                    Everything included with your project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Code2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">API Builder</p>
                      <p className="text-sm text-muted-foreground">Visual endpoint creation with code editor</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Database className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Mock Data</p>
                      <p className="text-sm text-muted-foreground">Generate and manage mock data collections</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                      <Cpu className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium">Code Execution</p>
                      <p className="text-sm text-muted-foreground">Sandboxed JavaScript execution</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <Cloud className="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-medium">Collaboration</p>
                      <p className="text-sm text-muted-foreground">Real-time editing with team members</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

             =

              {/* Next Steps */}
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary">Ready to Build?</CardTitle>
                  <CardDescription>
                    What happens after creation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span className="text-sm">Create your first endpoint</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span className="text-sm">Add mock data collections</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span className="text-sm">Test with the built-in runner</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span className="text-sm">Share with collaborators</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}