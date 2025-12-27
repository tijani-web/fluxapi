'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2,
  Play,
  Save,
  Download,
  Code as CodeIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  showLineNumbers?: boolean
  showCopyButton?: boolean
  showRunButton?: boolean
  showSaveButton?: boolean
  showExpandButton?: boolean
  editable?: boolean
  className?: string
  onCopy?: (code: string) => void
  onRun?: () => void
  onSave?: (code: string) => void
  onCodeChange?: (code: string) => void
}

export function CodeBlock({ 
  code, 
  language = 'javascript',
  title,
  showLineNumbers = true,
  showCopyButton = true,
  showRunButton = false,
  showSaveButton = false,
  showExpandButton = true,
  editable = false,
  className,
  onCopy,
  onRun,
  onSave,
  onCodeChange
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [localCode, setLocalCode] = useState(code)

  const handleCopy = () => {
    navigator.clipboard.writeText(localCode)
    setCopied(true)
    onCopy?.(localCode)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRun = () => {
    onRun?.()
  }

  const handleSave = () => {
    onSave?.(localCode)
  }

  const handleDownload = () => {
    const blob = new Blob([localCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = title ? `${title}.${getFileExtension(language)}` : `code.${getFileExtension(language)}`
    a.click()
  }

  const getFileExtension = (lang: string) => {
    switch (lang) {
      case 'javascript': return 'js'
      case 'typescript': return 'ts'
      case 'python': return 'py'
      case 'java': return 'java'
      case 'html': return 'html'
      case 'css': return 'css'
      case 'json': return 'json'
      default: return 'txt'
    }
  }

  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      javascript: 'JavaScript',
      typescript: 'TypeScript',
      python: 'Python',
      java: 'Java',
      html: 'HTML',
      css: 'CSS',
      json: 'JSON',
      bash: 'Bash',
      sql: 'SQL',
      markdown: 'Markdown'
    }
    return labels[lang] || lang
  }

  const formatCode = () => {
    try {
      if (language === 'json') {
        return JSON.stringify(JSON.parse(localCode), null, 2)
      }
      return localCode
    } catch {
      return localCode
    }
  }

  const formattedCode = formatCode()
  const lines = formattedCode.split('\n')

  return (
    <div className={cn(
      "rounded-lg border border-border/40 overflow-hidden bg-card",
      expanded && "fixed inset-4 z-50",
      className
    )}>
      {/* Header */}
      <div className="px-4 py-2 border-b border-border/40 bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CodeIcon className="h-4 w-4" />
          {title && (
            <span className="text-sm font-medium truncate">{title}</span>
          )}
          <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary font-mono">
            {getLanguageLabel(language)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {showCopyButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 gap-1"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              Copy
            </Button>
          )}

          {showRunButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRun}
              className="h-7 gap-1"
            >
              <Play className="h-3.5 w-3.5" />
              Run
            </Button>
          )}

          {showSaveButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="h-7 gap-1"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-7 gap-1"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>

          {showExpandButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="h-7 gap-1"
            >
              {expanded ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Code Content */}
      <div className="relative">
        {showLineNumbers && (
          <div className="absolute left-0 top-0 bottom-0 bg-muted/30 border-r border-border/40 select-none overflow-hidden">
            {lines.map((_, index) => (
              <div
                key={index}
                className="px-3 py-1 text-xs text-muted-foreground font-mono text-right"
                style={{ minWidth: '3rem' }}
              >
                {index + 1}
              </div>
            ))}
          </div>
        )}

        {editable ? (
          <textarea
            value={localCode}
            onChange={(e) => {
              setLocalCode(e.target.value)
              onCodeChange?.(e.target.value)
            }}
            className={cn(
              "w-full font-mono text-sm bg-transparent p-4 focus:outline-none resize-none",
              showLineNumbers && "pl-14"
            )}
            style={{
              minHeight: '200px',
              lineHeight: '1.6',
              tabSize: '2'
            }}
            spellCheck="false"
          />
        ) : (
          <pre
            className={cn(
              "font-mono text-sm p-4 overflow-auto",
              showLineNumbers && "pl-14",
              language === 'javascript' && "text-blue-400",
              language === 'typescript' && "text-blue-300",
              language === 'python' && "text-yellow-400",
              language === 'html' && "text-red-400",
              language === 'css' && "text-purple-400",
              language === 'json' && "text-green-400"
            )}
            style={{
              minHeight: '200px',
              lineHeight: '1.6',
              tabSize: '2'
            }}
          >
            {formattedCode}
          </pre>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-1.5 border-t border-border/40 bg-muted/10 text-xs text-muted-foreground flex items-center justify-between">
        <div>
          {lines.length} lines • {formattedCode.length} characters
        </div>
        <div>
          Language: {getLanguageLabel(language)}
        </div>
      </div>
    </div>
  )
}