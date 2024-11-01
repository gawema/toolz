"use client"

import { useRouter } from "next/navigation"
import { Page } from "@/components/app-page"
import { useAuth } from "@/lib/context/auth-context"
import { useEffect } from "react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div> // You might want to add a proper loading spinner here
  }

  if (!user) {
    return null // Return null while redirecting
  }

  return <Page />
}