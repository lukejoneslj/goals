'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Flame, 
  Trophy, 
  Calendar,
  Check,
  Edit3,
  Trash2,
  ArrowLeft
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Habit } from '@/lib/firebase'
import { habitsService, habitCompletionsService } from '@/lib/database'
import Link from 'next/link'

// Make this a dynamic route to prevent static generation
export const dynamic = 'force-dynamic'

const DAYS = [
  { key: 'monday', label: 'Mon', full: 'Monday' },
  { key: 'tuesday', label: 'Tue', full: 'Tuesday' },
  { key: 'wednesday', label: 'Wed', full: 'Wednesday' },
  { key: 'thursday', label: 'Thu', full: 'Thursday' },
  { key: 'friday', label: 'Fri', full: 'Friday' },
  { key: 'saturday', label: 'Sat', full: 'Saturday' },
  { key: 'sunday', label: 'Sun', full: 'Sunday' }
]

export default function StreaksPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [habits, setHabits] = useState<Habit[]>([])
  const [todayCompletions, setTodayCompletions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  })

  const loadHabits = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await habitsService.getAll(user.uid)

      if (error) throw error
      setHabits((data as Habit[]) || [])
    } catch (error) {
      console.error('Error loading habits:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  const loadTodayCompletions = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await habitCompletionsService.getForDate(today)

      if (error) throw error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setTodayCompletions(data?.map((c: any) => c.habitId) || [])
    } catch (error) {
      console.error('Error loading today\'s completions:', error)
    }
  }, [])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin')
    }
  }, [user, authLoading, router])

  // Load habits and today's completions
  useEffect(() => {
    if (user) {
      loadHabits()
      loadTodayCompletions()
    }
  }, [user, loadHabits, loadTodayCompletions])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !user) return

    try {
      if (editingHabit) {
        // Update existing habit
        const { error } = await habitsService.update(editingHabit.id, {
          name: formData.name,
          description: formData.description,
          monday: formData.monday,
          tuesday: formData.tuesday,
          wednesday: formData.wednesday,
          thursday: formData.thursday,
          friday: formData.friday,
          saturday: formData.saturday,
          sunday: formData.sunday
        })

        if (error) throw error
      } else {
        // Create new habit
        const habitData = {
          userId: user.uid,
          name: formData.name,
          description: formData.description,
          monday: formData.monday,
          tuesday: formData.tuesday,
          wednesday: formData.wednesday,
          thursday: formData.thursday,
          friday: formData.friday,
          saturday: formData.saturday,
          sunday: formData.sunday,
          isActive: true
        }

        const { error } = await habitsService.create(habitData)

        if (error) {
          console.error('Firebase error details:', error)
          throw error
        }
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      })
      setShowAddForm(false)
      setEditingHabit(null)
      loadHabits()
    } catch (error) {
      console.error('Error saving habit:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
    }
  }

  const toggleCompletion = async (habitId: string) => {
    const today = new Date().toISOString().split('T')[0]
    const isCompleted = todayCompletions.includes(habitId)

    try {
      if (isCompleted) {
        // Remove completion
        const { error } = await habitCompletionsService.deleteForHabitAndDate(habitId, today)

        if (error) throw error
        setTodayCompletions(prev => prev.filter(id => id !== habitId))
      } else {
        // Add completion
        const { error } = await habitCompletionsService.create({
          habitId: habitId,
          completionDate: today
        })

        if (error) throw error
        setTodayCompletions(prev => [...prev, habitId])
      }

      // Recalculate streak for this habit
      await calculateAndUpdateStreak(habitId)

      // Refresh habits to get updated streak counts
      loadHabits()
    } catch (error) {
      console.error('Error toggling completion:', error)
    }
  }

  const deleteHabit = async (habitId: string) => {
    if (!confirm('Are you sure you want to delete this habit?')) return

    try {
      const { error } = await habitsService.delete(habitId)

      if (error) throw error
      loadHabits()
    } catch (error) {
      console.error('Error deleting habit:', error)
    }
  }

  const startEdit = (habit: Habit) => {
    setFormData({
      name: habit.name,
      description: habit.description || '',
      monday: habit.monday,
      tuesday: habit.tuesday,
      wednesday: habit.wednesday,
      thursday: habit.thursday,
      friday: habit.friday,
      saturday: habit.saturday,
      sunday: habit.sunday
    })
    setEditingHabit(habit)
    setShowAddForm(true)
  }

  const calculateAndUpdateStreak = async (habitId: string) => {
    try {
      // Get all completions for this habit (this would be more efficient with a better query in production)
      // For now, we'll get recent completions and calculate the streak
      const habit = habits.find(h => h.id === habitId)
      if (!habit) return

      // Get completions for the last 60 days to calculate streak
      const completions: string[] = []
      for (let i = 0; i < 60; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]

        // Check if habit is scheduled for this day
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
        const isScheduled = habit[dayOfWeek as keyof Habit] as boolean

        if (isScheduled) {
          // Check if completed on this date
          const { data } = await habitCompletionsService.getForDate(dateStr)
          const completedToday = data?.some(c => c.habitId === habitId) || false
          if (completedToday) {
            completions.push(dateStr)
          } else {
            // If not completed on a scheduled day, break the streak
            break
          }
        }
      }

      const currentStreak = completions.length
      const { error } = await habitCompletionsService.updateStreak(habitId, currentStreak, habit.longestStreak)

      if (error) {
        console.error('Error updating streak:', error)
      }
    } catch (error) {
      console.error('Error calculating streak:', error)
    }
  }

  const getTodayDay = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[new Date().getDay()]
  }

  const shouldShowToday = (habit: Habit) => {
    const today = getTodayDay()
    return habit[today as keyof Habit] as boolean
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Flame className="w-8 h-8 text-orange-500 mr-3" />
                Daily Streaks
              </h1>
              <p className="text-gray-600">Build consistent habits and track your progress</p>
            </div>
          </div>
          <Button 
            onClick={() => {
              setShowAddForm(true)
              setEditingHabit(null)
              setFormData({
                name: '',
                description: '',
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
                sunday: false
              })
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Habit
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>{editingHabit ? 'Edit Habit' : 'Add New Habit'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Habit Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Read for 30 minutes, Exercise, Meditate"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add any details about this habit..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Which days do you want to do this?</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {DAYS.map(day => (
                      <Button
                        key={day.key}
                        type="button"
                        variant={formData[day.key as keyof typeof formData] ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFormData({ 
                          ...formData, 
                          [day.key]: !formData[day.key as keyof typeof formData] 
                        })}
                        className="min-w-[50px]"
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {editingHabit ? 'Update Habit' : 'Create Habit'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingHabit(null)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Habits List */}
        <div className="grid gap-6">
          {habits.length === 0 ? (
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <Flame className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No habits yet</h3>
                <p className="text-gray-600 mb-6">Start building consistent daily habits to achieve your goals!</p>
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Habit
                </Button>
              </CardContent>
            </Card>
          ) : (
            habits.map(habit => {
              const isCompletedToday = todayCompletions.includes(habit.id)
              const showToday = shouldShowToday(habit)
              
              return (
                <Card key={habit.id} className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{habit.name}</h3>
                          <div className="flex space-x-2">
                            <Badge variant="outline" className="flex items-center">
                              <Flame className="w-3 h-3 mr-1 text-orange-500" />
                              {habit.currentStreak} day streak
                            </Badge>
                            <Badge variant="outline" className="flex items-center">
                              <Trophy className="w-3 h-3 mr-1 text-yellow-500" />
                              Best: {habit.longestStreak}
                            </Badge>
                          </div>
                        </div>
                        
                        {habit.description && (
                          <p className="text-gray-600 mb-3">{habit.description}</p>
                        )}
                        
                        <div className="flex items-center space-x-2 mb-4">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {DAYS.filter(day => habit[day.key as keyof Habit] as boolean).map(day => day.label).join(', ')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {showToday && (
                          <Button
                            onClick={() => toggleCompletion(habit.id)}
                            variant={isCompletedToday ? "default" : "outline"}
                            size="sm"
                            className={isCompletedToday ? 
                              "bg-green-600 hover:bg-green-700 text-white" : 
                              "border-green-600 text-green-600 hover:bg-green-50"
                            }
                          >
                            {isCompletedToday ? (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Done Today
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Mark Complete
                              </>
                            )}
                          </Button>
                        )}
                        
                        <Button
                          onClick={() => startEdit(habit)}
                          variant="ghost"
                          size="sm"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          onClick={() => deleteHabit(habit.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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