'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle2,
  Circle,
  Plus,
  X,
  Calendar,
  Clock,
  AlertTriangle
} from 'lucide-react'
import { ActionItem } from '@/lib/firebase'
import { actionItemsService } from '@/lib/database'

interface ActionItemManagerProps {
  goalId: string
  onProgressUpdate?: (percentage: number) => void
}

export default function ActionItemManager({ goalId, onProgressUpdate }: ActionItemManagerProps) {
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [newItem, setNewItem] = useState({ description: '', dueDate: '' })
  const [isAdding, setIsAdding] = useState(false)

  const loadActionItems = useCallback(async () => {
    try {
      const { data, error } = await actionItemsService.getAll(goalId)

      if (error) throw error
      setActionItems(data || [])

      // Calculate and update progress
      if (data && data.length > 0) {
        const completedCount = data.filter(item => item.isCompleted).length
        const progressPercentage = Math.round((completedCount / data.length) * 100)
        onProgressUpdate?.(progressPercentage)
      }
    } catch (error) {
      console.error('Error loading action items:', error)
    } finally {
      setLoading(false)
    }
  }, [goalId, onProgressUpdate])

  useEffect(() => {
    loadActionItems()
  }, [loadActionItems])

  const addActionItem = async () => {
    if (!newItem.description.trim()) return

    try {
      const actionItemData = {
        goalId: goalId,
        actionDescription: newItem.description.trim(),
        dueDate: newItem.dueDate || undefined,
        isCompleted: false
      }

      const { data, error } = await actionItemsService.create(actionItemData)

      if (error) throw error

      setActionItems(prev => [...prev, data!])
      setNewItem({ description: '', dueDate: '' })
      setIsAdding(false)

      // Update progress
      const completedCount = actionItems.filter(item => item.isCompleted).length
      const totalCount = actionItems.length + 1
      const progressPercentage = Math.round((completedCount / totalCount) * 100)
      onProgressUpdate?.(progressPercentage)
    } catch (error) {
      console.error('Error adding action item:', error)
      alert('Error adding action item')
    }
  }

  const toggleActionItem = async (id: string, isCompleted: boolean | undefined) => {
    const currentlyCompleted = Boolean(isCompleted)

    try {
      const updates = {
        isCompleted: !currentlyCompleted,
        completedAt: !currentlyCompleted ? new Date().toISOString() : undefined
      }

      const { error } = await actionItemsService.update(id, updates)

      if (error) throw error

      setActionItems(prev =>
        prev.map(item =>
          item.id === id
            ? {
                ...item,
                isCompleted: !currentlyCompleted,
                completedAt: !currentlyCompleted ? new Date().toISOString() : undefined
              }
            : item
        )
      )

      // Update progress
      const updatedItems = actionItems.map(item =>
        item.id === id ? { ...item, isCompleted: !currentlyCompleted } : item
      )
      const completedCount = updatedItems.filter(item => item.isCompleted).length
      const progressPercentage = Math.round((completedCount / actionItems.length) * 100)
      onProgressUpdate?.(progressPercentage)
    } catch (error) {
      console.error('Error updating action item:', error)
      alert('Error updating action item')
    }
  }

  const deleteActionItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this action item?')) return

    try {
      const { error } = await actionItemsService.delete(id)

      if (error) throw error

      const updatedItems = actionItems.filter(item => item.id !== id)
      setActionItems(updatedItems)

      // Update progress
      if (updatedItems.length > 0) {
        const completedCount = updatedItems.filter(item => item.isCompleted).length
        const progressPercentage = Math.round((completedCount / updatedItems.length) * 100)
        onProgressUpdate?.(progressPercentage)
      } else {
        onProgressUpdate?.(0)
      }
    } catch (error) {
      console.error('Error deleting action item:', error)
      alert('Error deleting action item')
    }
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getItemStatus = (item: ActionItem) => {
    if (item.isCompleted) return 'completed'
    if (!item.dueDate) return 'no-date'

    const daysUntilDue = getDaysUntilDue(item.dueDate)
    if (daysUntilDue < 0) return 'overdue'
    if (daysUntilDue === 0) return 'due-today'
    if (daysUntilDue <= 3) return 'due-soon'
    return 'normal'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200'
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200'
      case 'due-today': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'due-soon': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const completedCount = actionItems.filter(item => item.isCompleted).length
  const totalCount = actionItems.length
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2 text-blue-600" />
            Action Items ({completedCount}/{totalCount})
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Item
          </Button>
        </div>
        
        {totalCount > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add New Item Form */}
        {isAdding && (
          <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
            <CardContent className="p-4 space-y-3">
              <div>
                <Label htmlFor="newDescription">Action Description</Label>
                <Input
                  id="newDescription"
                  placeholder="Describe the specific action to take..."
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="newDueDate">Due Date (optional)</Label>
                <Input
                  id="newDueDate"
                  type="date"
                  value={newItem.dueDate}
                  onChange={(e) => setNewItem(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="mt-1 w-auto"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={addActionItem}
                  disabled={!newItem.description.trim()}
                  size="sm"
                >
                  Add Item
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false)
                    setNewItem({ description: '', dueDate: '' })
                  }}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Items List */}
        {actionItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No action items yet</p>
            <p className="text-sm">Break down your goal into manageable action steps</p>
          </div>
        ) : (
          <div className="space-y-3">
            {actionItems.map((item) => {
              const status = getItemStatus(item)
              const statusColors = getStatusColor(status)
              
              return (
                <Card key={item.id} className={`border-l-4 ${statusColors} transition-all hover:shadow-md`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => toggleActionItem(item.id, item.isCompleted ?? false)}
                        className="mt-1 hover:scale-110 transition-transform"
                      >
                        {item.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400 hover:text-blue-600" />
                        )}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${item.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {item.actionDescription}
                        </p>
                        
                        <div className="flex items-center space-x-4 mt-2">
                          {item.dueDate && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>
                                Due: {new Date(item.dueDate).toLocaleDateString()}
                                {(() => {
                                  const daysUntilDue = getDaysUntilDue(item.dueDate)
                                  if (daysUntilDue < 0) return ` (${Math.abs(daysUntilDue)} days overdue)`
                                  if (daysUntilDue === 0) return ' (Today!)'
                                  if (daysUntilDue <= 7) return ` (${daysUntilDue} days)`
                                  return ''
                                })()}
                              </span>
                              {(() => {
                                const daysUntilDue = getDaysUntilDue(item.dueDate)
                                if (daysUntilDue < 0) return <AlertTriangle className="w-4 h-4 ml-1 text-red-500" />
                                if (daysUntilDue === 0) return <Clock className="w-4 h-4 ml-1 text-orange-500" />
                                return null
                              })()}
                            </div>
                          )}
                          
                          {item.completedAt && (
                            <Badge variant="secondary" className="text-xs">
                              Completed {new Date(item.completedAt).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteActionItem(item.id)}
                        className="text-gray-400 hover:text-red-600 hover:scale-110 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 