// app/workspace/[projectId]/components/sections/TemplatesSection.tsx
'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Layers, 
  Search, 
  Zap, 
  Sparkles, 
  CheckCircle, 
  Star,
  Users,
  Clock,
  Eye,
  Download,
  Plus,
  Filter,
  TrendingUp,
  Code,
  Database,
  Globe,
  FileText,
  ExternalLink,
  ArrowRight,
  Package
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Template {
  id: string
  name: string
  description: string
  category: 'starter' | 'crud' | 'auth' | 'integration' | 'ai' | 'utility'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  endpoints: number
  popularity: number
  tags: string[]
  previewImage?: string
  author: string
  updatedAt: string
}

interface TemplatesSectionProps {
  projectId: string
}

export function TemplatesSection({ projectId }: TemplatesSectionProps) {
  const { toast } = useToast()
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'E-Commerce API',
      description: 'Complete e-commerce system with products, orders, payments, and inventory',
      category: 'crud',
      difficulty: 'intermediate',
      endpoints: 15,
      popularity: 95,
      tags: ['ecommerce', 'payments', 'inventory', 'users'],
      author: 'API Templates Team',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'User Authentication',
      description: 'JWT-based auth with registration, login, password reset, and social login',
      category: 'auth',
      difficulty: 'beginner',
      endpoints: 8,
      popularity: 98,
      tags: ['auth', 'jwt', 'security', 'oauth'],
      author: 'Security Experts',
      updatedAt: '2024-01-10'
    },
    {
      id: '3',
      name: 'AI Assistant API',
      description: 'Integrate AI features with chat, code generation, and document processing',
      category: 'ai',
      difficulty: 'advanced',
      endpoints: 12,
      popularity: 92,
      tags: ['ai', 'chatgpt', 'gemini', 'automation'],
      author: 'AI Labs',
      updatedAt: '2024-01-20'
    },
    {
      id: '4',
      name: 'Blog Platform',
      description: 'Full-featured blog with posts, comments, categories, and search',
      category: 'crud',
      difficulty: 'beginner',
      endpoints: 10,
      popularity: 88,
      tags: ['blog', 'cms', 'content', 'seo'],
      author: 'Content Team',
      updatedAt: '2024-01-05'
    },
    {
      id: '5',
      name: 'Payment Gateway',
      description: 'Stripe/PayPal integration with subscriptions and webhooks',
      category: 'integration',
      difficulty: 'intermediate',
      endpoints: 9,
      popularity: 90,
      tags: ['payments', 'stripe', 'subscriptions', 'webhooks'],
      author: 'Finance Team',
      updatedAt: '2024-01-12'
    },
    {
      id: '6',
      name: 'Real-time Chat',
      description: 'WebSocket-based real-time messaging with rooms and notifications',
      category: 'utility',
      difficulty: 'advanced',
      endpoints: 7,
      popularity: 85,
      tags: ['websocket', 'realtime', 'chat', 'notifications'],
      author: 'Real-time Team',
      updatedAt: '2024-01-18'
    },
    {
      id: '7',
      name: 'File Upload Service',
      description: 'Handle file uploads with S3/Cloudinary integration and processing',
      category: 'utility',
      difficulty: 'intermediate',
      endpoints: 6,
      popularity: 82,
      tags: ['files', 'upload', 'storage', 'images'],
      author: 'Storage Team',
      updatedAt: '2024-01-08'
    },
    {
      id: '8',
      name: 'Analytics Dashboard',
      description: 'Collect and visualize API usage metrics and performance data',
      category: 'utility',
      difficulty: 'intermediate',
      endpoints: 8,
      popularity: 87,
      tags: ['analytics', 'metrics', 'dashboard', 'charts'],
      author: 'Analytics Team',
      updatedAt: '2024-01-14'
    }
  ])
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  
  const categories = [
    { id: 'all', name: 'All Templates', icon: <Layers className="h-4 w-4" /> },
    { id: 'starter', name: 'Starters', icon: <Zap className="h-4 w-4" /> },
    { id: 'crud', name: 'CRUD APIs', icon: <Database className="h-4 w-4" /> },
    { id: 'auth', name: 'Authentication', icon: <CheckCircle className="h-4 w-4" /> },
    { id: 'integration', name: 'Integrations', icon: <ExternalLink className="h-4 w-4" /> },
    { id: 'ai', name: 'AI Features', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'utility', name: 'Utilities', icon: <Package className="h-4 w-4" /> }
  ]
  
  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner', color: 'bg-green-500/20 text-green-600' },
    { id: 'intermediate', name: 'Intermediate', color: 'bg-blue-500/20 text-blue-600' },
    { id: 'advanced', name: 'Advanced', color: 'bg-purple-500/20 text-purple-600' }
  ]
  
  
  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = 
      selectedCategory === 'all' || template.category === selectedCategory
    
    const matchesDifficulty = 
      selectedDifficulty === 'all' || template.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'starter': return <Zap className="h-4 w-4" />
      case 'crud': return <Database className="h-4 w-4" />
      case 'auth': return <CheckCircle className="h-4 w-4" />
      case 'integration': return <ExternalLink className="h-4 w-4" />
      case 'ai': return <Sparkles className="h-4 w-4" />
      case 'utility': return <Package className="h-4 w-4" />
      default: return <Layers className="h-4 w-4" />
    }
  }
  
  // Get difficulty badge
  const getDifficultyBadge = (difficulty: string) => {
    const diff = difficulties.find(d => d.id === difficulty)
    if (!diff || diff.id === 'all') return null
    
    return (
      <Badge className={diff.color}>
        {diff.name}
      </Badge>
    )
  }
  
  // Get popularity stars
  const getPopularityStars = (popularity: number) => {
    const stars = []
    const filledStars = Math.floor(popularity / 20)
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < filledStars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      )
    }
    
    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="text-sm text-muted-foreground ml-1">{popularity}%</span>
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">API Templates</h2>
            <p className="text-muted-foreground">Ready-to-use API patterns and examples</p>
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>
      
      {/* Search & Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {/* Category Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Categories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="gap-2"
                >
                  {category.icon}
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Difficulty Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Difficulty</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {difficulties.map(difficulty => (
                <Button
                  key={difficulty.id}
                  variant={selectedDifficulty === difficulty.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                >
                  {difficulty.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Templates Grid */}
      <div className="flex-1 overflow-auto">
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTemplates.map(template => (
              <Card key={template.id} className="group hover:border-primary/50 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(template.category)}
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </div>
                    {getDifficultyBadge(template.difficulty)}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-muted-foreground" />
                      <span>{template.endpoints} endpoints</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{template.author}</span>
                    </div>
                  </div>
                  
                  {/* Popularity */}
                  <div>
                    {getPopularityStars(template.popularity)}
                  </div>
                  
                  {/* Last Updated */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Updated {template.updatedAt}</span>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Preview template
                      toast({
                        title: 'Preview',
                        description: `Previewing ${template.name} template`
                      })
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    // onClick={() => handleApplyTemplate(template.id)}
                    disabled={loading}
                    className="gap-2"
                  >
                    Apply
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? `No templates match "${searchQuery}"`
                  : 'Try changing your filters or create a new template'}
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setSelectedDifficulty('all')
                }}>
                  Clear Filters
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Template Categories Overview */}
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-4">Popular Template Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(1).map(category => {
            const count = templates.filter(t => t.category === category.id).length
            const avgPopularity = Math.round(
              templates
                .filter(t => t.category === category.id)
                .reduce((acc, t) => acc + t.popularity, 0) / (count || 1)
            )
            
            return (
              <Card key={category.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {category.icon}
                    </div>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                  <h4 className="font-semibold mb-1">{category.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {avgPopularity}% average rating
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start gap-3">
            <Download className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Export Templates</div>
              <div className="text-sm text-muted-foreground">Download template library</div>
            </div>
          </Button>
          
          <Button variant="outline" className="justify-start gap-3">
            <ExternalLink className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Template Marketplace</div>
              <div className="text-sm text-muted-foreground">Browse community templates</div>
            </div>
          </Button>
          
          <Button variant="outline" className="justify-start gap-3">
            <FileText className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Documentation</div>
              <div className="text-sm text-muted-foreground">Learn about templates</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}