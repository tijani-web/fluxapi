'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X } from 'lucide-react'
import { HTTP_METHOD } from 'next/dist/server/web/http'

interface CreateEndpointModalProps {
  projectId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: (endpoint: any) => void
}

type FormData = {
  name: string
  path: string
  method: string
  description: string
}

export function CreateEndpointModal({ projectId, isOpen, onClose, onSuccess }: CreateEndpointModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: {
      name: '',
      path: '',
      method: 'GET',
      description: ''
    }
  })
  
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const endpoint = await api.createEndpoint(projectId, {
        name: data.name,
        path: data.path.startsWith('/') ? data.path : `/${data.path}`,
        method: data.method as HTTP_METHOD,
        description: data.description,
        code: `// ${data.name} endpoint\nreturn { \n  success: true, \n  message: "${data.name} endpoint working",\n  data: {},\n  timestamp: new Date().toISOString()\n};`
      })
      
      onSuccess(endpoint)
      onClose()
      reset()
    } catch (error: any) {
      console.error('Failed to create endpoint:', error)
      alert(error.message || 'Failed to create endpoint')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background p-6 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Create New Endpoint</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Endpoint Name *</Label>
            <Input
              id="name"
              {...register('name', { required: 'Name is required' })}
              placeholder="Get Users"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="path">Path *</Label>
            <div className="flex">
              <div className="flex items-center px-3 border border-r-0 rounded-l bg-muted">
                /
              </div>
              <Input
                id="path"
                {...register('path', { 
                  required: 'Path is required',
                  pattern: {
                    value: /^[a-zA-Z0-9_\-/]+$/,
                    message: 'Invalid path format'
                  }
                })}
                placeholder="api/users"
                className="rounded-l-none"
              />
            </div>
            {errors.path && (
              <p className="text-sm text-red-500 mt-1">{errors.path.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="method">Method</Label>
            <Select 
              {...register('method')}
              defaultValue="GET"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="HEAD">HEAD</SelectItem>
                <SelectItem value="OPTIONS">OPTIONS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="What does this endpoint do?"
              rows={2}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Endpoint'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}