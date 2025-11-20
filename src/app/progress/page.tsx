'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
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
  Target,
  Download
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Todo, HabitCompletion, Habit, Goal } from '@/lib/firebase'
import { todosService, habitCompletionsService, habitsService, goalsService } from '@/lib/database'
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
  const [allTodos, setAllTodos] = useState<Todo[]>([])
  const [habitCompletions, setHabitCompletions] = useState<HabitCompletion[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
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

      // Get all todos (not just completed ones) and all goals for the user
      const [allTodosResult, todosResult, completionsResult, habitsResult, goalsResult] = await Promise.all([
        todosService.getAll(user.uid), // Get all todos to check what was due each day
        todosService.getCompletedInRange(user.uid, start, end),
        habitCompletionsService.getCompletionsInRange(user.uid, start, end),
        habitsService.getAll(user.uid),
        goalsService.getAll(user.uid)
      ])

      if (allTodosResult.error) throw allTodosResult.error
      if (todosResult.error) throw todosResult.error
      if (completionsResult.error) throw completionsResult.error
      if (habitsResult.error) throw habitsResult.error
      if (goalsResult.error) throw goalsResult.error

      setTodos(todosResult.data || [])
      setAllTodos(allTodosResult.data || [])
      setHabitCompletions(completionsResult.data || [])
      setHabits(habitsResult.data || [])
      setGoals(goalsResult.data || [])
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

  // Generate and export progress report
  const generateProgressReport = async () => {
    const { start, end } = dateRange
    const report: string[] = []

    // Header
    report.push('='.repeat(80))
    report.push('PROGRESS REPORT')
    report.push('='.repeat(80))
    report.push(`Period: ${start} to ${end}`)
    report.push(`Generated: ${new Date().toLocaleString()}`)
    report.push('')

    // Calculate date range for iteration
    const startDate = new Date(start)
    const endDate = new Date(end)
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    // Group completed data by date
    const todosCompletedByDate: Record<string, Todo[]> = {}
    const habitCompletionsByDate: Record<string, HabitCompletion[]> = {}

    // Group todos by completion date
    todos.forEach(todo => {
      if (todo.completedAt) {
        const dateKey = todo.completedAt.split('T')[0]
        if (!todosCompletedByDate[dateKey]) todosCompletedByDate[dateKey] = []
        todosCompletedByDate[dateKey].push(todo)
      }
    })

    // Group habit completions by date
    habitCompletions.forEach(completion => {
      if (!habitCompletionsByDate[completion.completionDate]) {
        habitCompletionsByDate[completion.completionDate] = []
      }
      habitCompletionsByDate[completion.completionDate].push(completion)
    })

    // Group completed goals by completion date (using updatedAt as proxy)
    const goalsCompletedByDate: Record<string, Goal[]> = {}
    goals.filter(goal => goal.status === 'completed').forEach(goal => {
      if (goal.updatedAt) {
        const dateKey = goal.updatedAt.split('T')[0]
        if (!goalsCompletedByDate[dateKey]) goalsCompletedByDate[dateKey] = []
        goalsCompletedByDate[dateKey].push(goal)
      }
    })

    // Day-by-day breakdown
    report.push('DAY-BY-DAY BREAKDOWN')
    report.push('-'.repeat(80))

    let totalTodosDue = 0
    let totalTodosCompleted = 0
    let totalHabitsDue = 0
    let totalHabitsCompleted = 0

    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      const dateKey = currentDate.toISOString().split('T')[0]
      const dayOfWeek = currentDate.getDay() // 0 = Sunday, 1 = Monday, etc.
      const formattedDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      // Get todos due on this date
      const todosDueToday = allTodos.filter(todo => todo.dueDate === dateKey)
      const todosCompletedToday = todosCompletedByDate[dateKey] || []

      // Get habits scheduled for this day (based on day of week)
      const habitsDueToday = habits.filter(habit => {
        const dayMapping: Record<number, boolean> = {
          0: habit.sunday,
          1: habit.monday,
          2: habit.tuesday,
          3: habit.wednesday,
          4: habit.thursday,
          5: habit.friday,
          6: habit.saturday
        }
        return dayMapping[dayOfWeek] && habit.isActive
      })

      // Get habit completions for this day
      const habitCompletionsToday = habitCompletionsByDate[dateKey] || []

      // Get goals completed on this day
      const goalsCompletedToday = goalsCompletedByDate[dateKey] || []

      // Update totals
      totalTodosDue += todosDueToday.length
      totalTodosCompleted += todosCompletedToday.length
      totalHabitsDue += habitsDueToday.length
      totalHabitsCompleted += habitCompletionsToday.length

      report.push('')
      report.push(`${formattedDate} (${dateKey})`)
      report.push('-'.repeat(40))

      // Todos section
      report.push(`📝 TODOS (${todosCompletedToday.length}/${todosDueToday.length} completed):`)
      if (todosDueToday.length > 0) {
        todosDueToday.forEach(todo => {
          const completed = todosCompletedToday.some(ct => ct.id === todo.id)
          const status = completed ? '✅' : '❌'
          report.push(`   ${status} ${todo.title}`)
          if (todo.description) {
            report.push(`       "${todo.description}"`)
          }
        })
      } else {
        report.push('   No todos were due today')
      }

      // Habits section
      report.push(`🔥 HABITS (${habitCompletionsToday.length}/${habitsDueToday.length} completed):`)
      if (habitsDueToday.length > 0) {
        habitsDueToday.forEach(habit => {
          const completed = habitCompletionsToday.some(c => c.habitId === habit.id)
          const status = completed ? '✅' : '❌'
          report.push(`   ${status} ${habit.name}`)
          if (habit.description) {
            report.push(`       "${habit.description}"`)
          }
        })
      } else {
        report.push('   No habits were scheduled today')
      }

      // Goals completed (only if actually completed)
      if (goalsCompletedToday.length > 0) {
        report.push(`🎯 GOALS COMPLETED (${goalsCompletedToday.length}):`)
        goalsCompletedToday.forEach(goal => {
          report.push(`   ✅ ${goal.outcome}`)
          if (goal.category) {
            report.push(`       Category: ${goal.category}`)
          }
        })
      }
    }

    // Analytics section
    report.push('')
    report.push('ANALYTICS & STATISTICS')
    report.push('='.repeat(80))

    // Overall stats
    const totalActions = totalTodosCompleted + totalHabitsCompleted
    const totalItemsDue = totalTodosDue + totalHabitsDue
    const overallCompletionRate = totalItemsDue > 0 ? ((totalActions / totalItemsDue) * 100).toFixed(1) : '0'
    const daysWithActivity = new Set([
      ...Object.keys(todosCompletedByDate),
      ...Object.keys(habitCompletionsByDate)
    ]).size
    const averageActionsPerDay = daysWithActivity > 0 ? (totalActions / daysWithActivity).toFixed(1) : '0'

    report.push(`PERIOD SUMMARY:`)
    report.push(`   Total Days in Period: ${totalDays}`)
    report.push(`   Days with Activity: ${daysWithActivity}`)
    report.push(`   Overall Completion Rate: ${overallCompletionRate}%`)
    report.push(`   Average Actions per Active Day: ${averageActionsPerDay}`)
    report.push('')

    // Todo analytics
    const todoCompletionRate = totalTodosDue > 0 ? ((totalTodosCompleted / totalTodosDue) * 100).toFixed(1) : '0'
    report.push(`TODO ANALYTICS:`)
    report.push(`   Total Todos Due: ${totalTodosDue}`)
    report.push(`   Total Todos Completed: ${totalTodosCompleted}`)
    report.push(`   Completion Rate: ${todoCompletionRate}%`)
    report.push('')

    // Habit analytics
    const habitCompletionRate = totalHabitsDue > 0 ? ((totalHabitsCompleted / totalHabitsDue) * 100).toFixed(1) : '0'
    const uniqueHabitsWorked = new Set(habitCompletions.map(c => c.habitId)).size
    report.push(`HABIT ANALYTICS:`)
    report.push(`   Total Habits Due: ${totalHabitsDue}`)
    report.push(`   Total Habit Completions: ${totalHabitsCompleted}`)
    report.push(`   Completion Rate: ${habitCompletionRate}%`)
    report.push(`   Unique Habits Worked On: ${uniqueHabitsWorked}`)
    report.push('')

    // Goal analytics
    const totalGoals = goals.length
    const completedGoals = goals.filter(g => g.status === 'completed').length
    const goalCompletionRate = totalGoals > 0 ? ((completedGoals / totalGoals) * 100).toFixed(1) : '0'
    report.push(`GOAL ANALYTICS:`)
    report.push(`   Total Goals: ${totalGoals}`)
    report.push(`   Goals Completed: ${completedGoals}`)
    report.push(`   Goal Completion Rate: ${goalCompletionRate}%`)
    report.push('')

    // Category breakdown
    report.push(`CATEGORY BREAKDOWN:`)
    const categories = ['spiritual', 'physical', 'social', 'intellectual']
    categories.forEach(category => {
      // Count todos completed in this category during the period
      const categoryTodosCompleted = todos.filter(t => t.category === category).length
      // Count habit completions in this category during the period
      const categoryHabitsCompleted = habitCompletions.filter(c => {
        const habit = habits.find(h => h.id === c.habitId)
        return habit?.category === category
      }).length
      // Count goals completed in this category
      const categoryGoalsCompleted = goals.filter(g => g.category === category && g.status === 'completed').length

      const totalCategoryActions = categoryTodosCompleted + categoryHabitsCompleted + categoryGoalsCompleted
      report.push(`   ${category.charAt(0).toUpperCase() + category.slice(1)}: ${totalCategoryActions} actions (${categoryTodosCompleted} todos, ${categoryHabitsCompleted} habits, ${categoryGoalsCompleted} goals)`)
    })

    // ELO Analysis
    report.push('')
    report.push(`ELO ANALYSIS:`)
    report.push(`   ELO Gained from Todos: +${stats.eloFromTodos}`)
    report.push(`   ELO Gained from Habits: +${Math.round(stats.eloFromHabits)}`)
    report.push(`   Total ELO Gained: +${stats.totalEloGained}`)

    // Download the report
    const reportText = report.join('\n')
    const blob = new Blob([reportText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `progress-report-${start}-to-${end}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

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

              <Button
                onClick={generateProgressReport}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Report
              </Button>
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

