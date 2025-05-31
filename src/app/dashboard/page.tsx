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
  AlertTriangle
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase, Goal } from '@/lib/supabase'
import GoalModal from '@/components/GoalModal'
import GoalDetailModal from '@/components/GoalDetailModal'

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
    if (!user?.id) return
    
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setGoals(data || [])
    } catch (error) {
      console.error('Error loading goals:', error)
    } finally {
      setLoadingGoals(false)
    }
  }, [user?.id])

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
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId)

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
      ? Math.round(categoryGoals.reduce((sum, goal) => sum + (goal.progress_percentage || 0), 0) / totalGoals)
      : 0

    return { totalGoals, completedGoals, avgProgress }
  }

  const getOverallStats = () => {
    const totalGoals = goals.length
    const completedGoals = goals.filter(goal => goal.status === 'completed').length
    const activeGoals = goals.filter(goal => goal.status === 'active').length
    const avgProgress = totalGoals > 0 
      ? Math.round(goals.reduce((sum, goal) => sum + (goal.progress_percentage || 0), 0) / totalGoals)
      : 0

    return { totalGoals, completedGoals, activeGoals, avgProgress }
  }

  if (loading || loadingGoals) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <Target className="w-8 h-8 text-white animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Your Dashboard</h3>
          <p className="text-gray-600">Preparing your goals and progress...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const overallStats = getOverallStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Modern Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Master Goal Tracker
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 font-semibold">
                    {user.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-gray-700 font-medium">{user.email}</span>
              </div>
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
            Welcome back! 👋
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Track your progress and achieve your goals across all four areas of life.
          </p>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Goals</p>
                    <p className="text-3xl font-bold text-gray-900">{overallStats.totalGoals}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-3xl font-bold text-green-600">{overallStats.completedGoals}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Goals</p>
                    <p className="text-3xl font-bold text-orange-600">{overallStats.activeGoals}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                    <p className="text-3xl font-bold text-purple-600">{overallStats.avgProgress}%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Luke 2:52 Quote */}
        <Card className="mb-12 bg-gradient-to-r from-purple-600 to-blue-600 border-0 text-white shadow-2xl">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              &ldquo;And Jesus increased in wisdom and stature, and in favour with God and man.&rdquo;
            </h2>
            <p className="text-purple-100 text-xl mb-2">— Luke 2:52</p>
            <p className="text-lg text-purple-200 mt-6">
              Grow in all four areas: Spiritual • Physical • Social • Intellectual
            </p>
          </CardContent>
        </Card>

        {/* Goal Categories Overview */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Progress by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(categoryConfig).map(([category, config]) => {
              const stats = getCategoryStats(category)
              const IconComponent = config.icon

              return (
                <Card 
                  key={category}
                  className="group cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 bg-white/80 backdrop-blur-sm overflow-hidden"
                >
                  <div className={`h-2 bg-gradient-to-r ${config.color}`}></div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                          {config.title}
                        </CardTitle>
                        <p className="text-gray-600 font-medium">
                          {stats.totalGoals} goal{stats.totalGoals !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className={`p-4 rounded-2xl ${config.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className={`w-8 h-8 ${config.textColor}`} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-3">
                          <span className="font-medium text-gray-700">Progress</span>
                          <span className="font-bold text-gray-900">{stats.avgProgress}%</span>
                        </div>
                        <Progress 
                          value={stats.avgProgress} 
                          className="h-3"
                        />
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                        <span className="text-green-600 font-medium">
                          ✓ {stats.completedGoals} completed
                        </span>
                        <span className="text-orange-600 font-medium">
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
        <div className="text-center mb-12">
          <Button 
            onClick={handleCreateGoal}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            size="lg"
          >
            <Plus className="mr-3 h-6 w-6" />
            Create New Goal
          </Button>
          <p className="text-gray-600 mt-4 text-lg">
            Set a new goal and start your journey toward growth
          </p>
        </div>

        {/* Goals List */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900">Your Goals</h2>
          
          {goals.length === 0 ? (
            <Card className="text-center py-16 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent>
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Target className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h3>
                <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                  Create your first goal and begin growing in all four areas of life: spiritual, physical, social, and intellectual.
                </p>
                <Button 
                  onClick={handleCreateGoal}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  size="lg"
                >
                  <Plus className="mr-3 h-5 w-5" />
                  Create Your First Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8">
              {goals.map((goal) => {
                const config = categoryConfig[goal.category]
                const IconComponent = config.icon
                const daysUntilTarget = Math.ceil(
                  (new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                )

                return (
                  <Card 
                    key={goal.id}
                    className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm cursor-pointer overflow-hidden transform hover:scale-[1.02]"
                    onClick={() => handleViewGoal(goal.id)}
                  >
                    <div className={`h-2 bg-gradient-to-r ${config.color}`}></div>
                    <CardHeader className="pb-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-4">
                            <div className={`p-2 rounded-xl ${config.bgColor} mr-3`}>
                              <IconComponent className={`w-5 h-5 ${config.textColor}`} />
                            </div>
                            <Badge className={`${config.textColor} ${config.borderColor} border-2 px-3 py-1 text-sm font-medium`}>
                              {config.title}
                            </Badge>
                            <Badge 
                              variant={goal.status === 'completed' ? 'default' : 'secondary'}
                              className="ml-3 px-3 py-1 text-sm"
                            >
                              {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                            </Badge>
                          </div>
                          <CardTitle className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                            {goal.outcome}
                          </CardTitle>
                          <div className="flex items-center text-gray-600 space-x-6">
                            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span className="font-medium">
                                {new Date(goal.target_date).toLocaleDateString()}
                              </span>
                            </div>
                            {daysUntilTarget !== 0 && (
                              <div className={`flex items-center rounded-lg px-3 py-2 ${
                                daysUntilTarget > 0 ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
                              }`}>
                                <Clock className="w-4 h-4 mr-2" />
                                <span className="font-medium">
                                  {daysUntilTarget > 0 ? `${daysUntilTarget} days left` : `${Math.abs(daysUntilTarget)} days overdue`}
                                </span>
                              </div>
                            )}
                            {daysUntilTarget === 0 && (
                              <div className="flex items-center bg-orange-50 text-orange-700 rounded-lg px-3 py-2">
                                <Clock className="w-4 h-4 mr-2" />
                                <span className="font-medium">Due Today!</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-6">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="hover:scale-110 transition-transform duration-200 hover:bg-blue-50 hover:border-blue-200"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewGoal(goal.id)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="hover:scale-110 transition-transform duration-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                            onClick={(e) => deleteGoal(goal.id, e)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between text-sm mb-3">
                            <span className="font-semibold text-gray-700">Progress</span>
                            <span className="font-bold text-gray-900">{goal.progress_percentage || 0}%</span>
                          </div>
                          <Progress value={goal.progress_percentage || 0} className="h-3" />
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="font-semibold text-gray-900 mb-2">Why this matters:</p>
                          <p className="text-gray-700 line-clamp-2">{goal.why_leverage}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          {goal.obstacles && goal.obstacles.length > 0 && (
                            <div className="bg-red-50 rounded-xl p-4">
                              <p className="font-semibold text-red-800 mb-3 flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Obstacles to overcome:
                              </p>
                              <ul className="space-y-2">
                                {goal.obstacles.slice(0, 2).map((obstacle, index) => (
                                  <li key={index} className="text-red-700 text-sm flex items-start">
                                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span className="line-clamp-1">{obstacle}</span>
                                  </li>
                                ))}
                                {goal.obstacles.length > 2 && (
                                  <li className="text-red-600 text-sm">+{goal.obstacles.length - 2} more obstacles...</li>
                                )}
                              </ul>
                            </div>
                          )}

                          {goal.resources && goal.resources.length > 0 && (
                            <div className="bg-green-50 rounded-xl p-4">
                              <p className="font-semibold text-green-800 mb-3 flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Resources available:
                              </p>
                              <ul className="space-y-2">
                                {goal.resources.slice(0, 2).map((resource, index) => (
                                  <li key={index} className="text-green-700 text-sm flex items-start">
                                    <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                    <span className="line-clamp-1">{resource}</span>
                                  </li>
                                ))}
                                {goal.resources.length > 2 && (
                                  <li className="text-green-600 text-sm">+{goal.resources.length - 2} more resources...</li>
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
      </div>

      {/* Modals */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onGoalCreated={handleGoalCreated}
        userId={user.id}
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