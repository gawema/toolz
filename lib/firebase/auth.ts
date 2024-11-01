import { GoogleAuthProvider, signInWithPopup, AuthError } from "firebase/auth"
import { auth } from "./config"

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  
  try {
    const result = await signInWithPopup(auth, provider)
    return result.user
  } catch (error) {
    const authError = error as AuthError
    console.error("Error signing in with Google:", authError)
    throw authError
  }
} 