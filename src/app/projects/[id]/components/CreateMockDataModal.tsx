'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { X } from 'lucide-react'

interface CreateMockDataModalProps {
  projectId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateMockDataModal({ projectId, isOpen, onClose, onSuccess }: CreateMockDataModalProps) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    schema: '[]'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert('Please enter a name')
      return
    }

    try {
      setLoading(true)
      let initialData
      try {
        initialData = JSON.parse(form.schema || '[]')
      } catch {
        initialData = []
      }

      await api.createMockDataCollection(projectId, {
        name: form.name,
        description: form.description,
        initialData
      })

      onSuccess()
      onClose()
      setForm({ name: '', description: '', schema: '[]' })
    } catch (error: any) {
      alert(error.message || 'Failed to create mock data')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background p-6 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Create Mock Data Collection</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label>Collection Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              placeholder="users"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              placeholder="Collection of user data"
              rows={2}
            />
          </div>

          <div>
            <Label>Initial Data (JSON array)</Label>
            <Textarea
              value={form.schema}
              onChange={(e) => setForm({...form, schema: e.target.value})}
              placeholder='[{"id": 1, "name": "John"}]'
              rows={4}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter JSON array of objects
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Creating...' : 'Create Collection'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}