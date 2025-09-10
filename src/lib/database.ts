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
import { db, Goal, ActionItem, getTimestamp } from './firebase'

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
