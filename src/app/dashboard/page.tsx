'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  Plus, 
  Brain, 
  Heart, 
  Users, 
  Dumbbell,
  TrendingUp,
  Award,
  Clock,
  ArrowRight,
  ListTodo,
  Flame,
  BookOpen
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Goal, UserELO } from '@/lib/firebase'
import { goalsService, userELOService } from '@/lib/database'
import { getRankInfo } from '@/lib/elo'
import GoalModal from '@/components/GoalModal'
import DashboardNav from '@/components/DashboardNav'
import Link from 'next/link'

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

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loadingGoals, setLoadingGoals] = useState(true)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [userELO, setUserELO] = useState<UserELO | null>(null)
  const [eloLoading, setEloLoading] = useState(true)

  const loadGoals = useCallback(async () => {
    if (!user?.uid) return

    try {
      const { data, error } = await goalsService.getAll(user.uid)

      if (error) throw error
      setGoals(data || [])
    } catch (error) {
      console.error('Error loading goals:', error)
    } finally {
      setLoadingGoals(false)
    }
  }, [user?.uid])

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
    if (!loading && !user) {
      router.push('/signin')
    } else if (user) {
      loadGoals()
      loadUserELO()
    }
  }, [user, loading, router, loadGoals, loadUserELO])

  const handleCreateGoal = () => {
    setIsGoalModalOpen(true)
  }

  const handleGoalCreated = () => {
    loadGoals()
  }

  const getOverallStats = () => {
    const totalGoals = goals.length
    const completedGoals = goals.filter(goal => goal.status === 'completed').length
    const activeGoals = goals.filter(goal => goal.status === 'active').length
    const avgProgress = totalGoals > 0
      ? Math.round(goals.reduce((sum, goal) => sum + (goal.progressPercentage || 0), 0) / totalGoals)
      : 0

    return { totalGoals, completedGoals, activeGoals, avgProgress }
  }

  // Get today's focus goals (active goals due soon or overdue)
  const getTodaysFocus = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return goals
      .filter(goal => goal.status === 'active')
      .map(goal => {
        const targetDate = new Date(goal.targetDate)
        targetDate.setHours(0, 0, 0, 0)
        const daysUntil = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        return { ...goal, daysUntil }
      })
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 3)
  }

  if (loading || loadingGoals) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto animate-pulse">
            <Target className="w-10 h-10 text-primary animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2 animate-pulse">Loading Your Dashboard</h3>
          <p className="text-muted-foreground animate-pulse">Preparing your goals and progress...</p>
          <div className="mt-8 flex justify-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  const overallStats = getOverallStats()
  const todaysFocus = getTodaysFocus()

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2 sm:mb-3">
            Welcome back! 👋
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl">
            Track your progress and achieve your goals across all four areas of life.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] xs:text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider truncate">Total Goals</p>
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground mt-0.5 sm:mt-1 leading-tight">{overallStats.totalGoals}</p>
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-primary/5 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 text-primary">
                    <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] xs:text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider truncate">Completed</p>
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-emerald-600 mt-0.5 sm:mt-1 leading-tight">{overallStats.completedGoals}</p>
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-emerald-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 text-emerald-600">
                    <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] xs:text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider truncate">Active</p>
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-amber-600 mt-0.5 sm:mt-1 leading-tight">{overallStats.activeGoals}</p>
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-amber-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 text-amber-600">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] xs:text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider truncate">Avg Progress</p>
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-violet-600 mt-0.5 sm:mt-1 leading-tight">{overallStats.avgProgress}%</p>
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-violet-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 text-violet-600">
                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* ELO Rank Card */}
          {!eloLoading && userELO && (
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 shadow-sm mb-6 sm:mb-8">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Habit Rank</p>
                    <p className="text-xl sm:text-2xl font-bold text-purple-700">{userELO.currentRank}</p>
                    <p className="text-xs text-muted-foreground mt-1">{userELO.eloRating} ELO</p>
                  </div>
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${getRankInfo(userELO.currentRank).color} rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md`}>
                    <span>{userELO.currentRank.split(' ')[0][0]}{userELO.currentRank.split(' ')[1]?.[0] || ''}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-primary text-primary-foreground border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-[1.02] active:scale-[0.98]"
                onClick={handleCreateGoal}>
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-foreground/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-1">Create New Goal</h3>
                  <p className="text-sm sm:text-base text-primary-foreground/80">
                    Set a new goal and start your journey
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Link href="/streaks">
            <Card className="bg-orange-50 border-orange-100 hover:border-orange-200 transition-all duration-300 cursor-pointer group hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600 group-hover:animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-orange-900 mb-1 transition-colors duration-300 group-hover:text-orange-700">Daily Streaks</h3>
                    <p className="text-sm sm:text-base text-orange-800/80">
                      Build consistent habits
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-orange-600 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/how-it-works">
            <Card className="bg-blue-50 border-blue-100 hover:border-blue-200 transition-all duration-300 cursor-pointer group hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-1 transition-colors duration-300 group-hover:text-blue-700">How It Works</h3>
                    <p className="text-sm sm:text-base text-blue-800/80">
                      Learn about the app
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Today's Focus */}
        {todaysFocus.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Today's Focus</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/goals">
                  View All Goals
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-4">
              {todaysFocus.map((goal) => {
                const config = categoryConfig[goal.category]
                const IconComponent = config.icon
                return (
                  <Link key={goal.id} href="/goals">
                    <Card className="hover:shadow-md transition-all duration-300 border bg-card cursor-pointer overflow-hidden hover:scale-[1.01] active:scale-[0.99] group">
                      <div className={`h-1 bg-gradient-to-r ${config.color}`}></div>
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className={`p-2 rounded-lg ${config.bgColor} flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                              <IconComponent className={`w-4 h-4 ${config.textColor} transition-transform duration-300 group-hover:rotate-6`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-foreground mb-1 truncate group-hover:text-primary transition-colors duration-300">{goal.outcome}</h3>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Badge variant="outline" className="text-xs transition-colors duration-300 group-hover:border-primary/50">
                                  {config.title}
                                </Badge>
                                <span className={`font-medium transition-colors duration-300 ${
                                  goal.daysUntil < 0 ? 'text-red-600' : 
                                  goal.daysUntil === 0 ? 'text-orange-600' : 
                                  'text-blue-600'
                                }`}>
                                  {goal.daysUntil < 0 ? `${Math.abs(goal.daysUntil)} days overdue` :
                                   goal.daysUntil === 0 ? 'Due today!' :
                                   `${goal.daysUntil} days left`}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-2xl font-bold text-foreground transition-transform duration-300 group-hover:scale-110">{goal.progressPercentage || 0}%</div>
                            <div className="text-xs text-muted-foreground">Progress</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* View All Goals CTA */}
        {goals.length > 0 && (
          <Link href="/goals">
            <Card className="bg-secondary/30 border border-border hover:border-primary/30 transition-all duration-300 cursor-pointer hover:scale-[1.01] active:scale-[0.99] hover:shadow-lg group">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <ListTodo className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">View All Goals</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        Manage and track all your goals in one place
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all duration-300" />
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>

      {/* Modals */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onGoalCreated={handleGoalCreated}
        userId={user.uid}
      />
    </div>
  )
} 