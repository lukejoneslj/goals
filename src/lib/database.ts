import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore'
import { db, Goal, ActionItem, Habit, HabitCompletion, UserELO, Todo, RunningPlan, RunningWorkout, getTimestamp } from './firebase'

// Helper function to ensure Firebase is initialized
const ensureFirebase = () => {
  if (!db) {
    throw new Error('Firebase not initialized. Make sure you are on the client side.')
  }
  return db
}

// Helper function to remove undefined values from objects (Firebase doesn't accept undefined)
const removeUndefined = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as Partial<T>
}

// Goals collection operations
export const goalsService = {
  // Create a new goal
  async create(goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const firestoreDb = ensureFirebase()

      const docRef = await addDoc(collection(firestoreDb, 'goals'), {
        ...goalData,
        createdAt: getTimestamp(),
        updatedAt: getTimestamp()
      })
      return { data: { id: docRef.id, ...goalData }, error: null }
    } catch (error) {
      console.error('Error creating goal:', error)

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: null, error: { message: `Failed to create goal: ${errorMessage}` } }
    }
  },

  // Get all goals for a user
  async getAll(userId: string) {
    try {
      console.log('Fetching goals for user:', userId)
      const firestoreDb = ensureFirebase()
      const q = query(
        collection(firestoreDb, 'goals'),
        where('userId', '==', userId)
      )
      const querySnapshot = await getDocs(q)
      const goals: Goal[] = []
      querySnapshot.forEach((doc) => {
        goals.push({ id: doc.id, ...doc.data() } as Goal)
      })
      // Sort goals by createdAt in descending order (newest first) on the client side
      goals.sort((a, b) => {
        const dateA = new Date(a.createdAt || '').getTime()
        const dateB = new Date(b.createdAt || '').getTime()
        return dateB - dateA
      })
      console.log('Successfully fetched and sorted goals:', goals.length)
      return { data: goals, error: null }
    } catch (error) {
      console.error('Error fetching goals:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: null, error: { message: `Failed to fetch goals: ${errorMessage}` } }
    }
  },

  // Get a single goal
  async get(goalId: string) {
    try {
      console.log('Fetching goal with ID:', goalId)
      const firestoreDb = ensureFirebase()
      const docRef = doc(firestoreDb, 'goals', goalId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        console.log('Goal found:', docSnap.id)
        return { data: { id: docSnap.id, ...docSnap.data() } as Goal, error: null }
      } else {
        console.log('Goal not found:', goalId)
        return { data: null, error: { message: 'Goal not found' } }
      }
    } catch (error) {
      console.error('Error fetching goal:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: null, error: { message: `Failed to fetch goal: ${errorMessage}` } }
    }
  },

  // Update a goal
  async update(goalId: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>) {
    try {
      console.log('Updating goal:', goalId, 'with data:', updates)
      const firestoreDb = ensureFirebase()
      const docRef = doc(firestoreDb, 'goals', goalId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: getTimestamp()
      })
      console.log('Goal updated successfully:', goalId)
      return { error: null }
    } catch (error) {
      console.error('Error updating goal:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { error: { message: `Failed to update goal: ${errorMessage}` } }
    }
  },

  // Delete a goal
  async delete(goalId: string) {
    try {
      console.log('Deleting goal:', goalId)
      const firestoreDb = ensureFirebase()
      await deleteDoc(doc(firestoreDb, 'goals', goalId))
      console.log('Goal deleted successfully:', goalId)
      return { error: null }
    } catch (error) {
      console.error('Error deleting goal:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { error: { message: `Failed to delete goal: ${errorMessage}` } }
    }
  },

  // Subscribe to goals changes
  subscribe(userId: string, callback: (goals: Goal[]) => void) {
    const firestoreDb = ensureFirebase()
    const q = query(
      collection(firestoreDb, 'goals'),
      where('userId', '==', userId)
    )

    return onSnapshot(q, (querySnapshot) => {
      const goals: Goal[] = []
      querySnapshot.forEach((doc) => {
        goals.push({ id: doc.id, ...doc.data() } as Goal)
      })
      // Sort goals by createdAt in descending order (newest first)
      goals.sort((a, b) => {
        const dateA = new Date(a.createdAt || '').getTime()
        const dateB = new Date(b.createdAt || '').getTime()
        return dateB - dateA
      })
      callback(goals)
    })
  }
}

// Action Items collection operations
export const actionItemsService = {
  // Create a new action item
  async create(actionItemData: Omit<ActionItem, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const firestoreDb = ensureFirebase()
      const docRef = await addDoc(collection(firestoreDb, 'action_items'), {
        ...actionItemData,
        createdAt: getTimestamp(),
        updatedAt: getTimestamp()
      })
      return { data: { id: docRef.id, ...actionItemData }, error: null }
    } catch (error) {
      console.error('Error creating action item:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: null, error: { message: `Failed to create action item: ${errorMessage}` } }
    }
  },

  // Get all action items for a goal
  async getAll(goalId: string, userId?: string) {
    try {
      const firestoreDb = ensureFirebase()
      const q = query(
        collection(firestoreDb, 'action_items')
      )
      // Note: We'll filter by goalId and userId on the client side to avoid needing composite index
      const querySnapshot = await getDocs(q)
      const actionItems: ActionItem[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data() as ActionItem
        if (data.goalId === goalId && (!userId || data.userId === userId)) {
          actionItems.push({ ...data, id: doc.id })
        }
      })
      // Sort by createdAt ascending (oldest first)
      actionItems.sort((a, b) => {
        const dateA = new Date(a.createdAt || '').getTime()
        const dateB = new Date(b.createdAt || '').getTime()
        return dateA - dateB
      })
      return { data: actionItems, error: null }
    } catch (error) {
      console.error('Error fetching action items:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: null, error: { message: `Failed to fetch action items: ${errorMessage}` } }
    }
  },

  // Update an action item
  async update(actionItemId: string, updates: Partial<Omit<ActionItem, 'id' | 'createdAt'>>) {
    try {
      const firestoreDb = ensureFirebase()
      const docRef = doc(firestoreDb, 'action_items', actionItemId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: getTimestamp()
      })
      return { error: null }
    } catch (error) {
      console.error('Error updating action item:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { error: { message: `Failed to update action item: ${errorMessage}` } }
    }
  },

  // Delete an action item
  async delete(actionItemId: string) {
    try {
      const firestoreDb = ensureFirebase()
      await deleteDoc(doc(firestoreDb, 'action_items', actionItemId))
      return { error: null }
    } catch (error) {
      console.error('Error deleting action item:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { error: { message: `Failed to delete action item: ${errorMessage}` } }
    }
  },

  // Subscribe to action items changes
  subscribe(goalId: string, userId: string, callback: (actionItems: ActionItem[]) => void) {
    const firestoreDb = ensureFirebase()
    const q = query(
      collection(firestoreDb, 'action_items')
    )

    return onSnapshot(q, (querySnapshot) => {
      const actionItems: ActionItem[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data() as ActionItem
        if (data.goalId === goalId && data.userId === userId) {
          actionItems.push({ ...data, id: doc.id })
        }
      })
      // Sort by createdAt ascending (oldest first)
      actionItems.sort((a, b) => {
        const dateA = new Date(a.createdAt || '').getTime()
        const dateB = new Date(b.createdAt || '').getTime()
        return dateA - dateB
      })
      callback(actionItems)
    })
  }
}

// Habits collection operations
export const habitsService = {
  // Create a new habit
  async create(habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'currentStreak' | 'longestStreak'>) {
    try {
      const firestoreDb = ensureFirebase()
      const docRef = await addDoc(collection(firestoreDb, 'habits'), {
        ...habitData,
        currentStreak: 0,
        longestStreak: 0,
        createdAt: getTimestamp(),
        updatedAt: getTimestamp()
      })
      return { data: { id: docRef.id, ...habitData, currentStreak: 0, longestStreak: 0 }, error: null }
    } catch (error) {
      return { data: null, error: { message: (error as Error).message } }
    }
  },

  // Get all habits for a user
  async getAll(userId: string) {
    try {
      const firestoreDb = ensureFirebase()
      const q = query(
        collection(firestoreDb, 'habits'),
        where('userId', '==', userId)
      )
      const querySnapshot = await getDocs(q)
      const habits: Habit[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Habit
        if (data.isActive) {
          habits.push({ ...data, id: doc.id })
        }
      })
      // Sort by createdAt descending (newest first)
      habits.sort((a, b) => {
        const dateA = new Date(a.createdAt || '').getTime()
        const dateB = new Date(b.createdAt || '').getTime()
        return dateB - dateA
      })
      return { data: habits, error: null }
    } catch (error) {
      console.error('Error fetching habits:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: null, error: { message: `Failed to fetch habits: ${errorMessage}` } }
    }
  },

  // Update a habit
  async update(habitId: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) {
    try {
      const firestoreDb = ensureFirebase()
      const docRef = doc(firestoreDb, 'habits', habitId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: getTimestamp()
      })
      return { error: null }
    } catch (error) {
      return { error: { message: (error as Error).message } }
    }
  },

  // Delete a habit (soft delete)
  async delete(habitId: string) {
    try {
      const firestoreDb = ensureFirebase()
      const docRef = doc(firestoreDb, 'habits', habitId)
      await updateDoc(docRef, {
        isActive: false,
        updatedAt: getTimestamp()
      })
      return { error: null }
    } catch (error) {
      return { error: { message: (error as Error).message } }
    }
  },

  // Subscribe to habits changes
  subscribe(userId: string, callback: (habits: Habit[]) => void) {
    const firestoreDb = ensureFirebase()
    const q = query(
      collection(firestoreDb, 'habits'),
      where('userId', '==', userId),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    )

    return onSnapshot(q, (querySnapshot) => {
      const habits: Habit[] = []
      querySnapshot.forEach((doc) => {
        habits.push({ id: doc.id, ...doc.data() } as Habit)
      })
      callback(habits)
    })
  }
}

// Habit Completions collection operations
export const habitCompletionsService = {
  // Create a new completion
  async create(completionData: Omit<HabitCompletion, 'id' | 'createdAt'>) {
    try {
      const firestoreDb = ensureFirebase()
      const docRef = await addDoc(collection(firestoreDb, 'habit_completions'), {
        ...completionData,
        createdAt: getTimestamp()
      })
      return { data: { id: docRef.id, ...completionData }, error: null }
    } catch (error) {
      return { data: null, error: { message: (error as Error).message } }
    }
  },

  // Get completions for a specific date
  async getForDate(date: string, userId?: string) {
    try {
      const firestoreDb = ensureFirebase()
      let q = query(collection(firestoreDb, 'habit_completions'))

      if (userId) {
        q = query(q, where('userId', '==', userId))
      }

      // Note: For production, you might want to add a composite index for userId + completionDate
      const querySnapshot = await getDocs(q)
      const completions: HabitCompletion[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data() as HabitCompletion
        if (data.completionDate === date && (!userId || data.userId === userId)) {
          completions.push({ ...data, id: doc.id })
        }
      })
      return { data: completions, error: null }
    } catch (error) {
      return { data: null, error: { message: (error as Error).message } }
    }
  },

  // Delete a completion
  async delete(completionId: string) {
    try {
      const firestoreDb = ensureFirebase()
      await deleteDoc(doc(firestoreDb, 'habit_completions', completionId))
      return { error: null }
    } catch (error) {
      return { error: { message: (error as Error).message } }
    }
  },

  // Delete completions for a habit on a specific date
  async deleteForHabitAndDate(habitId: string, date: string, userId?: string) {
    try {
      const firestoreDb = ensureFirebase()
      let q = query(
        collection(firestoreDb, 'habit_completions'),
        where('habitId', '==', habitId),
        where('completionDate', '==', date)
      )

      if (userId) {
        q = query(q, where('userId', '==', userId))
      }

      const querySnapshot = await getDocs(q)

      const deletePromises = querySnapshot.docs.map(doc => {
        const data = doc.data() as HabitCompletion
        // Additional security check
        if (!userId || data.userId === userId) {
          return deleteDoc(doc.ref)
        }
        return Promise.resolve()
      })
      await Promise.all(deletePromises)

      return { error: null }
    } catch (error) {
      return { error: { message: (error as Error).message } }
    }
  },

  // Update habit streaks (this is a complex operation that would need to be handled with Cloud Functions)
  // For now, we'll update the habit's streak counts directly
  async updateStreak(habitId: string, newCurrentStreak: number, newLongestStreak: number) {
    try {
      const firestoreDb = ensureFirebase()
      const habitRef = doc(firestoreDb, 'habits', habitId)
      await updateDoc(habitRef, {
        currentStreak: newCurrentStreak,
        longestStreak: Math.max(newCurrentStreak, newLongestStreak),
        updatedAt: getTimestamp()
      })
      return { error: null }
    } catch (error) {
      return { error: { message: (error as Error).message } }
    }
  },

  // Get habit completions within a date range
  async getCompletionsInRange(userId: string, startDate: string, endDate: string) {
    try {
      const firestoreDb = ensureFirebase()
      const q = query(
        collection(firestoreDb, 'habit_completions'),
        where('userId', '==', userId)
      )
      const querySnapshot = await getDocs(q)
      const completions = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as HabitCompletion))
        .filter(completion => {
          return completion.completionDate >= startDate && completion.completionDate <= endDate
        })
        .sort((a, b) => a.completionDate.localeCompare(b.completionDate))

      return { data: completions, error: null }
    } catch (error) {
      console.error('Error fetching habit completions in range:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: [], error: { message: `Failed to fetch completions: ${errorMessage}` } }
    }
  }
}

// User ELO operations
export const userELOService = {
  // Get or create ELO data for a user
  async getOrCreate(userId: string, displayName?: string, email?: string) {
    try {
      const firestoreDb = ensureFirebase()
      const q = query(collection(firestoreDb, 'user_elo'), where('userId', '==', userId))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        const existingData = doc.data() as UserELO
        
        // Update displayName and email if provided and different
        const needsUpdate = (displayName && existingData.displayName !== displayName) || 
                           (email && existingData.email !== email)
        
        if (needsUpdate) {
          const updates: Partial<UserELO> = {}
          if (displayName) updates.displayName = displayName
          if (email) updates.email = email
          updates.updatedAt = getTimestamp()
          
          await updateDoc(doc.ref, updates)
          return { data: { ...existingData, ...updates, id: doc.id } as UserELO, error: null }
        }
        
        return { data: { ...existingData, id: doc.id } as UserELO, error: null }
      }

      // Create new ELO record
      const newELOData = {
        userId,
        displayName: displayName || undefined,
        email: email || undefined,
        eloRating: 1000,
        currentRank: 'Bronze III',
        totalWins: 0,
        totalLosses: 0,
        winStreak: 0,
        bestWinStreak: 0,
        createdAt: getTimestamp(),
        updatedAt: getTimestamp()
      }

      const docRef = await addDoc(collection(firestoreDb, 'user_elo'), newELOData)
      return { data: { id: docRef.id, ...newELOData }, error: null }
    } catch (error) {
      console.error('Error getting/creating user ELO:', error)
      return { data: null, error: { message: (error as Error).message } }
    }
  },

  // Update ELO rating and stats
  async updateELO(userId: string, updates: Partial<UserELO>) {
    try {
      const firestoreDb = ensureFirebase()
      const q = query(collection(firestoreDb, 'user_elo'), where('userId', '==', userId))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        return { error: { message: 'User ELO record not found' } }
      }

      const docRef = querySnapshot.docs[0].ref
      await updateDoc(docRef, {
        ...updates,
        updatedAt: getTimestamp()
      })

      return { error: null }
    } catch (error) {
      console.error('Error updating user ELO:', error)
      return { error: { message: (error as Error).message } }
    }
  },

  // Record a win (habit maintained)
  async recordWin(userId: string, eloChange: number) {
    try {
      const currentELO = await this.getOrCreate(userId)
      if (currentELO.error || !currentELO.data) return currentELO

      const newElo = currentELO.data.eloRating + eloChange
      const newWinStreak = currentELO.data.winStreak + 1

      await this.updateELO(userId, {
        eloRating: newElo,
        totalWins: currentELO.data.totalWins + 1,
        winStreak: newWinStreak,
        bestWinStreak: Math.max(currentELO.data.bestWinStreak, newWinStreak),
        currentRank: this.getRankFromElo(newElo)
      })

      return { data: { ...currentELO.data, eloRating: newElo, winStreak: newWinStreak }, error: null }
    } catch (error) {
      return { error: { message: (error as Error).message } }
    }
  },

  // Record a loss (habit broken)
  async recordLoss(userId: string, eloChange: number) {
    try {
      const currentELO = await this.getOrCreate(userId)
      if (currentELO.error || !currentELO.data) return currentELO

      const newElo = Math.max(0, currentELO.data.eloRating + eloChange) // Don't go below 0

      await this.updateELO(userId, {
        eloRating: newElo,
        totalLosses: currentELO.data.totalLosses + 1,
        winStreak: 0, // Reset win streak on loss
        currentRank: this.getRankFromElo(newElo)
      })

      return { data: { ...currentELO.data, eloRating: newElo, winStreak: 0 }, error: null }
    } catch (error) {
      return { error: { message: (error as Error).message } }
    }
  },

  // Helper method to get rank from ELO
  getRankFromElo(elo: number) {
    if (elo >= 3000) return 'Challenger'
    if (elo >= 2800) return 'Grandmaster'
    if (elo >= 2600) return 'Master'
    if (elo >= 2500) return 'Diamond I'
    if (elo >= 2400) return 'Diamond II'
    if (elo >= 2300) return 'Diamond III'
    if (elo >= 2200) return 'Platinum I'
    if (elo >= 2100) return 'Platinum II'
    if (elo >= 2000) return 'Platinum III'
    if (elo >= 1900) return 'Gold I'
    if (elo >= 1800) return 'Gold II'
    if (elo >= 1700) return 'Gold III'
    if (elo >= 1600) return 'Silver I'
    if (elo >= 1500) return 'Silver II'
    if (elo >= 1400) return 'Silver III'
    if (elo >= 1300) return 'Bronze I'
    if (elo >= 1150) return 'Bronze II'
    return 'Bronze III'
  },

  // Simple ELO update for todos (+1 for complete, -1 for incomplete)
  async updateTodoELO(userId: string, isComplete: boolean) {
    try {
      const currentELO = await this.getOrCreate(userId)
      if (currentELO.error || !currentELO.data) return currentELO

      const eloChange = isComplete ? 1 : -1
      const newElo = Math.max(0, currentELO.data.eloRating + eloChange)

      await this.updateELO(userId, {
        eloRating: newElo,
        currentRank: this.getRankFromElo(newElo),
        ...(isComplete ? {
          totalWins: currentELO.data.totalWins + 1,
          winStreak: currentELO.data.winStreak + 1,
          bestWinStreak: Math.max(currentELO.data.bestWinStreak, currentELO.data.winStreak + 1)
        } : {
          totalLosses: currentELO.data.totalLosses + 1,
          winStreak: 0
        })
      })

      return { data: { ...currentELO.data, eloRating: newElo }, error: null }
    } catch (error) {
      return { error: { message: (error as Error).message } }
    }
  },

  // Get all users' ELO data for comparison (public leaderboard)
  async getAllUsers() {
    try {
      const firestoreDb = ensureFirebase()
      const querySnapshot = await getDocs(collection(firestoreDb, 'user_elo'))
      
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserELO[]

      // Sort by ELO rating descending
      users.sort((a, b) => b.eloRating - a.eloRating)

      return { data: users, error: null }
    } catch (error) {
      console.error('Error getting all users ELO:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: [], error: { message: `Failed to get users: ${errorMessage}` } }
    }
  }
}

// Todos collection operations
export const todosService = {
  // Create a new todo
  async create(todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const firestoreDb = ensureFirebase()

      const docRef = await addDoc(collection(firestoreDb, 'todos'), {
        ...removeUndefined(todoData),
        createdAt: getTimestamp(),
        updatedAt: getTimestamp()
      })
      return { data: { id: docRef.id, ...todoData }, error: null }
    } catch (error) {
      console.error('Error creating todo:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: null, error: { message: `Failed to create todo: ${errorMessage}` } }
    }
  },

  // Get all todos for a user for a specific date
  async getByDate(userId: string, date: string) {
    try {
      const firestoreDb = ensureFirebase()
      const q = query(
        collection(firestoreDb, 'todos'),
        where('userId', '==', userId),
        where('dueDate', '==', date)
      )
      const querySnapshot = await getDocs(q)
      const todos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Todo[]

      // Sort in memory to avoid requiring composite index
      todos.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return dateB - dateA // Descending order
      })

      return { data: todos, error: null }
    } catch (error) {
      console.error('Error fetching todos:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: [], error: { message: `Failed to fetch todos: ${errorMessage}` } }
    }
  },

  // Get all todos for a user
  async getAll(userId: string) {
    try {
      const firestoreDb = ensureFirebase()
      const q = query(
        collection(firestoreDb, 'todos'),
        where('userId', '==', userId)
      )
      const querySnapshot = await getDocs(q)
      const todos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Todo[]

      // Sort in memory to avoid requiring composite index
      todos.sort((a, b) => {
        const dateA = new Date(a.dueDate).getTime()
        const dateB = new Date(b.dueDate).getTime()
        if (dateB !== dateA) {
          return dateB - dateA // Descending order by due date
        }
        // If same due date, sort by createdAt
        const createdAtA = new Date(a.createdAt).getTime()
        const createdAtB = new Date(b.createdAt).getTime()
        return createdAtB - createdAtA // Descending order
      })

      return { data: todos, error: null }
    } catch (error) {
      console.error('Error fetching todos:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: [], error: { message: `Failed to fetch todos: ${errorMessage}` } }
    }
  },

  // Update a todo
  async update(todoId: string, updates: Partial<Todo>) {
    try {
      const firestoreDb = ensureFirebase()
      const todoRef = doc(firestoreDb, 'todos', todoId)
      await updateDoc(todoRef, {
        ...removeUndefined(updates),
        updatedAt: getTimestamp()
      })
      return { data: { id: todoId, ...updates }, error: null }
    } catch (error) {
      console.error('Error updating todo:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: null, error: { message: `Failed to update todo: ${errorMessage}` } }
    }
  },

  // Delete a todo
  async delete(todoId: string) {
    try {
      const firestoreDb = ensureFirebase()
      await deleteDoc(doc(firestoreDb, 'todos', todoId))
      return { data: { id: todoId }, error: null }
    } catch (error) {
      console.error('Error deleting todo:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: null, error: { message: `Failed to delete todo: ${errorMessage}` } }
    }
  },

  // Toggle completion status
  async toggleComplete(todoId: string, isCompleted: boolean) {
    try {
      const firestoreDb = ensureFirebase()
      const todoRef = doc(firestoreDb, 'todos', todoId)
      await updateDoc(todoRef, {
        isCompleted,
        completedAt: isCompleted ? getTimestamp() : null,
        updatedAt: getTimestamp()
      })
      return { data: { id: todoId, isCompleted }, error: null }
    } catch (error) {
      console.error('Error toggling todo completion:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: null, error: { message: `Failed to toggle todo: ${errorMessage}` } }
    }
  },

  // Get completed todos within a date range
  async getCompletedInRange(userId: string, startDate: string, endDate: string) {
    try {
      const firestoreDb = ensureFirebase()
      const q = query(
        collection(firestoreDb, 'todos'),
        where('userId', '==', userId),
        where('isCompleted', '==', true)
      )
      const querySnapshot = await getDocs(q)
      const todos = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Todo))
        .filter(todo => {
          if (!todo.completedAt) return false
          const completedDate = todo.completedAt.split('T')[0] // Get YYYY-MM-DD part
          return completedDate >= startDate && completedDate <= endDate
        })

      return { data: todos, error: null }
    } catch (error) {
      console.error('Error fetching completed todos in range:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: [], error: { message: `Failed to fetch todos: ${errorMessage}` } }
    }
  }
}

// Running Plans collection operations
export const runningPlansService = {
  // Create a new running plan
  async create(planData: Omit<RunningPlan, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const firestoreDb = ensureFirebase()
      const docRef = await addDoc(collection(firestoreDb, 'running_plans'), {
        ...removeUndefined(planData),
        createdAt: getTimestamp(),
        updatedAt: getTimestamp()
      })
      return { data: { id: docRef.id, ...planData }, error: null }
    } catch (error) {
      console.error('Error creating running plan:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: null, error: { message: `Failed to create running plan: ${errorMessage}` } }
    }
  },

  // Get all running plans for a user
  async getAll(userId: string) {
    try {
      const firestoreDb = ensureFirebase()
      const q = query(
        collection(firestoreDb, 'running_plans'),
        where('userId', '==', userId)
      )
      const querySnapshot = await getDocs(q)
      const plans = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RunningPlan[]

      // Sort by createdAt descending
      plans.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return dateB - dateA
      })

      return { data: plans, error: null }
    } catch (error) {
      console.error('Error fetching running plans:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: [], error: { message: `Failed to fetch running plans: ${errorMessage}` } }
    }
  },

  // Get active running plan for a user
  async getActive(userId: string) {
    try {
      const firestoreDb = ensureFirebase()
      const q = query(
        collection(firestoreDb, 'running_plans'),
        where('userId', '==', userId),
        where('status', '==', 'active')
      )
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        return { data: null, error: null }
      }

      const doc = querySnapshot.docs[0]
      return { data: { id: doc.id, ...doc.data() } as RunningPlan, error: null }
    } catch (error) {
      console.error('Error fetching active running plan:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: null, error: { message: `Failed to fetch active plan: ${errorMessage}` } }
    }
  },

  // Get a single running plan
  async get(planId: string) {
    try {
      const firestoreDb = ensureFirebase()
      const docRef = doc(firestoreDb, 'running_plans', planId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return { data: { id: docSnap.id, ...docSnap.data() } as RunningPlan, error: null }
      } else {
        return { data: null, error: { message: 'Running plan not found' } }
      }
    } catch (error) {
      console.error('Error fetching running plan:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: null, error: { message: `Failed to fetch plan: ${errorMessage}` } }
    }
  },

  // Update a running plan
  async update(planId: string, updates: Partial<Omit<RunningPlan, 'id' | 'createdAt'>>) {
    try {
      const firestoreDb = ensureFirebase()
      const docRef = doc(firestoreDb, 'running_plans', planId)
      await updateDoc(docRef, {
        ...removeUndefined(updates),
        updatedAt: getTimestamp()
      })
      return { data: { id: planId, ...updates }, error: null }
    } catch (error) {
      console.error('Error updating running plan:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: null, error: { message: `Failed to update plan: ${errorMessage}` } }
    }
  },

  // Delete a running plan
  async delete(planId: string) {
    try {
      const firestoreDb = ensureFirebase()
      await deleteDoc(doc(firestoreDb, 'running_plans', planId))
      return { data: { id: planId }, error: null }
    } catch (error) {
      console.error('Error deleting running plan:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: null, error: { message: `Failed to delete plan: ${errorMessage}` } }
    }
  }
}

// Running Workouts collection operations
export const runningWorkoutsService = {
  // Create a new workout
  async create(workoutData: Omit<RunningWorkout, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const firestoreDb = ensureFirebase()
      const docRef = await addDoc(collection(firestoreDb, 'running_workouts'), {
        ...removeUndefined(workoutData),
        createdAt: getTimestamp(),
        updatedAt: getTimestamp()
      })
      return { data: { id: docRef.id, ...workoutData }, error: null }
    } catch (error) {
      console.error('Error creating workout:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: null, error: { message: `Failed to create workout: ${errorMessage}` } }
    }
  },

  // Batch create workouts
  async batchCreate(workouts: Omit<RunningWorkout, 'id' | 'createdAt' | 'updatedAt'>[]) {
    try {
      const firestoreDb = ensureFirebase()
      const promises = workouts.map(workout =>
        addDoc(collection(firestoreDb, 'running_workouts'), {
          ...removeUndefined(workout),
          createdAt: getTimestamp(),
          updatedAt: getTimestamp()
        })
      )
      await Promise.all(promises)
      return { error: null }
    } catch (error) {
      console.error('Error batch creating workouts:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { error: { message: `Failed to create workouts: ${errorMessage}` } }
    }
  },

  // Get all workouts for a plan
  async getByPlan(planId: string, userId: string) {
    try {
      const firestoreDb = ensureFirebase()
      const q = query(
        collection(firestoreDb, 'running_workouts'),
        where('planId', '==', planId),
        where('userId', '==', userId)
      )
      const querySnapshot = await getDocs(q)
      const workouts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RunningWorkout[]

      // Sort by week and day
      workouts.sort((a, b) => {
        if (a.week !== b.week) return a.week - b.week
        return a.day - b.day
      })

      return { data: workouts, error: null }
    } catch (error) {
      console.error('Error fetching workouts:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: [], error: { message: `Failed to fetch workouts: ${errorMessage}` } }
    }
  },

  // Get workouts for a specific week
  async getByWeek(planId: string, week: number, userId: string) {
    try {
      const firestoreDb = ensureFirebase()
      const q = query(
        collection(firestoreDb, 'running_workouts'),
        where('planId', '==', planId),
        where('userId', '==', userId),
        where('week', '==', week)
      )
      const querySnapshot = await getDocs(q)
      const workouts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RunningWorkout[]

      workouts.sort((a, b) => a.day - b.day)

      return { data: workouts, error: null }
    } catch (error) {
      console.error('Error fetching week workouts:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: [], error: { message: `Failed to fetch workouts: ${errorMessage}` } }
    }
  },

  // Update a workout
  async update(workoutId: string, updates: Partial<RunningWorkout>) {
    try {
      const firestoreDb = ensureFirebase()
      const docRef = doc(firestoreDb, 'running_workouts', workoutId)
      await updateDoc(docRef, {
        ...removeUndefined(updates),
        updatedAt: getTimestamp()
      })
      return { data: { id: workoutId, ...updates }, error: null }
    } catch (error) {
      console.error('Error updating workout:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { data: null, error: { message: `Failed to update workout: ${errorMessage}` } }
    }
  },

  // Complete a workout
  async complete(
    workoutId: string,
    actualTime?: string,
    actualDistance?: number,
    userNotes?: string
  ) {
    try {
      const firestoreDb = ensureFirebase()
      const docRef = doc(firestoreDb, 'running_workouts', workoutId)
      await updateDoc(docRef, {
        isCompleted: true,
        completedAt: getTimestamp(),
        actualTime,
        actualDistance,
        userNotes,
        updatedAt: getTimestamp()
      })
      return { error: null }
    } catch (error) {
      console.error('Error completing workout:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { error: { message: `Failed to complete workout: ${errorMessage}` } }
    }
  },

  // Delete all workouts for a plan
  async deleteByPlan(planId: string, userId: string) {
    try {
      const firestoreDb = ensureFirebase()
      const q = query(
        collection(firestoreDb, 'running_workouts'),
        where('planId', '==', planId),
        where('userId', '==', userId)
      )
      const querySnapshot = await getDocs(q)
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref))
      await Promise.all(deletePromises)
      return { error: null }
    } catch (error) {
      console.error('Error deleting workouts:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return { error: { message: `Failed to delete workouts: ${errorMessage}` } }
    }
  }
}
