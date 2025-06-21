import { useForm } from "react-hook-form";
import clsx from "clsx";
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
import LoadingIcon from "../../components/common/AlertIcons";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../utils/api";

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    watch,
    trigger,
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
  useEffect(() => {
    if (password) {
      trigger("repeatPassword");
    }
  }, [password, trigger]);
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
        message: "Registered and logged in successfully!",
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
      <div className="mb-4 sm:mb-6">
        <h1 className="mb-2 font-semibold text-gray-800 dark:text-white/90 text-2xl sm:text-title-md">
          Create an account
        </h1>
        <div className="flex flex-row justify-between">
          <Link to="/">
            <span className="flex-1 link link-hover">Home</span>
          </Link>

          <p className="flex-none text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            Already have an account?{" "}
            <Link
              to="/login"
              className="inline-flex items-center link-info gap-x-0.5"
            >
              <span className="link link-hover">Log In</span>
              <ArrowUpRightIcon />
            </Link>
          </p>
        </div>
      </div>
S
      <div className="relative">
        {isValid && consent ? null : (
          <p className="absolute right-0 bottom-full text-xs font-normal text-right text-gray-700 dark:text-gray-400 sm:text-start">
            <span className="text-error">*</span> Required fields
          </p>
        )}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="flex flex-row md:flex-wrap items-center justify-between">
              {/* First Name */}
              <fieldset className="fieldset w-full md:w-[48%] relative">
                <legend className="fieldset-legend text-sm">
                  First Name{" "}
                  {errors.firstName || !watch("firstName") ? (
                    <span className="text-error">*</span>
                  ) : null}
                </legend>
                <input
                  className={clsx("input w-full", {
                    "input-error": errors.firstName,
                  })}
                  {...register("firstName", {
                    required: "First name is required",
                    minLength: { value: 2, message: "Min 2 characters" },
                    maxLength: 20,
                  })}
                  disabled={loading}
                  placeholder="E.g. John"
                  title="Enter your first name"
                />
                {errors.firstName && (
                  <p className="absolute right-0 top-full text-xs text-error">
                    {errors.firstName.message}
                  </p>
                )}
              </fieldset>

              {/* Last Name */}
              <fieldset className="fieldset w-full md:w-[48%] relative">
                <legend className="fieldset-legend text-sm">
                  Last Name{" "}
                  {errors.lastName || !watch("lastName") ? (
                    <span className="text-error">*</span>
                  ) : null}
                </legend>
                <input
                  className={clsx("input w-full", {
                    "input-error": errors.lastName,
                  })}
                  {...register("lastName", {
                    required: "Last name is required",
                    minLength: { value: 2, message: "Min 2 characters" },
                    maxLength: 20,
                  })}
                  minLength={errors.lastName ? 500 : 2}
                  disabled={loading}
                  placeholder="E.g. Doe"
                  title="Enter your last name"
                />
                {errors.lastName && (
                  <p className="absolute right-0 top-full text-xs text-error">
                    {errors.lastName.message}
                  </p>
                )}
              </fieldset>
            </div>

            <div className="flex flex-row md:flex-wrap items-center justify-between">
              {/* Username */}
              <fieldset className="fieldset w-full md:w-[42%] relative">
                <legend className="fieldset-legend text-sm">
                  Username{" "}
                  {errors.username || !watch("username") ? (
                    <span className="text-error">*</span>
                  ) : null}
                </legend>
                <label
                  className={clsx("input w-full", {
                    "input-error": errors.username,
                  })}
                >
                  <PersonIcon />
                  <input
                    {...register("username", {
                      required: "Username is required",
                      pattern: {
                        value: /^[A-Za-z][A-Za-z0-9\-]*$/,
                        message: "Only letters, numbers or dash",
                      },
                      minLength: { value: 3, message: "Min 3 characters" },
                      maxLength: 30,
                    })}
                    minLength={errors.username ? 500 : 3}
                    placeholder="E.g. johndoe"
                    title="Only letters, numbers or dash"
                    disabled={loading}
                  />
                </label>
                {errors.username && (
                  <p className="absolute right-0 top-full text-xs text-error">
                    {errors.username.message}
                  </p>
                )}
              </fieldset>

              {/* Phone Number */}
              <fieldset className="fieldset w-full md:w-[54%] relative">
                <legend className="fieldset-legend text-sm">
                  Phone{" "}
                  {errors.phoneNumber || !watch("phoneNumber") ? (
                    <span className="text-error">*</span>
                  ) : null}
                </legend>
                <label
                  className={clsx("input w-full", {
                    "input-error": errors.phoneNumber,
                  })}
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
                {errors.phoneNumber && (
                  <p className="absolute right-0 top-full text-xs text-error">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </fieldset>
            </div>

            {/* Email */}
            <fieldset className="fieldset relative">
              <legend className="fieldset-legend text-sm">
                E-mail{" "}
                {errors.email || !watch("email") ? (
                  <span className="text-error">*</span>
                ) : null}
              </legend>
              <label
                className={clsx("input w-full", {
                  "input-error": errors.email,
                })}
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
              {errors.email && (
                <p className="absolute right-55 top-full text-xs text-error">
                  {errors.email.message}
                </p>
              )}
            </fieldset>

            <div className="flex flex-row md:flex-wrap items-center justify-between">
              {/* Password */}
              <fieldset className="fieldset w-full md:w-[48%] relative">
                <legend className="fieldset-legend text-sm">
                  Password{" "}
                  {errors.password || !watch("password") ? (
                    <span className="text-error">*</span>
                  ) : null}
                </legend>
                <label
                  className={clsx("input w-full", {
                    "input-error": errors.password,
                  })}
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
                {errors.password && (
                  <p className="absolute right-0 top-full text-xs text-error">
                    {errors.password.message}
                  </p>
                )}
              </fieldset>

              {/* Confirm Password */}
              <fieldset className="fieldset w-full md:w-[48%] relative">
                <legend className="fieldset-legend text-sm">
                  Confirm Password{" "}
                  {errors.repeatPassword || !watch("repeatPassword") ? (
                    <span className="text-error">*</span>
                  ) : null}
                </legend>
                <label
                  className={clsx("input w-full", {
                    "input-error": errors.repeatPassword,
                  })}
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
                {errors.repeatPassword && (
                  <p className="absolute right-0 top-full text-xs text-error">
                    {errors.repeatPassword.message}
                  </p>
                )}
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
                <Link className="link-info link-hover">Information</Link>{" "}
                {!consent ? <span className="text-error">*</span> : null}
              </label>
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
                  <LoadingIcon /> Loading
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
