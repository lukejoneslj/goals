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

// Goals collection operations
export const goalsService = {
  // Create a new goal
  async create(goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'goals'), {
        ...goalData,
        createdAt: getTimestamp(),
        updatedAt: getTimestamp()
      })
      return { data: { id: docRef.id, ...goalData }, error: null }
    } catch (error) {
      return { data: null, error: { message: (error as Error).message } }
    }
  },

  // Get all goals for a user
  async getAll(userId: string) {
    try {
      const q = query(
        collection(db, 'goals'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const goals: Goal[] = []
      querySnapshot.forEach((doc) => {
        goals.push({ id: doc.id, ...doc.data() } as Goal)
      })
      return { data: goals, error: null }
    } catch (error) {
      return { data: null, error: { message: (error as Error).message } }
    }
  },

  // Get a single goal
  async get(goalId: string) {
    try {
      const docRef = doc(db, 'goals', goalId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return { data: { id: docSnap.id, ...docSnap.data() } as Goal, error: null }
      } else {
        return { data: null, error: { message: 'Goal not found' } }
      }
    } catch (error) {
      return { data: null, error: { message: (error as Error).message } }
    }
  },

  // Update a goal
  async update(goalId: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>) {
    try {
      const docRef = doc(db, 'goals', goalId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: getTimestamp()
      })
      return { error: null }
    } catch (error) {
      return { error: { message: (error as Error).message } }
    }
  },

  // Delete a goal
  async delete(goalId: string) {
    try {
      await deleteDoc(doc(db, 'goals', goalId))
      return { error: null }
    } catch (error) {
      return { error: { message: (error as Error).message } }
    }
  },

  // Subscribe to goals changes
  subscribe(userId: string, callback: (goals: Goal[]) => void) {
    const q = query(
      collection(db, 'goals'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    return onSnapshot(q, (querySnapshot) => {
      const goals: Goal[] = []
      querySnapshot.forEach((doc) => {
        goals.push({ id: doc.id, ...doc.data() } as Goal)
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
      const docRef = await addDoc(collection(db, 'action_items'), {
        ...actionItemData,
        createdAt: getTimestamp(),
        updatedAt: getTimestamp()
      })
      return { data: { id: docRef.id, ...actionItemData }, error: null }
    } catch (error) {
      return { data: null, error: { message: (error as Error).message } }
    }
  },

  // Get all action items for a goal
  async getAll(goalId: string) {
    try {
      const q = query(
        collection(db, 'action_items'),
        where('goalId', '==', goalId),
        orderBy('createdAt', 'asc')
      )
      const querySnapshot = await getDocs(q)
      const actionItems: ActionItem[] = []
      querySnapshot.forEach((doc) => {
        actionItems.push({ id: doc.id, ...doc.data() } as ActionItem)
      })
      return { data: actionItems, error: null }
    } catch (error) {
      return { data: null, error: { message: (error as Error).message } }
    }
  },

  // Update an action item
  async update(actionItemId: string, updates: Partial<Omit<ActionItem, 'id' | 'createdAt'>>) {
    try {
      const docRef = doc(db, 'action_items', actionItemId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: getTimestamp()
      })
      return { error: null }
    } catch (error) {
      return { error: { message: (error as Error).message } }
    }
  },

  // Delete an action item
  async delete(actionItemId: string) {
    try {
      await deleteDoc(doc(db, 'action_items', actionItemId))
      return { error: null }
    } catch (error) {
      return { error: { message: (error as Error).message } }
    }
  },

  // Subscribe to action items changes
  subscribe(goalId: string, callback: (actionItems: ActionItem[]) => void) {
    const q = query(
      collection(db, 'action_items'),
      where('goalId', '==', goalId),
      orderBy('createdAt', 'asc')
    )

    return onSnapshot(q, (querySnapshot) => {
      const actionItems: ActionItem[] = []
      querySnapshot.forEach((doc) => {
        actionItems.push({ id: doc.id, ...doc.data() } as ActionItem)
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
      const docRef = await addDoc(collection(db, 'habits'), {
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
      const q = query(
        collection(db, 'habits'),
        where('userId', '==', userId),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const habits: Habit[] = []
      querySnapshot.forEach((doc) => {
        habits.push({ id: doc.id, ...doc.data() } as Habit)
      })
      return { data: habits, error: null }
    } catch (error) {
      return { data: null, error: { message: (error as Error).message } }
    }
  },

  // Update a habit
  async update(habitId: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) {
    try {
      const docRef = doc(db, 'habits', habitId)
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
      const docRef = doc(db, 'habits', habitId)
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
    const q = query(
      collection(db, 'habits'),
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
      const docRef = await addDoc(collection(db, 'habit_completions'), {
        ...completionData,
        createdAt: getTimestamp()
      })
      return { data: { id: docRef.id, ...completionData }, error: null }
    } catch (error) {
      return { data: null, error: { message: (error as Error).message } }
    }
  },

  // Get completions for a specific date
  async getForDate(date: string) {
    try {
      const q = query(
        collection(db, 'habit_completions'),
        where('completionDate', '==', date)
      )
      const querySnapshot = await getDocs(q)
      const completions: HabitCompletion[] = []
      querySnapshot.forEach((doc) => {
        completions.push({ id: doc.id, ...doc.data() } as HabitCompletion)
      })
      return { data: completions, error: null }
    } catch (error) {
      return { data: null, error: { message: (error as Error).message } }
    }
  },

  // Delete a completion
  async delete(completionId: string) {
    try {
      await deleteDoc(doc(db, 'habit_completions', completionId))
      return { error: null }
    } catch (error) {
      return { error: { message: (error as Error).message } }
    }
  },

  // Delete completions for a habit on a specific date
  async deleteForHabitAndDate(habitId: string, date: string) {
    try {
      const q = query(
        collection(db, 'habit_completions'),
        where('habitId', '==', habitId),
        where('completionDate', '==', date)
      )
      const querySnapshot = await getDocs(q)

      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref))
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
      const habitRef = doc(db, 'habits', habitId)
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
