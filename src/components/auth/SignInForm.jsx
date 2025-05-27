import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../utils/constants";
import { useToast } from "../../context/ToastContext";
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4 mt-px"
            >
              <path
                fillRule="evenodd"
                d="M8.25 3.75H19.5a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-1.5 0V6.31L5.03 20.03a.75.75 0 0 1-1.06-1.06L17.69 5.25H8.25a.75.75 0 0 1 0-1.5Z"
                clipRule="evenodd"
              />
            </svg>
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
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </g>
                </svg>
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
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                    <circle
                      cx="16.5"
                      cy="7.5"
                      r=".5"
                      fill="currentColor"
                    ></circle>
                  </g>
                </svg>
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
