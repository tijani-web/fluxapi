// app/project/[id]/components/tables/DataTable.tsx
'use client'

import { useState } from 'react'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash2, Edit, Check, X } from 'lucide-react'

interface DataTableProps {
  data: any[]
  onDataChange?: (data: any[]) => void
  editable?: boolean
}

export function DataTable({ data, onDataChange, editable = false }: DataTableProps) {
  const [editingCell, setEditingCell] = useState<{row: number; col: string} | null>(null)
  const [editValue, setEditValue] = useState('')

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">No data available</div>
      </div>
    )
  }

  const headers = Object.keys(data[0] || {})

  const handleEdit = (rowIndex: number, colName: string) => {
    setEditingCell({ row: rowIndex, col: colName })
    setEditValue(String(data[rowIndex][colName]))
  }

  const handleSave = () => {
    if (editingCell && onDataChange) {
      const newData = [...data]
      const originalValue = newData[editingCell.row][editingCell.col]
      
      // Try to preserve type
      let finalValue: any = editValue
      if (typeof originalValue === 'number') {
        finalValue = isNaN(Number(editValue)) ? editValue : Number(editValue)
      } else if (typeof originalValue === 'boolean') {
        finalValue = editValue.toLowerCase() === 'true'
      } else if (typeof originalValue === 'object') {
        try {
          finalValue = JSON.parse(editValue)
        } catch {
          finalValue = editValue
        }
      }
      
      newData[editingCell.row] = {
        ...newData[editingCell.row],
        [editingCell.col]: finalValue
      }
      onDataChange(newData)
    }
    setEditingCell(null)
    setEditValue('')
  }

  const handleCancel = () => {
    setEditingCell(null)
    setEditValue('')
  }

  const handleDeleteRow = (rowIndex: number) => {
    if (onDataChange) {
      const newData = data.filter((_, index) => index !== rowIndex)
      onDataChange(newData)
    }
  }

  return (
    <div className="border rounded-lg overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map(header => (
              <TableHead key={header} className="font-medium">
                {header}
              </TableHead>
            ))}
            {editable && <TableHead className="w-[100px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {headers.map(header => (
                <TableCell key={header} className="max-w-[200px] truncate">
                  {editingCell?.row === rowIndex && editingCell?.col === header ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="h-8"
                        autoFocus
                      />
                      <div className="flex gap-1">
                        <Button size="icon" className="h-7 w-7" onClick={handleSave}>
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleCancel}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className={`truncate ${editable ? 'cursor-pointer hover:bg-muted/50 p-1 rounded' : ''}`}
                      onClick={() => editable && handleEdit(rowIndex, header)}
                      title={String(row[header])}
                    >
                      {typeof row[header] === 'object' 
                        ? JSON.stringify(row[header])
                        : String(row[header])}
                    </div>
                  )}
                </TableCell>
              ))}
              {editable && (
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleEdit(rowIndex, headers[0])}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => handleDeleteRow(rowIndex)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="px-4 py-2 border-t text-sm text-muted-foreground">
        Showing {data.length} rows
      </div>
    </div>
  )
}