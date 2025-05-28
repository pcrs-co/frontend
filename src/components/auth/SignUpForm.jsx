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
    region: "",       // Added region field
    district: "",      // Added district field
    email: "",
    DOB: "",
    password: "",
    repeatPassword: "",
  });

  // Other state variables for form control
  const [consent, setConsent] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);

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
  };

  const { showToast } = useToast();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Set loading state

    try {
      const registrationData = {
        first_name: signUpData.firstName,
        last_name: signUpData.lastName,
        username: signUpData.username,
        phone_number: `+255${signUpData.phoneNumber.substring(1)}`,
        email: signUpData.email,
        password: signUpData.password,
        password2: signUpData.repeatPassword,
        // Optional fields - only include if they have values
        ...(signUpData.dateOfBirth && { date_of_birth: signUpData.dateOfBirth }),
        ...(signUpData.region && { region: signUpData.region }),
        ...(signUpData.district && { district: signUpData.district }),
      };

      console.log("Submitting:", registrationData); // Debug log

      // Register the user
      const registerResponse = await api.post("/register/", registrationData);
      console.log("Registration response:", registerResponse.data); // Debug log

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
      } else if (error.response) {
        // Request was made but no response received
        showToast({
          message: "Server not reachable. Please check your connection.",
          type: "error"
        });
      } else {
        // Other errors
        showToast({
          message: error.message || "An unexpected error occurred",
          type: "error"
        });
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
            <ArrowUpRightIcon />
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
                  <PersonIcon />
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
                  <PhoneIcon />
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
                <LetterIcon />
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
                  <KeyIcon />

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
                  <PassToggle
                    checked={showPassword}
                    onChange={togglePasswordVisibility}
                  />
                </label>
              </fieldset>

              {/* Confirm Password Input */}
              <fieldset className="fieldset w-full md:w-[48%]">
                <legend className="fieldset-legend text-sm">
                  Confirm Password
                  <span className="text-error opacity-60">*</span>
                </legend>
                <div
                  className={
                    signUpData.repeatPassword &&
                    signUpData.repeatPassword !== signUpData.password
                      ? "tooltip tooltip-open tooltip-error tooltip-bottom md:tooltip-right"
                      : null
                  }
                  data-tip="Passwords do not match"
                >
                  <label
                    className={`input w-full ${signUpData.repeatPassword ? "validator" : ""
                      }`}
                  >
                    <KeyIcon />
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
                    <PassToggle
                      checked={showPassword}
                      onChange={togglePasswordVisibility}
                    />
                  </label>
                </div>
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
