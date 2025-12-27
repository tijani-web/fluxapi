// app/project/[id]/components/sections/MockDataSection.tsx
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '@/lib/api'
import { MockDataCollection, CreateMockDataCollection, UpdateMockDataCollection } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  Filter, 
  Database, 
  MoreVertical, 
  Trash2, 
  Edit,
  Copy,
  Eye,
  EyeOff,
  Download,
  Upload,
  Sparkles,
  RefreshCw,
  Play,
  FileJson,
  Table,
  Grid,
  List,
  Key,
  Hash,
  Calendar,
  Mail,
  User,
  Globe,
  CheckCircle,
  AlertCircle,
  Settings,
  Zap,
  BarChart3,
  FileUp,
  FileDown,
  ChevronDown,
  Menu,
  X
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { JSONEditor } from '../Editor/JSONEditor'
import { DataTable } from '../tabels/DataTable'
import { SearchBar } from '../tabels/SearchBar'

interface MockDataSectionProps {
  projectId: string
}

type DataFormat = 'json' | 'table' | 'grid'
type DataType = 'users' | 'products' | 'orders' | 'custom' | 'ai-generated'

interface DataField {
  name: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'uuid'
  required: boolean
  unique: boolean
  defaultValue?: any
}

export function MockDataSection({ projectId }: MockDataSectionProps) {
  const { toast } = useToast()
  const [collections, setCollections] = useState<MockDataCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCollection, setSelectedCollection] = useState<MockDataCollection | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [format, setFormat] = useState<DataFormat>('table')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showSchemaModal, setShowSchemaModal] = useState(false)
  const [showAIGenerateModal, setShowAIGenerateModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'collections' | 'explorer' | 'generator'>('collections')
  const [editingData, setEditingData] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [schema, setSchema] = useState<DataField[]>([])
  const [previewData, setPreviewData] = useState<any[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Responsive breakpoints
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  
  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 640)
      setIsTablet(width >= 640 && width < 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])
  
  // Load collections
  const loadCollections = useCallback(async () => {
    try {
      const data = await api.getMockDataCollections(projectId)
      setCollections(data)
      
      if (data.length > 0 && !selectedCollection) {
        setSelectedCollection(data[0])
        setEditingData(data[0].data || [])
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load mock data collections',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [projectId, selectedCollection, toast])
  
  useEffect(() => {
    loadCollections()
  }, [loadCollections])
  
  // Create collection
  const handleCreateCollection = async (data: CreateMockDataCollection) => {
    try {
      const collection = await api.createMockDataCollection(projectId, data)
      setCollections(prev => [collection, ...prev])
      setSelectedCollection(collection)
      setEditingData(collection.data || [])
      toast({
        title: 'Success',
        description: 'Collection created successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  }
  
  // Update collection
  const handleUpdateCollection = async (collectionId: string, data: UpdateMockDataCollection) => {
    try {
      const updated = await api.updateMockDataCollection(collectionId, data)
      setCollections(prev => prev.map(col => col.id === collectionId ? updated : col))
      if (selectedCollection?.id === collectionId) {
        setSelectedCollection(updated)
      }
      toast({
        title: 'Success',
        description: 'Collection updated successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  }
  
  // Delete collection
  const handleDeleteCollection = async (collectionId: string) => {
    if (!confirm('Are you sure? This will delete all data in this collection.')) return
    
    try {
      await api.deleteMockDataCollection(collectionId)
      setCollections(prev => prev.filter(col => col.id !== collectionId))
      if (selectedCollection?.id === collectionId) {
        if (collections.length > 1) {
          const nextCollection = collections.find(col => col.id !== collectionId)
          setSelectedCollection(nextCollection || null)
          setEditingData(nextCollection?.data || [])
        } else {
          setSelectedCollection(null)
          setEditingData([])
        }
      }
      toast({
        title: 'Success',
        description: 'Collection deleted successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  }
  
  // Duplicate collection
  const handleDuplicateCollection = async (collection: MockDataCollection) => {
    try {
      const duplicated = await api.createMockDataCollection(projectId, {
        name: `${collection.name} (Copy)`,
        description: collection.description,
        schema: collection.schema,
        initialData: collection.data,
        isSeedData: false
      })
      setCollections(prev => [duplicated, ...prev])
      setSelectedCollection(duplicated)
      setEditingData(duplicated.data || [])
      toast({
        title: 'Success',
        description: 'Collection duplicated successfully'
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  }
  
  // Search in collection
  const handleSearch = async (query: string) => {
    if (!selectedCollection) return
    
    try {
      const results = await api.searchMockData(selectedCollection.id, query)
      setPreviewData(results)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Search failed',
        variant: 'destructive'
      })
    }
  }
  
  // Generate mock data with AI
  const handleAIGenerate = async (type: DataType, count: number) => {
    setIsGenerating(true)
    try {
      const result = await api.generateCode({
        prompt: `Generate ${count} realistic ${type} objects with fields: ${schema.map(f => f.name).join(', ')}`,
        projectId,
        context: { type, count, schema }
      })
      
      // Parse AI response and create collection
      const aiData = JSON.parse(result.code || '[]')
      const aiCollection = await api.createMockDataCollection(projectId, {
        name: `AI ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        description: `AI-generated ${type} data (${count} items)`,
        schema: schema,
        initialData: aiData,
        isSeedData: true
      })
      
      setCollections(prev => [aiCollection, ...prev])
      setSelectedCollection(aiCollection)
      setEditingData(aiData)
      
      toast({
        title: 'Success',
        description: `Generated ${count} ${type} records with AI`
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setIsGenerating(false)
    }
  }
  
  // Export collection
  const handleExport = async (collectionId: string, format: 'json' | 'csv' | 'yaml') => {
    try {
      const collection = collections.find(col => col.id === collectionId)
      if (!collection) return
      
      let content = ''
      let filename = `${collection.name}.${format}`
      let mimeType = ''
      
      switch (format) {
        case 'json':
          content = JSON.stringify(collection.data, null, 2)
          mimeType = 'application/json'
          break
        case 'csv':
          // Convert to CSV
          if (collection.data.length === 0) {
            content = ''
          } else {
            const headers = Object.keys(collection.data[0] || {}).join(',')
            const rows = collection.data.map(item => 
              Object.values(item).map(val => 
                typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
              ).join(',')
            )
            content = [headers, ...rows].join('\n')
          }
          mimeType = 'text/csv'
          break
        case 'yaml':
          // Convert to YAML
          const yaml = require('js-yaml')
          content = yaml.dump(collection.data)
          mimeType = 'text/yaml'
          break
      }
      
      // Create download link
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: 'Success',
        description: `Exported ${collection.data.length} records as ${format.toUpperCase()}`
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  }
  
  // Import data
  const handleImport = async (file: File, format: 'json' | 'csv') => {
    try {
      const text = await file.text()
      let data: any[]
      
      switch (format) {
        case 'json':
          data = JSON.parse(text)
          break
        case 'csv':
          const lines = text.split('\n').filter(line => line.trim() !== '')
          if (lines.length === 0) {
            data = []
          } else {
            const headers = lines[0].split(',')
            data = lines.slice(1).map(line => {
              const values = line.split(',')
              return headers.reduce((obj, header, index) => {
                let value = values[index]?.trim()
                // Remove quotes and parse numbers
                if (value?.startsWith('"') && value.endsWith('"')) {
                  value = value.slice(1, -1).replace(/""/g, '"')
                }
                obj[header] = isNaN(Number(value)) ? value : Number(value)
                return obj
              }, {} as any)
            })
          }
          break
        default:
          data = []
      }
      
      // Create collection from imported data
      const collection = await api.createMockDataCollection(projectId, {
        name: file.name.replace(/\.[^/.]+$/, ""),
        description: `Imported from ${file.name}`,
        initialData: data,
        isSeedData: true
      })
      
      setCollections(prev => [collection, ...prev])
      setSelectedCollection(collection)
      setEditingData(data)
      
      toast({
        title: 'Success',
        description: `Imported ${data.length} records from ${file.name}`
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to import file',
        variant: 'destructive'
      })
    }
  }
  
  // Generate sample schema
  const generateSampleSchema = (type: DataType): DataField[] => {
    switch (type) {
      case 'users':
        return [
          { name: 'id', type: 'uuid', required: true, unique: true },
          { name: 'name', type: 'string', required: true, unique: false },
          { name: 'email', type: 'email', required: true, unique: true },
          { name: 'age', type: 'number', required: false, unique: false },
          { name: 'isActive', type: 'boolean', required: false, unique: false, defaultValue: true },
          { name: 'createdAt', type: 'date', required: true, unique: false }
        ]
      case 'products':
        return [
          { name: 'id', type: 'uuid', required: true, unique: true },
          { name: 'name', type: 'string', required: true, unique: false },
          { name: 'price', type: 'number', required: true, unique: false },
          { name: 'category', type: 'string', required: false, unique: false },
          { name: 'inStock', type: 'boolean', required: false, unique: false, defaultValue: true },
          { name: 'rating', type: 'number', required: false, unique: false, defaultValue: 0 }
        ]
      case 'orders':
        return [
          { name: 'id', type: 'uuid', required: true, unique: true },
          { name: 'userId', type: 'uuid', required: true, unique: false },
          { name: 'total', type: 'number', required: true, unique: false },
          { name: 'status', type: 'string', required: true, unique: false, defaultValue: 'pending' },
          { name: 'items', type: 'string', required: true, unique: false },
          { name: 'createdAt', type: 'date', required: true, unique: false }
        ]
      default:
        return [
          { name: 'id', type: 'uuid', required: true, unique: true },
          { name: 'name', type: 'string', required: true, unique: false }
        ]
    }
  }
  
  // Apply schema to generate preview
  const generatePreviewFromSchema = (schema: DataField[], count: number = 5) => {
    const preview = []
    for (let i = 0; i < count; i++) {
      const item: Record<string, any> = {}
      schema.forEach(field => {
        switch (field.type) {
          case 'string':
            item[field.name] = `Sample ${field.name} ${i + 1}`
            break
          case 'number':
            item[field.name] = Math.floor(Math.random() * 1000)
            break
          case 'boolean':
            item[field.name] = Math.random() > 0.5
            break
          case 'date':
            item[field.name] = new Date().toISOString()
            break
          case 'email':
            item[field.name] = `user${i + 1}@example.com`
            break
          case 'uuid':
            item[field.name] = `uuid-${i + 1}-${Date.now()}`
            break
        }
      })
      preview.push(item)
    }
    setPreviewData(preview)
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] md:min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading mock data...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header - Responsive with mobile menu */}
      <div className="border-b border-border/40 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Title and Mobile Menu Button */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Mock Data</h2>
              <p className="text-muted-foreground text-sm sm:text-base mt-1 max-w-3xl">
                Create and manage realistic test data for your APIs
              </p>
            </div>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden h-10 w-10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          
          {/* Action Bar */}
          <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ${isMobileMenuOpen ? 'flex' : 'hidden sm:flex'}`}>
            {/* Search - Full width on mobile */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full min-h-[44px]"
              />
            </div>
            
            {/* View Format Selector */}
            <div className="flex border rounded-md overflow-hidden self-stretch sm:self-auto">
              <button
                onClick={() => setFormat('table')}
                className={`flex-1 sm:flex-none p-3 sm:p-2 sm:px-3 min-h-[44px] sm:min-h-0 ${format === 'table' ? 'bg-muted' : ''}`}
                title="Table View"
                aria-label="Table View"
              >
                <Table className="h-4 w-4 mx-auto sm:mx-0" />
                <span className="sr-only sm:not-sr-only sm:ml-2 sm:inline">Table</span>
              </button>
              <button
                onClick={() => setFormat('json')}
                className={`flex-1 sm:flex-none p-3 sm:p-2 sm:px-3 min-h-[44px] sm:min-h-0 ${format === 'json' ? 'bg-muted' : ''}`}
                title="JSON View"
                aria-label="JSON View"
              >
                <FileJson className="h-4 w-4 mx-auto sm:mx-0" />
                <span className="sr-only sm:not-sr-only sm:ml-2 sm:inline">JSON</span>
              </button>
              <button
                onClick={() => setFormat('grid')}
                className={`flex-1 sm:flex-none p-3 sm:p-2 sm:px-3 min-h-[44px] sm:min-h-0 ${format === 'grid' ? 'bg-muted' : ''}`}
                title="Grid View"
                aria-label="Grid View"
              >
                <Grid className="h-4 w-4 mx-auto sm:mx-0" />
                <span className="sr-only sm:not-sr-only sm:ml-2 sm:inline">Grid</span>
              </button>
            </div>
            
            {/* Create Button with Dropdown - Full width on mobile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full sm:w-auto min-h-[44px]">
                  <Plus className="h-4 w-4 mr-0 sm:mr-2" />
                  <span className="ml-2 sm:ml-0">Create</span>
                  <ChevronDown className="ml-2 h-4 w-4 hidden sm:inline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] sm:w-auto">
                <DropdownMenuItem onClick={() => setShowCreateModal(true)} className="min-h-[44px]">
                  <Database className="h-4 w-4 mr-2" />
                  New Collection
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowSchemaModal(true)} className="min-h-[44px]">
                  <Settings className="h-4 w-4 mr-2" />
                  From Schema
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowAIGenerateModal(true)} className="min-h-[44px]">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Generate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowImportModal(true)} className="min-h-[44px]">
                  <FileUp className="h-4 w-4 mr-2" />
                  Import Data
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Main Content - Responsive tabs */}
      <div className="flex-1 overflow-hidden min-h-0">
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="h-full">
          {/* Tab Navigation - Responsive scrolling on mobile */}
          <div className="border-b">
            <TabsList className="h-12 sm:h-14 px-2 sm:px-4 overflow-x-auto overflow-y-hidden flex-nowrap">
              <TabsTrigger 
                value="collections" 
                className="h-10 px-3 sm:px-4 whitespace-nowrap min-w-[120px] sm:min-w-0"
              >
                <Database className="h-4 w-4 mr-2" />
                <span>Collections</span>
                {collections.length > 0 && (
                  <Badge className="ml-2 hidden sm:inline-flex">{collections.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="explorer" 
                className="h-10 px-3 sm:px-4 whitespace-nowrap min-w-[120px] sm:min-w-0"
              >
                <Eye className="h-4 w-4 mr-2" />
                <span>Data Explorer</span>
              </TabsTrigger>
              <TabsTrigger 
                value="generator" 
                className="h-10 px-3 sm:px-4 whitespace-nowrap min-w-[120px] sm:min-w-0"
              >
                <Zap className="h-4 w-4 mr-2" />
                <span>Data Generator</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Collections Tab - Responsive grid */}
          <TabsContent value="collections" className="h-[calc(100%-48px)] sm:h-[calc(100%-56px)] p-0 m-0 overflow-auto">
            {selectedCollection ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
                {/* Collection List - Sidebar becomes full width on mobile/tablet */}
                <div className="border-r overflow-auto p-3 sm:p-4 lg:col-span-1 lg:max-w-md">
                  <div className="space-y-3">
                    {collections.map((collection) => (
                      <Card 
                        key={collection.id}
                        className={`cursor-pointer transition-all hover:border-primary/40 ${
                          selectedCollection?.id === collection.id ? 'border-primary bg-primary/5' : ''
                        } overflow-hidden`}
                        onClick={() => {
                          setSelectedCollection(collection)
                          setEditingData(collection.data || [])
                        }}
                      >
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  <Database className="h-3 w-3 mr-1" />
                                  {collection.data?.length || 0}
                                </Badge>
                                {collection.isSeedData && (
                                  <Badge className="text-xs bg-green-500/20 text-green-600">
                                    Seed
                                  </Badge>
                                )}
                              </div>
                              
                              <h4 className="font-semibold text-sm sm:text-base truncate">{collection.name}</h4>
                              <p className="text-xs sm:text-sm text-muted-foreground mb-2 truncate">
                                {collection.description || 'No description'}
                              </p>
                              
                              {collection.schema && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {Object.keys(collection.schema).slice(0, isMobile ? 2 : 3).map(key => (
                                    <span 
                                      key={key} 
                                      className="text-xs px-2 py-1 bg-muted rounded truncate max-w-[80px] sm:max-w-none"
                                      title={key}
                                    >
                                      {key}
                                    </span>
                                  ))}
                                  {Object.keys(collection.schema).length > (isMobile ? 2 : 3) && (
                                    <span className="text-xs px-2 py-1 bg-muted rounded">
                                      +{Object.keys(collection.schema).length - (isMobile ? 2 : 3)}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 flex-shrink-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleDuplicateCollection(collection)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExport(collection.id, 'json')}>
                                  <FileDown className="h-4 w-4 mr-2" />
                                  Export JSON
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExport(collection.id, 'csv')}>
                                  <Download className="h-4 w-4 mr-2" />
                                  Export CSV
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteCollection(collection.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {collections.length === 0 && (
                      <div className="text-center py-8 sm:py-12">
                        <div className="inline-flex p-3 rounded-full bg-muted/50 mb-4">
                          <Database className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">No collections yet</h3>
                        <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                          Create your first mock data collection
                        </p>
                        <Button onClick={() => setShowCreateModal(true)} size={isMobile ? "default" : "lg"}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Collection
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Data Editor - Full width on mobile/tablet */}
                <div className="overflow-auto p-3 sm:p-4 lg:col-span-2">
                  {selectedCollection && (
                    <div className="space-y-4 sm:space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="min-w-0">
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{selectedCollection.name}</h3>
                          <p className="text-muted-foreground text-sm sm:text-base truncate">
                            {selectedCollection.description || 'No description provided'}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size={isMobile ? "sm" : "default"}
                            onClick={() => handleUpdateCollection(selectedCollection.id, {
                              data: editingData
                            })}
                            className="flex-1 sm:flex-none min-w-[120px]"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="outline" 
                                size={isMobile ? "sm" : "default"}
                                className="flex-1 sm:flex-none min-w-[120px]"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Export
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleExport(selectedCollection.id, 'json')}>
                                Export as JSON
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleExport(selectedCollection.id, 'csv')}>
                                Export as CSV
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleExport(selectedCollection.id, 'yaml')}>
                                Export as YAML
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      {/* Data Viewer/Editor - Responsive based on format */}
                      <Card>
                        <CardHeader className="p-4 sm:p-6">
                          <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span>Data Editor</span>
                            <Badge className="self-start sm:self-center">
                              {editingData.length} records
                            </Badge>
                          </CardTitle>
                          <CardDescription className="text-sm sm:text-base">
                            Edit your mock data in {format} format
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-0">
                          {format === 'json' ? (
                            <div className="min-h-[300px] sm:min-h-[400px]">
                              <JSONEditor
                                data={editingData}
                                onChange={setEditingData}
                                height={isMobile ? "300px" : "400px"}
                              />
                            </div>
                          ) : format === 'table' ? (
                            <div className="overflow-x-auto -mx-4 sm:mx-0">
                              <div className="min-w-[640px] sm:min-w-0">
                                <DataTable
                                  data={editingData}
                                  onDataChange={setEditingData}
                                  editable={true}
                                  isMobile={isMobile}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                              {editingData.slice(0, isMobile ? 6 : 12).map((item, index) => (
                                <Card key={index} className="overflow-hidden">
                                  <CardContent className="p-3 sm:p-4">
                                    <div className="space-y-1 sm:space-y-2">
                                      {Object.entries(item).map(([key, value]) => (
                                        <div key={key} className="text-xs sm:text-sm">
                                          <span className="font-medium text-muted-foreground truncate block">{key}:</span>
                                          <span className="truncate block">
                                            {typeof value === 'object' 
                                              ? JSON.stringify(value) 
                                              : String(value)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="p-4 sm:p-6 pt-0 flex flex-col sm:flex-row justify-between gap-3">
                          <div className="text-sm text-muted-foreground">
                            {selectedCollection.isSeedData && (
                              <span className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                This is seed data
                              </span>
                            )}
                          </div>
                          <Button
                            size={isMobile ? "sm" : "default"}
                            onClick={() => {
                              const newRecord: Record<string, any> = {}
                              if (selectedCollection.schema) {
                                Object.keys(selectedCollection.schema).forEach(key => {
                                  newRecord[key] = ''
                                })
                              }
                              setEditingData(prev => [...prev, newRecord])
                            }}
                            className="w-full sm:w-auto"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Record
                          </Button>
                        </CardFooter>
                      </Card>
                      
                      {/* Schema Info - Collapsible on mobile */}
                      {selectedCollection.schema && (
                        <Card>
                          <CardHeader className="p-4 sm:p-6">
                            <CardTitle>Data Schema</CardTitle>
                            <CardDescription className="text-sm sm:text-base">
                              Structure of your mock data
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 sm:p-6 pt-0">
                            <div className="space-y-2">
                              {Object.entries(selectedCollection.schema).map(([fieldName, fieldConfig]: [string, any]) => (
                                <div 
                                  key={fieldName} 
                                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded gap-2 sm:gap-4"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium truncate">{fieldName}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 sm:gap-2">
                                      <Badge variant="outline" className="text-xs">
                                        {fieldConfig.type}
                                      </Badge>
                                      {fieldConfig.required && (
                                        <Badge variant="outline" className="text-xs bg-red-500/10">
                                          Required
                                        </Badge>
                                      )}
                                      {fieldConfig.unique && (
                                        <Badge variant="outline" className="text-xs bg-blue-500/10">
                                          Unique
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  {fieldConfig.defaultValue !== undefined && (
                                    <span className="text-sm text-muted-foreground truncate">
                                      Default: {String(fieldConfig.defaultValue)}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-4 sm:p-8">
                <div className="text-center max-w-md w-full">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                    <Database className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Create Mock Data</h3>
                  <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                    Create realistic test data for your API endpoints. 
                    Use templates, AI generation, or import from files.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button 
                      onClick={() => setShowCreateModal(true)} 
                      size={isMobile ? "sm" : "default"}
                      className="min-h-[44px]"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      New Collection
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAIGenerateModal(true)}
                      size={isMobile ? "sm" : "default"}
                      className="min-h-[44px]"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Generate
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowSchemaModal(true)}
                      size={isMobile ? "sm" : "default"}
                      className="min-h-[44px]"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      From Schema
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowImportModal(true)}
                      size={isMobile ? "sm" : "default"}
                      className="min-h-[44px]"
                    >
                      <FileUp className="h-4 w-4 mr-2" />
                      Import
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Data Explorer Tab */}
          <TabsContent value="explorer" className="h-[calc(100%-48px)] sm:h-[calc(100%-56px)] p-3 sm:p-4 lg:p-6 overflow-auto">
            <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle>Search Across Collections</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Find specific data across all your mock collections
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <SearchBar
                    onSearch={handleSearch}
                    placeholder="Search for data across all collections..."
                    classname="w-full"
                  />
                  
                  {previewData.length > 0 && (
                    <div className="mt-4 sm:mt-6">
                      <h4 className="font-semibold text-lg mb-3">Search Results ({previewData.length})</h4>
                      <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <div className="min-w-[640px] sm:min-w-0">
                          <DataTable data={previewData} />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Data Generator Tab - Responsive grid */}
          <TabsContent value="generator" className="h-[calc(100%-48px)] sm:h-[calc(100%-56px)] p-3 sm:p-4 lg:p-6 overflow-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
              <Card className="lg:col-span-2">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle>Schema Builder</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Define the structure of your mock data
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 sm:gap-4">
                      <Button
                        variant="outline"
                        size={isMobile ? "sm" : "default"}
                        onClick={() => setSchema(generateSampleSchema('users'))}
                        className="flex-1 sm:flex-none min-w-[140px]"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Users Template
                      </Button>
                      <Button
                        variant="outline"
                        size={isMobile ? "sm" : "default"}
                        onClick={() => setSchema(generateSampleSchema('products'))}
                        className="flex-1 sm:flex-none min-w-[140px]"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Products Template
                      </Button>
                      <Button
                        variant="outline"
                        size={isMobile ? "sm" : "default"}
                        onClick={() => setSchema(generateSampleSchema('orders'))}
                        className="flex-1 sm:flex-none min-w-[140px]"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Orders Template
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {schema.map((field, index) => (
                        <div 
                          key={index} 
                          className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border rounded"
                        >
                          <Input
                            value={field.name}
                            onChange={(e) => {
                              const newSchema = [...schema]
                              newSchema[index].name = e.target.value
                              setSchema(newSchema)
                            }}
                            placeholder="Field name"
                            className="w-full sm:w-32"
                          />
                          <Select
                            value={field.type}
                            onValueChange={(value: any) => {
                              const newSchema = [...schema]
                              newSchema[index].type = value as DataField['type']
                              setSchema(newSchema)
                            }}
                          >
                            <SelectTrigger className="w-full sm:w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="string">String</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="boolean">Boolean</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="uuid">UUID</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={field.required}
                              onCheckedChange={(checked) => {
                                const newSchema = [...schema]
                                newSchema[index].required = checked
                                setSchema(newSchema)
                              }}
                            />
                            <Label className="text-sm">Required</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={field.unique}
                              onCheckedChange={(checked) => {
                                const newSchema = [...schema]
                                newSchema[index].unique = checked
                                setSchema(newSchema)
                              }}
                            />
                            <Label className="text-sm">Unique</Label>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newSchema = schema.filter((_, i) => i !== index)
                              setSchema(newSchema)
                            }}
                            className="self-end sm:self-center"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        onClick={() => setSchema([
                          ...schema,
                          { name: `field_${schema.length + 1}`, type: 'string', required: false, unique: false }
                        ])}
                        size={isMobile ? "sm" : "default"}
                        className="w-full sm:w-auto"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Field
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 sm:p-6 pt-0">
                  <Button
                    onClick={() => generatePreviewFromSchema(schema)}
                    className="w-full min-h-[44px]"
                    size={isMobile ? "sm" : "default"}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Generate Preview
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle>Preview</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Sample data based on your schema
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  {previewData.length > 0 ? (
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                      <div className="min-w-[640px] sm:min-w-0">
                        <DataTable data={previewData.slice(0, 5)} />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-sm sm:text-base">
                        Build your schema and generate a preview
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-4 sm:p-6 pt-0">
                  <Button
                    onClick={() => setShowAIGenerateModal(true)}
                    disabled={schema.length === 0}
                    className="w-full min-h-[44px]"
                    size={isMobile ? "sm" : "default"}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Generate Data
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Modals - Responsive sizing */}
      <CreateCollectionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCollection}
        projectId={projectId}
        isMobile={isMobile}
      />
      
      <AIGenerateModal
        isOpen={showAIGenerateModal}
        onClose={() => setShowAIGenerateModal(false)}
        onGenerate={handleAIGenerate}
        schema={schema}
        isGenerating={isGenerating}
        isMobile={isMobile}
      />
      
      <ImportDataModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
        isMobile={isMobile}
      />
    </div>
  )
}

// Helper components with responsive enhancements
function CreateCollectionModal({ isOpen, onClose, onSubmit, projectId, isMobile }: any) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    initialData: '[]'
  })
  
  const handleSubmit = () => {
    if (!form.name.trim()) {
      alert('Collection name is required')
      return
    }
    
    try {
      const data = JSON.parse(form.initialData)
      onSubmit({
        name: form.name,
        description: form.description,
        initialData: data
      })
      onClose()
    } catch (error) {
      alert('Invalid JSON data')
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-[95vw] sm:max-w-2xl ${isMobile ? 'w-[95vw]' : ''}`}>
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Create Mock Data Collection</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 sm:space-y-4 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
          <div>
            <Label className="text-sm sm:text-base">Collection Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              placeholder="e.g., Users, Products, Orders"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label className="text-sm sm:text-base">Description (optional)</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              placeholder="Describe what this data represents..."
              rows={2}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label className="text-sm sm:text-base">Initial Data (JSON)</Label>
            <Textarea
              value={form.initialData}
              onChange={(e) => setForm({...form, initialData: e.target.value})}
              rows={isMobile ? 6 : 8}
              className="font-mono text-sm mt-1"
              placeholder='[{"id": 1, "name": "Example"}]'
            />
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto min-h-[44px]">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="w-full sm:w-auto min-h-[44px]">
            Create Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AIGenerateModal({ isOpen, onClose, onGenerate, schema, isGenerating, isMobile }: any) {
  const [type, setType] = useState<DataType>('users')
  const [count, setCount] = useState(10)
  const [prompt, setPrompt] = useState('')
  
  const handleGenerate = () => {
    onGenerate(type, count)
    onClose()
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-[95vw] sm:max-w-md ${isMobile ? 'w-[95vw]' : ''}`}>
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">AI Data Generation</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Generate realistic mock data using AI
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 sm:space-y-4">
          <div>
            <Label className="text-sm sm:text-base">Data Type</Label>
            <Select value={type} onValueChange={(value: DataType) => setType(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="products">Products</SelectItem>
                <SelectItem value="orders">Orders</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm sm:text-base">Number of Records</Label>
            <Input
              type="number"
              min="1"
              max="1000"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label className="text-sm sm:text-base">Additional Instructions (optional)</Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Include European names only, realistic prices..."
              rows={3}
              className="mt-1"
            />
          </div>
          
          {schema.length > 0 && (
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Schema will be used:</p>
              <div className="flex flex-wrap gap-1">
                {schema.map((field: DataField) => (
                  <Badge key={field.name} variant="outline" className="text-xs">
                    {field.name}: {field.type}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto min-h-[44px]">
            Cancel
          </Button>
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full sm:w-auto min-h-[44px]"
          >
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ImportDataModal({ isOpen, onClose, onImport, isMobile }: any) {
  const [format, setFormat] = useState<'json' | 'csv'>('json')
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }
  
  const handleImport = () => {
    if (!file) {
      alert('Please select a file')
      return
    }
    
    onImport(file, format)
    onClose()
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-[95vw] sm:max-w-md ${isMobile ? 'w-[95vw]' : ''}`}>
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Import Data</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Import mock data from JSON or CSV files
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 sm:space-y-4">
          <div>
            <Label className="text-sm sm:text-base">Import Format</Label>
            <Select value={format} onValueChange={(value: any) => setFormat(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON File</SelectItem>
                <SelectItem value="csv">CSV File</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm sm:text-base">Select File</Label>
            <div className="border-2 border-dashed rounded-lg p-4 sm:p-6 text-center mt-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept={format === 'json' ? '.json' : '.csv'}
                className="hidden"
              />
              <Upload className="h-8 sm:h-12 w-8 sm:w-12 mx-auto text-muted-foreground mb-3 sm:mb-4" />
              <p className="text-sm text-muted-foreground mb-2 truncate">
                {file ? file.name : 'No file selected'}
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                size={isMobile ? "sm" : "default"}
                className="min-h-[44px]"
              >
                Choose File
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Supported formats:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>JSON: Array of objects</li>
              <li>CSV: First row as headers</li>
              <li>Max file size: 10MB</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto min-h-[44px]">
            Cancel
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!file}
            className="w-full sm:w-auto min-h-[44px]"
          >
            Import Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Missing icon components
const Package = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
)

const ShoppingCart = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
)