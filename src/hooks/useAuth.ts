'use client'

import { useEffect, useState } from 'react'
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return { data: { user: result.user }, error: null }
    } catch (error) {
      return { data: null, error: { message: (error as Error).message } }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      return { data: { user: result.user }, error: null }
    } catch (error) {
      return { data: null, error: { message: (error as Error).message } }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      return { data: { user: result.user }, error: null }
    } catch (error) {
      return { data: null, error: { message: (error as Error).message } }
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      return { error: null }
    } catch (error) {
      return { error: { message: (error as Error).message } }
    }
  }

  return {
    user,
    loading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
  }
} 