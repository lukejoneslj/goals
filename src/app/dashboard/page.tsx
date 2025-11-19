'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Target, 
  LogOut, 
  Plus, 
  Brain, 
  Heart, 
  Users, 
  Dumbbell,
  Calendar,
  Trash2,
  CheckCircle,
  Eye,
  TrendingUp,
  Award,
  Clock,
  AlertTriangle,
  FileText,
  ArrowRight
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Goal } from '@/lib/firebase'
import { goalsService } from '@/lib/database'
import GoalModal from '@/components/GoalModal'
import GoalDetailModal from '@/components/GoalDetailModal'
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
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loadingGoals, setLoadingGoals] = useState(true)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)

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

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin')
    } else if (user) {
      loadGoals()
    }
  }, [user, loading, router, loadGoals])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleCreateGoal = () => {
    setIsGoalModalOpen(true)
  }

  const handleGoalCreated = () => {
    loadGoals()
  }

  const handleViewGoal = (goalId: string) => {
    setSelectedGoalId(goalId)
    setIsDetailModalOpen(true)
  }

  const handleGoalUpdated = () => {
    loadGoals()
  }

  const deleteGoal = async (goalId: string, event: React.MouseEvent) => {
    event.stopPropagation()

    if (!confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await goalsService.delete(goalId)

      if (error) throw error

      loadGoals()
    } catch (error) {
      console.error('Error deleting goal:', error)
      alert('Error deleting goal')
    }
  }

  const getCategoryStats = (category: string) => {
    const categoryGoals = goals.filter(goal => goal.category === category)
    const totalGoals = categoryGoals.length
    const completedGoals = categoryGoals.filter(goal => goal.status === 'completed').length
    const avgProgress = totalGoals > 0
      ? Math.round(categoryGoals.reduce((sum, goal) => sum + (goal.progressPercentage || 0), 0) / totalGoals)
      : 0

    return { totalGoals, completedGoals, avgProgress }
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

  if (loading || loadingGoals) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <Target className="w-8 h-8 text-primary animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Loading Your Dashboard</h3>
          <p className="text-muted-foreground">Preparing your goals and progress...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const overallStats = getOverallStats()

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 sm:py-3 md:py-4">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary-foreground" />
              </div>
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-foreground tracking-tight truncate">
                RepentDaily
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-shrink-0">
              <div className="hidden sm:flex items-center space-x-2 md:space-x-3 bg-secondary/50 rounded-full px-2 md:px-4 py-1.5 md:py-2 border border-border/50">
                <Avatar className="w-6 h-6 md:w-8 md:h-8 border border-border">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs md:text-sm">
                    {user.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-foreground font-medium text-xs md:text-sm hidden md:inline truncate max-w-[120px] lg:max-w-none">{user.email || user.displayName}</span>
              </div>
              <Button 
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
                className="hover:bg-destructive/10 hover:text-destructive transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3 md:px-4"
              >
                <LogOut className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Welcome Section */}
        <div className="mb-8 sm:mb-10 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-3 sm:mb-4">
            Welcome back! 👋
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 md:mb-10 max-w-2xl">
            Track your progress and achieve your goals across all four areas of life.
          </p>

          {/* Overall Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Goals</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mt-1">{overallStats.totalGoals}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-primary/5 rounded-xl flex items-center justify-center flex-shrink-0 text-primary">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">Completed</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-600 mt-1">{overallStats.completedGoals}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0 text-emerald-600">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">Active</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-600 mt-1">{overallStats.activeGoals}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 text-amber-600">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">Avg Progress</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-violet-600 mt-1">{overallStats.avgProgress}%</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0 text-violet-600">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Navigation - Goal Creation CTA */}
        <Card className="mb-4 sm:mb-6 md:mb-8 bg-primary text-primary-foreground border-none shadow-lg cursor-pointer group"
              onClick={() => {
                const createGoalButton = document.querySelector('[data-create-goal-button]')
                if (createGoalButton) {
                  createGoalButton.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
              }}>
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center flex-1 min-w-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary-foreground/10 rounded-2xl flex items-center justify-center mr-3 sm:mr-4 md:mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-foreground mb-1 sm:mb-2">Create New Goal</h3>
                  <p className="text-sm sm:text-base md:text-xl text-primary-foreground/80">
                    Set a new goal and start your journey toward growth
                  </p>
                </div>
              </div>
              <Button 
                size="lg"
                variant="secondary"
                className="text-secondary-foreground font-bold px-6 sm:px-8 py-3 sm:py-4 shadow-md w-full sm:w-auto hover:bg-secondary/90"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCreateGoal()
                }}
              >
                Create Goal
                <Plus className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Navigation - Daily Streaks */}
        <Card className="mb-4 sm:mb-6 md:mb-12 bg-orange-50 border-orange-100 hover:border-orange-200 transition-all duration-300">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center flex-1 min-w-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-orange-100 rounded-2xl flex items-center justify-center mr-3 sm:mr-4 md:mr-6 flex-shrink-0">
                  <span className="text-2xl sm:text-3xl">🔥</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-900 mb-1 sm:mb-2">Daily Streaks</h3>
                  <p className="text-sm sm:text-base md:text-xl text-orange-800/80">
                    Build consistent habits and track your daily progress
                  </p>
                </div>
              </div>
              <Button 
                asChild 
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 sm:px-8 py-3 sm:py-4 font-bold shadow-md w-full sm:w-auto"
              >
                <Link href="/streaks">
                  View Streaks
                  <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Luke 2:52 Quote */}
        <Card className="mb-4 sm:mb-6 md:mb-12 bg-secondary text-secondary-foreground border-none shadow-md">
          <CardContent className="p-4 sm:p-6 md:p-8 text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif font-bold mb-2 sm:mb-3 md:mb-4 leading-tight">
              &ldquo;And Jesus increased in wisdom and stature, and in favour with God and man.&rdquo;
            </h2>
            <p className="text-secondary-foreground/80 text-sm sm:text-base md:text-xl mb-2 font-medium">— Luke 2:52</p>
            <p className="text-sm sm:text-base md:text-lg text-secondary-foreground/60 mt-4 sm:mt-6 uppercase tracking-widest font-bold text-xs">
              Spiritual • Physical • Social • Intellectual
            </p>
          </CardContent>
        </Card>

        {/* Goal Categories Overview */}
        <div className="mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 sm:mb-6 md:mb-8 tracking-tight">Progress by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {Object.entries(categoryConfig).map(([category, config]) => {
              const stats = getCategoryStats(category)
              const IconComponent = config.icon

              return (
                <Card 
                  key={category}
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 bg-card border-border overflow-hidden"
                >
                  <div className={`h-1 bg-gradient-to-r ${config.color}`}></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold text-foreground mb-1">
                          {config.title}
                        </CardTitle>
                        <p className="text-muted-foreground text-sm font-medium">
                          {stats.totalGoals} goal{stats.totalGoals !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className={`p-3 rounded-xl bg-secondary/50 group-hover:bg-secondary transition-colors duration-300`}>
                        <IconComponent className={`w-6 h-6 ${config.textColor}`} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-muted-foreground">Progress</span>
                          <span className="font-bold text-foreground">{stats.avgProgress}%</span>
                        </div>
                        <Progress 
                          value={stats.avgProgress} 
                          className="h-2 bg-secondary"
                        />
                      </div>
                      <div className="flex justify-between text-xs pt-2 border-t border-border/50">
                        <span className="text-emerald-600 font-medium">
                          ✓ {stats.completedGoals} completed
                        </span>
                        <span className="text-amber-600 font-medium">
                          ⚡ {stats.totalGoals - stats.completedGoals} active
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Add New Goal Button */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <Button 
            onClick={handleCreateGoal}
            data-create-goal-button
            className="bg-primary text-primary-foreground hover:opacity-90 px-6 sm:px-8 md:px-12 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto rounded-full"
            size="lg"
          >
            <Plus className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
            Create New Goal
          </Button>
          <p className="text-muted-foreground mt-3 sm:mt-4 text-sm sm:text-base md:text-lg">
            Set a new goal and start your journey toward growth
          </p>
        </div>

        {/* Goals List */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight">Your Goals</h2>
          
          {goals.length === 0 ? (
            <Card className="text-center py-12 sm:py-16 bg-card border-dashed border-2 border-border shadow-none">
              <CardContent>
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">Ready to Start Your Journey?</h3>
                <p className="text-muted-foreground mb-8 text-base sm:text-lg max-w-md mx-auto">
                  Create your first goal and begin growing in all four areas of life: spiritual, physical, social, and intellectual.
                </p>
                <Button 
                  onClick={handleCreateGoal}
                  className="bg-primary text-primary-foreground px-8 py-3 text-lg font-bold shadow-md hover:shadow-lg transition-all duration-300"
                  size="lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {goals.map((goal) => {
                const config = categoryConfig[goal.category]
                const IconComponent = config.icon
                const daysUntilTarget = Math.ceil(
                  (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                )

                return (
                  <Card 
                    key={goal.id}
                    className="group hover:shadow-md transition-all duration-300 border bg-card cursor-pointer overflow-hidden"
                    onClick={() => handleViewGoal(goal.id)}
                  >
                    <div className={`h-1 bg-gradient-to-r ${config.color}`}></div>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-3 sm:mb-4">
                            <div className={`p-2 rounded-lg ${config.bgColor} mr-3`}>
                              <IconComponent className={`w-4 h-4 ${config.textColor}`} />
                            </div>
                            <Badge variant="outline" className={`${config.textColor} border-${config.borderColor.split('-')[1]}-200 bg-transparent px-3 py-1`}>
                              {config.title}
                            </Badge>
                            <Badge 
                              variant={goal.status === 'completed' ? 'default' : 'secondary'}
                              className="ml-3 px-3 py-1"
                            >
                              {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4 group-hover:text-primary transition-colors duration-300">
                            {goal.outcome}
                          </CardTitle>
                          <div className="flex flex-wrap items-center text-muted-foreground gap-2 sm:gap-3 md:gap-6">
                            <div className="flex items-center bg-secondary rounded-md px-2 sm:px-3 py-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                              <span className="font-medium text-xs sm:text-sm">
                                {new Date(goal.targetDate).toLocaleDateString()}
                              </span>
                            </div>
                            {daysUntilTarget !== 0 && (
                              <div className={`flex items-center rounded-md px-2 sm:px-3 py-1 ${
                                daysUntilTarget > 0 ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
                              }`}>
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                                <span className="font-medium text-xs sm:text-sm">
                                  {daysUntilTarget > 0 ? `${daysUntilTarget} days left` : `${Math.abs(daysUntilTarget)} days overdue`}
                                </span>
                              </div>
                            )}
                            {daysUntilTarget === 0 && (
                              <div className="flex items-center bg-orange-50 text-orange-700 rounded-md px-2 sm:px-3 py-1">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                                <span className="font-medium text-xs sm:text-sm">Due Today!</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-1 sm:space-x-2 ml-2 sm:ml-4 md:ml-6 flex-shrink-0">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:bg-secondary p-2 h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewGoal(goal.id)
                            }}
                          >
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:bg-destructive/10 hover:text-destructive p-2 h-8 w-8"
                            onClick={(e) => deleteGoal(goal.id, e)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4 sm:space-y-6">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-muted-foreground">Progress</span>
                            <span className="font-bold text-foreground">{goal.progressPercentage || 0}%</span>
                          </div>
                          <Progress value={goal.progressPercentage || 0} className="h-2 bg-secondary" />
                        </div>
                        
                        <div className="bg-secondary/30 rounded-lg p-4 border border-border/50">
                          <p className="font-semibold text-foreground mb-1 text-sm">Why this matters:</p>
                          <p className="text-muted-foreground text-sm line-clamp-2 italic">{goal.whyLeverage}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                          {goal.obstacles && goal.obstacles.length > 0 && (
                            <div className="bg-red-50/50 rounded-lg p-3 sm:p-4 border border-red-100">
                              <p className="font-semibold text-red-800 mb-2 flex items-center text-sm">
                                <AlertTriangle className="w-3 h-3 mr-2" />
                                Obstacles
                              </p>
                              <ul className="space-y-1.5">
                                {goal.obstacles.slice(0, 2).map((obstacle, index) => (
                                  <li key={index} className="text-red-700 text-xs sm:text-sm flex items-start">
                                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                    <span className="line-clamp-1">{obstacle}</span>
                                  </li>
                                ))}
                                {goal.obstacles.length > 2 && (
                                  <li className="text-red-600 text-xs">+ {goal.obstacles.length - 2} more</li>
                                )}
                              </ul>
                            </div>
                          )}

                          {goal.resources && goal.resources.length > 0 && (
                            <div className="bg-green-50/50 rounded-lg p-3 sm:p-4 border border-green-100">
                              <p className="font-semibold text-green-800 mb-2 flex items-center text-sm">
                                <CheckCircle className="w-3 h-3 mr-2" />
                                Resources
                              </p>
                              <ul className="space-y-1.5">
                                {goal.resources.slice(0, 2).map((resource, index) => (
                                  <li key={index} className="text-green-700 text-xs sm:text-sm flex items-start">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                    <span className="line-clamp-1">{resource}</span>
                                  </li>
                                ))}
                                {goal.resources.length > 2 && (
                                  <li className="text-green-600 text-xs">+ {goal.resources.length - 2} more</li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Goals Guide Link - Moved to bottom for better UX */}
        <Card className="mb-6 sm:mb-8 md:mb-12 bg-secondary/30 border border-border hover:border-primary/30 transition-all duration-300 cursor-pointer mt-12">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-4 gap-4">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">Master Your Goal Setting</h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Ready to take your goals to the next level? Learn the complete methodology behind effective goal setting.
            </p>
            <Button 
              asChild 
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 font-bold px-8"
            >
              <Link href="/goals-guide">
                Read the Complete Guide
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onGoalCreated={handleGoalCreated}
        userId={user.uid}
      />

      <GoalDetailModal
        goalId={selectedGoalId}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedGoalId(null)
        }}
        onGoalUpdated={handleGoalUpdated}
      />
    </div>
  )
} 