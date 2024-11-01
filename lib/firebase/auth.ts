import { GoogleAuthProvider, signInWithPopup, browserPopupRedirectResolver } from "firebase/auth"
import { auth } from "./config"

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  
  try {
    const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver)
    return result.user
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      console.error('Please allow popups for this website to sign in with Google')
      // You might want to show a user-friendly error message here
    } else if (error.code === 'auth/popup-closed-by-user') {
      console.error('Sign-in popup was closed before finishing the sign-in process')
      // Handle user closing the popup
    } else {
      console.error("Error signing in with Google:", error)
    }
    throw error
  }
} 