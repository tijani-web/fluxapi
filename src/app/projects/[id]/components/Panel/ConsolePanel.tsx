'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Terminal, Trash2, Download, Filter } from 'lucide-react'

export function ConsolePanel() {
  const [logs, setLogs] = useState([
    { id: 1, type: 'info', message: 'Project loaded successfully', timestamp: new Date().toISOString() },
    { id: 2, type: 'success', message: 'Endpoint GET /api/users executed in 142ms', timestamp: new Date().toISOString() },
    { id: 3, type: 'warning', message: 'Mock data collection "users" has no data', timestamp: new Date().toISOString() },
    { id: 4, type: 'error', message: 'Syntax error in endpoint code: Unexpected token', timestamp: new Date().toISOString() },
    { id: 5, type: 'info', message: 'Auto-save completed', timestamp: new Date().toISOString() },
  ])
  const [filter, setFilter] = useState<'all' | 'info' | 'success' | 'warning' | 'error'>('all')

  const filteredLogs = logs.filter(log => filter === 'all' || log.type === filter)

  const clearLogs = () => {
    setLogs([])
  }

  const exportLogs = () => {
    const data = JSON.stringify(logs, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'console-logs.json'
    a.click()
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-500 bg-green-500/10 border-green-500/20'
      case 'warning': return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
      case 'error': return 'text-red-500 bg-red-500/10 border-red-500/20'
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Console Header */}
      <div className="px-4 py-2 border-b border-border/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4" />
          <span className="font-medium">Console</span>
          <span className="text-xs text-muted-foreground">({logs.length} logs)</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex border border-border/40 rounded overflow-hidden">
            {(['all', 'info', 'success', 'warning', 'error'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-2 py-1 text-xs capitalize transition-colors ${
                  filter === type 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-muted/50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={exportLogs}
            className="h-7 gap-1"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearLogs}
            className="h-7 gap-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </Button>
        </div>
      </div>

      {/* Console Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-2">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className={`p-3 rounded-lg border ${getTypeColor(log.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium capitalize">
                      {log.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        second: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p className="text-sm font-mono">{log.message}</p>
                </div>
              </div>
            </div>
          ))}
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No logs to display
            </div>
          )}
        </div>
      </div>

      {/* Console Input */}
      <div className="px-4 py-2 border-t border-border/40">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              &gt;
            </span>
            <input
              type="text"
              placeholder="Type a command... (coming soon)"
              className="w-full pl-8 pr-4 py-2 rounded-lg border border-border/40 bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
              disabled
            />
          </div>
          <Button size="sm" disabled>
            Execute
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Console commands will be available in future updates
        </p>
      </div>
    </div>
  )
}