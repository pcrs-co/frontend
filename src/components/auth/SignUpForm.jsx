import { useForm } from "react-hook-form";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../utils/constants";
import PassToggle from "./PassToggle";
import { useToast } from "../../context/ToastContext";
import {
  PersonIcon,
  KeyIcon,
  ArrowUpRightIcon,
  PhoneIcon,
  LetterIcon,
} from "../common/MiscIcons";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import api from "../../utils/api";

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      phoneNumber: "",
      region: "",
      district: "",
      email: "",
      DOB: "",
      password: "",
      repeatPassword: "",
      consent: false,
    },
  });

  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const password = watch("password");
  const consent = watch("consent");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const registrationData = {
        first_name: data.firstName,
        last_name: data.lastName,
        username: data.username,
        phone_number: `+255${data.phoneNumber.substring(1)}`,
        email: data.email,
        password: data.password,
        password2: data.repeatPassword,
        ...(data.DOB && { date_of_birth: data.DOB }),
        ...(data.region && { region: data.region }),
        ...(data.district && { district: data.district }),
      };

      const registerResponse = await api.post("/register/", registrationData);

      const loginResponse = await api.post("/token/", {
        username: data.username,
        password: data.password,
      });

      localStorage.setItem(ACCESS_TOKEN, loginResponse.data.access);
      localStorage.setItem(REFRESH_TOKEN, loginResponse.data.refresh);
      localStorage.setItem("userRole", loginResponse.data.role);
      localStorage.setItem("username", loginResponse.data.username);

      showToast({
        message: "Registered and signed in successfully!",
        type: "success",
      });

      navigate("/");
    } catch (error) {
      const errData = error.response?.data;
      if (errData) {
        Object.values(errData).forEach((value) => {
          showToast({
            message: Array.isArray(value) ? value.join(", ") : value,
            type: "error",
          });
        });
      } else {
        showToast({
          message: error.message || "An unexpected error occurred",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-5 sm:mb-8">
        <h1 className="mb-2 font-semibold text-gray-800 dark:text-white/90 text-2xl sm:text-title-md">
          Create an account
        </h1>
        <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="inline-flex items-center link-info gap-x-0.5"
          >
            <span className="link link-hover">Sign In</span>
            <ArrowUpRightIcon />
          </Link>
        </p>
      </div>

      <div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="flex flex-row md:flex-wrap items-center justify-between">
              {/* First Name */}
              <fieldset className="fieldset w-full md:w-[48%]">
                <legend className="fieldset-legend text-sm">
                  First Name<span className="text-error opacity-60">*</span>
                </legend>
                <div
                  className={`${
                    watch("firstName") && errors.firstName
                      ? "tooltip tooltip-error"
                      : ""
                  }`}
                  data-tip={errors.firstName?.message}
                >
                  <input
                    className="input validator"
                    {...register("firstName", {
                      required: "First name is required",
                      minLength: { value: 2, message: "Min 2 characters" },
                      maxLength: 20,
                    })}
                    disabled={loading}
                    placeholder="E.g. John"
                    title="Enter your first name"
                  />
                </div>
              </fieldset>

              {/* Last Name */}
              <fieldset className="fieldset w-full md:w-[48%]">
                <legend className="fieldset-legend text-sm">
                  Last Name<span className="text-error opacity-60">*</span>
                </legend>
                <div
                  className={`${
                    watch("lastName") && errors.lastName
                      ? "tooltip tooltip-error"
                      : ""
                  }`}
                  data-tip={errors.lastName?.message}
                >
                  <input
                    className="input validator w-full"
                    {...register("lastName", {
                      required: "Last name is required",
                      minLength: { value: 2, message: "Min 2 characters" },
                      maxLength: 20,
                    })}
                    disabled={loading}
                    placeholder="E.g. Doe"
                    title="Enter your last name"
                  />
                </div>
              </fieldset>
            </div>

            <div className="flex flex-row md:flex-wrap items-center justify-between">
              {/* Username */}
              <fieldset className="fieldset w-full md:w-[42%]">
                <legend className="fieldset-legend text-sm">
                  Username<span className="text-error opacity-60">*</span>
                </legend>
                <label
                  className={`input w-full validator ${
                    watch("username") && errors.username
                      ? "tooltip tooltip-error"
                      : ""
                  }`}
                  data-tip={errors.username?.message}
                >
                  <PersonIcon />
                  <input
                    {...register("username", {
                      required: "Username is required",
                      pattern: {
                        value: /^[A-Za-z][A-Za-z0-9\-]*$/,
                        message: "Only letters, numbers or dash",
                      },
                      minLength: 3,
                      maxLength: 30,
                    })}
                    placeholder="E.g. johndoe"
                    title="Only letters, numbers or dash"
                    disabled={loading}
                  />
                </label>
              </fieldset>

              {/* Phone Number */}
              <fieldset className="fieldset w-full md:w-[54%]">
                <legend className="fieldset-legend text-sm">
                  Phone<span className="text-error opacity-60">*</span>
                </legend>
                <label
                  className={`input w-full validator ${
                    watch("phoneNumber") && errors.phoneNumber
                      ? "tooltip tooltip-error"
                      : ""
                  }`}
                  data-tip={errors.phoneNumber?.message}
                >
                  <PhoneIcon />
                  <input
                    type="tel"
                    className="tabular-nums"
                    inputMode="numeric"
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Must be 10 digits",
                      },
                    })}
                    placeholder="Enter your Phone Number"
                    title="Must be 10 digits"
                    disabled={loading}
                  />
                </label>
              </fieldset>
            </div>

            {/* Email */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-sm">
                E-mail<span className="text-error opacity-60">*</span>
              </legend>
              <label
                className={`input w-full validator ${
                  watch("email") && errors.email ? "tooltip tooltip-error" : ""
                }`}
                data-tip={errors.email?.message}
              >
                <LetterIcon />
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  placeholder="E.g. mail@site.com"
                  title="Enter your e-mail"
                  disabled={loading}
                />
              </label>
            </fieldset>

            <div className="flex flex-row md:flex-wrap items-center justify-between">
              {/* Password */}
              <fieldset className="fieldset w-full md:w-[48%]">
                <legend className="fieldset-legend text-sm">
                  Password<span className="text-error opacity-60">*</span>
                </legend>
                <label
                  className={`input w-full validator ${
                    watch("password") && errors.password
                      ? "tooltip tooltip-error"
                      : ""
                  }`}
                  data-tip={errors.password?.message}
                >
                  <KeyIcon />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 8, message: "Min 8 characters" },
                    })}
                    placeholder="Enter your Password"
                    disabled={loading}
                  />
                  <PassToggle
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                </label>
              </fieldset>

              {/* Confirm Password */}
              <fieldset className="fieldset w-full md:w-[48%]">
                <legend className="fieldset-legend text-sm">
                  Confirm Password
                  <span className="text-error opacity-60">*</span>
                </legend>
                <label
                  className={`input w-full validator ${
                    watch("repeatPassword") !== password
                      ? "tooltip tooltip-error tooltip-open"
                      : ""
                  }`}
                  data-tip={errors.repeatPassword?.message}
                >
                  <KeyIcon />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("repeatPassword", {
                      required: "Confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    placeholder="Repeat Password"
                    disabled={loading}
                  />
                  <PassToggle
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                </label>
              </fieldset>
            </div>

            {/* Consent */}
            <fieldset className="fieldset">
              <label className="label text-sm ml-px mt-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs checkbox-info"
                  {...register("consent", { required: true })}
                  disabled={loading}
                />
                I agree to the platform accessing my{" "}
                <Link className="link-info link-hover">Information</Link>
              </label>
              {errors.consent && (
                <p className="text-error">You must agree before signing up</p>
              )}
            </fieldset>
          </div>

          {/* Submit Button */}
          <div className={loading ? "cursor-wait" : ""}>
            <button
              type="submit"
              className={`btn btn-info w-full shadow-none ${
                loading ? "btn-soft pointer-events-none" : ""
              }`}
              disabled={!isValid || !consent}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner" /> Loading
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
