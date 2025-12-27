'use client'

import { useState } from 'react'
import { Endpoint } from '@/types/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Copy, 
  Check, 
  Download, 
  Eye, 
  Code2,
  Terminal,
  Globe,
  Shield,
  Clock,
  FileText
} from 'lucide-react'

interface DocsPanelProps {
  endpoint: Endpoint
  endpoints: Endpoint[]
}

export function DocsPanel({ endpoint, endpoints }: DocsPanelProps) {
  // Add null check at the VERY TOP
  if (!endpoint || typeof endpoint !== 'object') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Loading endpoint documentation...</p>
        </div>
      </div>
    )
  }

  const [copied, setCopied] = useState(false)
  const [activeExample, setActiveExample] = useState('javascript')

  // Now safe to use endpoint.method
  const methodColor = endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-600 border-blue-500/30' :
                     endpoint.method === 'POST' ? 'bg-green-500/20 text-green-600 border-green-500/30' :
                     endpoint.method === 'PUT' ? 'bg-amber-500/20 text-amber-600 border-amber-500/30' :
                     endpoint.method === 'DELETE' ? 'bg-red-500/20 text-red-600 border-red-500/30' :
                     'bg-gray-500/20 text-gray-600 border-gray-500/30'

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Safe check for window
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  const examples = {
    javascript: `fetch('${baseUrl}/api/proxy/${endpoint.id}', {
  method: '${endpoint.method}',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify({
    // Request body
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`,

    python: `import requests

response = requests.${endpoint.method.toLowerCase()}(
    '${baseUrl}/api/proxy/${endpoint.id}',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN'
    },
    json={
        # Request body
    }
)

print(response.json())`,

    curl: `curl -X ${endpoint.method} \\
  '${baseUrl}/api/proxy/${endpoint.id}' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer YOUR_TOKEN' \\
  -d '{
    "key": "value"
  }'`,

    php: `<?php

$ch = curl_init('${baseUrl}/api/proxy/${endpoint.id}');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, '${endpoint.method}');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer YOUR_TOKEN'
]);

if (${endpoint.method === 'POST' || endpoint.method === 'PUT'}) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'key' => 'value'
    ]));
}

$response = curl_exec($ch);
curl_close($ch);

echo $response;`
  }

  const generateOpenAPISpec = () => {
    return {
      openapi: '3.0.0',
      info: {
        title: endpoint.name || 'Untitled Endpoint',
        description: endpoint.description || '',
        version: '1.0.0'
      },
      paths: {
        [endpoint.path || '/']: {
          [endpoint.method.toLowerCase()]: {
            summary: endpoint.name || 'Untitled Endpoint',
            description: endpoint.description || '',
            responses: {
              '200': {
                description: 'Successful response',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean' },
                        data: { type: 'object' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Endpoint Overview */}
      <div className="rounded-lg border border-border/40 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className={methodColor}>
                {endpoint.method || 'GET'}
              </Badge>
              <h2 className="text-2xl font-bold">{endpoint.name || 'Untitled Endpoint'}</h2>
            </div>
            <p className="text-muted-foreground">{endpoint.description || 'No description provided'}</p>
          </div>
          
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export OpenAPI
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Path</p>
              <p className="font-mono">{endpoint.path || '/'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Executions</p>
              <p className="font-semibold">{endpoint.callCount || 0}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={endpoint.isActive ? 'default' : 'secondary'}>
                {endpoint.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="text-sm">
                {endpoint.updatedAt ? new Date(endpoint.updatedAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="rounded-lg border border-border/40 overflow-hidden">
        <div className="px-4 py-3 border-b border-border/40 bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            <h3 className="font-medium">Code Examples</h3>
          </div>
          
          <div className="flex gap-1">
            {Object.keys(examples).map((lang) => (
              <Button
                key={lang}
                variant={activeExample === lang ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveExample(lang)}
                className="h-7 capitalize"
              >
                {lang}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="p-4">
          <div className="rounded-lg bg-muted/30 p-4 overflow-auto relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyCode(examples[activeExample as keyof typeof examples])}
              className="absolute top-2 right-2 h-7 gap-1"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            
            <pre className="text-sm font-mono whitespace-pre-wrap pt-6">
              {examples[activeExample as keyof typeof examples]}
            </pre>
          </div>
        </div>
      </div>

      {/* API Reference */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Request Parameters */}
        <div className="rounded-lg border border-border/40 overflow-hidden">
          <div className="px-4 py-3 border-b border-border/40 bg-muted/20">
            <h3 className="font-medium flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Request Parameters
            </h3>
          </div>
          
          <div className="p-4">
            {endpoint.queryParams && Object.keys(endpoint.queryParams).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(endpoint.queryParams).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-2 rounded bg-muted/30">
                    <div>
                      <span className="font-mono font-medium">{key}</span>
                      <p className="text-xs text-muted-foreground">Query parameter</p>
                    </div>
                    <span className="font-mono text-sm">{String(value)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No query parameters defined</p>
            )}
          </div>
        </div>

        {/* Headers */}
        <div className="rounded-lg border border-border/40 overflow-hidden">
          <div className="px-4 py-3 border-b border-border/40 bg-muted/20">
            <h3 className="font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Request Headers
            </h3>
          </div>
          
          <div className="p-4">
            {endpoint.headers && Object.keys(endpoint.headers).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(endpoint.headers).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-2 rounded bg-muted/30">
                    <div>
                      <span className="font-mono font-medium">{key}</span>
                      <p className="text-xs text-muted-foreground">Header</p>
                    </div>
                    <span className="font-mono text-sm">{String(value)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No custom headers defined</p>
            )}
          </div>
        </div>
      </div>

      {/* Response Schema */}
      <div className="rounded-lg border border-border/40 overflow-hidden">
        <div className="px-4 py-3 border-b border-border/40 bg-muted/20">
          <h3 className="font-medium flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Response Schema
          </h3>
        </div>
        
        <div className="p-4">
          {endpoint.responseSchema ? (
            <div className="rounded-lg bg-muted/30 p-4 overflow-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap">
                {JSON.stringify(endpoint.responseSchema, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">No response schema defined. Here's a typical response:</p>
              
              <div className="rounded-lg bg-muted/30 p-4 overflow-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap">
{`{
  "success": true,
  "data": {
    // Your response data here
  },
  "timestamp": "2024-01-15T10:30:00Z"
}`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Try It Out */}
      <div className="rounded-lg border border-border/40 p-6 text-center">
        <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
          <Eye className="h-6 w-6 text-primary" />
        </div>
        
        <h3 className="text-xl font-bold mb-2">Try it out</h3>
        <p className="text-muted-foreground mb-4">
          Test this endpoint directly from the Test tab
        </p>
        
        <div className="flex gap-3 justify-center">
          <Button variant="outline" className="gap-2">
            <Terminal className="h-4 w-4" />
            Open in Test Panel
          </Button>
          <Button className="gap-2">
            <BookOpen className="h-4 w-4" />
            View Full Documentation
          </Button>
        </div>
      </div>
    </div>
  )
}