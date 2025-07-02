// src/components/core/LandingForm.jsx

import { useForm } from "react-hook-form";
import clsx from "clsx";
import { useRecommender } from "../../utils/hooks/useRecommender";
import { useSuggestions } from "../../utils/hooks/useSuggestions";
import AutocompleteInput from '../common/AutocompleteInput';

export default function LandingForm() {
  // --- CHANGE 1: Add 'considerations' to the form's default state ---
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: "onChange",
    defaultValues: {
      primary_activity: "",
      secondary_activities: "",
      considerations: "" // Add the new field
    }
  });

  const { startRecommendation, isPending: isRecommending } = useRecommender();
  const { suggestions, isLoading: isLoadingSuggestions } = useSuggestions();

  const onSubmit = (formData) => {
    // --- CHANGE 2: Add 'considerations' to the payload sent to the backend ---
    const payload = {
      primary_activity: formData.primary_activity,
      secondary_activities: formData.secondary_activities
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      considerations: formData.considerations // Include the new data
    };
    startRecommendation(payload);
  };

  const isDisabled = isRecommending || isLoadingSuggestions;

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse gap-16">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Your Perfect PC Awaits.</h1>
          <p className="py-6 max-w-lg">Stop guessing. Start building. Tell us what you do, and our AI will instantly calculate the exact hardware you need. No jargon, just results.</p>
        </div>
        <div className="card w-full max-w-lg shadow-2xl bg-base-100">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body">

            <AutocompleteInput
              name="primary_activity"
              label="What is your MAIN activity?"
              register={register}
              placeholder={isLoadingSuggestions ? "Loading activities..." : "e.g., Gaming"}
              suggestions={suggestions.activities}
              error={errors.primary_activity}
              required={true}
              disabled={isDisabled}
            />

            <AutocompleteInput
              name="secondary_activities"
              label="Any other activities? (comma-separated)"
              register={register}
              placeholder="e.g., Live Streaming, Coding"
              suggestions={suggestions.activities}
              disabled={isDisabled}
            />

            {/* --- CHANGE 3: Add the new textarea for Considerations --- */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Other Preferences or Notes? (Optional)</span>
              </label>
              <textarea
                // Register the field with react-hook-form
                {...register("considerations")}
                className="textarea textarea-bordered h-24"
                placeholder="e.g., must be quiet, needs a good webcam, budget around 1,500,000 TSh..."
                disabled={isDisabled}
              ></textarea>
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                disabled={isDisabled}
                className={clsx("btn btn-primary btn-lg", isRecommending && "loading")}
              >
                {isRecommending ? "Analyzing..." : "Calculate My Specs"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}