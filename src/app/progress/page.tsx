'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  TrendingUp,
  CheckSquare,
  Flame,
  Brain,
  Heart,
  Users,
  Dumbbell,
  BarChart3,
  Calendar,
  Trophy,
  Target
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Todo, HabitCompletion, Habit } from '@/lib/firebase'
import { todosService, habitCompletionsService, habitsService } from '@/lib/database'
import { calculateHabitEloChange, DEFAULT_ELO } from '@/lib/elo'
import { getTodayLocalDateString } from '@/lib/utils'
import DashboardNav from '@/components/DashboardNav'
import LoadingSpinner from '@/components/LoadingSpinner'

const categoryConfig = {
  spiritual: {
    icon: Heart,
    color: 'from-purple-500 to-purple-600',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-500',
    title: '🙏 Spiritual'
  },
  physical: {
    icon: Dumbbell,
    color: 'from-red-500 to-red-600',
    textColor: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    title: '💪 Physical'
  },
  social: {
    icon: Users,
    color: 'from-green-500 to-green-600',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    title: '👥 Social'
  },
  intellectual: {
    icon: Brain,
    color: 'from-blue-500 to-blue-600',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    title: '🧠 Intellectual'
  }
}

type TimeFrame = 'week' | 'month' | '3months' | '6months' | 'year' | 'all' | 'custom'

export default function ProgressPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('month')
  const [todos, setTodos] = useState<Todo[]>([])
  const [habitCompletions, setHabitCompletions] = useState<HabitCompletion[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin')
    }
  }, [user, authLoading, router])

  // Calculate date range based on time frame
  const getDateRange = useCallback((frame: TimeFrame): { start: string; end: string } => {
    const today = new Date()
    const end = getTodayLocalDateString()
    let start = new Date()

    switch (frame) {
      case 'week':
        start.setDate(today.getDate() - 7)
        break
      case 'month':
        start.setMonth(today.getMonth() - 1)
        break
      case '3months':
        start.setMonth(today.getMonth() - 3)
        break
      case '6months':
        start.setMonth(today.getMonth() - 6)
        break
      case 'year':
        start.setFullYear(today.getFullYear() - 1)
        break
      case 'all':
        start = new Date(2020, 0, 1) // Arbitrary early date
        break
      case 'custom':
        // Will be handled by custom date inputs
        return { start: end, end }
      default:
        start.setMonth(today.getMonth() - 1)
    }

    const startStr = start.toISOString().split('T')[0]
    return { start: startStr, end }
  }, [])

  const dateRange = useMemo(() => getDateRange(timeFrame), [timeFrame, getDateRange])

  const loadData = useCallback(async () => {
    if (!user?.uid) return

    setLoading(true)
    try {
      const { start, end } = dateRange
      
      const [todosResult, completionsResult, habitsResult] = await Promise.all([
        todosService.getCompletedInRange(user.uid, start, end),
        habitCompletionsService.getCompletionsInRange(user.uid, start, end),
        habitsService.getAll(user.uid)
      ])

      if (todosResult.error) throw todosResult.error
      if (completionsResult.error) throw completionsResult.error
      if (habitsResult.error) throw habitsResult.error

      setTodos(todosResult.data || [])
      setHabitCompletions(completionsResult.data || [])
      setHabits(habitsResult.data || [])
    } catch (error) {
      console.error('Error loading progress data:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.uid, dateRange])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user, loadData])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalTodosCompleted = todos.length
    
    // Category breakdown for todos
    const todoCategories = todos.reduce((acc, todo) => {
      const cat = todo.category || 'uncategorized'
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Category breakdown for habit completions
    const habitCategories = habitCompletions.reduce((acc, completion) => {
      const habit = habits.find(h => h.id === completion.habitId)
      const cat = habit?.category || 'uncategorized'
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Combine categories
    const allCategories = ['spiritual', 'physical', 'social', 'intellectual'] as const
    const categoryStats = allCategories.map(cat => ({
      category: cat,
      todos: todoCategories[cat] || 0,
      habits: habitCategories[cat] || 0,
      total: (todoCategories[cat] || 0) + (habitCategories[cat] || 0)
    }))

    const totalCategoryItems = categoryStats.reduce((sum, stat) => sum + stat.total, 0)

    // Calculate ELO gains
    // Todos: +1 ELO per completion
    const eloFromTodos = totalTodosCompleted

    // Habits: Calculate based on streak at time of completion
    // We'll estimate streak by counting consecutive completions per habit
    const habitStreaks: Record<string, number> = {}
    
    // Group completions by habit and date
    const completionsByHabit: Record<string, HabitCompletion[]> = {}
    habitCompletions.forEach(completion => {
      if (!completionsByHabit[completion.habitId]) {
        completionsByHabit[completion.habitId] = []
      }
      completionsByHabit[completion.habitId].push(completion)
    })

    // Calculate streak and ELO for each habit
    let totalEloFromHabits = 0
    Object.entries(completionsByHabit).forEach(([habitId, completions]) => {
      const habit = habits.find(h => h.id === habitId)
      if (!habit) return

      // Sort by date
      completions.sort((a, b) => a.completionDate.localeCompare(b.completionDate))
      
      // Calculate streak (simplified - count consecutive days)
      let currentStreak = 0
      let maxStreak = 0
      let previousDate: string | null = null

      completions.forEach(completion => {
        if (previousDate) {
          const prevDate = new Date(previousDate)
          const currDate = new Date(completion.completionDate)
          const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
          
          if (daysDiff === 1) {
            currentStreak++
          } else {
            currentStreak = 1
          }
        } else {
          currentStreak = 1
        }
        
        maxStreak = Math.max(maxStreak, currentStreak)
        previousDate = completion.completionDate
      })

      habitStreaks[habitId] = maxStreak

      // Estimate ELO gain for each completion
      // Use a base ELO and calculate change
      let estimatedElo = DEFAULT_ELO
      completions.forEach(() => {
        const eloChange = calculateHabitEloChange(
          estimatedElo,
          currentStreak,
          true,
          currentStreak
        )
        totalEloFromHabits += Math.max(0, eloChange.eloChange)
        estimatedElo = eloChange.newElo
        currentStreak++
      })
    })

    const totalEloGained = eloFromTodos + totalEloFromHabits
    const totalActions = totalTodosCompleted + habitCompletions.length

    return {
      totalTodosCompleted,
      totalHabitCompletions: habitCompletions.length,
      totalActions,
      categoryStats,
      totalCategoryItems,
      eloFromTodos,
      eloFromHabits: totalEloFromHabits,
      totalEloGained,
      habitStreaks
    }
  }, [todos, habitCompletions, habits])

  if (loading || authLoading) {
    return <LoadingSpinner 
      message="Loading Progress" 
      subMessage="Analyzing your growth..."
      icon={BarChart3}
    />
  }

  if (!user) return null

  const { start, end } = dateRange

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2">
                Progress & Growth 📈
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                Track your repentance and transformation over time
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={timeFrame} onValueChange={(value) => setTimeFrame(value as TimeFrame)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time frame" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {timeFrame !== 'custom' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{start} to {end}</span>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Actions</CardTitle>
                <Target className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.totalActions}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalTodosCompleted} todos + {stats.totalHabitCompletions} habits
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Todos Completed</CardTitle>
                <CheckSquare className="w-5 h-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{stats.totalTodosCompleted}</div>
              <p className="text-xs text-muted-foreground mt-1">Tasks finished</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Habit Completions</CardTitle>
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.totalHabitCompletions}</div>
              <p className="text-xs text-muted-foreground mt-1">Streaks maintained</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">ELO Gained</CardTitle>
                <Trophy className="w-5 h-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">+{stats.totalEloGained}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.eloFromTodos} from todos, {Math.round(stats.eloFromHabits)} from habits
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ELO Breakdown */}
        <Card className="mb-6 sm:mb-8 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              ELO Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">From Todos</span>
                  <span className="text-lg font-bold text-emerald-600">+{stats.eloFromTodos}</span>
                </div>
                <Progress 
                  value={stats.totalEloGained > 0 ? (stats.eloFromTodos / stats.totalEloGained) * 100 : 0} 
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">From Habits</span>
                  <span className="text-lg font-bold text-orange-600">+{Math.round(stats.eloFromHabits)}</span>
                </div>
                <Progress 
                  value={stats.totalEloGained > 0 ? (stats.eloFromHabits / stats.totalEloGained) * 100 : 0} 
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.categoryStats.map(({ category, todos, habits, total }) => {
                const config = categoryConfig[category]
                const IconComponent = config.icon
                const percentage = stats.totalCategoryItems > 0 
                  ? Math.round((total / stats.totalCategoryItems) * 100) 
                  : 0

                return (
                  <Card key={category} className={`${config.bgColor} border ${config.borderColor} hover:shadow-md transition-all duration-300`}>
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg bg-white/50`}>
                          <IconComponent className={`w-5 h-5 ${config.textColor}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-foreground text-sm">{config.title}</h3>
                          <p className="text-xs text-muted-foreground">{percentage}% of actions</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total</span>
                          <span className="font-bold text-foreground">{total}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Todos</span>
                          <span className="text-emerald-600 font-medium">{todos}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Habits</span>
                          <span className="text-orange-600 font-medium">{habits}</span>
                        </div>
                        <Progress value={percentage} className="h-1.5 mt-2" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {stats.totalActions === 0 && (
          <Card className="bg-secondary/30 border-border">
            <CardContent className="p-8 sm:p-12 text-center">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Progress Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start completing todos and habits to see your progress here!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

