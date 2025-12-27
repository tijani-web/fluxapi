'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Editor, { Monaco } from '@monaco-editor/react'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { 
  Save, 
  Play, 
  Zap, 
  Copy, 
  Check, 
  RefreshCw,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  History,
  Code
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type * as monaco from 'monaco-editor'

interface CodeEditorProps {
  code: string
  endpointId?: string
  projectId: string
  onSave: (code: string) => Promise<void>
  onExecute: () => Promise<void>
  language?: string
  readOnly?: boolean
  isSaving?: boolean
  isExecuting?: boolean
  showLineNumbers?: boolean
  showMinimap?: boolean
  fontSize?: number
  onCodeChange?: (code: string) => void
}

export function CodeEditor({ 
  code: initialCode, 
  endpointId, 
  projectId,
  onSave, 
  onExecute,
  language = 'javascript',
  readOnly = false,
  isSaving = false,
  isExecuting = false,
  showLineNumbers = true,
  showMinimap = true,
  fontSize = 14,
  onCodeChange
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme()
  const [code, setCode] = useState(initialCode)
  const [copied, setCopied] = useState(false)
  const [showLogs, setShowLogs] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [executionLogs, setExecutionLogs] = useState<string[]>([])
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)

  // Track changes
  useEffect(() => {
    setHasUnsavedChanges(code !== initialCode)
  }, [code, initialCode])

  // Editor options
  const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: showMinimap },
    scrollBeyondLastLine: false,
    fontSize,
    lineNumbers: showLineNumbers ? 'on' : 'off',
    roundedSelection: false,
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
      alwaysConsumeMouseWheel: false
    },
    readOnly,
    wordWrap: 'on',
    automaticLayout: true,
    formatOnPaste: true,
    formatOnType: true,
    suggestOnTriggerCharacters: true,
    tabSize: 2,
    insertSpaces: true,
    folding: true,
    foldingHighlight: true,
    showFoldingControls: 'always',
    renderLineHighlight: 'all',
    cursorBlinking: 'blink',
    cursorSmoothCaretAnimation: 'on',
    cursorStyle: 'line',
    renderWhitespace: 'selection',
    renderControlCharacters: false,
    fontLigatures: true,
    fixedOverflowWidgets: true,
    padding: { top: 8, bottom: 8 },
    lineDecorationsWidth: 10,
    lineHeight: 1.6,
    contextmenu: true,
    mouseWheelZoom: true,
    smoothScrolling: true,
  }

  const handleEditorDidMount = (
  editor: monaco.editor.IStandaloneCodeEditor,
  monaco: Monaco
) => {
  editorRef.current = editor
  monacoRef.current = monaco

  // Configure JavaScript language features
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    allowJs: true,
    typeRoots: ["node_modules/@types"],
    strict: true
  })

  // Add custom auto-completion with proper types
  monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems: (
      model: monaco.editor.ITextModel, 
      position: monaco.Position
    ) => {
      const word = model.getWordUntilPosition(position)
      const range: monaco.IRange = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      }

      const suggestions: monaco.languages.CompletionItem[] = [
        {
          label: 'return',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'return ',
          range: range,
          documentation: 'Return statement'
        },
        {
          label: 'await db',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'await db.${1:collection}.findMany({\n  $2\n});',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Query mock database',
          range: range,
          documentation: 'Query the mock database'
        },
        {
          label: 'log',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'console.log(${1:message});',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Log to console',
          range: range,
          documentation: 'Log a message to console'
        },
        {
          label: 'trycatch',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: [
            'try {',
            '\t${1:// code}',
            '} catch (error) {',
            '\treturn {',
            '\t\tsuccess: false,',
            '\t\terror: error.message',
            '\t};',
            '}'
          ].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Try-catch block',
          range: range,
          documentation: 'Try-catch block with error handling'
        },
        {
          label: 'response',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: [
            'return {',
            '\tsuccess: true,',
            '\tdata: ${1:data},',
            '\ttimestamp: new Date().toISOString()',
            '};'
          ].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'API response',
          range: range,
          documentation: 'Standard API response format'
        },
        {
          label: 'errorResponse',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: [
            'return {',
            '\tsuccess: false,',
            '\terror: ${1:errorMessage},',
            '\tstatusCode: ${2:500},',
            '\ttimestamp: new Date().toISOString()',
            '};'
          ].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Error response',
          range: range,
          documentation: 'Standard error response format'
        }
      ]

      return { suggestions }
    }
  })

  // Track cursor position
  editor.onDidChangeCursorPosition((e) => {
    setCursorPosition({
      line: e.position.lineNumber,
      column: e.position.column
    })
  })

  // Add keyboard shortcuts with proper types
  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
    () => handleSave()
  )
  
  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
    () => handleExecute()
  )

  // Add format shortcut
  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
    () => handleFormatCode()
  )

  // Add comment/uncomment
  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash,
    () => {
      const action = editor.getAction('editor.action.commentLine')
      action?.run()
    }
  )
}

  const handleSave = useCallback(async () => {
    if (readOnly || isSaving) return
    
    try {
      await onSave(code)
      setHasUnsavedChanges(false)
      addLog('💾 Changes saved successfully')
    } catch (error: any) {
      addLog(`❌ Save failed: ${error.message}`)
      throw error
    }
  }, [code, readOnly, isSaving, onSave])

  const handleExecute = useCallback(async () => {
    if (isExecuting) return
    
    addLog('🚀 Starting execution...')
    try {
      const startTime = Date.now()
      await onExecute()
      const endTime = Date.now()
      addLog(`✅ Execution completed in ${endTime - startTime}ms`)
    } catch (error: any) {
      addLog(`❌ Execution failed: ${error.message}`)
      throw error
    }
  }, [isExecuting, onExecute])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    addLog('📋 Code copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run()
      addLog('✨ Code formatted')
    }
  }

  const handleUndo = () => {
    if (editorRef.current) {
      editorRef.current.getAction('undo')?.run()
    }
  }

  const handleRedo = () => {
    if (editorRef.current) {
      editorRef.current.getAction('redo')?.run()
    }
  }

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
    setExecutionLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 50)])
  }

  const clearLogs = () => {
    setExecutionLogs([])
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const codeSnippets = [
    {
      name: 'Basic Response',
      code: `// Return JSON response
return {
  success: true,
  message: "API is working!",
  timestamp: new Date().toISOString(),
  data: {
    // Your data here
  }
};`
    },
    {
      name: 'Error Handler',
      code: `// Handle errors
try {
  const result = await performOperation();
  return { success: true, data: result };
} catch (error) {
  return {
    success: false,
    error: error.message,
    statusCode: 500,
    timestamp: new Date().toISOString()
  };
}`
    },
    {
      name: 'Database Query',
      code: `// Query mock data
const users = await db.users.findMany({
  where: { active: true },
  take: 10
});

return {
  success: true,
  data: users,
  count: users.length
};`
    },
    {
      name: 'Validation',
      code: `// Validate request
if (!request.body || !request.body.email) {
  return {
    success: false,
    error: "Email is required",
    statusCode: 400
  };
}`
    }
  ]

  const insertSnippet = (snippet: string) => {
    if (editorRef.current) {
      const selection = editorRef.current.getSelection()
      const id = { major: 1, minor: 1 }
      const op = {
        identifier: id,
        range: selection!,
        text: snippet,
        forceMoveMarkers: true
      }
      editorRef.current.executeEdits("snippet-insert", [op])
      addLog(`📝 Inserted snippet`)
    }
  }

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || ''
    setCode(newCode)
    setHasUnsavedChanges(newCode !== initialCode)
    onCodeChange?.(newCode)
  }

  return (
    <div className={cn(
      "h-full flex flex-col border border-border/40 rounded-lg overflow-hidden",
      isFullscreen && "fixed inset-0 z-50 rounded-none"
    )}>
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-muted/20">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">
            {language.toUpperCase()}
          </Badge>
          
          {endpointId && (
            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
              {endpointId.slice(0, 8)}...
            </span>
          )}
          
          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/20">
              Unsaved
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* History Controls */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleUndo}
            className="h-7 w-7"
            disabled={readOnly}
          >
            <History className="h-3.5 w-3.5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRedo}
            className="h-7 w-7"
            disabled={readOnly}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>

          {/* Code Actions */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFormatCode}
            className="h-7 gap-1.5"
            disabled={readOnly}
          >
            <Code className="h-3.5 w-3.5" />
            Format
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyCode}
            className="h-7 gap-1.5"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            Copy
          </Button>

          {/* Save Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving || readOnly || !hasUnsavedChanges}
            className="h-7 gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? 'Saving...' : 'Save'}
            <span className="text-xs opacity-60">Ctrl+S</span>
          </Button>

          {/* Execute Button */}
          <Button
            size="sm"
            onClick={handleExecute}
            disabled={isExecuting}
            className="h-7 gap-1.5"
          >
            {isExecuting ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                Run
                <span className="text-xs opacity-60">Ctrl+Enter</span>
              </>
            )}
          </Button>

          {/* Fullscreen Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="h-7 w-7"
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Code Snippets Bar */}
      <div className="px-4 py-2 border-b border-border/40 bg-muted/10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">Snippets:</span>
          <div className="flex flex-wrap gap-1">
            {codeSnippets.map((snippet, index) => (
              <button
                key={index}
                onClick={() => insertSnippet(snippet.code)}
                className="text-xs px-2 py-1 rounded border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={readOnly}
              >
                {snippet.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          value={code}
          theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
          options={editorOptions}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          className="min-h-[300px]"
        />
      </div>

      {/* Status Bar */}
      <div className="px-4 py-1.5 border-t border-border/40 bg-muted/20 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Ln</span>
            <span className="font-mono">{cursorPosition.line}</span>
            <span className="text-muted-foreground">, Col</span>
            <span className="font-mono">{cursorPosition.column}</span>
          </div>
          
          <div className="text-muted-foreground">
            {code.length} chars • {code.split('\n').length} lines
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="flex items-center gap-1 hover:text-foreground/80"
          >
            {showLogs ? (
              <EyeOff className="h-3 w-3" />
            ) : (
              <Eye className="h-3 w-3" />
            )}
            {showLogs ? 'Hide Logs' : 'Show Logs'}
          </button>
          
          <div className="text-muted-foreground hidden sm:block">
            <kbd className="px-1.5 py-0.5 rounded border border-border/40">Ctrl+S</kbd> save • 
            {' '}<kbd className="px-1.5 py-0.5 rounded border border-border/40">Ctrl+Enter</kbd> run
          </div>
        </div>
      </div>

      {/* Execution Logs Panel */}
      {showLogs && (
        <div className="border-t border-border/40 h-48 overflow-auto">
          <div className="px-4 py-2 border-b border-border/40 bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">Execution Logs</span>
              <Badge variant="secondary" className="h-5 text-xs">
                {executionLogs.length}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearLogs}
                className="h-6 px-2 text-xs"
              >
                Clear
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLogs(false)}
                className="h-6 px-2"
              >
                <EyeOff className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="p-4 font-mono text-sm">
            {executionLogs.length > 0 ? (
              <div className="space-y-1">
                {executionLogs.map((log, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "flex items-start gap-2 p-1.5 rounded",
                      log.includes('❌') && "bg-destructive/5 text-destructive",
                      log.includes('✅') && "bg-green-500/5 text-green-600",
                      log.includes('💾') && "bg-blue-500/5 text-blue-600",
                      log.includes('✨') && "bg-purple-500/5 text-purple-600",
                      log.includes('🚀') && "bg-amber-500/5 text-amber-600",
                    )}
                  >
                    <span className="flex-1">{log}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No execution logs yet. Run your code to see logs here.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}