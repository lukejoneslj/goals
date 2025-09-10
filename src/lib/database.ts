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
import { db, Goal, ActionItem, Habit, HabitCompletion, getTimestamp } from './firebase'

// Helper function to ensure Firebase is initialized
const ensureFirebase = () => {
  if (!db) {
    throw new Error('Firebase not initialized. Make sure you are on the client side.')
  }
  return db
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
  }
}
