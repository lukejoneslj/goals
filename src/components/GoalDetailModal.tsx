'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Heart, 
  Dumbbell, 
  Users, 
  Brain,
  Target,
  Calendar,
  AlertTriangle,
  Lightbulb,
  FileText,
  MessageCircle,
  CheckCircle,
  Play,
  Pause
} from 'lucide-react'
import { Goal } from '@/lib/firebase'
import { goalsService } from '@/lib/database'
import { parseLocalDate } from '@/lib/utils'
import ActionItemManager from './ActionItemManager'

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

const statusConfig = {
  planning: { label: 'Planning', color: 'bg-gray-100 text-gray-800' },
  active: { label: 'Active', color: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
  paused: { label: 'Paused', color: 'bg-yellow-100 text-yellow-800' },
  abandoned: { label: 'Abandoned', color: 'bg-red-100 text-red-800' }
}

interface GoalDetailModalProps {
  goalId: string | null
  isOpen: boolean
  onClose: () => void
  onGoalUpdated: () => void
}

export default function GoalDetailModal({ goalId, isOpen, onClose, onGoalUpdated }: GoalDetailModalProps) {
  const [goal, setGoal] = useState<Goal | null>(null)
  const [loading, setLoading] = useState(false)

  const loadGoal = useCallback(async () => {
    if (!goalId) return

    setLoading(true)
    try {
      const { data, error } = await goalsService.get(goalId)

      if (error) throw error
      setGoal(data)
    } catch (error) {
      console.error('Error loading goal:', error)
      alert('Error loading goal')
    } finally {
      setLoading(false)
    }
  }, [goalId])

  useEffect(() => {
    if (goalId && isOpen) {
      loadGoal()
    }
  }, [goalId, isOpen, loadGoal])

  const updateGoalProgress = async (progressPercentage: number) => {
    if (!goal) return

    try {
      const { error } = await goalsService.update(goal.id, { progressPercentage })

      if (error) throw error

      setGoal(prev => prev ? { ...prev, progressPercentage } : null)
      onGoalUpdated()
    } catch (error) {
      console.error('Error updating goal progress:', error)
    }
  }

  const updateGoalStatus = async (newStatus: Goal['status']) => {
    if (!goal) return

    try {
      const { error } = await goalsService.update(goal.id, { status: newStatus })

      if (error) throw error

      setGoal(prev => prev ? { ...prev, status: newStatus } : null)
      onGoalUpdated()
    } catch (error) {
      console.error('Error updating goal status:', error)
      alert('Error updating goal status')
    }
  }

  const getDaysUntilTarget = () => {
    if (!goal) return 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const target = parseLocalDate(goal.targetDate)
    target.setHours(0, 0, 0, 0)
    const diffTime = target.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  if (!goal || loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loading Goal...</DialogTitle>
          </DialogHeader>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const config = categoryConfig[goal.category]
  const IconComponent = config.icon
  const daysUntilTarget = getDaysUntilTarget()
  const status = statusConfig[goal.status]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-6xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold flex items-center min-w-0 flex-1">
              <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 ${config.textColor} flex-shrink-0`} />
              <span className="truncate">{goal.outcome}</span>
            </DialogTitle>
            <div className="flex items-center space-x-2 flex-wrap">
              <Badge className={`${config.textColor} ${config.borderColor} text-xs sm:text-sm`}>
                {config.title}
              </Badge>
              <Badge className={`${status.color} text-xs sm:text-sm`}>
                {status.label}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Goal Overview */}
          <Card className={`border-l-4 ${config.borderColor} ${config.bgColor}`}>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    Target Date
                  </div>
                  <p className="text-lg font-semibold">
                    {new Date(goal.targetDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {daysUntilTarget > 0 && `${daysUntilTarget} days remaining`}
                    {daysUntilTarget === 0 && 'Due today!'}
                    {daysUntilTarget < 0 && `${Math.abs(daysUntilTarget)} days overdue`}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm font-medium text-gray-700">
                    <Target className="w-4 h-4 mr-2" />
                    Progress
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-2xl font-bold">{goal.progressPercentage || 0}%</span>
                    </div>
                    <Progress value={goal.progressPercentage || 0} className="h-3" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Status Actions</div>
                  <div className="flex flex-wrap gap-2">
                    {goal.status === 'planning' && (
                      <Button
                        onClick={() => updateGoalStatus('active')}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Start Goal
                      </Button>
                    )}
                    {goal.status === 'active' && (
                      <>
                        <Button
                          onClick={() => updateGoalStatus('completed')}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                        <Button
                          onClick={() => updateGoalStatus('paused')}
                          size="sm"
                          variant="outline"
                        >
                          <Pause className="w-4 h-4 mr-1" />
                          Pause
                        </Button>
                      </>
                    )}
                    {goal.status === 'paused' && (
                      <Button
                        onClick={() => updateGoalStatus('active')}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Resume
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabbed Content */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">7-Step Overview</TabsTrigger>
              <TabsTrigger value="actions">Action Items</TabsTrigger>
              <TabsTrigger value="details">Full Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Step 1: Outcome */}
                <Card className="border-l-4 border-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Badge className="bg-blue-500 text-white mr-3 px-2 py-1">1</Badge>
                      <Target className="w-5 h-5 mr-2" />
                      Desired Outcome
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-900 font-medium">{goal.outcome}</p>
                  </CardContent>
                </Card>

                {/* Step 2: Target Date */}
                <Card className="border-l-4 border-green-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Badge className="bg-green-500 text-white mr-3 px-2 py-1">2</Badge>
                      <Calendar className="w-5 h-5 mr-2" />
                      Target Date
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-900 font-medium">
                      {new Date(goal.targetDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {daysUntilTarget > 0 && `${daysUntilTarget} days remaining`}
                      {daysUntilTarget === 0 && 'Due today!'}
                      {daysUntilTarget < 0 && `${Math.abs(daysUntilTarget)} days overdue`}
                    </p>
                  </CardContent>
                </Card>

                {/* Step 2: Target Date */}
                <Card className="border-l-4 border-green-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Badge className="bg-green-500 text-white mr-3 px-2 py-1">2</Badge>
                      <Calendar className="w-5 h-5 mr-2" />
                      Target Date
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-900 font-medium">
                      {new Date(goal.targetDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {daysUntilTarget > 0 && `${daysUntilTarget} days remaining`}
                      {daysUntilTarget === 0 && 'Due today!'}
                      {daysUntilTarget < 0 && `${Math.abs(daysUntilTarget)} days overdue`}
                    </p>
                  </CardContent>
                </Card>

                {/* Step 3: Obstacles */}
                <Card className="border-l-4 border-red-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Badge className="bg-red-500 text-white mr-3 px-2 py-1">3</Badge>
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Obstacles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {goal.obstacles && goal.obstacles.length > 0 ? (
                      <ul className="space-y-2">
                        {goal.obstacles.map((obstacle, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="text-gray-700">{obstacle}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No obstacles identified</p>
                    )}
                  </CardContent>
                </Card>

                {/* Step 4: Resources */}
                <Card className="border-l-4 border-yellow-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Badge className="bg-yellow-500 text-white mr-3 px-2 py-1">4</Badge>
                      <Lightbulb className="w-5 h-5 mr-2" />
                      Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {goal.resources && goal.resources.length > 0 ? (
                      <ul className="space-y-2">
                        {goal.resources.map((resource, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="text-gray-700">{resource}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No resources identified</p>
                    )}
                  </CardContent>
                </Card>

                {/* Step 5: Detailed Plan */}
                <Card className="border-l-4 border-purple-500 md:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Badge className="bg-purple-500 text-white mr-3 px-2 py-1">5</Badge>
                      <FileText className="w-5 h-5 mr-2" />
                      Detailed Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {goal.detailedPlan ? (
                      <p className="text-gray-700 whitespace-pre-wrap">{goal.detailedPlan}</p>
                    ) : (
                      <p className="text-gray-500 italic">No detailed plan provided</p>
                    )}
                  </CardContent>
                </Card>

                {/* Step 7: Why/Leverage */}
                <Card className="border-l-4 border-indigo-500 md:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Badge className="bg-indigo-500 text-white mr-3 px-2 py-1">7</Badge>
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Why This Matters (Leverage)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-wrap">{goal.whyLeverage}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="actions" className="mt-6">
              {/* Step 6: Action Items */}
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <Badge className="bg-orange-500 text-white mr-3 px-2 py-1">6</Badge>
                  <h3 className="text-xl font-semibold">Massive Action - Manageable Chunks</h3>
                </div>
                <ActionItemManager 
                  goalId={goal.id} 
                  onProgressUpdate={updateGoalProgress}
                />
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <div className="space-y-6">
                {goal.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Additional Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 whitespace-pre-wrap">{goal.notes}</p>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Goal History</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Created:</span>
                      <span>{goal.createdAt ? new Date(goal.createdAt).toLocaleDateString() : 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Last Updated:</span>
                      <span>{goal.updatedAt ? new Date(goal.updatedAt).toLocaleDateString() : 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Status:</span>
                      <Badge className={status.color}>{status.label}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
} 