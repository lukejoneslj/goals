'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Plus, 
  CheckCircle2,
  Circle,
  Edit3,
  Trash2,
  Brain,
  Heart,
  Users,
  Dumbbell,
  Filter,
  X,
  ListTodo
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Todo, UserELO } from '@/lib/firebase'
import { todosService, userELOService } from '@/lib/database'
import { getTodayLocalDateString } from '@/lib/utils'
import DashboardNav from '@/components/DashboardNav'

const categoryConfig = {
  spiritual: {
    icon: Heart,
    color: 'from-purple-300 to-purple-400',
    textColor: 'text-purple-500',
    bgColor: 'bg-purple-50/50',
    borderColor: 'border-purple-300',
    title: '🙏 Spiritual'
  },
  physical: {
    icon: Dumbbell,
    color: 'from-rose-300 to-rose-400',
    textColor: 'text-rose-500',
    bgColor: 'bg-rose-50/50',
    borderColor: 'border-rose-300',
    title: '💪 Physical'
  },
  social: {
    icon: Users,
    color: 'from-emerald-300 to-emerald-400',
    textColor: 'text-emerald-500',
    bgColor: 'bg-emerald-50/50',
    borderColor: 'border-emerald-300',
    title: '👥 Social'
  },
  intellectual: {
    icon: Brain,
    color: 'from-blue-300 to-blue-400',
    textColor: 'text-blue-500',
    bgColor: 'bg-blue-50/50',
    borderColor: 'border-blue-300',
    title: '🧠 Intellectual'
  }
}

type CategoryFilter = 'all' | 'spiritual' | 'physical' | 'social' | 'intellectual'

export default function TodosPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [selectedDate, setSelectedDate] = useState(getTodayLocalDateString())
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [userELO, setUserELO] = useState<UserELO | null>(null)
  const [eloLoading, setEloLoading] = useState(true)
  const [eloNotification, setEloNotification] = useState<{ change: number; newElo: number; isWin: boolean } | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as '' | 'spiritual' | 'physical' | 'social' | 'intellectual',
    dueDate: getTodayLocalDateString()
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin')
    }
  }, [user, authLoading, router])

  const loadTodos = useCallback(async () => {
    if (!user?.uid) return

    try {
      const { data, error } = await todosService.getByDate(user.uid, selectedDate)
      if (error) throw error
      setTodos(data || [])
    } catch (error) {
      console.error('Error loading todos:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.uid, selectedDate])

  const loadUserELO = useCallback(async () => {
    if (!user?.uid) return

    try {
      const { data, error } = await userELOService.getOrCreate(
        user.uid,
        user.displayName || undefined,
        user.email || undefined
      )
      if (error) throw error
      setUserELO(data as UserELO)
    } catch (error) {
      console.error('Error loading user ELO:', error)
    } finally {
      setEloLoading(false)
    }
  }, [user?.uid, user?.displayName, user?.email])

  useEffect(() => {
    if (user) {
      loadTodos()
      loadUserELO()
    }
  }, [user, loadTodos, loadUserELO])

  const handleSubmit = async (e: React.FormEvent, keepOpen: boolean = false) => {
    e.preventDefault()
    if (!user) return

    try {
      if (editingTodo) {
        await todosService.update(editingTodo.id, {
          title: formData.title,
          description: formData.description || undefined,
          category: formData.category || undefined,
          dueDate: formData.dueDate
        })
        setShowAddForm(false)
        setEditingTodo(null)
      } else {
        await todosService.create({
          userId: user.uid,
          title: formData.title,
          description: formData.description || undefined,
          category: formData.category || undefined,
          isCompleted: false,
          dueDate: formData.dueDate
        })
        
        // If keepOpen is true, keep form open and clear it for next todo
        if (keepOpen) {
          setFormData({
            title: '',
            description: '',
            category: formData.category, // Keep the same category for convenience
            dueDate: formData.dueDate // Keep the same date
          })
          // Focus back on title input for quick entry
          setTimeout(() => {
            const titleInput = document.getElementById('title')
            titleInput?.focus()
          }, 100)
        } else {
          setShowAddForm(false)
        }
      }

      if (!keepOpen) {
        setEditingTodo(null)
        setFormData({
          title: '',
          description: '',
          category: '',
          dueDate: getTodayLocalDateString()
        })
      }
      
      loadTodos()
    } catch (error) {
      console.error('Error saving todo:', error)
    }
  }

  const toggleComplete = async (todoId: string, currentStatus: boolean) => {
    if (!user) return

    try {
      const newStatus = !currentStatus
      await todosService.toggleComplete(todoId, newStatus)

      // Update ELO
      if (userELO) {
        const result = await userELOService.updateTodoELO(user.uid, newStatus)
        if (result.data) {
          setUserELO(result.data as UserELO)
          const eloChange = newStatus ? 1 : -1
          const newElo = result.data.eloRating
          setEloNotification({ 
            change: eloChange, 
            newElo: newElo, 
            isWin: newStatus 
          })
          setTimeout(() => setEloNotification(null), 3000)
        }
      }

      loadTodos()
      loadUserELO()
    } catch (error) {
      console.error('Error toggling todo:', error)
    }
  }

  const deleteTodo = async (todoId: string) => {
    if (!user) return

    try {
      await todosService.delete(todoId)
      loadTodos()
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const startEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setFormData({
      title: todo.title,
      description: todo.description || '',
      category: todo.category || '',
      dueDate: todo.dueDate
    })
    setShowAddForm(true)
  }

  const filteredTodos = todos.filter(todo => 
    categoryFilter === 'all' || todo.category === categoryFilter
  )

  const completedCount = filteredTodos.filter(t => t.isCompleted).length
  const totalCount = filteredTodos.length

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 md:mb-10 gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground flex items-center tracking-tight">
              <ListTodo className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary mr-2 sm:mr-3 flex-shrink-0" />
              <span className="truncate">Today's To-Dos</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Complete tasks and earn ELO points</p>
          </div>
          <Button 
            onClick={() => {
              setShowAddForm(true)
              setEditingTodo(null)
              setFormData({
                title: '',
                description: '',
                category: '',
                dueDate: selectedDate
              })
            }}
            className="bg-primary text-primary-foreground hover:opacity-90 w-full sm:w-auto shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Todo
          </Button>
        </div>

        {/* ELO Change Notification */}
        {eloNotification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border transition-all duration-300 ${
            eloNotification.isWin
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                eloNotification.isWin ? 'bg-emerald-100' : 'bg-red-100'
              }`}>
                {eloNotification.isWin ? (
                  <span className="text-emerald-600 text-sm">+</span>
                ) : (
                  <span className="text-red-600 text-sm">-</span>
                )}
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {eloNotification.isWin ? 'Task Completed!' : 'Task Incomplete'}
                </p>
                <p className="text-xs">
                  ELO {eloNotification.isWin ? '+' : ''}{eloNotification.change} → {eloNotification.newElo}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Date Picker and Stats */}
        <div className="mb-4 sm:mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="border border-border shadow-sm bg-card">
            <CardContent className="p-4">
              <Label htmlFor="date-picker" className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                Select Date
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="date-picker"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex-1 text-sm bg-background"
                />
                {selectedDate !== getTodayLocalDateString() && (
                  <Button
                    onClick={() => setSelectedDate(getTodayLocalDateString())}
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0"
                  >
                    Today
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border shadow-sm bg-card lg:col-span-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Progress</p>
                  <p className="text-2xl font-bold text-primary">
                    {completedCount} / {totalCount}
                  </p>
                </div>
                {!eloLoading && userELO && (
                  <div className="text-right">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">ELO</p>
                    <p className="text-2xl font-bold text-purple-600">{userELO.eloRating}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-muted-foreground whitespace-nowrap">Category:</span>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 flex-1">
            {(['all', 'spiritual', 'physical', 'social', 'intellectual'] as CategoryFilter[]).map((category) => {
              const config = category === 'all' ? null : categoryConfig[category]
              return (
                <Button
                  key={category}
                  variant={categoryFilter === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategoryFilter(category)}
                  className={`text-xs transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${
                    categoryFilter === category && config
                      ? `${config.bgColor} ${config.textColor} ${config.borderColor}`
                      : ''
                  }`}
                >
                  {category === 'all' ? (
                    'All'
                  ) : (
                    <>
                      {config && <config.icon className="w-3 h-3 mr-1" />}
                      <span className="hidden xs:inline">{config?.title}</span>
                      <span className="xs:hidden">{config?.title.split(' ')[1]}</span>
                    </>
                  )}
                </Button>
              )
            })}
          </div>
          {categoryFilter !== 'all' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCategoryFilter('all')}
              className="text-xs px-2"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Add/Edit Form Modal */}
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-bold">{editingTodo ? 'Edit Todo' : 'Add New Todo'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 mt-4">
              <div>
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Read Bible chapter, Exercise for 30 min"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add any details about this task..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Category (optional)</Label>
                <p className="text-xs text-muted-foreground mb-2">Which area of life does this task support?</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {Object.entries(categoryConfig).map(([key, config]) => {
                    const IconComponent = config.icon
                    const isSelected = formData.category === key
                    return (
                      <Button
                        key={key}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFormData({ 
                          ...formData, 
                          category: isSelected ? '' : key as typeof formData.category
                        })}
                        className={`transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${
                          isSelected 
                            ? `${config.bgColor} ${config.textColor} ${config.borderColor}` 
                            : ''
                        }`}
                      >
                        <IconComponent className="w-4 h-4 mr-1.5" />
                        <span className="text-xs">{config.title}</span>
                      </Button>
                    )
                  })}
                </div>
              </div>

              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-border/50">
                {editingTodo ? (
                  <>
                    <Button type="submit" className="bg-primary text-primary-foreground hover:opacity-90 w-full sm:w-auto">
                      Update Todo
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowAddForm(false)
                        setEditingTodo(null)
                      }}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      type="button"
                      onClick={(e) => handleSubmit(e, true)}
                      className="bg-primary text-primary-foreground hover:opacity-90 w-full sm:w-auto"
                    >
                      Add & Add Another
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-primary text-primary-foreground hover:opacity-90 w-full sm:w-auto"
                    >
                      Create Todo
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowAddForm(false)
                        setEditingTodo(null)
                      }}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Todos List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredTodos.length === 0 ? (
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm md:col-span-2 lg:col-span-3">
              <CardContent className="text-center py-12">
                <ListTodo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {categoryFilter === 'all' ? "No tasks for this date" : "No tasks in this category"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {categoryFilter === 'all' 
                    ? "Add your first task to get started and earn ELO points!" 
                    : "Try selecting a different category or add a new task."}
                </p>
                <Button 
                  onClick={() => {
                    setShowAddForm(true)
                    setFormData({
                      title: '',
                      description: '',
                      category: categoryFilter !== 'all' ? categoryFilter : '',
                      dueDate: selectedDate
                    })
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Todo
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredTodos.map(todo => {
              const todoCategory = todo.category ? categoryConfig[todo.category] : null
              const CategoryIcon = todoCategory?.icon

              return (
                <Card 
                  key={todo.id} 
                  className={`bg-card border-border shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col h-full ${
                    todo.isCompleted ? 'opacity-50 grayscale' : ''
                  }`}
                >
                  {todoCategory && <div className={`h-1 bg-gradient-to-r ${todoCategory.color} ${todo.isCompleted ? 'opacity-50' : ''}`}></div>}
                  <CardContent className={`p-3 sm:p-4 md:p-5 flex flex-col flex-1 ${todo.isCompleted ? 'opacity-75' : ''}`}>
                    {/* Header */}
                    <div className="mb-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-base sm:text-lg font-bold text-foreground tracking-tight line-clamp-2 ${
                            todo.isCompleted ? 'line-through text-muted-foreground' : ''
                          }`}>
                            {todo.title}
                          </h3>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              startEdit(todo)
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-secondary"
                          >
                            <Edit3 className="w-3 h-3 text-muted-foreground" />
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteTodo(todo.id)
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {todoCategory && (
                          <Badge variant="outline" className={`${todoCategory.textColor} ${todoCategory.borderColor} bg-transparent px-2 py-0.5 text-xs opacity-70`}>
                            {CategoryIcon && <CategoryIcon className="w-3 h-3 mr-1 flex-shrink-0" />}
                            <span className="whitespace-nowrap">{todoCategory.title}</span>
                          </Badge>
                        )}
                      </div>
                      
                      {todo.description && (
                        <p className={`text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2 leading-relaxed ${
                          todo.isCompleted ? 'line-through' : ''
                        }`}>
                          {todo.description}
                        </p>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto pt-3 border-t border-border/50">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleComplete(todo.id, todo.isCompleted)
                        }}
                        variant={todo.isCompleted ? "default" : "outline"}
                        size="sm"
                        className={`w-full font-medium transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${
                          todo.isCompleted
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white border-none"
                            : "border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                        }`}
                      >
                        {todo.isCompleted ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            Completed (+1 ELO)
                          </>
                        ) : (
                          <>
                            <Circle className="w-4 h-4 mr-1.5" />
                            Mark Complete (+1 ELO)
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

