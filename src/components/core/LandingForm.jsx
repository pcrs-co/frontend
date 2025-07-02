"use client"

import { useState } from "react"
import DynamicForm from "./DynamicForm"

// Mock hooks - replace with your actual implementations
const useRecommender = () => {
  const [isPending, setIsPending] = useState(false)

  const startRecommendation = async (payload) => {
    setIsPending(true)
    console.log("Starting recommendation with payload:", payload)

    // Simulate API call
    setTimeout(() => {
      setIsPending(false)
      // Using DaisyUI toast notification
      const toast = document.createElement("div")
      toast.className = "toast toast-top toast-end"
      toast.innerHTML = `
        <div class="alert alert-success">
          <div>
            <span class="font-bold">Recommendation Complete!</span>
            <div class="text-xs">Primary: ${payload.primary_activity}</div>
            <div class="text-xs">Preferences: ${payload.preferences.join(", ")}</div>
          </div>
        </div>
      `
      document.body.appendChild(toast)
      setTimeout(() => toast.remove(), 5000)
    }, 2000)
  }

  return { startRecommendation, isPending }
}

export default function LandingPage() {
  const { startRecommendation, isPending } = useRecommender()

  const handleFormSubmit = (payload) => {
    startRecommendation(payload)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      <div className="container mx-auto py-12">
        {/* Hero Section */}
        <div className="hero mb-12">
          <div className="hero-content text-center">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Your Perfect PC Awaits.</h1>
              <p className="text-lg md:text-xl text-base-content/70 max-w-2xl mx-auto">
                Stop guessing. Start building. Tell us what you do, and our AI will instantly calculate the exact
                hardware you need. No jargon, just results.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <DynamicForm onFormSubmit={handleFormSubmit} isSubmitting={isPending} />
      </div>
    </div>
  )
}
