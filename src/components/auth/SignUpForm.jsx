import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../utils/constants";
import { EyeCloseIcon, EyeIcon } from "../../assets/icons";
import { useToast } from "../../context/ToastContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

export default function SignUpForm() {
  // Define state to store form data
  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phoneNumber: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  // Other state variables for form control
  const [consent, setConsent] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Effect to enable/disable the submit button based on form validity
  useEffect(() => {
    const {
      firstName,
      lastName,
      username,
      phoneNumber,
      email,
      password,
      repeatPassword,
    } = signUpData;

    // Check if all required fields are filled and passwords match
    const isValid =
      firstName &&
      lastName &&
      username &&
      isValidPhoneNumber &&
      email &&
      password &&
      repeatPassword &&
      password === repeatPassword &&
      consent;

    setDisabled(!isValid);
  }, [signUpData, consent]);

  // Toggle consent state
  const toggleConsent = () => {
    setConsent((prevConsent) => !prevConsent);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevShow) => !prevShow);
  };

  // Handle input changes
  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      // Only store digits for phone number
      const digitsOnly = value.replace(/\D/g, "");
      setSignUpData((prev) => ({ ...prev, [name]: digitsOnly }));
      setIsValidPhoneNumber(digitsOnly.length === 10); // Only valid if exactly 10 digits
    } else {
      setSignUpData((prev) => ({ ...prev, [name]: value }));
    }
    // In handleInput for password fields:
    if (name === "password" || name === "repeatPassword") {
      setSignUpData((prev) => ({ ...prev, [name]: value }));
      if (signUpData.password !== signUpData.repeatPassword) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    }
  };

  const { showToast } = useToast();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Set loading state

    try {
      // Register the user
      await api.post("/register/", {
        ...signUpData,
      });

      // Auto-login the user after successful registration
      const loginResponse = await api.post("/token/", {
        username: signUpData.username,
        password: signUpData.password,
      });

      // Store tokens and user role in localStorage
      localStorage.setItem(ACCESS_TOKEN, loginResponse.data.access);
      localStorage.setItem(REFRESH_TOKEN, loginResponse.data.refresh);
      localStorage.setItem("userRole", loginResponse.data.role);
      localStorage.setItem("username", loginResponse.data.username);

      showToast({
        message: "Registered and signed in successfully!",
        type: "success",
      });

      // Redirect to homepage
      navigate("/");
    } catch (error) {
      // Handle errors during registration or login
      if (error.response?.data) {
        Object.entries(error.response.data).forEach(([key, value]) => {
          showToast({
            message: `${key}: ${Array.isArray(value) ? value.join(", ") : value
              }`,
            type: "error",
          });
        });
      } else if (!error.response) {
        showToast({ message: "Server not reachable!", type: "warning" });
      } else {
        showToast({ message: "Unexpected error occurred!", type: "error" });
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <div className="mb-5 sm:mb-8">
        {/* Form header */}
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
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <div className="flex flex-row md:flex-wrap items-center justify-between">
              {/* First Name Input */}
              <fieldset className="fieldset w-full md:w-[48%]">
                <legend className="fieldset-legend text-sm">
                  First Name<span className="text-error opacity-60">*</span>
                </legend>
                <input
                  className="input validator"
                  name="firstName"
                  type="text"
                  minLength="2"
                  maxLength="20"
                  required
                  placeholder="E.g. John"
                  title="Enter your first name"
                  onChange={handleInput}
                  value={signUpData.firstName}
                  disabled={loading}
                />
              </fieldset>

              {/* Last Name Input */}
              <fieldset className="fieldset w-full md:w-[48%]">
                <legend className="fieldset-legend text-sm">
                  Last Name<span className="text-error opacity-60">*</span>
                </legend>
                <input
                  className="input validator"
                  name="lastName"
                  type="text"
                  minLength="2"
                  maxLength="20"
                  required
                  placeholder="E.g. Doe"
                  title="Enter your last name"
                  onChange={handleInput}
                  value={signUpData.lastName}
                  disabled={loading}
                />
              </fieldset>
            </div>

            <div className="flex flex-row md:flex-wrap items-center justify-between">
              {/* Username Input */}
              <fieldset className="fieldset w-full md:w-[42%]">
                <legend className="fieldset-legend text-sm">
                  Username
                  <span className="text-error opacity-60">*</span>
                </legend>
                <label className="input validator">
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
                    placeholder="E.g. johndoe"
                    pattern="[A-Za-z][A-Za-z0-9\-]*"
                    minLength="3"
                    maxLength="30"
                    title="Only letters, numbers or dash"
                    name="username"
                    onChange={handleInput}
                    value={signUpData.username}
                    disabled={loading}
                  />
                </label>
              </fieldset>

              {/* Phone Number Input */}
              <fieldset className="fieldset w-full md:w-[54%]">
                <legend className="fieldset-legend text-sm">
                  Phone<span className="text-error opacity-60">*</span>
                </legend>
                <label className="input validator w-full">
                  <svg
                    className="h-[1em] opacity-50"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                  >
                    <g fill="none">
                      <path
                        d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z"
                        fill="currentColor"
                      ></path>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z"
                        fill="currentColor"
                      ></path>
                    </g>
                  </svg>
                  <input
                    type="tel"
                    inputMode="numeric"
                    className="tabular-nums"
                    name="phoneNumber"
                    required
                    placeholder="Enter your Phone Number"
                    pattern="[0-9]*"
                    minLength="10"
                    maxLength="10"
                    title="Must be 10 digits"
                    onChange={handleInput}
                    value={signUpData.phoneNumber}
                    disabled={loading}
                  />
                </label>
              </fieldset>
            </div>

            {/* Email Input */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-sm">
                E-mail<span className="text-error opacity-60">*</span>
              </legend>
              <label className="input validator w-full">
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
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </g>
                </svg>
                <input
                  name="email"
                  type="email"
                  placeholder="E.g. mail@site.com"
                  title="Enter your e-mail"
                  onChange={handleInput}
                  value={signUpData.email}
                  disabled={loading}
                  required
                />
              </label>
            </fieldset>

            <div className="flex flex-row md:flex-wrap items-center justify-between">
              {/* Password Input */}
              <fieldset className="fieldset w-full md:w-[48%]">
                <legend className="fieldset-legend text-sm">
                  Password
                  <span className="text-error opacity-60">*</span>
                </legend>
                <label
                  className={`input w-full ${signUpData.password ? "validator" : ""
                    }`}
                >
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
                    name="password"
                    required
                    pattern=".{8,}"
                    placeholder="Enter your Password"
                    onChange={handleInput}
                    value={signUpData.password}
                    disabled={loading}
                  />
                  {/* Password visibility toggle */}
                  <label className="swap">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={togglePasswordVisibility}
                    />
                    <EyeIcon className="swap-on fill-gray-500 dark:fill-gray-400 size-full" />
                    <EyeCloseIcon className="swap-off fill-gray-500 dark:fill-gray-400 size-full" />
                  </label>
                </label>
              </fieldset>

              {/* Confirm Password Input */}
              <fieldset className="fieldset w-full md:w-[48%]">
                <legend className="fieldset-legend text-sm">
                  Confirm Password
                  <span className="text-error opacity-60">*</span>
                </legend>
                <label
                  className={`input w-full ${signUpData.repeatPassword ? "validator" : ""
                    }`}
                >
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
                    name="repeatPassword"
                    required
                    pattern=".{8,}"
                    minLength={
                      signUpData.password === signUpData.repeatPassword
                        ? 8
                        : 100
                    }
                    placeholder="Repeat Password"
                    onChange={handleInput}
                    value={signUpData.repeatPassword}
                    disabled={loading}
                  />
                  {/* Password visibility toggle */}
                  <label className="swap">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={togglePasswordVisibility}
                    />
                    <EyeIcon className="swap-on fill-gray-500 dark:fill-gray-400 size-full" />
                    <EyeCloseIcon className="swap-off fill-gray-500 dark:fill-gray-400 size-full" />
                  </label>
                </label>
                {/* In the confirm password fieldset: */}
                {passwordError && (
                  <p className="text-error text-xs mt-1">{passwordError}</p>
                )}
              </fieldset>
            </div>

            {/* Consent Checkbox */}
            <fieldset className="fieldset">
              <label className="label text-sm ml-px mt-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs checkbox-info"
                  onChange={toggleConsent}
                  disabled={loading}
                />
                I agree to the platform accessing my{" "}
                <Link className="link-info link-hover">Information</Link>
              </label>
            </fieldset>
          </div>

          {/* Submit Button */}
          <div className={loading ? "cursor-wait" : ""}>
            <button
              type="submit"
              disabled={disabled}
              className={`btn btn-info w-full shadow-none ${loading ? "btn-soft pointer-events-none" : ""
                }`}
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
