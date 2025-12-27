'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Eye, 
  Table, 
  BarChart3, 
  Image as ImageIcon, 
  Smartphone,
  Code,
  Copy,
  Check,
  Expand,
  Download,
  Filter,
  SortAsc,
  ExternalLink
} from 'lucide-react'

interface PreviewPanelProps {
  response?: any
  endpoint?: {
    method: string
    path: string
    name: string
  }
}

export function PreviewPanel({ response, endpoint }: PreviewPanelProps) {
  const [activeTab, setActiveTab] = useState('tree')
  const [copied, setCopied] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [detectedFeatures, setDetectedFeatures] = useState({
    hasArrays: false,
    hasNestedObjects: false,
    hasNumbers: false,
    hasImages: false,
    hasDates: false,
    hasUrls: false
  })

  // Analyze response structure
  useEffect(() => {
    if (!response) return

    const features = {
      hasArrays: false,
      hasNestedObjects: false,
      hasNumbers: false,
      hasImages: false,
      hasDates: false,
      hasUrls: false
    }

    const analyzeObject = (obj: any) => {
      if (Array.isArray(obj)) {
        features.hasArrays = true
        obj.forEach(analyzeObject)
      } else if (obj && typeof obj === 'object') {
        features.hasNestedObjects = true
        Object.values(obj).forEach(value => {
          if (typeof value === 'number') features.hasNumbers = true
          if (typeof value === 'string') {
            if (value.match(/\.(jpg|jpeg|png|gif|webp)$/i)) features.hasImages = true
            if (value.match(/^\d{4}-\d{2}-\d{2}/)) features.hasDates = true
            if (value.startsWith('http')) features.hasUrls = true
          }
          if (value && typeof value === 'object') analyzeObject(value)
        })
      }
    }

    analyzeObject(response)
    setDetectedFeatures(features)

    // Auto-select best tab based on content
    if (features.hasArrays && Array.isArray(response) && response.length > 0) {
      setActiveTab('table')
    } else if (features.hasImages) {
      setActiveTab('images')
    } else if (features.hasNumbers) {
      setActiveTab('charts')
    }
  }, [response])

  const copyResponse = () => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadResponse = () => {
    const dataStr = JSON.stringify(response, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `response-${endpoint?.name || 'data'}.json`
    a.click()
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (!response) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex p-3 rounded-full bg-muted/50">
            <Eye className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-medium">No Response to Preview</h3>
            <p className="text-muted-foreground">
              Execute an endpoint to see the response preview here
            </p>
          </div>
        </div>
      </div>
    )
  }

  const responseSize = formatBytes(new Blob([JSON.stringify(response)]).size)
  const isArray = Array.isArray(response)

  return (
    <div className={`h-full flex flex-col ${fullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="font-medium">Preview</span>
            {endpoint && (
              <Badge variant="outline" className="text-xs">
                {endpoint.method} {endpoint.path}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary" className="h-5 text-xs">
              {isArray ? `${response.length} items` : 'Object'}
            </Badge>
            <span className="text-xs">• {responseSize}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyResponse}
            className="gap-1 h-7"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            Copy
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadResponse}
            className="gap-1 h-7"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFullscreen(!fullscreen)}
            className="gap-1 h-7"
          >
            {fullscreen ? (
              <Expand className="h-3.5 w-3.5" />
            ) : (
              <ExternalLink className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Feature Detection Badges */}
      <div className="px-4 py-2 border-b border-border/40 bg-muted/10">
        <div className="flex flex-wrap gap-1">
          {detectedFeatures.hasArrays && (
            <Badge variant="outline" className="text-xs gap-1">
              <Table className="h-3 w-3" />
              Array Data
            </Badge>
          )}
          {detectedFeatures.hasNumbers && (
            <Badge variant="outline" className="text-xs gap-1">
              <BarChart3 className="h-3 w-3" />
              Charts Available
            </Badge>
          )}
          {detectedFeatures.hasImages && (
            <Badge variant="outline" className="text-xs gap-1">
              <ImageIcon className="h-3 w-3" />
              Images Found
            </Badge>
          )}
          {detectedFeatures.hasDates && (
            <Badge variant="outline" className="text-xs">
              📅 Dates
            </Badge>
          )}
          {detectedFeatures.hasUrls && (
            <Badge variant="outline" className="text-xs">
              🔗 URLs
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="px-4 pt-3 bg-transparent border-b border-border/40 rounded-none h-auto">
            <TabsTrigger value="tree" className="gap-2">
              <Code className="h-4 w-4" />
              Tree View
            </TabsTrigger>
            
            {detectedFeatures.hasArrays && (
              <TabsTrigger value="table" className="gap-2">
                <Table className="h-4 w-4" />
                Table
              </TabsTrigger>
            )}
            
            {detectedFeatures.hasNumbers && (
              <TabsTrigger value="charts" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Charts
              </TabsTrigger>
            )}

            {detectedFeatures.hasImages && (
              <TabsTrigger value="images" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Images
              </TabsTrigger>
            )}

            <TabsTrigger value="mobile" className="gap-2">
              <Smartphone className="h-4 w-4" />
              Mobile
            </TabsTrigger>

            <TabsTrigger value="snippets" className="gap-2">
              <Code className="h-4 w-4" />
              Code
            </TabsTrigger>
          </TabsList>

          {/* Tree View */}
          <TabsContent value="tree" className="h-[calc(100%-60px)] p-4">
            <div className="rounded-lg border border-border/40 bg-muted/5 p-4 h-full overflow-auto">
              <div className="font-mono text-sm">
                <pre>{JSON.stringify(response, null, 2)}</pre>
              </div>
            </div>
          </TabsContent>

          {/* Table View */}
          {detectedFeatures.hasArrays && (
            <TabsContent value="table" className="h-[calc(100%-60px)] p-4">
              <div className="h-full overflow-auto">
                <div className="rounded-lg border border-border/40 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/30">
                      <tr>
                        {Object.keys(Array.isArray(response) ? response[0] || {} : {}).map((key) => (
                          <th key={key} className="p-3 text-left text-sm font-medium">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {(Array.isArray(response) ? response : [response]).map((item, index) => (
                        <tr key={index} className="hover:bg-muted/10">
                          {Object.values(item).map((value: any, i) => (
                            <td key={i} className="p-3 text-sm">
                              {typeof value === 'object' ? 
                                JSON.stringify(value) : 
                                String(value)
                              }
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          )}

          {/* Charts View */}
          {detectedFeatures.hasNumbers && (
            <TabsContent value="charts" className="h-[calc(100%-60px)] p-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Data Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 flex items-center justify-center border border-border/40 rounded-lg">
                      <span className="text-muted-foreground">Chart visualization</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Images View */}
          {detectedFeatures.hasImages && (
            <TabsContent value="images" className="h-[calc(100%-60px)] p-4">
              <div className="h-full overflow-auto">
                <div className="grid grid-cols-3 gap-4">
                  {/* Extract and display images */}
                  {(() => {
                    const images: string[] = []
                    
                    const extractImages = (obj: any) => {
                      if (Array.isArray(obj)) {
                        obj.forEach(extractImages)
                      } else if (obj && typeof obj === 'object') {
                        Object.values(obj).forEach(extractImages)
                      } else if (typeof obj === 'string' && obj.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                        images.push(obj)
                      }
                    }
                    
                    extractImages(response)
                    
                    return images.map((url, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden border border-border/40">
                        <img 
                          src={url} 
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f0f0f0"/><text x="50" y="50" font-family="Arial" font-size="10" text-anchor="middle" fill="%23999">Image</text></svg>'
                          }}
                        />
                      </div>
                    ))
                  })()}
                </div>
              </div>
            </TabsContent>
          )}

          {/* Mobile Preview */}
          <TabsContent value="mobile" className="h-[calc(100%-60px)] p-4">
            <div className="flex items-center justify-center h-full">
              <div className="relative">
                <div className="w-64 h-[500px] border-4 border-gray-900 rounded-[2rem] overflow-hidden bg-white shadow-xl">
                  {/* Mobile header */}
                  <div className="h-12 bg-gray-900 flex items-center justify-center">
                    <div className="w-16 h-1 bg-gray-700 rounded-full"></div>
                  </div>
                  
                  {/* Mobile content */}
                  <div className="p-4 h-[calc(100%-3rem)] overflow-auto">
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="font-medium text-sm">{endpoint?.name || 'API Response'}</h3>
                        <p className="text-xs text-gray-500">{endpoint?.method} {endpoint?.path}</p>
                      </div>
                      
                      <div className="space-y-2">
                        {Object.entries(response).slice(0, 5).map(([key, value]: [string, any]) => (
                          <div key={key} className="p-2 rounded-lg bg-gray-50">
                            <div className="text-xs text-gray-500">{key}</div>
                            <div className="text-sm truncate">
                              {typeof value === 'object' ? 
                                JSON.stringify(value).slice(0, 50) + '...' : 
                                String(value).slice(0, 50)
                              }
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Code Snippets */}
          <TabsContent value="snippets" className="h-[calc(100%-60px)] p-4">
            <div className="h-full overflow-auto">
              <div className="space-y-4">
                {[
                  {
                    language: 'JavaScript',
                    code: `fetch('${endpoint?.path || '/api'}', {
  method: '${endpoint?.method || 'GET'}',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`
                  },
                  {
                    language: 'Python',
                    code: `import requests

response = requests.${endpoint?.method?.toLowerCase() || 'get'}(
  '${endpoint?.path || '/api'}',
  headers={'Content-Type': 'application/json'}
)

print(response.json())`
                  },
                  {
                    language: 'cURL',
                    code: `curl -X ${endpoint?.method || 'GET'} \\
  '${endpoint?.path || '/api'}' \\
  -H 'Content-Type: application/json'`
                  }
                ].map((snippet) => (
                  <Card key={snippet.language}>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">{snippet.language}</CardTitle>
                    </CardHeader>
                    <CardContent className="py-3">
                      <pre className="text-xs bg-muted/30 p-3 rounded overflow-auto">
                        {snippet.code}
                      </pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Actions Footer */}
      <div className="px-4 py-2 border-t border-border/40 bg-muted/10">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {isArray ? `${response.length} items` : 'Single object'} • Updated just now
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Filter feature
              }}
              className="h-6 gap-1 text-xs"
            >
              <Filter className="h-3 w-3" />
              Filter
            </Button>
            
            {isArray && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Sort feature
                }}
                className="h-6 gap-1 text-xs"
              >
                <SortAsc className="h-3 w-3" />
                Sort
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}