// stores/userStore.js
import { create } from 'zustand'

const useUserStore = create((set) => ({
  user: null,
  error: null,

  // Set user data (e.g. after successful login)
  setUser: (userData) => set({ user: userData, error: null }),

  // Clear user data
  clearUser: () => set({ user: null, error: null })
}))

export default useUserStore
