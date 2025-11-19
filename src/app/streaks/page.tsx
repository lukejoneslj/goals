'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { 
  Plus, 
  Flame, 
  Trophy, 
  Calendar,
  Check,
  Edit3,
  Trash2
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Habit, UserELO } from '@/lib/firebase'
import { habitsService, habitCompletionsService, userELOService } from '@/lib/database'
import { calculateHabitEloChange, getRankInfo, getEloProgress, getNextRank } from '@/lib/elo'
import DashboardNav from '@/components/DashboardNav'

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
  const [userELO, setUserELO] = useState<UserELO | null>(null)
  const [eloLoading, setEloLoading] = useState(true)
  const [eloNotification, setEloNotification] = useState<{ change: number; newElo: number; isWin: boolean } | null>(null)
  
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

  const loadUserELO = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await userELOService.getOrCreate(user.uid)

      if (error) throw error

      setUserELO(data as UserELO)
    } catch (error) {
      console.error('Error loading user ELO:', error)
    } finally {
      setEloLoading(false)
    }
  }, [user])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin')
    }
  }, [user, authLoading, router])

  // Load habits, today's completions, and ELO data
  useEffect(() => {
    if (user) {
      loadHabits()
      loadTodayCompletions()
      loadDateCompletions(selectedDate)
      loadUserELO()
    }
  }, [user, loadHabits, loadTodayCompletions, loadDateCompletions, loadUserELO, selectedDate])

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
        const oldStreak = habits.find(h => h.id === habitId)?.currentStreak || 0
        await calculateAndUpdateStreak(habitId)

        // Update ELO based on the action
        if (user && userELO) {
          try {
            if (isCompleted) {
              // User is breaking their streak (loss)
              const { eloChange, newElo } = calculateHabitEloChange(
                userELO.eloRating,
                oldStreak,
                false, // loss
                userELO.winStreak
              )

              await userELOService.recordLoss(user.uid, eloChange)
              setUserELO(prev => prev ? { ...prev, eloRating: newElo, winStreak: 0 } : null)
              setEloNotification({ change: eloChange, newElo: newElo, isWin: false })
              setTimeout(() => setEloNotification(null), 3000)
            } else {
              // User is maintaining/completing their streak (win)
              const { eloChange, newElo } = calculateHabitEloChange(
                userELO.eloRating,
                oldStreak,
                true, // win
                userELO.winStreak
              )

              const result = await userELOService.recordWin(user.uid, eloChange)
              if (result.data) {
                setUserELO(result.data as UserELO)
                setEloNotification({ change: eloChange, newElo: newElo, isWin: true })
                setTimeout(() => setEloNotification(null), 3000)
              }
            }
          } catch (error) {
            console.error('Error updating ELO:', error)
          }
        }

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
    <div className="min-h-screen bg-background">
      <DashboardNav />
      
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 md:mb-10 gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground flex items-center tracking-tight">
              <Flame className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-500 mr-2 sm:mr-3 flex-shrink-0" />
              <span className="truncate">Daily Streaks</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Build consistent habits and track your progress</p>
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
            className="bg-primary text-primary-foreground hover:opacity-90 w-full sm:w-auto shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Habit
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
                  <span className="text-emerald-600 text-sm">▲</span>
                ) : (
                  <span className="text-red-600 text-sm">▼</span>
                )}
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {eloNotification.isWin ? 'Streak Maintained!' : 'Streak Broken'}
                </p>
                <p className="text-xs">
                  ELO {eloNotification.isWin ? '+' : ''}{eloNotification.change} → {eloNotification.newElo}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Date Picker and Stats */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <Card className="border border-border shadow-sm bg-card">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 border-b border-border pb-6">
                  <div className="w-full sm:w-auto">
                    <Label htmlFor="date-picker" className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Select Date
                    </Label>
                    <Input
                      id="date-picker"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="mt-2 w-full sm:w-48 text-sm bg-background"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  {selectedDate !== new Date().toISOString().split('T')[0] && (
                    <Button
                      onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                      variant="outline"
                      size="sm"
                      className="mt-auto w-full sm:w-auto"
                    >
                      Back to Today
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                  <div className="text-center p-4 bg-secondary/30 rounded-xl">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                      {habits.reduce((sum, habit) => sum + (habit.currentStreak || 0), 0)}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">Total Streak Days</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/30 rounded-xl">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-600">
                      {todayCompletions.length}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">Completed Today</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/30 rounded-xl">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-violet-600">
                      {habits.reduce((max, habit) => Math.max(max, habit.longestStreak || 0), 0)}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">Best Streak</div>
                  </div>
                  <div className="text-center col-span-2 sm:col-span-1 p-4 bg-orange-50 rounded-xl border border-orange-100 flex flex-col justify-center items-center">
                    <div className="text-sm sm:text-base font-bold text-orange-700 mb-1">
                      {getMotivationalMessage(habits.reduce((sum, habit) => sum + (habit.currentStreak || 0), 0))}
                    </div>
                    <div className="text-xs text-orange-600/80">Keep up the great work!</div>
                  </div>
                </div>

                {/* ELO Rating Section */}
                {!eloLoading && userELO && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 pt-4 border-t border-border">
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                      <div className="flex items-center justify-center mb-2">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRankInfo(userELO.currentRank).color} flex items-center justify-center text-white font-bold text-sm`}>
                          {userELO.currentRank.split(' ')[0][0]}{userELO.currentRank.split(' ')[1]?.[0] || ''}
                        </div>
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-purple-700">
                        {userELO.eloRating}
                      </div>
                      <div className="text-xs sm:text-sm text-purple-600 font-medium">ELO Rating</div>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                      <div className="text-lg sm:text-xl font-bold text-blue-700 mb-1">
                        {userELO.currentRank}
                      </div>
                      <div className="text-xs sm:text-sm text-blue-600 font-medium mb-2">Current Rank</div>
                      {getNextRank(userELO.eloRating) && (
                        <div className="text-xs text-blue-500">
                          Next: {getNextRank(userELO.eloRating)}
                        </div>
                      )}
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                      <div className="text-lg sm:text-xl font-bold text-emerald-700 mb-1">
                        {userELO.totalWins}/{userELO.totalWins + userELO.totalLosses}
                      </div>
                      <div className="text-xs sm:text-sm text-emerald-600 font-medium mb-2">Win Rate</div>
                      <div className="text-xs text-emerald-500">
                        {userELO.totalWins + userELO.totalLosses > 0
                          ? `${Math.round((userELO.totalWins / (userELO.totalWins + userELO.totalLosses)) * 100)}%`
                          : '0%'
                        }
                      </div>
                    </div>
                  </div>
                )}

                {/* Rank Progress Bar */}
                {!eloLoading && userELO && (
                  <div className="mt-4 p-4 bg-secondary/30 rounded-xl border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">Rank Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {getEloProgress(userELO.eloRating).percentage}% to next rank
                      </span>
                    </div>
                    <Progress
                      value={getEloProgress(userELO.eloRating).percentage}
                      className="h-3 bg-secondary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{userELO.currentRank}</span>
                      <span>{getNextRank(userELO.eloRating) || 'Max Rank'}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-6 sm:mb-8 md:mb-10 border border-border shadow-lg bg-card">
            <CardHeader className="p-4 sm:p-6 border-b border-border/50">
              <CardTitle className="text-lg sm:text-xl font-bold">{editingHabit ? 'Edit Habit' : 'Add New Habit'}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-border/50">
                  <Button type="submit" className="bg-primary text-primary-foreground hover:opacity-90 w-full sm:w-auto">
                    {editingHabit ? 'Update Habit' : 'Create Habit'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingHabit(null)
                    }}
                    className="w-full sm:w-auto"
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
                <Card key={habit.id} className="border border-border shadow-sm hover:shadow-md transition-all duration-200 bg-card group">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 sm:space-x-4 mb-2 sm:mb-3">
                          <h3 className="text-lg sm:text-xl font-bold text-foreground truncate w-full sm:w-auto tracking-tight">{habit.name}</h3>
                          <div className="flex flex-wrap gap-2 sm:gap-3">
                            <div className={`flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                              habit.currentStreak > 0
                                ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                : 'bg-secondary text-muted-foreground border border-border'
                            }`}>
                              <Flame className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0 ${habit.currentStreak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
                              <span className="whitespace-nowrap">{habit.currentStreak} day streak</span>
                            </div>
                            {habit.longestStreak > 0 && (
                              <div className="flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-yellow-50 text-yellow-800 border border-yellow-200">
                                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-yellow-600 flex-shrink-0" />
                                <span className="whitespace-nowrap">Best: {habit.longestStreak}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {habit.description && (
                          <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">{habit.description}</p>
                        )}
                        
                        <div className="flex items-center space-x-2 mb-3 sm:mb-0">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            {DAYS.filter(day => habit[day.key as keyof Habit] as boolean).map(day => day.label).join(', ')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2 w-full sm:w-auto">
                        {isScheduledForDate && (
                          <Button
                            onClick={() => toggleCompletion(habit.id)}
                            variant={isCompletedToday ? "default" : "outline"}
                            size="sm"
                            className={isCompletedToday ?
                              "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md w-full sm:w-auto font-medium border-none" :
                              "border-emerald-600 text-emerald-600 hover:bg-emerald-50 shadow-sm w-full sm:w-auto font-medium"
                            }
                          >
                            {isCompletedToday ? (
                              <>
                                <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                <span className="text-xs sm:text-sm">Completed</span>
                              </>
                            ) : (
                              <>
                                <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                <span className="text-xs sm:text-sm">Mark Complete</span>
                              </>
                            )}
                          </Button>
                        )}
                        {!isScheduledForDate && (
                          <span className="text-xs text-muted-foreground italic text-center sm:text-left py-2">
                            Not scheduled for {selectedDayOfWeek}
                          </span>
                        )}
                        
                        <div className="flex gap-2 sm:gap-0 justify-end sm:justify-start">
                          <Button
                            onClick={() => startEdit(habit)}
                            variant="ghost"
                            size="sm"
                            className="flex-1 sm:flex-none hover:bg-secondary"
                          >
                            <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                          </Button>
                          
                          <Button
                            onClick={() => deleteHabit(habit.id)}
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-1 sm:flex-none"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
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