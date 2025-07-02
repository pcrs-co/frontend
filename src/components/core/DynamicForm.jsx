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
}

const conversationFlow = [
  // Question 1: The High-Level Use Case
  {
    id: "workflow_type",
    question: "Let's start with your primary goal. What will be the main purpose of your new PC?",
    helpText: "Select the one that best describes your daily activities.",
    type: "single-select",
    options: [
      {
        text: "Education & Everyday Use",
        value: "Academic & General Use",
        description: "For research, essays, streaming, and browsing.",
        icon: "AcademicCapIcon",
      },
      {
        text: "Professional & Business",
        value: "Office Productivity",
        description: "For documents, spreadsheets, video calls, and management.",
        icon: "BuildingStorefrontIcon",
      },
      {
        text: "Gaming & Entertainment",
        value: "Gaming",
        description: "For playing the latest titles and enjoying media.",
        icon: "PuzzlePieceIcon",
      },
      {
        text: "Creative & Content Creation",
        value: "Creative Work",
        description: "For photo/video editing, design, music, or streaming.",
        icon: "PencilSquareIcon",
      },
      {
        text: "Software & Engineering",
        value: "Programming & Development",
        description: "For coding, compiling, and running specialized software.",
        icon: "CodeBracketIcon",
      },
    ],
    next: (value) => {
      if (value === "Gaming") return "gaming_focus"
      if (value === "Creative Work") return "creative_focus"
      if (value === "Programming & Development") return "dev_focus"
      return "secondary_workflow"
    },
  },

  // Drill-Down: Gaming
  {
    id: "gaming_focus",
    question: "For your gaming experience, what is the highest priority?",
    helpText: "This helps determine the balance between graphics and speed.",
    type: "single-select",
    options: [
      {
        text: "Peak Visual Fidelity",
        value: "High-Fidelity 3D Gaming",
        description: "Stunning graphics in single-player epics (e.g., Cyberpunk, Starfield).",
        icon: "RocketLaunchIcon",
      },
      {
        text: "Maximum Framerate",
        value: "Competitive eSports Gaming",
        description: "Highest FPS for competitive games (e.g., Valorant, CS:GO).",
        icon: "BoltIcon",
      },
      {
        text: "A Balanced Experience",
        value: "General Gaming",
        description: "A solid, all-around performer for a mix of everything.",
        icon: "UserGroupIcon",
      },
    ],
    next: "secondary_workflow",
  },

  // Drill-Down: Creative
  {
    id: "creative_focus",
    question: "In your creative suite, which task is the most demanding?",
    helpText: "This pinpoints the most critical hardware component.",
    type: "single-select",
    options: [
      {
        text: "Editing High-Resolution Video (4K+)",
        value: "4K Video Editing",
        description: "Using Premiere Pro, DaVinci Resolve.",
        icon: "VideoCameraIcon",
      },
      {
        text: "Complex 3D Modeling & Rendering",
        value: "3D Rendering & Animation",
        description: "Using Blender, Cinema 4D, V-Ray.",
        icon: "BeakerIcon",
      },
      {
        text: "Professional Photo & Raster Editing",
        value: "Professional Photo Editing",
        description: "Large files in Photoshop, Lightroom.",
        icon: "CameraIcon",
      },
      {
        text: "Live Streaming Content",
        value: "Live Streaming",
        description: "Broadcasting on Twitch, YouTube.",
        icon: "VideoCameraIcon",
      },
    ],
    next: "secondary_workflow",
  },

  // Drill-Down: Development
  {
    id: "dev_focus",
    question: "For your development workflow, what's a key requirement?",
    helpText: "This tells us about your memory and processing needs.",
    type: "single-select",
    options: [
      {
        text: "Running Heavy IDEs & Compilers",
        value: "Heavy Compilation",
        description: "Large C++, Java, or Rust projects.",
        icon: "CodeBracketIcon",
      },
      {
        text: "Virtualization (Docker, VMs)",
        value: "Virtualization & Containers",
        description: "Running multiple operating systems or containers.",
        icon: "ComputerDesktopIcon",
      },
      {
        text: "AI / Machine Learning Models",
        value: "AI & Machine Learning",
        description: "Training or running models with large datasets.",
        icon: "BeakerIcon",
      },
    ],
    next: "secondary_workflow",
  },

  // Question 2: The Secondary Use Case
  {
    id: "secondary_workflow",
    question: "Besides your primary goal, what else will you do frequently?",
    helpText: "Select up to two other common activities.",
    type: "multi-select",
    max_selections: 2,
    options: [
      { text: "Gaming", value: "Gaming", icon: "PuzzlePieceIcon" },
      { text: "Streaming Media (Netflix, etc)", value: "Media Streaming", icon: "FilmIcon" },
      { text: "Office & Productivity tasks", value: "Office Productivity", icon: "BuildingStorefrontIcon" },
      { text: "Nothing else significant", value: null, icon: "CheckIcon" },
    ],
    next: "mobility_needs",
  },

  // Question 3: Mobility & Form Factor
  {
    id: "mobility_needs",
    question: "How important is portability?",
    helpText: "This will help us decide between a laptop and a desktop.",
    type: "single-select",
    options: [
      {
        text: "Essential (Daily Carry)",
        value: "High Portability (Laptop)",
        description: "I need a lightweight device for class or travel.",
        icon: "AcademicCapIcon",
      },
      {
        text: "Somewhat Important",
        value: "Balanced (Performance Laptop)",
        description: "I move it occasionally but value power.",
        icon: "SunIcon",
      },
      {
        text: "Not Important (Stationary)",
        value: "Maximum Performance (Desktop)",
        description: "It will stay at my desk.",
        icon: "ComputerDesktopIcon",
      },
    ],
    next: null,
  },
]

export default function DynamicForm({ onFormSubmit, isSubmitting = false }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState({})

  const currentStep = conversationFlow[stepIndex]
  const isLastStep =
    !currentStep.next || (typeof currentStep.next === "function" && !currentStep.next(answers[currentStep.id]))
  const canProceed =
    answers[currentStep.id] !== undefined &&
    answers[currentStep.id] !== null &&
    (currentStep.type !== "multi-select" ||
      (Array.isArray(answers[currentStep.id]) && answers[currentStep.id].length > 0))

  const handleSelect = (value) => {
    if (value === null && currentStep.type === "multi-select") {
      // "Nothing else significant" option - proceed without selecting anything
      handleNext()
      return
    }

    const currentAnswer = answers[currentStep.id] || (currentStep.type === "multi-select" ? [] : null)
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

      const preferences = [
        // Include the original workflow type if it's different from the specialized focus
        answers.workflow_type !== primary_activity ? answers.workflow_type : null,
        // Include secondary workflows
        ...(Array.isArray(answers.secondary_workflow) ? answers.secondary_workflow : []),
        // Include mobility preference
        answers.mobility_needs,
      ].filter(Boolean)

      const payload = {
        primary_activity,
        preferences,
        // Include raw answers for debugging/additional processing
        raw_answers: answers,
      }

      console.log("FINAL PAYLOAD TO API:", payload)
      onFormSubmit(payload)
      return
    }

    const nextIndex = conversationFlow.findIndex((s) => s.id === nextStepId)
    if (nextIndex > -1) {
      setStepIndex(nextIndex)
    }
  }

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1)
    }
  }

  const renderIcon = (iconName) => {
    const IconComponent = iconMap[iconName]
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null
  }

  const renderOption = (option) => {
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
            {/* <div className="badge badge-outline">
              Step {stepIndex + 1} of {conversationFlow.length}
            </div> */}
            <div className="flex gap-2">
              {stepIndex > 0 && (
                <button className="btn btn-outline btn-sm" onClick={handleBack}>
                  <ChevronLeftIcon className="w-4 h-4 mr-1" />
                  Back
                </button>
              )}
            </div>
          </div>

          {/* Progress bar */}
          {/* <div className="w-full bg-base-300 rounded-full h-2 mb-6">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((stepIndex + 1) / conversationFlow.length) * 100}%` }}
            ></div>
          </div> */}

          {/* Question */}
          <h2 className="card-title text-xl mb-2">{currentStep.question}</h2>
          <p className="text-base-content/70 mb-6">{currentStep.helpText}</p>

          {/* Options */}
          <div className="space-y-3 mb-6">{currentStep.options.map(renderOption)}</div>

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
                "Get My Specs"
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
