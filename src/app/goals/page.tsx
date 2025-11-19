'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Target, 
  Plus, 
  Brain, 
  Heart, 
  Users, 
  Dumbbell,
  Calendar,
  Trash2,
  Eye,
  Clock,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  X
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Goal } from '@/lib/firebase'
import { goalsService } from '@/lib/database'
import GoalModal from '@/components/GoalModal'
import GoalDetailModal from '@/components/GoalDetailModal'
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

type StatusFilter = 'all' | 'planning' | 'active' | 'completed' | 'paused' | 'abandoned'
type CategoryFilter = 'all' | 'spiritual' | 'physical' | 'social' | 'intellectual'

export default function GoalsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loadingGoals, setLoadingGoals] = useState(true)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')

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

  // Filter goals
  const filteredGoals = goals.filter(goal => {
    const matchesSearch = searchQuery === '' || 
      goal.outcome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.whyLeverage?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || goal.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || goal.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const activeGoals = goals.filter(g => g.status === 'active')
  const completedGoals = goals.filter(g => g.status === 'completed')

  if (loading || loadingGoals) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto animate-pulse">
            <Target className="w-10 h-10 text-primary animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2 animate-pulse">Loading Your Goals</h3>
          <p className="text-muted-foreground animate-pulse">Fetching your goals...</p>
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

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2">
              Your Goals
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {goals.length} total • {activeGoals.length} active • {completedGoals.length} completed
            </p>
          </div>
          <Button 
            onClick={handleCreateGoal}
            className="bg-primary text-primary-foreground hover:opacity-90 w-full sm:w-auto"
            size="lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Goal
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search goals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* Status and Category Filters */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Status:</span>
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'active', 'planning', 'completed', 'paused'] as StatusFilter[]).map((status) => (
                      <Button
                        key={status}
                        variant={statusFilter === status ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setStatusFilter(status)}
                        className="text-xs sm:text-sm"
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm font-medium text-muted-foreground">Category:</span>
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'spiritual', 'physical', 'social', 'intellectual'] as CategoryFilter[]).map((category) => (
                      <Button
                        key={category}
                        variant={categoryFilter === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCategoryFilter(category)}
                        className="text-xs sm:text-sm"
                      >
                        {category === 'all' ? 'All' : categoryConfig[category].title}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals List */}
        {filteredGoals.length === 0 ? (
          <Card className="text-center py-12 sm:py-16 bg-card border-dashed border-2 border-border shadow-none">
            <CardContent>
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-primary" />
              </div>
              {goals.length === 0 ? (
                <>
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
                </>
              ) : (
                <>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">No goals match your filters</h3>
                  <p className="text-muted-foreground mb-8 text-base sm:text-lg max-w-md mx-auto">
                    Try adjusting your search or filters to see more goals.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('')
                      setStatusFilter('all')
                      setCategoryFilter('all')
                    }}
                  >
                    Clear Filters
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {filteredGoals.map((goal) => {
              const config = categoryConfig[goal.category]
              const IconComponent = config.icon
              const daysUntilTarget = Math.ceil(
                (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              )

              return (
                <Card 
                  key={goal.id}
                  className={`group bg-card border-border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden ${
                    goal.status === 'completed' ? 'opacity-50 grayscale' : ''
                  }`}
                  onClick={() => handleViewGoal(goal.id)}
                >
                  <div className={`h-1 bg-gradient-to-r ${config.color} ${goal.status === 'completed' ? 'opacity-50' : ''}`}></div>
                  <CardHeader className={`pb-3 sm:pb-4 ${goal.status === 'completed' ? 'opacity-75' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-3 sm:mb-4 flex-wrap gap-2">
                          <div className={`p-2 rounded-lg ${config.bgColor} flex-shrink-0`}>
                            <IconComponent className={`w-4 h-4 ${config.textColor}`} />
                          </div>
                          <Badge variant="outline" className={`${config.textColor} ${config.borderColor} bg-transparent px-2 sm:px-3 py-0.5 sm:py-1 text-xs opacity-70`}>
                            {config.title}
                          </Badge>
                          <Badge 
                            variant={goal.status === 'completed' ? 'default' : 'secondary'}
                            className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs"
                          >
                            {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300 tracking-tight">
                          {goal.outcome}
                        </CardTitle>
                        <div className="flex flex-wrap items-center text-muted-foreground gap-2 sm:gap-3">
                          <div className="flex items-center bg-secondary/50 rounded-md px-2 sm:px-3 py-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                            <span className="font-medium text-xs sm:text-sm">
                              {new Date(goal.targetDate).toLocaleDateString()}
                            </span>
                          </div>
                          {daysUntilTarget !== 0 && (
                            <div className={`flex items-center rounded-md px-2 sm:px-3 py-1 ${
                              daysUntilTarget > 0 ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-red-50 text-red-700 border border-red-100'
                            }`}>
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                              <span className="font-medium text-xs sm:text-sm">
                                {daysUntilTarget > 0 ? `${daysUntilTarget} days left` : `${Math.abs(daysUntilTarget)} days overdue`}
                              </span>
                            </div>
                          )}
                          {daysUntilTarget === 0 && (
                            <div className="flex items-center bg-orange-50 text-orange-700 rounded-md px-2 sm:px-3 py-1 border border-orange-100">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                              <span className="font-medium text-xs sm:text-sm">Due Today!</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-1 sm:space-x-2 ml-2 sm:ml-4 flex-shrink-0">
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
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">Progress</span>
                          <span className="text-sm sm:text-base font-bold text-foreground">{goal.progressPercentage || 0}%</span>
                        </div>
                        <Progress value={goal.progressPercentage || 0} className="h-2 bg-secondary" />
                      </div>
                      
                      <div className="bg-secondary/30 rounded-lg p-3 sm:p-4 border border-border/50">
                        <p className="text-xs sm:text-sm font-semibold text-foreground mb-1.5 sm:mb-2">Why this matters:</p>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 italic leading-relaxed">{goal.whyLeverage}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                        {goal.obstacles && goal.obstacles.length > 0 && (
                          <div className="bg-red-50/50 rounded-lg p-3 sm:p-4 border border-red-100/50">
                            <p className="text-xs sm:text-sm font-semibold text-red-800 mb-2 flex items-center">
                              <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                              Obstacles
                            </p>
                            <ul className="space-y-1.5">
                              {goal.obstacles.slice(0, 2).map((obstacle, index) => (
                                <li key={index} className="text-xs sm:text-sm text-red-700 flex items-start">
                                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                  <span className="line-clamp-1">{obstacle}</span>
                                </li>
                              ))}
                              {goal.obstacles.length > 2 && (
                                <li className="text-xs text-red-600">+ {goal.obstacles.length - 2} more</li>
                              )}
                            </ul>
                          </div>
                        )}

                        {goal.resources && goal.resources.length > 0 && (
                          <div className="bg-emerald-50/50 rounded-lg p-3 sm:p-4 border border-emerald-100/50">
                            <p className="text-xs sm:text-sm font-semibold text-emerald-800 mb-2 flex items-center">
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                              Resources
                            </p>
                            <ul className="space-y-1.5">
                              {goal.resources.slice(0, 2).map((resource, index) => (
                                <li key={index} className="text-xs sm:text-sm text-emerald-700 flex items-start">
                                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                  <span className="line-clamp-1">{resource}</span>
                                </li>
                              ))}
                              {goal.resources.length > 2 && (
                                <li className="text-xs text-emerald-600">+ {goal.resources.length - 2} more</li>
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

