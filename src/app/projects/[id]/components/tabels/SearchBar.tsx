// app/project/[id]/components/search/SearchBar.tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, X } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  withFilters?: boolean
}

export function SearchBar({ onSearch, placeholder = "Search...", withFilters = false }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = () => {
    onSearch(query)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-9"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
              onClick={() => {
                setQuery('')
                onSearch('')
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
        
        {withFilters && (
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        )}
      </div>
      
      {showFilters && withFilters && (
        <div className="border rounded-lg p-4 bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <select className="w-full p-2 border rounded text-sm">
                <option value="all">All Types</option>
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="date">Date</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Contains</label>
              <Input placeholder="Text to match" className="text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <select className="w-full p-2 border rounded text-sm">
                <option value="name">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="date">Date (Newest)</option>
                <option value="date-desc">Date (Oldest)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => setShowFilters(false)}>
              Cancel
            </Button>
            <Button size="sm">
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}