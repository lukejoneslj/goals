import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI with the API key
const genAI = new GoogleGenerativeAI('AIzaSyBosBACVUrGcxDaVnBvm0pjPw7Kse96oS4')

export interface RunningPlanInput {
  raceType: string
  raceDate: string
  previousRaceTime?: string
  mileTime?: string
  sixMileTime?: string
  restDays: string[]
  concerns: string[]
  additionalInfo?: string
  currentFitnessLevel?: string
}

export interface GeneratedWorkout {
  week: number
  day: number
  date: string
  workoutType: 'easy_run' | 'long_run' | 'tempo_run' | 'intervals' | 'recovery' | 'rest' | 'race'
  distance?: number
  duration?: string
  description: string
  notes?: string
}

/**
 * Generate a personalized running training plan using Gemini AI
 */
export async function generateRunningPlan(input: RunningPlanInput): Promise<GeneratedWorkout[]> {
  try {
    // Use gemini-3-flash-preview model as specified
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' })

    // Calculate weeks until race
    const today = new Date()
    const raceDate = new Date(input.raceDate)
    const weeksUntilRace = Math.max(1, Math.ceil((raceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 7)))

    // Build a comprehensive prompt
    const prompt = `You are an expert running coach. Generate a detailed, personalized training plan for a runner with the following information:

**Race Details:**
- Race Type: ${input.raceType}
- Race Date: ${input.raceDate}
- Weeks Until Race: ${weeksUntilRace}
${input.previousRaceTime ? `- Previous ${input.raceType} Time: ${input.previousRaceTime}` : ''}

**Current Fitness:**
${input.mileTime ? `- Current Mile Time: ${input.mileTime}` : ''}
${input.sixMileTime ? `- Current 6-Mile Time: ${input.sixMileTime}` : ''}
${input.currentFitnessLevel ? `- Fitness Level: ${input.currentFitnessLevel}` : ''}

**Preferences & Constraints:**
- Rest Days: ${input.restDays.join(', ')}
${input.concerns.length > 0 ? `- Concerns/Worries: ${input.concerns.join(', ')}` : ''}
${input.additionalInfo ? `- Additional Info: ${input.additionalInfo}` : ''}

Please create a ${weeksUntilRace}-week training plan that:
1. Gradually builds up mileage and intensity
2. Addresses the runner's specific concerns
3. Respects their preferred rest days
4. Includes varied workout types: easy runs, long runs, tempo runs, intervals, and recovery
5. Provides specific distances, paces, and helpful coaching notes
6. Follows proper periodization with a taper before race day

Return ONLY a valid JSON array (no markdown, no code blocks) with this exact structure:
[
  {
    "week": 1,
    "day": 1,
    "date": "YYYY-MM-DD",
    "workoutType": "easy_run",
    "distance": 3,
    "duration": "25-30 min",
    "description": "Easy pace run to start the week",
    "notes": "Focus on keeping your heart rate low. This should feel comfortable."
  }
]

Important:
- Generate workouts for ${weeksUntilRace} weeks (week 1 to week ${weeksUntilRace})
- Start from today's date (${today.toISOString().split('T')[0]}) and assign specific dates to each workout
- Use workoutType values: "easy_run", "long_run", "tempo_run", "intervals", "recovery", "rest", "race"
- Include 4-6 running days per week, with rest days on ${input.restDays.join(' and ')}
- Distance should be in miles (as a number)
- Include the race itself as the final workout in the last week with workoutType "race"
- Make sure to address concerns: ${input.concerns.join(', ')}
- Be specific with paces and provide encouraging, practical coaching notes`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Clean up the response - remove markdown code blocks if present
    let cleanedText = text.trim()
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```json?\n?/g, '').replace(/```\n?$/g, '')
    }

    // Parse the JSON response
    const workouts: GeneratedWorkout[] = JSON.parse(cleanedText)

    // Validate and ensure proper structure
    if (!Array.isArray(workouts)) {
      throw new Error('Invalid response format from AI')
    }

    return workouts
  } catch (error) {
    console.error('Error generating running plan:', error)
    throw new Error('Failed to generate running plan. Please try again.')
  }
}

/**
 * Regenerate a running plan based on user feedback
 */
export async function regenerateRunningPlan(
  input: RunningPlanInput,
  feedback: string,
  completedWorkouts: {
    week: number
    day: number
    date: string
    workoutType: string
    distance?: number
    duration?: string
    description: string
    notes?: string
    actualTime?: string
  }[]
): Promise<GeneratedWorkout[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' })

    const today = new Date()
    const raceDate = new Date(input.raceDate)
    const weeksUntilRace = Math.max(1, Math.ceil((raceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 7)))

    const prompt = `You are an expert running coach. A runner needs their training plan adjusted based on feedback.

**Original Race Details:**
- Race Type: ${input.raceType}
- Race Date: ${input.raceDate}
- Weeks Remaining: ${weeksUntilRace}

**Runner's Feedback:**
"${feedback}"

**Completed Workouts (Last ${Math.min(completedWorkouts.length, 7)} days):**
${completedWorkouts.slice(-7).map(w => `Week ${w.week}, Day ${w.day}: ${w.workoutType} - ${w.distance || 0} miles - ${w.actualTime ? `Completed in ${w.actualTime}` : 'Not completed'}`).join('\n')}

**Current Fitness:**
${input.mileTime ? `- Mile Time: ${input.mileTime}` : ''}
${input.sixMileTime ? `- 6-Mile Time: ${input.sixMileTime}` : ''}

**Preferences:**
- Rest Days: ${input.restDays.join(', ')}
- Concerns: ${input.concerns.join(', ')}

Based on this feedback, generate an ADJUSTED training plan for the remaining ${weeksUntilRace} weeks that:
1. Addresses the runner's feedback (too hard/too easy/needs modification)
2. Maintains proper progression toward the race
3. Keeps the runner healthy and motivated
4. Respects their rest day preferences

Return ONLY a valid JSON array (no markdown, no code blocks) with this exact structure:
[
  {
    "week": 1,
    "day": 1,
    "date": "YYYY-MM-DD",
    "workoutType": "easy_run",
    "distance": 3,
    "duration": "25-30 min",
    "description": "Easy pace run",
    "notes": "Adjusted based on your feedback"
  }
]

Start from today (${today.toISOString().split('T')[0]}) and create workouts for ${weeksUntilRace} weeks.
Use workoutType: "easy_run", "long_run", "tempo_run", "intervals", "recovery", "rest", "race"`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    let cleanedText = text.trim()
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```json?\n?/g, '').replace(/```\n?$/g, '')
    }

    const workouts: GeneratedWorkout[] = JSON.parse(cleanedText)

    if (!Array.isArray(workouts)) {
      throw new Error('Invalid response format from AI')
    }

    return workouts
  } catch (error) {
    console.error('Error regenerating running plan:', error)
    throw new Error('Failed to regenerate running plan. Please try again.')
  }
}

