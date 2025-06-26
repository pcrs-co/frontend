// src/components/core/LandingForm.jsx

import { useForm } from "react-hook-form";
import clsx from "clsx";
import { useRecommender } from "../../utils/hooks/useRecommender";
import { suggestionDB } from '../../data/suggestionDB';
import AutocompleteInput from '../common/AutocompleteInput';

export default function LandingForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: "onChange",
    defaultValues: {
      main_activity: "",
      other_activities: "",
      main_application: "",
      other_applications: "",
    }
  });

  // Our new hook provides everything we need in one line!
  const { startRecommendation, isPending } = useRecommender();

  const onSubmit = (formData) => {
    const allActivities = [
      formData.main_activity,
      ...formData.other_activities.split(',')
    ].map(s => s.trim()).filter(Boolean);

    const allApplications = [
      formData.main_application,
      ...formData.other_applications.split(',')
    ].map(s => s.trim()).filter(Boolean);

    // The payload that matches the backend UserPreferenceSerializer
    const preferences = {
      activities: allActivities,
      applications: allApplications,
    };

    // Start the entire multi-step process!
    startRecommendation(preferences);
  };

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
              name="main_activity"
              label="What is your MAIN activity?"
              register={register}
              placeholder="e.g., Gaming"
              suggestions={suggestionDB.activities}
              error={errors.main_activity}
              required={true}
              disabled={isPending}
            />

            <AutocompleteInput
              name="other_activities"
              label="List other activities (comma-separated)"
              register={register}
              placeholder="e.g., Video Editing, Streaming"
              suggestions={suggestionDB.activities}
              disabled={isPending}
            />

            <div className="divider"></div>

            <AutocompleteInput
              name="main_application"
              label="What is your MAIN application?"
              register={register}
              placeholder="e.g., Cyberpunk 2077"
              suggestions={suggestionDB.applications}
              error={errors.main_application}
              required={true}
              disabled={isPending}
            />

            <AutocompleteInput
              name="other_applications"
              label="List other applications (comma-separated)"
              register={register}
              placeholder="e.g., Adobe Premiere Pro, Blender"
              suggestions={suggestionDB.applications}
              disabled={isPending}
            />

            <div className="form-control mt-6">
              <button
                type="submit"
                disabled={isPending}
                className={clsx("btn btn-primary", isPending && "loading")}
              >
                {isPending ? "Analyzing..." : "Calculate My Specs"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}