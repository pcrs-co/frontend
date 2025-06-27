// src/components/core/LandingForm.jsx

import { useForm } from "react-hook-form";
import clsx from "clsx";
import { useRecommender } from "../../utils/hooks/useRecommender";
import { useSuggestions } from "../../utils/hooks/useSuggestions";
import AutocompleteInput from '../common/AutocompleteInput';

export default function LandingForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: "onChange",
    defaultValues: {
      primary_activity: "",
      secondary_activities: "",
    }
  });

  const { startRecommendation, isPending: isRecommending } = useRecommender();

  // Here is the magic! One line to get dynamic, cached suggestions.
  const { suggestions, isLoading: isLoadingSuggestions } = useSuggestions();

  const onSubmit = (formData) => {
    const payload = {
      primary_activity: formData.primary_activity,
      secondary_activities: formData.secondary_activities
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
    };
    startRecommendation(payload);
  };

  // The form is disabled while the recommender is working OR while fetching suggestions.
  const isDisabled = isRecommending || isLoadingSuggestions;

  return (
    <div className="hero min-h-[calc(100vh-200px)] bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left lg:pl-10">
          <h1 className="text-5xl font-bold">Your Perfect PC Awaits.</h1>
          <p className="py-6">Stop guessing. Start building. Tell us what you do, and our AI will instantly calculate the exact hardware you need. No jargon, just results.</p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
            <AutocompleteInput
              name="primary_activity"
              label="What is your MAIN activity?"
              register={register}
              placeholder={isLoadingSuggestions ? "Loading activities..." : "e.g., Gaming"}
              suggestions={suggestions.activities} // <-- USE DYNAMIC DATA FROM THE HOOK
              error={errors.primary_activity}
              required={true}
              disabled={isDisabled}
            />

            <AutocompleteInput
              name="secondary_activities"
              label="List any other activities (comma-separated)"
              register={register}
              placeholder="e.g., Live Streaming"
              suggestions={suggestions.activities} // <-- USE DYNAMIC DATA FROM THE HOOK
              disabled={isDisabled}
            />

            <div className="form-control mt-6">
              <button
                type="submit"
                disabled={isDisabled}
                className={clsx("btn btn-primary", isRecommending && "loading")}
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