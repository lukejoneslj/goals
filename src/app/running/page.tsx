'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Trophy,
  MapPin,
  Clock,
  Calendar,
  Plus,
  X,
  CheckCircle,
  Edit,
  Loader2,
  Sparkles,
  TrendingUp,
  Target
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { RunningPlan, RunningWorkout } from '@/lib/firebase'
import { runningPlansService, runningWorkoutsService } from '@/lib/database'
import { generateRunningPlan, regenerateRunningPlan, RunningPlanInput } from '@/lib/gemini'
import DashboardNav from '@/components/DashboardNav'
import LoadingSpinner from '@/components/LoadingSpinner'

const RACE_TYPES = [
  '5K (3.1 miles)',
  '10K (6.2 miles)',
  'Half Marathon (13.1 miles)',
  'Marathon (26.2 miles)',
  'Other'
]

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const WORKOUT_TYPE_CONFIG = {
  easy_run: { label: 'Easy Run', color: 'bg-blue-100 text-blue-700', icon: '🏃' },
  long_run: { label: 'Long Run', color: 'bg-purple-100 text-purple-700', icon: '🏃‍♂️' },
  tempo_run: { label: 'Tempo Run', color: 'bg-orange-100 text-orange-700', icon: '⚡' },
  intervals: { label: 'Intervals', color: 'bg-red-100 text-red-700', icon: '🔥' },
  recovery: { label: 'Recovery', color: 'bg-green-100 text-green-700', icon: '💚' },
  rest: { label: 'Rest Day', color: 'bg-gray-100 text-gray-700', icon: '😴' },
  race: { label: 'Race Day', color: 'bg-yellow-100 text-yellow-700', icon: '🏆' }
}

export default function RunningPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activePlan, setActivePlan] = useState<RunningPlan | null>(null)
  const [workouts, setWorkouts] = useState<RunningWorkout[]>([])
  const [loadingPlan, setLoadingPlan] = useState(true)
  const [generatingPlan, setGeneratingPlan] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [regenerateFeedback, setRegenerateFeedback] = useState('')
  const [showRegenerateModal, setShowRegenerateModal] = useState(false)

  // Onboarding form state
  const [formData, setFormData] = useState({
    raceType: '',
    raceDate: '',
    previousRaceTime: '',
    mileTime: '',
    sixMileTime: '',
    restDays: [] as string[],
    concerns: [] as string[],
    concernInput: '',
    additionalInfo: ''
  })

  const loadActivePlan = useCallback(async () => {
    if (!user?.uid) return

    try {
      const { data: plan, error: planError } = await runningPlansService.getActive(user.uid)
      
      if (planError) throw planError

      if (plan && plan.raceType && plan.raceDate) {
        setActivePlan(plan)
        
        // Load workouts for this plan
        const { data: workoutsData, error: workoutsError } = await runningWorkoutsService.getByPlan(plan.id)
        if (workoutsError) throw workoutsError
        
        setWorkouts(workoutsData || [])
        setShowOnboarding(false)
      } else {
        // No valid plan found - show onboarding
        setShowOnboarding(true)
      }
    } catch (error) {
      console.error('Error loading running plan:', error)
      setShowOnboarding(true)
    } finally {
      setLoadingPlan(false)
    }
  }, [user?.uid])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin')
    } else if (user) {
      loadActivePlan()
    }
  }, [user, loading, router, loadActivePlan])

  const handleCreatePlan = async () => {
    if (!user?.uid) return
    
    // Validation
    if (!formData.raceType || !formData.raceDate) {
      alert('Please fill in race type and race date')
      return
    }

    if (formData.restDays.length === 0) {
      alert('Please select at least one rest day')
      return
    }

    setGeneratingPlan(true)

    try {
      // Prepare input for AI
      const planInput: RunningPlanInput = {
        raceType: formData.raceType,
        raceDate: formData.raceDate,
        previousRaceTime: formData.previousRaceTime || undefined,
        mileTime: formData.mileTime || undefined,
        sixMileTime: formData.sixMileTime || undefined,
        restDays: formData.restDays,
        concerns: formData.concerns,
        additionalInfo: formData.additionalInfo || undefined
      }

      // Generate plan using Gemini AI
      const generatedWorkouts = await generateRunningPlan(planInput)

      // Create the running plan in database
      const { data: newPlan, error: planError } = await runningPlansService.create({
        userId: user.uid,
        raceType: formData.raceType,
        raceDate: formData.raceDate,
        previousRaceTime: formData.previousRaceTime || undefined,
        mileTime: formData.mileTime || undefined,
        sixMileTime: formData.sixMileTime || undefined,
        restDays: formData.restDays,
        concerns: formData.concerns,
        additionalInfo: formData.additionalInfo || undefined,
        plan: generatedWorkouts,
        currentWeek: 1,
        status: 'active'
      })

      if (planError || !newPlan) throw new Error('Failed to create plan')

      // Create all workouts in database
      const workoutsToCreate = generatedWorkouts.map(workout => ({
        planId: newPlan.id,
        userId: user.uid,
        week: workout.week,
        day: workout.day,
        date: workout.date,
        workoutType: workout.workoutType,
        distance: workout.distance,
        duration: workout.duration,
        description: workout.description,
        notes: workout.notes,
        isCompleted: false
      }))

      await runningWorkoutsService.batchCreate(workoutsToCreate)

      // Reload the plan
      await loadActivePlan()
    } catch (error) {
      console.error('Error creating running plan:', error)
      alert('Failed to create running plan. Please try again.')
    } finally {
      setGeneratingPlan(false)
    }
  }

  const handleRegeneratePlan = async () => {
    if (!user?.uid || !activePlan || !regenerateFeedback.trim()) {
      alert('Please provide feedback for regenerating the plan')
      return
    }

    setGeneratingPlan(true)

    try {
      const planInput: RunningPlanInput = {
        raceType: activePlan.raceType,
        raceDate: activePlan.raceDate,
        previousRaceTime: activePlan.previousRaceTime,
        mileTime: activePlan.mileTime,
        sixMileTime: activePlan.sixMileTime,
        restDays: activePlan.restDays,
        concerns: activePlan.concerns,
        additionalInfo: activePlan.additionalInfo
      }

      // Get completed workouts for context
      const completedWorkouts = workouts
        .filter(w => w.isCompleted)
        .map(w => ({
          week: w.week,
          day: w.day,
          date: w.date,
          workoutType: w.workoutType,
          distance: w.distance,
          duration: w.duration,
          description: w.description,
          notes: w.notes,
          actualTime: w.actualTime
        }))

      // Regenerate plan with AI
      const regeneratedWorkouts = await regenerateRunningPlan(
        planInput,
        regenerateFeedback,
        completedWorkouts
      )

      // Delete old workouts
      await runningWorkoutsService.deleteByPlan(activePlan.id)

      // Update plan
      await runningPlansService.update(activePlan.id, {
        plan: regeneratedWorkouts,
        currentWeek: 1
      })

      // Create new workouts
      const workoutsToCreate = regeneratedWorkouts.map(workout => ({
        planId: activePlan.id,
        userId: user.uid,
        week: workout.week,
        day: workout.day,
        date: workout.date,
        workoutType: workout.workoutType,
        distance: workout.distance,
        duration: workout.duration,
        description: workout.description,
        notes: workout.notes,
        isCompleted: false
      }))

      await runningWorkoutsService.batchCreate(workoutsToCreate)

      setShowRegenerateModal(false)
      setRegenerateFeedback('')
      await loadActivePlan()
    } catch (error) {
      console.error('Error regenerating plan:', error)
      alert('Failed to regenerate plan. Please try again.')
    } finally {
      setGeneratingPlan(false)
    }
  }

  const handleCompleteWorkout = async (
    workoutId: string,
    actualTime?: string,
    actualDistance?: number,
    userNotes?: string
  ) => {
    try {
      await runningWorkoutsService.complete(workoutId, actualTime, actualDistance, userNotes)
      await loadActivePlan()
    } catch (error) {
      console.error('Error completing workout:', error)
      alert('Failed to complete workout')
    }
  }

  const toggleRestDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      restDays: prev.restDays.includes(day)
        ? prev.restDays.filter(d => d !== day)
        : [...prev.restDays, day]
    }))
  }

  const addConcern = () => {
    if (formData.concernInput.trim()) {
      setFormData(prev => ({
        ...prev,
        concerns: [...prev.concerns, prev.concernInput.trim()],
        concernInput: ''
      }))
    }
  }

  const removeConcern = (index: number) => {
    setFormData(prev => ({
      ...prev,
      concerns: prev.concerns.filter((_, i) => i !== index)
    }))
  }

  if (loading || loadingPlan) {
    return <LoadingSpinner 
      message="Loading Your Running Plan" 
      subMessage="Getting your training ready..."
      icon={Trophy}
    />
  }

  if (!user) return null

  // Onboarding Form
  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav />
        
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Trophy className="w-10 h-10 text-primary" />
              Create Your Running Plan
            </h1>
            <p className="text-lg text-muted-foreground">
              Let's create a personalized training plan powered by AI
            </p>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Race Information
              </CardTitle>
              <CardDescription>
                Tell us about your race and current fitness level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Race Type */}
              <div>
                <Label htmlFor="raceType" className="text-base font-semibold mb-2 block">
                  What race are you training for? *
                </Label>
                <Select
                  value={formData.raceType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, raceType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select race distance" />
                  </SelectTrigger>
                  <SelectContent>
                    {RACE_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Race Date */}
              <div>
                <Label htmlFor="raceDate" className="text-base font-semibold mb-2 block">
                  Race Date *
                </Label>
                <Input
                  id="raceDate"
                  type="date"
                  value={formData.raceDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, raceDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Current Fitness */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="previousRaceTime" className="text-sm font-medium mb-2 block">
                    Previous {formData.raceType} Time
                  </Label>
                  <Input
                    id="previousRaceTime"
                    type="text"
                    placeholder="e.g., 24:30 or 3:45:00"
                    value={formData.previousRaceTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, previousRaceTime: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="mileTime" className="text-sm font-medium mb-2 block">
                    Current Mile Time
                  </Label>
                  <Input
                    id="mileTime"
                    type="text"
                    placeholder="e.g., 7:30"
                    value={formData.mileTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, mileTime: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="sixMileTime" className="text-sm font-medium mb-2 block">
                    Current 6-Mile Time
                  </Label>
                  <Input
                    id="sixMileTime"
                    type="text"
                    placeholder="e.g., 48:00"
                    value={formData.sixMileTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, sixMileTime: e.target.value }))}
                  />
                </div>
              </div>

              {/* Rest Days */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Preferred Rest Days *
                </Label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map(day => (
                    <Button
                      key={day}
                      type="button"
                      variant={formData.restDays.includes(day) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleRestDay(day)}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Concerns */}
              <div>
                <Label className="text-base font-semibold mb-2 block">
                  Concerns or Worries
                </Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Share any concerns about your training (e.g., past injuries, time constraints, nervousness)
                </p>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Enter a concern..."
                    value={formData.concernInput}
                    onChange={(e) => setFormData(prev => ({ ...prev, concernInput: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && addConcern()}
                  />
                  <Button type="button" onClick={addConcern} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.concerns.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.concerns.map((concern, index) => (
                      <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1">
                        {concern}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-2"
                          onClick={() => removeConcern(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div>
                <Label htmlFor="additionalInfo" className="text-base font-semibold mb-2 block">
                  Additional Information
                </Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Any other information that might help create your perfect training plan..."
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleCreatePlan}
                disabled={generatingPlan}
                className="w-full h-12 text-lg font-semibold"
                size="lg"
              >
                {generatingPlan ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Your Plan with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate My Training Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Main Training Plan View
  const weekWorkouts = workouts.filter(w => w.week === selectedWeek)
  const totalWeeks = Math.max(...workouts.map(w => w.week), 1)
  const completedWorkouts = workouts.filter(w => w.isCompleted).length
  const totalWorkouts = workouts.filter(w => w.workoutType !== 'rest').length
  const completionPercentage = totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                <Trophy className="w-10 h-10 text-primary" />
                {activePlan?.raceType} Training
              </h1>
              <p className="text-lg text-muted-foreground">
                Race Date: {new Date(activePlan?.raceDate || '').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowRegenerateModal(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Adjust Plan
              </Button>
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={async () => {
                  if (confirm('Are you sure you want to delete this plan and start over?')) {
                    try {
                      if (activePlan) {
                        await runningWorkoutsService.deleteByPlan(activePlan.id)
                        await runningPlansService.delete(activePlan.id)
                        setActivePlan(null)
                        setWorkouts([])
                        setShowOnboarding(true)
                      }
                    } catch (error) {
                      console.error('Error deleting plan:', error)
                      alert('Failed to delete plan')
                    }
                  }
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Start New Plan
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Progress</p>
                    <p className="text-2xl font-bold">{completionPercentage}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Workouts Done</p>
                    <p className="text-2xl font-bold">{completedWorkouts}/{totalWorkouts}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Week</p>
                    <p className="text-2xl font-bold">{selectedWeek}/{totalWeeks}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Days to Race</p>
                    <p className="text-2xl font-bold">
                      {Math.ceil((new Date(activePlan?.raceDate || '').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Week Selector */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Select Week</h3>
              <span className="text-sm text-muted-foreground">Week {selectedWeek} of {totalWeeks}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(week => (
                <Button
                  key={week}
                  variant={selectedWeek === week ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedWeek(week)}
                >
                  Week {week}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Workouts for Selected Week */}
        <div className="grid gap-4">
          {weekWorkouts.map((workout) => {
            const config = WORKOUT_TYPE_CONFIG[workout.workoutType]
            return (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                config={config}
                onComplete={handleCompleteWorkout}
              />
            )
          })}
        </div>

        {/* Regenerate Modal */}
        {showRegenerateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full">
              <CardHeader>
                <CardTitle>Adjust Your Training Plan</CardTitle>
                <CardDescription>
                  Tell the AI how you'd like to modify your plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="e.g., 'The plan is too intense, I need more easy days' or 'I'm feeling great, can we increase the mileage?'"
                  value={regenerateFeedback}
                  onChange={(e) => setRegenerateFeedback(e.target.value)}
                  rows={6}
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowRegenerateModal(false)
                      setRegenerateFeedback('')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRegeneratePlan}
                    disabled={generatingPlan || !regenerateFeedback.trim()}
                  >
                    {generatingPlan ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Regenerate Plan
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

// Workout Card Component
function WorkoutCard({
  workout,
  config,
  onComplete
}: {
  workout: RunningWorkout
  config: typeof WORKOUT_TYPE_CONFIG[keyof typeof WORKOUT_TYPE_CONFIG]
  onComplete: (id: string, time?: string, distance?: number, notes?: string) => void
}) {
  const [showCompleteForm, setShowCompleteForm] = useState(false)
  const [actualTime, setActualTime] = useState('')
  const [actualDistance, setActualDistance] = useState('')
  const [userNotes, setUserNotes] = useState('')

  const handleComplete = () => {
    onComplete(
      workout.id,
      actualTime || undefined,
      actualDistance ? parseFloat(actualDistance) : undefined,
      userNotes || undefined
    )
    setShowCompleteForm(false)
    setActualTime('')
    setActualDistance('')
    setUserNotes('')
  }

  return (
    <Card className={`${workout.isCompleted ? 'opacity-60' : ''} hover:shadow-md transition-all`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Badge className={config.color}>
                {config.icon} {config.label}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {new Date(workout.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
              {workout.isCompleted && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
            
            <h3 className="text-xl font-bold mb-2">{workout.description}</h3>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
              {workout.distance && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {workout.distance} miles
                </span>
              )}
              {workout.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {workout.duration}
                </span>
              )}
            </div>

            {workout.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <p className="text-sm text-blue-900">
                  <strong>Coach's Note:</strong> {workout.notes}
                </p>
              </div>
            )}

            {workout.isCompleted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-1">
                {workout.actualTime && (
                  <p className="text-sm text-green-900">
                    <strong>Time:</strong> {workout.actualTime}
                  </p>
                )}
                {workout.actualDistance && (
                  <p className="text-sm text-green-900">
                    <strong>Distance:</strong> {workout.actualDistance} miles
                  </p>
                )}
                {workout.userNotes && (
                  <p className="text-sm text-green-900">
                    <strong>Notes:</strong> {workout.userNotes}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 ml-4">
            {!workout.isCompleted && workout.workoutType !== 'rest' && (
              <Button
                size="sm"
                onClick={() => setShowCompleteForm(!showCompleteForm)}
              >
                {showCompleteForm ? 'Cancel' : 'Log Workout'}
              </Button>
            )}
          </div>
        </div>

        {showCompleteForm && (
          <div className="mt-4 pt-4 border-t space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="actualTime" className="text-sm mb-1 block">
                  Actual Time
                </Label>
                <Input
                  id="actualTime"
                  placeholder="e.g., 28:45"
                  value={actualTime}
                  onChange={(e) => setActualTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="actualDistance" className="text-sm mb-1 block">
                  Actual Distance (miles)
                </Label>
                <Input
                  id="actualDistance"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 3.5"
                  value={actualDistance}
                  onChange={(e) => setActualDistance(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="userNotes" className="text-sm mb-1 block">
                Notes (optional)
              </Label>
              <Textarea
                id="userNotes"
                placeholder="How did it feel? Any observations?"
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                rows={2}
              />
            </div>
            <Button onClick={handleComplete} className="w-full">
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Workout
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

