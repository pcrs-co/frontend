"use client"

import DynamicForm from "./DynamicForm"
// 1. IMPORT THE REAL HOOKS
import { useRecommender } from "../../utils/hooks/useRecommender"; // Adjust path as needed
import { useToast } from "../../context/ToastContext"; // To show toasts

export default function LandingPage() {
  // 2. USE THE REAL RECOMMENDER HOOK
  const { startRecommendation, isPending } = useRecommender()
  const { showToast } = useToast()

  // 3. ADAPT THE SUBMIT HANDLER TO MATCH THE BACKEND'S EXPECTED FORMAT
  const handleFormSubmit = (formPayload) => {
    // The DynamicForm gives us:
    // formPayload = {
    //   primary_activity: "High-Fidelity 3D Gaming",
    //   preferences: ["Gaming", "Media Streaming", "Maximum Performance (Desktop)"],
    //   raw_answers: { ... }
    // }

    // Your backend UserPreferenceSerializer expects:
    // {
    //   primary_activity: "High-Fidelity 3D Gaming",
    //   secondary_activities: ["Gaming", "Media Streaming"],
    //   considerations: "User prefers a desktop for maximum performance."
    // }

    const { primary_activity, preferences } = formPayload;

    // The `primary_activity` from the form is already perfect.
    // The `preferences` array contains a mix of secondary activities and other notes.
    // We can join them together to form the `considerations` string.
    // The AI is smart enough to parse this.

    // We can also extract secondary activities if needed, but sending all preferences
    // as a single "considerations" string is robust and effective.
    const considerations_string = preferences.join(', ');

    const finalApiPayload = {
      primary_activity: primary_activity,
      secondary_activities: [], // We are sending everything in considerations for simplicity and power.
      considerations: considerations_string,
    };

    console.log("SENDING FINAL PAYLOAD TO API:", finalApiPayload)
    startRecommendation(finalApiPayload);
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
                Tell us what you do, and our AI will instantly calculate the
                hardware you need. No jargon, just results.
              </p>
            </div>
          </div>
        </div>
        {/* Responsive Wrapper */}
        <div className="flex flex-col lg:flex-row gap-12 lg:min-h-[600px]">

          {/* Hero Section */}
          <div className="flex-1 flex items-center justify-center">
            <div className="hero w-full">
              <div className="hero-content text-center lg:text-left w-full">
                <div className="max-w-4xl">
                  <h1 className="text-4xl md:text-6xl font-bold mb-6">Your Perfect PC Awaits.</h1>
                  <p className="text-lg md:text-xl text-base-content/70 max-w-2xl mx-auto lg:mx-0">
                    Stop guessing. Start building. Tell us what you do, and our AI will instantly calculate the exact
                    hardware you need. No jargon, just results.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex-1 w-full flex items-center justify-center">
            <DynamicForm onFormSubmit={handleFormSubmit} isSubmitting={isPending} />
          </div>

        </div>
      </div>


    </div>
  )
}