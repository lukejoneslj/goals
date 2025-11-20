'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Plus, 
  Flame, 
  Trophy, 
  Calendar,
  Check,
  Edit3,
  Trash2,
  Brain,
  Heart,
  Users,
  Dumbbell,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  BarChart3
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Habit, UserELO } from '@/lib/firebase'
import { habitsService, habitCompletionsService, userELOService } from '@/lib/database'
import { calculateHabitEloChange, getRankInfo, getEloProgress, getNextRank } from '@/lib/elo'
import { getWeekdayFromDateString, getTodayLocalDateString } from '@/lib/utils'
import DashboardNav from '@/components/DashboardNav'
import LoadingSpinner from '@/components/LoadingSpinner'

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

export default function StreaksPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [habits, setHabits] = useState<Habit[]>([])
  const [todayCompletions, setTodayCompletions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(getTodayLocalDateString())
  const [dateCompletions, setDateCompletions] = useState<string[]>([])
  const [userELO, setUserELO] = useState<UserELO | null>(null)
  const [eloLoading, setEloLoading] = useState(true)
  const [eloNotification, setEloNotification] = useState<{ change: number; newElo: number; isWin: boolean } | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [showStats, setShowStats] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '' as 'spiritual' | 'physical' | 'social' | 'intellectual' | '',
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
      const today = getTodayLocalDateString()
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
    if (user && selectedDate !== getTodayLocalDateString()) {
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
          category: formData.category || undefined,
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
          category: formData.category || undefined,
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
        category: '',
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

    const isTodaySelected = selectedDate === getTodayLocalDateString()
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
      category: habit.category || '',
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




  if (authLoading || loading) {
    return <LoadingSpinner 
      message="Loading Your Streaks" 
      subMessage="Preparing your habits..."
      icon={Flame}
      iconColor="text-orange-500"
    />
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
                category: '',
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

        {/* Category Filter - Compact */}
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

        {/* Stats and Date Picker Grid */}
        <div className="mb-4 sm:mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Date Picker Card */}
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
                  max={getTodayLocalDateString()}
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

          {/* Quick Stats Grid */}
          <Card className="border border-border shadow-sm bg-card lg:col-span-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quick Stats</span>
                {!eloLoading && userELO && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowStats(!showStats)}
                    className="cursor-pointer h-7 px-2"
                  >
                    <BarChart3 className="w-3 h-3 mr-1" />
                    {showStats ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                  <div className="text-xl font-bold text-primary">
                    {habits.reduce((sum, habit) => sum + (habit.currentStreak || 0), 0)}
                  </div>
                  <div className="text-[10px] xs:text-xs text-muted-foreground font-medium mt-0.5">Streaks</div>
                </div>
                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                  <div className="text-xl font-bold text-emerald-600">
                    {todayCompletions.length}
                  </div>
                  <div className="text-[10px] xs:text-xs text-muted-foreground font-medium mt-0.5">Today</div>
                </div>
                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                  <div className="text-xl font-bold text-violet-600">
                    {habits.reduce((max, habit) => Math.max(max, habit.longestStreak || 0), 0)}
                  </div>
                  <div className="text-[10px] xs:text-xs text-muted-foreground font-medium mt-0.5">Best</div>
                </div>
                {!eloLoading && userELO && (
                  <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 cursor-pointer hover:shadow-md transition-all duration-300"
                       onClick={() => setShowStats(!showStats)}>
                    <div className="flex items-center justify-center mb-1">
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${getRankInfo(userELO.currentRank).color} flex items-center justify-center text-white font-bold text-xs`}>
                        {userELO.currentRank.split(' ')[0][0]}{userELO.currentRank.split(' ')[1]?.[0] || ''}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-purple-700">{userELO.eloRating}</div>
                    <div className="text-[10px] text-purple-600 font-medium">ELO</div>
                  </div>
                )}
              </div>

              {/* Expanded Stats Section */}
              {showStats && !eloLoading && userELO && (
                <div className="mt-4 pt-4 border-t border-border animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-center mb-1.5">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRankInfo(userELO.currentRank).color} flex items-center justify-center text-white font-bold text-xs`}>
                          {userELO.currentRank.split(' ')[0][0]}{userELO.currentRank.split(' ')[1]?.[0] || ''}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-purple-700">{userELO.eloRating}</div>
                      <div className="text-xs text-purple-600 font-medium">ELO Rating</div>
                    </div>

                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                      <div className="text-lg font-bold text-blue-700 mb-1">{userELO.currentRank}</div>
                      <div className="text-xs text-blue-600 font-medium mb-1">Current Rank</div>
                      {getNextRank(userELO.eloRating) && (
                        <div className="text-xs text-blue-500">Next: {getNextRank(userELO.eloRating)}</div>
                      )}
                    </div>

                    <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                      <div className="text-lg font-bold text-emerald-700 mb-1">
                        {userELO.totalWins}/{userELO.totalWins + userELO.totalLosses}
                      </div>
                      <div className="text-xs text-emerald-600 font-medium mb-1">Win Rate</div>
                      <div className="text-xs text-emerald-500">
                        {userELO.totalWins + userELO.totalLosses > 0
                          ? `${Math.round((userELO.totalWins / (userELO.totalWins + userELO.totalLosses)) * 100)}%`
                          : '0%'}
                      </div>
                    </div>
                  </div>

                  {/* Rank Progress Bar */}
                  <div className="p-3 bg-secondary/30 rounded-lg border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-foreground">Rank Progress</span>
                      <span className="text-xs text-muted-foreground">
                        {getEloProgress(userELO.eloRating).percentage}% to next rank
                      </span>
                    </div>
                    <Progress value={getEloProgress(userELO.eloRating).percentage} className="h-2 bg-secondary" />
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>{userELO.currentRank}</span>
                      <span>{getNextRank(userELO.eloRating) || 'Max Rank'}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Form Modal */}
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-bold">{editingHabit ? 'Edit Habit' : 'Add New Habit'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 mt-4">
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
                  <Label>Category (optional)</Label>
                  <p className="text-xs text-muted-foreground mb-2">Which area of life does this habit support?</p>
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
          </DialogContent>
        </Dialog>

        {/* Habits List - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {habits.length === 0 ? (
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm md:col-span-2 lg:col-span-3">
              <CardContent className="text-center py-12">
                <Flame className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No habits yet</h3>
                <p className="text-gray-600 mb-6">Start building consistent daily habits to achieve your goals!</p>
                <Button 
                  onClick={() => {
                    setShowAddForm(true)
                    setFormData({
                      name: '',
                      description: '',
                      category: '',
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
                  Add Your First Habit
                </Button>
              </CardContent>
            </Card>
          ) : habits.filter(habit => categoryFilter === 'all' || habit.category === categoryFilter).length === 0 ? (
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm md:col-span-2 lg:col-span-3">
              <CardContent className="text-center py-12">
                <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No habits in this category</h3>
                <p className="text-gray-600 mb-6">Try selecting a different category or add a new habit.</p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    variant="outline"
                    onClick={() => setCategoryFilter('all')}
                  >
                    View All Habits
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowAddForm(true)
                      setFormData({
                        name: '',
                        description: '',
                        category: categoryFilter !== 'all' ? categoryFilter : '',
                        monday: false,
                        tuesday: false,
                        wednesday: false,
                        thursday: false,
                        friday: false,
                        saturday: false,
                        sunday: false
                      })
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Habit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            habits
              .filter(habit => categoryFilter === 'all' || habit.category === categoryFilter)
              .map(habit => {
              const isTodaySelected = selectedDate === getTodayLocalDateString()
              const currentCompletions = isTodaySelected ? todayCompletions : dateCompletions
              const isCompletedToday = currentCompletions.includes(habit.id)

              // Check if habit is scheduled for selected date
              const selectedDayOfWeek = getWeekdayFromDateString(selectedDate)
              const isScheduledForDate = habit[selectedDayOfWeek as keyof Habit] as boolean

              const habitCategory = habit.category ? categoryConfig[habit.category] : null
              const CategoryIcon = habitCategory?.icon

              return (
                <Card key={habit.id} className={`bg-card border-border shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col h-full ${
                  isCompletedToday ? 'opacity-50 grayscale' : ''
                }`}>
                  {habitCategory && <div className={`h-1 bg-gradient-to-r ${habitCategory.color} ${isCompletedToday ? 'opacity-50' : ''}`}></div>}
                  <CardContent className={`p-3 sm:p-4 md:p-5 flex flex-col flex-1 ${isCompletedToday ? 'opacity-75' : ''}`}>
                    {/* Header */}
                    <div className="mb-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight flex-1 line-clamp-2">{habit.name}</h3>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              startEdit(habit)
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
                              deleteHabit(habit.id)
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
                        {habitCategory && (
                          <Badge variant="outline" className={`${habitCategory.textColor} ${habitCategory.borderColor} bg-transparent px-2 py-0.5 text-xs opacity-70`}>
                            {CategoryIcon && <CategoryIcon className="w-3 h-3 mr-1 flex-shrink-0" />}
                            <span className="whitespace-nowrap">{habitCategory.title}</span>
                          </Badge>
                        )}
                        <Badge variant="outline" className={`px-2 py-0.5 text-xs transition-colors ${
                          habit.currentStreak > 0
                            ? 'bg-orange-50 text-orange-800 border-orange-200'
                            : 'bg-secondary text-muted-foreground border-border'
                        }`}>
                          <Flame className={`w-3 h-3 mr-1 flex-shrink-0 ${habit.currentStreak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
                          <span className="whitespace-nowrap">{habit.currentStreak} day</span>
                        </Badge>
                        {habit.longestStreak > 0 && habit.longestStreak !== habit.currentStreak && (
                          <Badge variant="outline" className="px-2 py-0.5 text-xs bg-yellow-50 text-yellow-800 border-yellow-200">
                            <Trophy className="w-3 h-3 mr-1 text-yellow-600 flex-shrink-0" />
                            <span className="whitespace-nowrap">Best: {habit.longestStreak}</span>
                          </Badge>
                        )}
                      </div>
                      
                      {habit.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2 leading-relaxed">{habit.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span className="line-clamp-1">
                          {DAYS.filter(day => habit[day.key as keyof Habit] as boolean).map(day => day.label).join(', ')}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto pt-3 border-t border-border/50">
                      {isScheduledForDate ? (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleCompletion(habit.id)
                          }}
                          variant={isCompletedToday ? "default" : "outline"}
                          size="sm"
                          className={`w-full font-medium transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${
                            isCompletedToday
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white border-none"
                              : "border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          <Check className="w-3 h-3 mr-1.5" />
                          {isCompletedToday ? 'Completed' : 'Mark Complete'}
                        </Button>
                      ) : (
                        <div className="text-xs text-muted-foreground italic text-center py-2">
                          Not scheduled for {selectedDayOfWeek}
                        </div>
                      )}
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