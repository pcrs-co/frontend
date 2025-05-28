import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../utils/constants";
import { useToast } from "../../context/ToastContext";
import { PersonIcon, KeyIcon, ArrowUpRightIcon } from "../common/MiscIcons";
import PassToggle from "./PassToggle";

// SignInForm Component
export default function SignInForm() {
  // State for sign-in data
  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });

  // State for loading indicator, form disable and password visibility
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Effect to enable/disable the submit button based on input validity
  useEffect(() => {
    const { username, password } = signInData;
    const isValid = username && password;
    setDisabled(!isValid);
  }, [signInData]);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle input changes
  const handleInput = (event) => {
    const { name, value } = event.target;
    setSignInData((prev) => ({ ...prev, [name]: value }));
  };

  const { showToast } = useToast();
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Attempt to sign in
      const response = await api.post("/token/", signInData);

      // Store tokens and user role in localStorage
      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
      localStorage.setItem("userRole", response.data.role);
      localStorage.setItem("username", response.data.username);

      showToast({ message: "Signed In successfully!", type: "success" });

      // Redirect based on user role
      switch (response.data.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "vendor":
          navigate("/vendor/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      let toastMessage = "Unexpected error occurred";
      let type = "error";

      // Handle error cases
      if (!error.response) {
        toastMessage = "Server not reachable";
        type = "warning";
      } else if (error.response.status === 401) {
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
      <div className="mb-5 sm:mb-8">
        <h1 className="mb-2 font-semibold text-gray-800 text-2xl dark:text-white/90 sm:text-title-md">
          Welcome Back!
        </h1>
        <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
          Don't have an account? {""}
          <Link
            to="/signup"
            className="inline-flex items-center link-info gap-x-0.5"
          >
            <span className="link link-hover">Sign Up</span>
            <ArrowUpRightIcon />
          </Link>
        </p>
      </div>

      <div>
        <form className="space-y-6">
          <div className="space-y-3">
            <fieldset>
              {/* Username */}
              <legend className="fieldset-legend text-sm">
                Username
                <span className="text-error opacity-60">*</span>
              </legend>
              <label className="input w-full">
                <PersonIcon />
                <input
                  type="text"
                  required
                  placeholder="Enter your Username"
                  pattern="[A-Za-z][A-Za-z0-9\-]*"
                  minLength="3"
                  maxLength="30"
                  title="Only letters, numbers or dash"
                  name="username"
                  onChange={handleInput}
                  value={signInData.username}
                  disabled={loading}
                />
              </label>
            </fieldset>

            <fieldset>
              {/* Password */}
              <legend className="fieldset-legend text-sm">
                Password<span className="text-error opacity-60">*</span>
              </legend>
              <label className="input w-full">
                <KeyIcon />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your Password"
                  name="password"
                  pattern=".{8,}"
                  onChange={handleInput}
                  value={signInData.password}
                  disabled={loading}
                />
                <PassToggle
                  checked={showPassword}
                  onChange={togglePasswordVisibility}
                />
              </label>
            </fieldset>

            <div className="flex flex-row items-center justify-between">
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

          <div className={loading ? "cursor-wait" : ""}>
            <button
              onClick={handleSubmit}
              disabled={disabled}
              className={`btn btn-info w-full shadow-none ${
                loading ? "btn-soft pointer-events-none" : ""
              }`}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner" /> Loading
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
