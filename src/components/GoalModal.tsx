'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  Dumbbell, 
  Users, 
  Brain,
  Plus,
  X,
  Calendar,
  Target,
  AlertTriangle,
  Lightbulb,
  FileText,
  Zap,
  MessageCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Category = 'spiritual' | 'physical' | 'social' | 'intellectual'

const categoryConfig = {
  spiritual: {
    icon: Heart,
    color: 'from-purple-500 to-purple-600',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-500',
    title: '🙏 Spiritual',
    description: 'Faith, values, and character development'
  },
  physical: {
    icon: Dumbbell,
    color: 'from-red-500 to-red-600',
    textColor: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    title: '💪 Physical',
    description: 'Health, fitness, and physical well-being'
  },
  social: {
    icon: Users,
    color: 'from-green-500 to-green-600',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    title: '👥 Social',
    description: 'Relationships and social connections'
  },
  intellectual: {
    icon: Brain,
    color: 'from-blue-500 to-blue-600',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    title: '🧠 Intellectual',
    description: 'Learning, skills, and knowledge growth'
  }
}

interface ActionItem {
  id: string
  description: string
  dueDate: string
  isCompleted: boolean
}

interface GoalModalProps {
  isOpen: boolean
  onClose: () => void
  onGoalCreated: () => void
  userId: string
}

export default function GoalModal({ isOpen, onClose, onGoalCreated, userId }: GoalModalProps) {
  const [currentStep, setCurrentStep] = useState<'category' | 'seven-steps'>('category')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    outcome: '',
    targetDate: '',
    obstacles: [''],
    resources: [''],
    detailedPlan: '',
    whyLeverage: '',
    notes: ''
  })
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('category')
      setSelectedCategory(null)
      setFormData({
        outcome: '',
        targetDate: '',
        obstacles: [''],
        resources: [''],
        detailedPlan: '',
        whyLeverage: '',
        notes: ''
      })
      setActionItems([])
    }
  }, [isOpen])

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category)
    setCurrentStep('seven-steps')
  }

  const handleBackToCategory = () => {
    setCurrentStep('category')
  }

  const addListItem = (type: 'obstacles' | 'resources') => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], '']
    }))
  }

  const updateListItem = (type: 'obstacles' | 'resources', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => i === index ? value : item)
    }))
  }

  const removeListItem = (type: 'obstacles' | 'resources', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  const addActionItem = () => {
    const newActionItem: ActionItem = {
      id: Date.now().toString(),
      description: '',
      dueDate: '',
      isCompleted: false
    }
    setActionItems(prev => [...prev, newActionItem])
  }

  const updateActionItem = (id: string, field: keyof ActionItem, value: string | boolean) => {
    setActionItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const removeActionItem = (id: string) => {
    setActionItems(prev => prev.filter(item => item.id !== id))
  }

  const handleSubmit = async () => {
    if (!selectedCategory || !formData.outcome || !formData.targetDate || !formData.whyLeverage) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      // Create the goal
      const goalData = {
        user_id: userId,
        category: selectedCategory,
        status: 'planning' as const,
        outcome: formData.outcome,
        target_date: formData.targetDate,
        obstacles: formData.obstacles.filter(o => o.trim() !== ''),
        resources: formData.resources.filter(r => r.trim() !== ''),
        detailed_plan: formData.detailedPlan || null,
        why_leverage: formData.whyLeverage,
        progress_percentage: 0,
        notes: formData.notes || null
      }

      const { data: goalResult, error: goalError } = await supabase
        .from('goals')
        .insert([goalData])
        .select()
        .single()

      if (goalError) throw goalError

      // Create action items if any
      const validActionItems = actionItems.filter(item => item.description.trim() !== '')
      if (validActionItems.length > 0) {
        const actionItemsData = validActionItems.map(item => ({
          goal_id: goalResult.id,
          action_description: item.description,
          due_date: item.dueDate || null,
          is_completed: false
        }))

        const { error: actionError } = await supabase
          .from('action_items')
          .insert(actionItemsData)

        if (actionError) throw actionError
      }

      onGoalCreated()
      onClose()
    } catch (error) {
      console.error('Error creating goal:', error)
      alert('Error creating goal. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[90vw] !w-[90vw] max-h-[95vh] overflow-y-auto p-8">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-3xl font-bold flex items-center">
            <Target className="w-8 h-8 mr-3 text-blue-600" />
            Create New Goal
          </DialogTitle>
        </DialogHeader>

        {currentStep === 'category' && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-semibold">Choose Your Goal Category</h3>
              <p className="text-gray-600 text-lg">Based on Luke 2:52 - grow in all four areas of life</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {Object.entries(categoryConfig).map(([category, config]) => {
                const IconComponent = config.icon
                return (
                  <Card
                    key={category}
                    className={`cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 ${config.borderColor} hover:border-opacity-100 border-opacity-50 h-full`}
                    onClick={() => handleCategorySelect(category as Category)}
                  >
                    <CardContent className="p-8 text-center h-full flex flex-col justify-center">
                      <div className={`inline-flex p-6 rounded-full ${config.bgColor} mb-6 mx-auto`}>
                        <IconComponent className={`w-10 h-10 ${config.textColor}`} />
                      </div>
                      <h4 className="text-xl font-semibold mb-3">{config.title}</h4>
                      <p className="text-gray-600">{config.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {currentStep === 'seven-steps' && selectedCategory && (
          <div className="space-y-8">
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleBackToCategory}
                  className="mr-2"
                >
                  ← Back
                </Button>
                <Badge className={`${categoryConfig[selectedCategory].textColor} ${categoryConfig[selectedCategory].borderColor} text-lg px-4 py-2`}>
                  {categoryConfig[selectedCategory].title}
                </Badge>
              </div>
              <div className="text-lg text-gray-600 font-medium">
                Seven Critical Steps to Effective Goal Setting
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
              {/* Left Column - Steps 1-4 */}
              <div className="space-y-8">
                {/* Step 1: Outcome */}
                <Card className="p-8 border-l-4 border-l-blue-500 bg-blue-50/30">
                  <div className="space-y-6">
                    <Label className="text-xl font-semibold flex items-center">
                      <Badge className="bg-blue-500 text-white mr-4 px-3 py-1 text-lg">1</Badge>
                      <Target className="w-6 h-6 mr-3" />
                      Write down your desired OUTCOME *
                    </Label>
                    <Input
                      placeholder="What specific outcome do you want to achieve?"
                      value={formData.outcome}
                      onChange={(e) => setFormData(prev => ({ ...prev, outcome: e.target.value }))}
                      className="text-lg py-4"
                    />
                  </div>
                </Card>

                {/* Step 2: Target Date */}
                <Card className="p-8 border-l-4 border-l-green-500 bg-green-50/30">
                  <div className="space-y-6">
                    <Label className="text-xl font-semibold flex items-center">
                      <Badge className="bg-green-500 text-white mr-4 px-3 py-1 text-lg">2</Badge>
                      <Calendar className="w-6 h-6 mr-3" />
                      Put a specific DATE of accomplishment *
                    </Label>
                    
                    {/* Quick Time Frame Buttons */}
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 font-medium">Quick Time Frames:</p>
                      <div className="grid grid-cols-3 lg:grid-cols-4 gap-3">
                        {[
                          { label: '1 Week', days: 7 },
                          { label: '1 Month', days: 30 },
                          { label: '3 Months', days: 90 },
                          { label: '6 Months', days: 180 },
                          { label: '1 Year', days: 365 },
                          { label: '2 Years', days: 730 },
                          { label: '5 Years', days: 1825 },
                          { label: '10 Years', days: 3650 }
                        ].map((timeFrame) => (
                          <Button
                            key={timeFrame.label}
                            variant="outline"
                            size="sm"
                            className="text-sm py-2 px-3 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-300"
                            onClick={() => {
                              const targetDate = new Date()
                              targetDate.setDate(targetDate.getDate() + timeFrame.days)
                              const formattedDate = targetDate.toISOString().split('T')[0]
                              setFormData(prev => ({ ...prev, targetDate: formattedDate }))
                            }}
                          >
                            {timeFrame.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Manual Date Input */}
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 font-medium">Or pick a custom date:</p>
                      <Input
                        type="date"
                        value={formData.targetDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                        className="text-lg py-4"
                      />
                    </div>
                  </div>
                </Card>

                {/* Step 3: Obstacles */}
                <Card className="p-8 border-l-4 border-l-red-500 bg-red-50/30">
                  <div className="space-y-6">
                    <Label className="text-xl font-semibold flex items-center">
                      <Badge className="bg-red-500 text-white mr-4 px-3 py-1 text-lg">3</Badge>
                      <AlertTriangle className="w-6 h-6 mr-3" />
                      Identify the OBSTACLES to achievement
                    </Label>
                    <div className="space-y-4">
                      {formData.obstacles.map((obstacle, index) => (
                        <div key={index} className="flex gap-4">
                          <Input
                            placeholder="What could prevent you from achieving this goal?"
                            value={obstacle}
                            onChange={(e) => updateListItem('obstacles', index, e.target.value)}
                            className="flex-1 py-3"
                          />
                          {formData.obstacles.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeListItem('obstacles', index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addListItem('obstacles')}
                        className="w-full mt-3"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Obstacle
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Step 4: Resources */}
                <Card className="p-8 border-l-4 border-l-yellow-500 bg-yellow-50/30">
                  <div className="space-y-6">
                    <Label className="text-xl font-semibold flex items-center">
                      <Badge className="bg-yellow-500 text-white mr-4 px-3 py-1 text-lg">4</Badge>
                      <Lightbulb className="w-6 h-6 mr-3" />
                      Identify and list the RESOURCES available to you
                    </Label>
                    <div className="space-y-4">
                      {formData.resources.map((resource, index) => (
                        <div key={index} className="flex gap-4">
                          <Input
                            placeholder="What resources can help you succeed?"
                            value={resource}
                            onChange={(e) => updateListItem('resources', index, e.target.value)}
                            className="flex-1 py-3"
                          />
                          {formData.resources.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeListItem('resources', index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addListItem('resources')}
                        className="w-full mt-3"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Resource
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column - Steps 5-7 */}
              <div className="space-y-8">
                {/* Step 5: Detailed Plan */}
                <Card className="p-8 border-l-4 border-l-purple-500 bg-purple-50/30">
                  <div className="space-y-6">
                    <Label className="text-xl font-semibold flex items-center">
                      <Badge className="bg-purple-500 text-white mr-4 px-3 py-1 text-lg">5</Badge>
                      <FileText className="w-6 h-6 mr-3" />
                      Establish a DETAILED PLAN or strategy
                    </Label>
                    <Textarea
                      placeholder="Outline your strategy and approach to achieve this goal..."
                      value={formData.detailedPlan}
                      onChange={(e) => setFormData(prev => ({ ...prev, detailedPlan: e.target.value }))}
                      rows={6}
                      className="text-base"
                    />
                  </div>
                </Card>

                {/* Step 6: Massive Action */}
                <Card className="p-8 border-l-4 border-l-orange-500 bg-orange-50/30">
                  <div className="space-y-6">
                    <Label className="text-xl font-semibold flex items-center">
                      <Badge className="bg-orange-500 text-white mr-4 px-3 py-1 text-lg">6</Badge>
                      <Zap className="w-6 h-6 mr-3" />
                      Take MASSIVE ACTION - Break it down into manageable chunks
                    </Label>
                    <p className="text-gray-600 mb-4">
                      Break your goal into specific, actionable steps with timelines. These will become your checkboxes for progress tracking.
                    </p>
                    <div className="space-y-4">
                      {actionItems.map((item) => (
                        <Card key={item.id} className="p-5 bg-white border border-gray-200">
                          <div className="space-y-4">
                            <div className="flex gap-4">
                              <Input
                                placeholder="Describe the specific action to take..."
                                value={item.description}
                                onChange={(e) => updateActionItem(item.id, 'description', e.target.value)}
                                className="flex-1 py-3"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeActionItem(item.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="flex gap-4 items-center">
                              <Label className="text-sm font-medium whitespace-nowrap">Due Date:</Label>
                              <Input
                                type="date"
                                value={item.dueDate}
                                onChange={(e) => updateActionItem(item.id, 'dueDate', e.target.value)}
                                className="w-auto"
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                      <Button
                        variant="outline"
                        onClick={addActionItem}
                        className="w-full py-3"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Action Item
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Step 7: Why/Leverage */}
                <Card className="p-8 border-l-4 border-l-indigo-500 bg-indigo-50/30">
                  <div className="space-y-6">
                    <Label className="text-xl font-semibold flex items-center">
                      <Badge className="bg-indigo-500 text-white mr-4 px-3 py-1 text-lg">7</Badge>
                      <MessageCircle className="w-6 h-6 mr-3" />
                      Know WHY you are doing it (Leverage) *
                    </Label>
                    <Textarea
                      placeholder="Why is this goal important to you? What will achieving it mean? How will it impact your life?"
                      value={formData.whyLeverage}
                      onChange={(e) => setFormData(prev => ({ ...prev, whyLeverage: e.target.value }))}
                      rows={5}
                      className="text-base"
                    />
                  </div>
                </Card>
              </div>
            </div>

            {/* Additional Notes - Full Width */}
            <Card className="p-8 bg-gray-50/50">
              <div className="space-y-6">
                <Label className="text-xl font-semibold">Additional Notes</Label>
                <Textarea
                  placeholder="Any additional thoughts, inspiration, or notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  className="text-base"
                />
              </div>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-6 pt-8 border-t border-gray-200">
              <Button variant="outline" onClick={onClose} size="lg" className="px-8">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-12"
              >
                {isSubmitting ? 'Creating Goal...' : 'Create Goal'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 