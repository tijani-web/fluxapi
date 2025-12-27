// ImportExportSection.tsx - FULLY RESPONSIVE VERSION
'use client'

import { useState, useEffect, useCallback } from 'react'
import { ApiClient } from '@/lib/api-client'
import { ExportFormat, ProjectExport, ProjectVisibility } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  Upload, 
  RefreshCw, 
  AlertCircle, 
  Clock,
  FileJson,
  FileText,
  ExternalLink,
  Package,
  History,
  CheckCircle,
  XCircle,
  Loader2,
  FileUp,
  FolderUp,
  Zap,
  ChevronRight
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface ImportExportSectionProps {
  projectId: string
}

export function ImportExportSection({ projectId }: ImportExportSectionProps) {
  const { toast } = useToast()
  const [exports, setExports] = useState<ProjectExport[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('CUSTOM_JSON')
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importName, setImportName] = useState('')
  const [includeOptions, setIncludeOptions] = useState({
    endpoints: true,
    mockData: true,
    environments: true,
    webhooks: true
  })
  const [isMobile, setIsMobile] = useState(false)
  
  // RESPONSIVE: Check mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Load exports history
  const loadExports = useCallback(async () => {
    try {
      const exportsData = await ApiClient.getProjectExportsHistory(projectId, 10)
      console.log('Loaded exports:', exportsData)
      setExports(exportsData)
    } catch (error) {
      console.error('Failed to load exports:', error)
      toast({ 
        title: 'Error', 
        description: 'Failed to load export history', 
        variant: 'destructive' 
      })
    }
  }, [projectId, toast])
  
  useEffect(() => {
    loadExports().finally(() => setLoading(false))
  }, [loadExports])
  
  // Handle file upload for import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Validate file type
    const allowedTypes = ['application/json', 'application/yaml', 'text/yaml', 'text/plain']
    const allowedExtensions = ['.json', '.yaml', '.yml']
    const fileExt = file.name.toLowerCase().slice(-5)
    const hasValidExtension = allowedExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    )
    
    if (!allowedTypes.includes(file.type) && !hasValidExtension) {
      toast({ 
        title: 'Invalid File', 
        description: 'Please upload JSON or YAML files only', 
        variant: 'destructive' 
      })
      return
    }
    
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      toast({ 
        title: 'File Too Large', 
        description: 'Maximum file size is 10MB', 
        variant: 'destructive' 
      })
      return
    }
    
    setImportFile(file)
    // Suggest name from filename
    setImportName(file.name.replace(/\.[^/.]+$/, "").replace(/-/g, ' '))
  }
  
  // Export project
  const handleExport = async (format?: ExportFormat) => {
    const exportFormat = format || selectedFormat
    setExporting(true)
    
    try {
      // Prepare export options
      const options = {
        format: exportFormat,
        include: includeOptions
      }
      
      console.log('Exporting with options:', options)
      
      // Call the API client method
      const result = await ApiClient.exportProjectData(projectId, options)
      
      // Download the file
      const url = window.URL.createObjectURL(result.blob)
      const link = document.createElement('a')
      link.href = url
      link.download = result.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast({ 
        title: 'Export Successful!', 
        description: `Project exported as ${exportFormat}. File downloaded.`,
        variant: 'default'
      })
      
      // Refresh exports list
      setTimeout(() => loadExports(), 1000)
      
    } catch (error: any) {
      console.error('Export error:', error)
      toast({ 
        title: 'Export Failed', 
        description: error.message || 'Failed to export project', 
        variant: 'destructive' 
      })
    } finally {
      setExporting(false)
    }
  }
  
  // Quick export functions
  const handleQuickExport = (format: ExportFormat) => {
    setSelectedFormat(format)
    handleExport(format)
  }
  
  // Import project
  const handleImport = async () => {
    if (!importFile || !importName.trim()) {
      toast({ 
        title: 'Missing Information', 
        description: 'Please provide a file and project name', 
        variant: 'destructive' 
      })
      return
    }
    
    setImporting(true)
    
    try {
      const project = await ApiClient.importProjectData(importFile, {
        name: importName.trim(),
        visibility: 'PRIVATE' as ProjectVisibility
      })
      
      toast({ 
        title: 'Import Successful!', 
        description: `Project "${project.name}" has been imported.`,
        variant: 'default'
      })
      
      // Redirect to the new project after 2 seconds
      setTimeout(() => {
        window.location.href = `/projects/${project.id}`
      }, 2000)
      
    } catch (error: any) {
      console.error('Import error:', error)
      toast({ 
        title: 'Import Failed', 
        description: error.message || 'Failed to import project', 
        variant: 'destructive' 
      })
    } finally {
      setImporting(false)
    }
  }
  
  // Clear import form
  const clearImport = () => {
    setImportFile(null)
    setImportName('')
  }
  
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="text-center space-y-3 sm:space-y-4">
          <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-primary animate-spin" />
          <p className="text-sm sm:text-base text-muted-foreground">Loading import/export...</p>
        </div>
      </div>
    )
  }
  
  return (
    <ScrollArea className="h-full">
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="px-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Import & Export</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">Transfer projects between systems</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column - Export */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Export Card */}
            <Card className="border-2 border-primary/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Quick Export
                  </CardTitle>
                  <Badge variant="outline" className="font-normal text-xs">Fast</Badge>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  Export your project with one click
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className={cn(
                  "grid gap-2",
                  isMobile ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"
                )}>
                  <Button
                    onClick={() => handleQuickExport('CUSTOM_JSON')}
                    disabled={exporting}
                    variant="outline"
                    className="h-auto py-3 sm:py-4 flex flex-col items-center gap-1 sm:gap-2 hover:bg-primary/5 min-h-[88px]"
                  >
                    <FileJson className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    <span className="text-xs sm:text-sm font-medium">JSON</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">Full Project</span>
                  </Button>
                  
                  <Button
                    onClick={() => handleQuickExport('OPENAPI')}
                    disabled={exporting}
                    variant="outline"
                    className="h-auto py-3 sm:py-4 flex flex-col items-center gap-1 sm:gap-2 hover:bg-primary/5 min-h-[88px]"
                  >
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    <span className="text-xs sm:text-sm font-medium">OpenAPI</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">Spec 3.0</span>
                  </Button>
                  
                  <Button
                    onClick={() => handleQuickExport('POSTMAN')}
                    disabled={exporting}
                    variant="outline"
                    className="h-auto py-3 sm:py-4 flex flex-col items-center gap-1 sm:gap-2 hover:bg-primary/5 min-h-[88px]"
                  >
                    <ExternalLink className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                    <span className="text-xs sm:text-sm font-medium">Postman</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">Collection</span>
                  </Button>
                  
                  <Button
                    onClick={() => handleQuickExport('INSOMNIA')}
                    disabled={exporting}
                    variant="outline"
                    className="h-auto py-3 sm:py-4 flex flex-col items-center gap-1 sm:gap-2 hover:bg-primary/5 min-h-[88px]"
                  >
                    <Package className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                    <span className="text-xs sm:text-sm font-medium">Insomnia</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">Workspace</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Advanced Export Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                  Advanced Export
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Customize what to include in your export
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {/* Format Selection */}
                <div className="space-y-2">
                  <Label className="text-sm sm:text-base">Export Format</Label>
                  <Select
                    value={selectedFormat}
                    onValueChange={(value) => setSelectedFormat(value as ExportFormat)}
                  >
                    <SelectTrigger className="w-full min-h-[44px] text-sm sm:text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CUSTOM_JSON" className="text-sm">
                        <div className="flex items-center gap-2 py-1">
                          <FileJson className="h-4 w-4 text-green-600" />
                          FluxAPI JSON (Full Project)
                        </div>
                      </SelectItem>
                      <SelectItem value="OPENAPI" className="text-sm">
                        <div className="flex items-center gap-2 py-1">
                          <FileText className="h-4 w-4 text-blue-600" />
                          OpenAPI 3.0 Specification
                        </div>
                      </SelectItem>
                      <SelectItem value="POSTMAN" className="text-sm">
                        <div className="flex items-center gap-2 py-1">
                          <ExternalLink className="h-4 w-4 text-orange-600" />
                          Postman Collection v2.1
                        </div>
                      </SelectItem>
                      <SelectItem value="INSOMNIA" className="text-sm">
                        <div className="flex items-center gap-2 py-1">
                          <Package className="h-4 w-4 text-purple-600" />
                          Insomnia Workspace
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Include Options */}
                <div className="space-y-3">
                  <Label className="text-sm sm:text-base">Include in Export</Label>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                    {Object.entries(includeOptions).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 border rounded-lg min-h-[44px]">
                        <Label htmlFor={key} className="cursor-pointer text-sm">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        </Label>
                        <Switch
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) => 
                            setIncludeOptions(prev => ({ ...prev, [key]: checked }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleExport()}
                  disabled={exporting}
                  className="w-full min-h-[44px]"
                >
                  {exporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span className="text-sm sm:text-base">Exporting...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      <span className="text-sm sm:text-base">Export with Selected Options</span>
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Import & History */}
          <div className="space-y-4 sm:space-y-6">
            {/* Import Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
                  Import Project
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Import a project from a file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {importFile ? (
                  // File selected state
                  <div className="space-y-4">
                    <div className="p-3 sm:p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <FileJson className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{importFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(importFile.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearImport}
                          className="h-8 w-8 sm:h-9 sm:w-auto px-2"
                        >
                          <span className="hidden sm:inline">Change</span>
                          <span className="sm:hidden">×</span>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="project-name" className="text-sm sm:text-base">Project Name *</Label>
                        <Input
                          id="project-name"
                          value={importName}
                          onChange={(e) => setImportName(e.target.value)}
                          placeholder="My Imported Project"
                          className="mt-1 min-h-[44px] text-sm sm:text-base"
                        />
                      </div>
                      
                      <Alert className="text-xs sm:text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="text-xs sm:text-sm">Note</AlertTitle>
                        <AlertDescription className="text-xs sm:text-sm">
                          Imported projects will be created as private by default.
                        </AlertDescription>
                      </Alert>
                    </div>
                    
                    <div className="flex gap-2 sm:gap-3">
                      <Button
                        onClick={handleImport}
                        disabled={importing || !importName.trim()}
                        className="flex-1 min-h-[44px]"
                      >
                        {importing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            <span className="text-sm">Importing...</span>
                          </>
                        ) : (
                          <>
                            <FolderUp className="h-4 w-4 mr-2" />
                            <span className="text-sm">Start Import</span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={clearImport}
                        disabled={importing}
                        className="min-h-[44px]"
                      >
                        <span className="text-sm">Cancel</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  // No file selected state
                  <div className="space-y-4">
                    <div 
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors min-h-[180px] sm:min-h-[200px] flex flex-col items-center justify-center"
                      onClick={() => document.getElementById('import-file')?.click()}
                    >
                      <FileUp className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto text-muted-foreground mb-2 sm:mb-3" />
                      <p className="text-sm sm:text-base font-medium mb-1">Drag & drop or click to upload</p>
                      <p className="text-xs text-muted-foreground">
                        Supported formats: JSON, YAML
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                        Max file size: 10MB
                      </p>
                    </div>
                    
                    <input
                      type="file"
                      id="import-file"
                      className="hidden"
                      accept=".json,.yaml,.yml"
                      onChange={handleFileChange}
                    />
                    
                    <div className="grid grid-cols-2 xs:grid-cols-4 gap-2">
                      <div className="text-center p-2 sm:p-3 border rounded-lg">
                        <FileJson className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mx-auto mb-1 sm:mb-2 text-green-600" />
                        <p className="text-xs sm:text-sm font-medium">FluxAPI JSON</p>
                      </div>
                      <div className="text-center p-2 sm:p-3 border rounded-lg">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mx-auto mb-1 sm:mb-2 text-blue-600" />
                        <p className="text-xs sm:text-sm font-medium">OpenAPI 3.0</p>
                      </div>
                      <div className="text-center p-2 sm:p-3 border rounded-lg">
                        <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mx-auto mb-1 sm:mb-2 text-orange-600" />
                        <p className="text-xs sm:text-sm font-medium">Postman</p>
                      </div>
                      <div className="text-center p-2 sm:p-3 border rounded-lg">
                        <Package className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mx-auto mb-1 sm:mb-2 text-purple-600" />
                        <p className="text-xs sm:text-sm font-medium">Insomnia</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Export History Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <History className="h-4 w-4 sm:h-5 sm:w-5" />
                    Export History
                  </CardTitle>
                  {exports.length > 0 && (
                    <Badge variant="secondary" className="text-xs">{exports.length}</Badge>
                  )}
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  Previous exports of this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className={cn(
                  "pr-1 sm:pr-2",
                  exports.length > 0 ? "h-[250px] sm:h-[300px]" : "h-auto"
                )}>
                  {exports.length > 0 ? (
                    <div className="space-y-2 sm:space-y-3">
                      {exports.map((exp) => (
                        <div 
                          key={exp.id} 
                          className="p-3 sm:p-4 border rounded-lg hover:bg-accent/50 transition-colors group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                              {exp.format === 'OPENAPI' ? (
                                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                              ) : exp.format === 'POSTMAN' ? (
                                <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                              ) : exp.format === 'INSOMNIA' ? (
                                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                              ) : (
                                <FileJson className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              )}
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                                  <span className="font-medium text-sm truncate">
                                    {exp.format} Export
                                  </span>
                                  {exp.status === 'COMPLETED' ? (
                                    <Badge className="bg-green-500/20 text-green-600 text-xs py-0.5 px-1.5">
                                      <CheckCircle className="h-2.5 w-2.5 mr-1" />
                                      <span className="hidden xs:inline">Completed</span>
                                      <span className="xs:hidden">Done</span>
                                    </Badge>
                                  ) : exp.status === 'FAILED' ? (
                                    <Badge className="bg-red-500/20 text-red-600 text-xs py-0.5 px-1.5">
                                      <XCircle className="h-2.5 w-2.5 mr-1" />
                                      <span className="hidden xs:inline">Failed</span>
                                      <span className="xs:hidden">Fail</span>
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-yellow-500/20 text-yellow-600 text-xs py-0.5 px-1.5">
                                      {exp.status}
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 text-xs text-muted-foreground mt-2">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {format(new Date(exp.createdAt), isMobile ? 'MMM d HH:mm' : 'MMM d, yyyy HH:mm')}
                                  </span>
                                  
                                  {exp.fileUrl && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => window.open(exp.fileUrl, '_blank')}
                                    >
                                      <Download className="h-3 w-3 mr-1" />
                                      Download
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <History className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                      <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-2">No exports yet</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm mb-4 max-w-md mx-auto">
                        Export your project to see the history here
                      </p>
                      <Button 
                        onClick={() => handleQuickExport('CUSTOM_JSON')}
                        variant="outline"
                        size="sm"
                        className="min-h-[44px]"
                      >
                        <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Make Your First Export
                      </Button>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              
              {exports.length > 0 && (
                <CardFooter className="border-t pt-3 px-3 sm:px-6">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full min-h-[44px]"
                    onClick={loadExports}
                  >
                    <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    <span className="text-sm">Refresh History</span>
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
        
        {/* Tips & Information */}
        <div className="mt-4 sm:mt-6">
          <Alert className="bg-muted/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-sm sm:text-base">Tips & Information</AlertTitle>
            <AlertDescription className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-2">
              <div>
                <p className="font-medium text-xs sm:text-sm">JSON Format</p>
                <p className="text-xs text-muted-foreground">Full project backup with all data included</p>
              </div>
              <div>
                <p className="font-medium text-xs sm:text-sm">OpenAPI Format</p>
                <p className="text-xs text-muted-foreground">Best for API documentation and sharing</p>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <p className="font-medium text-xs sm:text-sm">Import Safety</p>
                <p className="text-xs text-muted-foreground">Imports create new projects, won't affect existing ones</p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </ScrollArea>
  )
}