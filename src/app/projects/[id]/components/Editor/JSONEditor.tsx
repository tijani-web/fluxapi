// app/project/[id]/components/editor/JSONEditor.tsx
'use client'

import { useEffect, useState } from 'react'

interface JSONEditorProps {
  data: any
  onChange: (data: any) => void
  height?: string
  readOnly?: boolean
}

export function JSONEditor({ data, onChange, height = '400px', readOnly = false }: JSONEditorProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Format JSON for display
  useEffect(() => {
    try {
      setText(JSON.stringify(data, null, 2))
      setError(null)
    } catch (e) {
      setError('Invalid JSON')
    }
  }, [data])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)
    
    try {
      const parsed = JSON.parse(newText)
      setError(null)
      onChange(parsed)
    } catch (e) {
      setError('Invalid JSON')
    }
  }

  return (
    <div className="relative border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
        <div className="text-sm font-medium">JSON Editor</div>
        <div className="flex items-center gap-2">
          {error && (
            <div className="text-xs text-red-500 px-2 py-1 bg-red-500/10 rounded">
              Invalid JSON
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            {Array.isArray(data) ? `${data.length} items` : 'Object'}
          </div>
        </div>
      </div>
      
      <textarea
        value={text}
        onChange={handleChange}
        readOnly={readOnly}
        className={`w-full font-mono text-sm p-4 ${readOnly ? 'bg-muted' : 'bg-background'}`}
        style={{ 
          height: `calc(${height} - 40px)`,
          resize: 'vertical',
          minHeight: '200px'
        }}
        spellCheck={false}
      />
      
      <div className="px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground">
        {readOnly ? 'Read only' : 'Edit JSON directly. Changes are auto-saved.'}
      </div>
    </div>
  )
}