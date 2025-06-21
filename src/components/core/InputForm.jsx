import { useState } from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { useToast } from "../../context/ToastContext";

export default function InputForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      console.log("Form Data:", formData);
      showToast({ message: "Redirecting to tailored questions...", type: "success" });

      setTimeout(() => {
        navigate(`/results`, { state: formData });
      }, 500);
      
    } catch (error) {
      showToast({ message: "An error occurred", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Purpose Select */}
      <label className="select w-full">
        <span className="label">What do you do primarily?</span>
        <select
          {...register("purpose", { required: "Select a purpose" })}
          disabled={loading}
          className={clsx({ "select-error": errors.purpose })}
        >
          <option value="" disabled>
            Select your primary purpose
          </option>
          <option value="gaming">Gaming</option>
          <option value="office">Office Work</option>
          <option value="content">Content Creation</option>
          <option value="software">Software Development</option>
          <option value="student">Student Use</option>
          <option value="casual">Casual Use</option>
        </select>
        {errors.purpose && (
          <p className="text-xs text-error mt-1">{errors.purpose.message}</p>
        )}
      </label>

      {/* Budget Range */}
      <fieldset className="fieldset flex flex-col w-full">
        <legend className="fieldset-legend text-sm">
          Select your budget range
        </legend>
        <input
          type="range"
          min={0}
          max={100}
          className="range range-xs w-full"
          disabled={loading}
          {...register("budget")}
        />
        <div className="flex justify-between mt-2 text-xs label">
          <span>Budget</span>
          <span>Balanced</span>
          <span>Performance</span>
        </div>
      </fieldset>

      {/* Skill Level + Submit */}
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row items-center justify-between">
          <select
            className={clsx("select w-[58%]", {
              "select-error": errors.skill,
            })}
            {...register("skill", { required: "Select your skill level" })}
            disabled={loading}
          >
            <option value="" disabled>
              Select your computer skill level
            </option>
            <option value="basic">Basic</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <button
            type="submit"
            disabled={!isValid || loading}
            className={clsx(
              "btn btn-info w-[40%]",
              loading && "btn-soft pointer-events-none cursor-wait"
            )}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner" /> Loading
              </>
            ) : (
              "Continue"
            )}
          </button>
        </div>


        <p className="label text-xs">Your level of computer knowledge</p>
      </div>

    </form>
  );
}
