'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [dateCompletions, setDateCompletions] = useState<string[]>([])
  
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

      const habitsData = (data as Habit[]) || []
      setHabits(habitsData)
    } catch (error) {
      console.error('Error loading habits:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  const loadTodayCompletions = useCallback(async () => {
    if (!user) return

    try {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await habitCompletionsService.getForDate(today, user.uid)

      if (error) throw error

      const completions = data?.map((c) => c.habitId) || []
      setTodayCompletions(completions)
    } catch (error) {
      console.error('Error loading today\'s completions:', error)
    }
  }, [user])

  const loadDateCompletions = useCallback(async (date: string) => {
    if (!user) return

    try {
      const { data, error } = await habitCompletionsService.getForDate(date, user.uid)

      if (error) throw error

      const completions = data?.map((c) => c.habitId) || []
      setDateCompletions(completions)
    } catch (error) {
      console.error('Error loading date completions:', error)
    }
  }, [user])

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
      loadDateCompletions(selectedDate)
    }
  }, [user, loadHabits, loadTodayCompletions, loadDateCompletions, selectedDate])

  // Load completions when selected date changes
  useEffect(() => {
    if (user && selectedDate !== new Date().toISOString().split('T')[0]) {
      loadDateCompletions(selectedDate)
    }
  }, [selectedDate, user, loadDateCompletions])

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
          userId: user!.uid,
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
    if (!user) return

    const isTodaySelected = selectedDate === new Date().toISOString().split('T')[0]
    const currentCompletions = isTodaySelected ? todayCompletions : dateCompletions
    const isCompleted = currentCompletions.includes(habitId)

    try {
      if (isCompleted) {
        // Remove completion
        const { error } = await habitCompletionsService.deleteForHabitAndDate(habitId, selectedDate, user.uid)

        if (error) throw error

        if (isTodaySelected) {
          setTodayCompletions(prev => prev.filter(id => id !== habitId))
        } else {
          setDateCompletions(prev => prev.filter(id => id !== habitId))
        }
      } else {
        // Add completion
        const { error } = await habitCompletionsService.create({
          userId: user.uid,
          habitId: habitId,
          completionDate: selectedDate
        })

        if (error) throw error

        if (isTodaySelected) {
          setTodayCompletions(prev => [...prev, habitId])
        } else {
          setDateCompletions(prev => [...prev, habitId])
        }
      }

      // Recalculate streak for this habit (only if we're working with today)
      if (isTodaySelected) {
        await calculateAndUpdateStreak(habitId)
        // Refresh habits to get updated streak counts
        loadHabits()
      }
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
      const habit = habits.find(h => h.id === habitId)
      if (!habit) return

      // Calculate current streak by going backwards from today
      let currentStreak = 0
      let longestStreak = habit.longestStreak || 0

      // Check up to 60 days back
      for (let i = 0; i < 60; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]

        // Check if habit is scheduled for this day
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
        const isScheduled = habit[dayOfWeek as keyof Habit] as boolean

        if (isScheduled) {
          // Check if completed on this date
          const { data } = await habitCompletionsService.getForDate(dateStr, habit.userId)
          const completedToday = data?.some(c => c.habitId === habitId) || false

          if (completedToday) {
            currentStreak++
          } else {
            // Break when we find the first non-completed scheduled day
            break
          }
        } else if (i === 0) {
          // If today is not scheduled, current streak is 0
          currentStreak = 0
          break
        }
      }

      // Update longest streak if current is higher
      longestStreak = Math.max(longestStreak, currentStreak)

      const { error } = await habitCompletionsService.updateStreak(habitId, currentStreak, longestStreak)

      if (error) {
        console.error('Error updating streak:', error)
      }
    } catch (error) {
      console.error('Error calculating streak:', error)
    }
  }



  const getMotivationalMessage = (streak: number) => {
    if (streak === 0) return "Start your streak today! 💪"
    if (streak < 7) return "You're on fire! Keep it up! 🔥"
    if (streak < 30) return "Amazing consistency! You're crushing it! 🌟"
    if (streak < 100) return "Incredible dedication! You're unstoppable! 🚀"
    return "LEGENDARY! You're a habit master! 👑"
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

        {/* Date Picker and Stats */}
        <div className="mb-8">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div>
                    <Label htmlFor="date-picker" className="text-sm font-medium text-gray-700">
                      Select Date
                    </Label>
                    <Input
                      id="date-picker"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="mt-1 w-40"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  {selectedDate !== new Date().toISOString().split('T')[0] && (
                    <Button
                      onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                      variant="outline"
                      size="sm"
                      className="mt-6"
                    >
                      Back to Today
                    </Button>
                  )}
                </div>

                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {habits.reduce((sum, habit) => sum + (habit.currentStreak || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Streak Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {todayCompletions.length}
                    </div>
                    <div className="text-sm text-gray-600">Completed Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {habits.reduce((max, habit) => Math.max(max, habit.longestStreak || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Best Streak</div>
                  </div>
                  <div className="text-center max-w-xs">
                    <div className="text-lg font-semibold text-orange-600 mb-1">
                      {getMotivationalMessage(habits.reduce((sum, habit) => sum + (habit.currentStreak || 0), 0))}
                    </div>
                    <div className="text-xs text-gray-500">Keep up the great work!</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
              const isTodaySelected = selectedDate === new Date().toISOString().split('T')[0]
              const currentCompletions = isTodaySelected ? todayCompletions : dateCompletions
              const isCompletedToday = currentCompletions.includes(habit.id)

              // Check if habit is scheduled for selected date
              const selectedDateObj = new Date(selectedDate)
              const selectedDayOfWeek = selectedDateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
              const isScheduledForDate = habit[selectedDayOfWeek as keyof Habit] as boolean

              // Debug logging (remove in production)
              // console.log('Habit:', habit.name, 'isScheduledForDate:', isScheduledForDate, 'isCompletedToday:', isCompletedToday)

              return (
                <Card key={habit.id} className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">{habit.name}</h3>
                          <div className="flex space-x-3">
                            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              habit.currentStreak > 0
                                ? 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200'
                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}>
                              <Flame className={`w-4 h-4 mr-2 ${habit.currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
                              {habit.currentStreak} day streak
                            </div>
                            {habit.longestStreak > 0 && (
                              <div className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200">
                                <Trophy className="w-4 h-4 mr-2 text-yellow-600" />
                                Best: {habit.longestStreak}
                              </div>
                            )}
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
                        {isScheduledForDate && (
                          <Button
                            onClick={() => toggleCompletion(habit.id)}
                            variant={isCompletedToday ? "default" : "outline"}
                            size="sm"
                            className={isCompletedToday ?
                              "bg-green-600 hover:bg-green-700 text-white shadow-md" :
                              "border-green-600 text-green-600 hover:bg-green-50 shadow-sm"
                            }
                          >
                            {isCompletedToday ? (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Completed
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Mark Complete
                              </>
                            )}
                          </Button>
                        )}
                        {!isScheduledForDate && (
                          <span className="text-xs text-gray-500 italic">
                            Not scheduled for {selectedDayOfWeek}
                          </span>
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