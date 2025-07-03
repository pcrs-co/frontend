"use client"

import { useState } from "react"

import {
  AcademicCapIcon,
  BuildingStorefrontIcon,
  PuzzlePieceIcon,
  PencilSquareIcon,
  CodeBracketIcon,
  RocketLaunchIcon,
  BoltIcon,
  UserGroupIcon,
  VideoCameraIcon,
  BeakerIcon,
  CameraIcon,
  ComputerDesktopIcon,
  FilmIcon,
  CheckIcon,
  SunIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
  ClockIcon,
  FireIcon,
  SparklesIcon,
  CpuChipIcon,
  TvIcon,
} from "@heroicons/react/24/outline"

// Icon mapping for cleaner code
const iconMap = {
  AcademicCapIcon,
  BuildingStorefrontIcon,
  PuzzlePieceIcon,
  PencilSquareIcon,
  CodeBracketIcon,
  RocketLaunchIcon,
  BoltIcon,
  UserGroupIcon,
  VideoCameraIcon,
  BeakerIcon,
  CameraIcon,
  ComputerDesktopIcon,
  FilmIcon,
  CheckIcon,
  SunIcon,
  CurrencyDollarIcon,
  ClockIcon,
  FireIcon,
  SparklesIcon,
  CpuChipIcon,
  TvIcon,
}

const conversationFlow = [
  // Question 1: The High-Level Use Case
  {
    id: "workflow_type",
    question: "What's your main mission with this new PC?",
    helpText: "Think about what you'll spend most of your time doing - this drives everything else.",
    type: "single-select",
    options: [
      {
        text: "Learning & Everyday Computing",
        value: "Academic & General Use",
        description: "Research, assignments, streaming shows, and web browsing.",
        icon: "AcademicCapIcon",
      },
      {
        text: "Work & Professional Tasks",
        value: "Office Productivity",
        description: "Spreadsheets, presentations, video meetings, and business apps.",
        icon: "BuildingStorefrontIcon",
      },
      {
        text: "Gaming & Interactive Entertainment",
        value: "Gaming",
        description: "Playing modern games, from indie titles to AAA blockbusters.",
        icon: "PuzzlePieceIcon",
      },
      {
        text: "Creative Projects & Content",
        value: "Creative Work",
        description: "Photo editing, video production, graphic design, or music creation.",
        icon: "PencilSquareIcon",
      },
      {
        text: "Programming & Technical Work",
        value: "Programming & Development",
        description: "Software development, data analysis, or running specialized tools.",
        icon: "CodeBracketIcon",
      },
    ],
    next: (value) => {
      if (value === "Gaming") return "gaming_focus"
      if (value === "Creative Work") return "creative_focus"
      if (value === "Programming & Development") return "dev_focus"
      return "performance_priority"
    },
  },

  // Drill-Down: Gaming
  {
    id: "gaming_focus",
    question: "What kind of gaming experience gets you most excited?",
    helpText: "This helps us balance between stunning visuals and lightning-fast performance.",
    type: "single-select",
    options: [
      {
        text: "Cinematic Single-Player Adventures",
        value: "High-Fidelity 3D Gaming",
        description: "Immersive worlds with ray tracing (Cyberpunk 2077, Red Dead Redemption).",
        icon: "SparklesIcon",
      },
      {
        text: "Competitive Multiplayer Dominance",
        value: "Competitive eSports Gaming",
        description: "High refresh rates for the edge (Valorant, Apex Legends, CS2).",
        icon: "FireIcon",
      },
      {
        text: "Variety Gaming Sessions",
        value: "General Gaming",
        description: "Great performance across indie games, strategy, and action titles.",
        icon: "UserGroupIcon",
      },
      {
        text: "VR & Next-Gen Experiences",
        value: "VR Gaming",
        description: "Virtual reality and cutting-edge gaming technologies.",
        icon: "RocketLaunchIcon",
      },
    ],
    next: "performance_priority",
  },

  // Drill-Down: Creative
  {
    id: "creative_focus",
    question: "Which creative workflow pushes your current setup to its limits?",
    helpText: "We'll prioritize the hardware that matters most for your heaviest workload.",
    type: "single-select",
    options: [
      {
        text: "4K+ Video Production",
        value: "4K Video Editing",
        description: "Timeline scrubbing, color grading, and rendering in Premiere/DaVinci.",
        icon: "VideoCameraIcon",
      },
      {
        text: "3D Modeling & Animation",
        value: "3D Rendering & Animation",
        description: "Complex scenes in Blender, Maya, or Cinema 4D with GPU rendering.",
        icon: "BeakerIcon",
      },
      {
        text: "High-Resolution Photography",
        value: "Professional Photo Editing",
        description: "RAW processing, compositing, and retouching in Photoshop/Lightroom.",
        icon: "CameraIcon",
      },
      {
        text: "Live Content Creation",
        value: "Live Streaming",
        description: "Multi-camera streaming, real-time effects, and audience interaction.",
        icon: "TvIcon",
      },
      {
        text: "Motion Graphics & VFX",
        value: "Motion Graphics",
        description: "After Effects compositions, particle systems, and visual effects.",
        icon: "FilmIcon",
      },
    ],
    next: "performance_priority",
  },

  // Drill-Down: Development
  {
    id: "dev_focus",
    question: "What development task currently makes you grab coffee while waiting?",
    helpText: "We'll focus on the specs that eliminate those productivity bottlenecks.",
    type: "single-select",
    options: [
      {
        text: "Large-Scale Compilation",
        value: "Heavy Compilation",
        description: "Building massive C++, Rust, or enterprise Java projects.",
        icon: "CpuChipIcon",
      },
      {
        text: "Container & VM Orchestration",
        value: "Virtualization & Containers",
        description: "Docker swarms, Kubernetes clusters, or multiple OS environments.",
        icon: "ComputerDesktopIcon",
      },
      {
        text: "AI Model Training & Inference",
        value: "AI & Machine Learning",
        description: "Training neural networks, processing datasets, or running LLMs locally.",
        icon: "BeakerIcon",
      },
      {
        text: "Database & Analytics Workloads",
        value: "Data Processing",
        description: "Large dataset processing, ETL pipelines, or real-time analytics.",
        icon: "ClockIcon",
      },
    ],
    next: "performance_priority",
  },

  // Question 2: Performance Priority (replaces secondary workflow)
  {
    id: "performance_priority",
    question: "When your PC is working hard, what matters most to you?",
    helpText: "This helps us balance the build between different performance aspects.",
    type: "single-select",
    options: [
      {
        text: "Lightning-Fast Responsiveness",
        value: "Speed Priority",
        description: "Instant app launches, quick file transfers, snappy multitasking.",
        icon: "BoltIcon",
      },
      {
        text: "Whisper-Quiet Operation",
        value: "Quiet Priority",
        description: "Minimal fan noise during intensive tasks, peaceful workspace.",
        icon: "SunIcon",
      },
      {
        text: "Maximum Raw Power",
        value: "Performance Priority",
        description: "Highest possible performance, even if it means more heat/noise.",
        icon: "FireIcon",
      },
      {
        text: "Balanced & Reliable",
        value: "Balanced Priority",
        description: "Good performance with reasonable temperatures and noise levels.",
        icon: "CheckIcon",
      },
    ],
    next: "budget_range",
  },

  // Question 3: Budget Range (replaces mobility)
  {
    id: "budget_range",
    question: "What's your budget for this PC build?",
    helpText: "Move the slider to set your comfortable spending range in Tanzanian Shillings.",
    type: "slider",
    min: 1000000, // 1M TZS
    max: 10000000, // 10M TZS
    step: 250000, // 250K TZS steps
    defaultValue: 2500000, // 2.5M TZS default
    formatValue: (value) => `${(value / 1000000).toFixed(1)}M TZS`,
    getBudgetCategory: (value) => {
      if (value < 2000000) return "Budget Build"
      if (value < 3750000) return "Mid-Range Build"
      if (value < 6250000) return "High-End Build"
      return "Enthusiast Build"
    },
    next: "additional_needs",
  },

  // Question 4: Additional Considerations
  {
    id: "additional_needs",
    question: "Any special requirements or nice-to-haves?",
    helpText: "Select any that apply to your situation - or skip if none matter.",
    type: "multi-select",
    max_selections: 3,
    options: [
      { text: "Multiple Monitor Support", value: "Multi-Monitor", icon: "ComputerDesktopIcon" },
      { text: "WiFi 6E/7 Connectivity", value: "Advanced WiFi", icon: "BoltIcon" },
      { text: "Extensive Storage (2TB+)", value: "Large Storage", icon: "FilmIcon" },
      { text: "RGB Lighting & Aesthetics", value: "RGB Lighting", icon: "SparklesIcon" },
      { text: "Compact Form Factor", value: "Small Form Factor", icon: "CpuChipIcon" },
      { text: "Future Upgrade Flexibility", value: "Upgradeable", icon: "RocketLaunchIcon" },
      { text: "None of these matter", value: null, icon: "CheckIcon" },
    ],
    next: null,
  },
]

export default function DynamicForm({ onFormSubmit, isSubmitting = false }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  // Track the actual path taken through the conversation flow
  const [stepHistory, setStepHistory] = useState([])

  const currentStep = conversationFlow[stepIndex]
  const isLastStep =
    !currentStep.next || (typeof currentStep.next === "function" && !currentStep.next(answers[currentStep.id]))

  const canProceed =
    answers[currentStep.id] !== undefined &&
    answers[currentStep.id] !== null &&
    (currentStep.type !== "multi-select" ||
      (Array.isArray(answers[currentStep.id]) && answers[currentStep.id].length > 0)) &&
    (currentStep.type !== "slider" || answers[currentStep.id] >= currentStep.min)

  const handleSelect = (value) => {
    if (value === null && currentStep.type === "multi-select") {
      // "None of these matter" option - proceed without selecting anything
      handleNext()
      return
    }

    const currentAnswer =
      answers[currentStep.id] ||
      (currentStep.type === "multi-select" ? [] : currentStep.type === "slider" ? currentStep.defaultValue : null)
    let updatedAnswer

    if (currentStep.type === "multi-select") {
      if (currentAnswer.includes(value)) {
        updatedAnswer = currentAnswer.filter((v) => v !== value)
      } else if (currentAnswer.length < (currentStep.max_selections || 99)) {
        updatedAnswer = [...currentAnswer, value]
      } else {
        updatedAnswer = currentAnswer
      }
    } else {
      updatedAnswer = value
    }

    setAnswers({ ...answers, [currentStep.id]: updatedAnswer })
  }

  const handleNext = () => {
    const nextStepId =
      typeof currentStep.next === "function" ? currentStep.next(answers[currentStep.id]) : currentStep.next

    if (!nextStepId) {
      // Final step - create payload
      const primary_activity =
        answers.gaming_focus || answers.creative_focus || answers.dev_focus || answers.workflow_type || "General Use"

      // Get budget category from slider value
      const budgetStep = conversationFlow.find((step) => step.id === "budget_range")
      const budgetCategory = budgetStep?.getBudgetCategory(answers.budget_range) || "Mid-Range Build"

      const preferences = [
        // Include the original workflow type if it's different from the specialized focus
        answers.workflow_type !== primary_activity ? answers.workflow_type : null,
        // Include performance priority
        answers.performance_priority,
        // Include budget category
        budgetCategory,
        // Include additional needs
        ...(Array.isArray(answers.additional_needs) ? answers.additional_needs : []),
      ].filter(Boolean)

      const payload = {
        primary_activity,
        preferences,
        budget_amount: answers.budget_range,
        budget_category: budgetCategory,
        // Include raw answers for debugging/additional processing
        raw_answers: answers,
      }

      console.log("FINAL PAYLOAD TO API:", payload)
      onFormSubmit(payload)
      return
    }

    // Add current step to history before moving forward
    setStepHistory([...stepHistory, stepIndex])
    const nextIndex = conversationFlow.findIndex((s) => s.id === nextStepId)
    if (nextIndex > -1) {
      setStepIndex(nextIndex)
    }
  }

  const handleBack = () => {
    if (stepHistory.length > 0) {
      // Get the actual previous step from history
      const previousStepIndex = stepHistory[stepHistory.length - 1]
      // Remove the last step from history
      setStepHistory(stepHistory.slice(0, -1))
      // Go to the previous step
      setStepIndex(previousStepIndex)
    }
  }

  const renderIcon = (iconName) => {
    const IconComponent = iconMap[iconName]
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null
  }

  const renderOption = (option) => {
    // Handle slider type
    if (currentStep.type === "slider") {
      const currentValue = answers[currentStep.id] || currentStep.defaultValue
      const budgetCategory = currentStep.getBudgetCategory(currentValue)

      return (
        <div key="slider" className="card bg-base-100 shadow-sm border-2 border-base-300 p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-base-content/70">{currentStep.formatValue(currentStep.min)}</span>
              <span className="text-lg font-bold text-primary">{currentStep.formatValue(currentValue)}</span>
              <span className="text-sm text-base-content/70">{currentStep.formatValue(currentStep.max)}</span>
            </div>

            <input
              type="range"
              min={currentStep.min}
              max={currentStep.max}
              step={currentStep.step}
              value={currentValue}
              onChange={(e) => handleSelect(Number.parseInt(e.target.value))}
              className="range range-primary w-full"
            />

            <div className="text-center">
              <div className="badge badge-primary badge-lg">{budgetCategory}</div>
              <p className="text-xs text-base-content/70 mt-2">
                {budgetCategory === "Budget Build" && "Smart choices for essential performance"}
                {budgetCategory === "Mid-Range Build" && "Excellent performance-per-dollar with upgrade potential"}
                {budgetCategory === "High-End Build" && "Premium components for demanding workloads"}
                {budgetCategory === "Enthusiast Build" && "The best available hardware for ultimate performance"}
              </p>
            </div>
          </div>
        </div>
      )
    }

    // Handle regular options
    const isSelected =
      currentStep.type === "multi-select"
        ? (answers[currentStep.id] || []).includes(option.value)
        : answers[currentStep.id] === option.value

    return (
      <div
        key={option.value || "null"}
        className={`card bg-base-100 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
          isSelected ? "border-primary bg-primary/5" : "border-base-300 hover:border-base-400"
        }`}
        onClick={() => handleSelect(option.value)}
      >
        <div className="card-body p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1 text-primary">{renderIcon(option.icon)}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">{option.text}</h3>
              {option.description && <p className="text-xs text-base-content/70">{option.description}</p>}
            </div>
            {isSelected && <CheckIcon className="w-4 h-4 text-primary flex-shrink-0 mt-1" />}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              {stepHistory.length > 0 && (
                <button className="btn btn-outline btn-sm" onClick={handleBack}>
                  <ChevronLeftIcon className="w-4 h-4 mr-1" />
                  Back
                </button>
              )}
            </div>
            {/* <div className="text-sm text-base-content/50">
              Step {stepIndex + 1} of {conversationFlow.length}
            </div> */}
          </div>

          {/* Question */}
          <h2 className="card-title text-xl mb-2">{currentStep.question}</h2>
          <p className="text-base-content/70 mb-6">{currentStep.helpText}</p>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentStep.type === "slider" ? renderOption() : currentStep.options.map(renderOption)}
          </div>

          {/* Multi-select info */}
          {currentStep.type === "multi-select" && (
            <div className="text-sm text-base-content/70 mb-4">
              {answers[currentStep.id]?.length > 0 && (
                <p>
                  Selected: {answers[currentStep.id].length} of {currentStep.max_selections || "unlimited"}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="card-actions justify-end pt-4">
            <button
              className={`btn btn-primary min-w-[120px] ${isSubmitting ? "loading" : ""}`}
              onClick={handleNext}
              disabled={!canProceed || isSubmitting}
            >
              {isSubmitting ? (
                "Analyzing..."
              ) : isLastStep ? (
                "Get My Perfect Build"
              ) : (
                <>
                  Next
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
