import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import api from "../../utils/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../utils/constants";
import { useToast } from "../../context/ToastContext";
import { PersonIcon, KeyIcon, ArrowUpRightIcon } from "../common/MiscIcons";
import PassToggle from "./PassToggle";
import { LoadingIcon } from "../../components/common/AlertIcons";

export default function LogInForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const { data } = await api.post("/token/", formData);

      localStorage.setItem(ACCESS_TOKEN, data.access);
      localStorage.setItem(REFRESH_TOKEN, data.refresh);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("username", data.username);

      showToast({ message: "Logged In successfully!", type: "success" });

      const routeMap = {
        admin: "/admin/dashboard",
        vendor: "/vendor/dashboard",
      };

      navigate(routeMap[data.role] || "/");
    } catch (error) {
      const res = error.response;
      let toastMessage = "Unexpected error occurred";
      let type = "error";

      if (!res) {
        toastMessage = "Server not reachable";
        type = "warning";
      } else if (res.status === 401) {
        toastMessage = "Invalid credentials";
        type = "error";
      }

      showToast({ message: toastMessage, type });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-4 sm:mb-6">
        <h1 className="mb-2 font-semibold text-gray-800 text-2xl dark:text-white/90 sm:text-title-md">
          Welcome Back!
        </h1>
        <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="inline-flex items-center link-info gap-x-0.5"
          >
            <span className="link link-hover">Sign Up</span>
            <ArrowUpRightIcon />
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-3">
          <fieldset className="relative">
            <legend className="fieldset-legend text-sm">Username</legend>
            <label
              className={clsx("input w-full", {
                "input-error": errors.username,
              })}
            >
              <PersonIcon />
              <input
                type="text"
                placeholder="Enter your Username"
                {...register("username", {
                  required: "Username is required",
                  pattern: {
                    value: /^[A-Za-z][A-Za-z0-9\-]*$/,
                    message: "Only letters, numbers or dash",
                  },
                  minLength: { value: 3, message: "Minimum 3 characters" },
                  maxLength: { value: 30, message: "Maximum 30 characters" },
                })}
                disabled={loading}
              />
            </label>
            {errors.username && (
              <p className="absolute right-0 top-10 text-xs text-error mt-1">
                {errors.username.message}
              </p>
            )}
          </fieldset>

          <fieldset className="relative">
            <legend className="fieldset-legend text-sm">Password</legend>
            <label
              className={clsx("input w-full", {
                "input-error": errors.password,
              })}
            >
              <KeyIcon />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Minimum 8 characters required",
                  },
                })}
                disabled={loading}
              />
              <PassToggle
                checked={showPassword}
                onChange={() => setShowPassword((v) => !v)}
              />
            </label>
            {errors.password && (
              <p className="absolute right-0 top-10 text-xs text-error mt-1">
                {errors.password.message}
              </p>
            )}
          </fieldset>

          <div className="flex flex-row items-center justify-between mt-5">
            <fieldset className="fieldset">
              <label className="label text-sm ml-px">
                <input
                  type="checkbox"
                  defaultChecked
                  className="checkbox checkbox-xs checkbox-info"
                  disabled={loading}
                />
                Remember me
              </label>
            </fieldset>
            <Link
              to="/auth/forgot-password"
              className="link-info text-sm mr-px"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <div className={clsx({ "cursor-wait": loading })}>
          <button
            type="submit"
            disabled={!isValid}
            className={clsx(
              "btn btn-info w-full shadow-none",
              loading && "btn-soft pointer-events-none"
            )}
          >
            {loading ? (
              <>
                <LoadingIcon /> Loading
              </>
            ) : (
              "Log In"
            )}
          </button>
        </div>
      </form>
    </>
  );
}
