import { useState } from "react";
import { Link } from "react-router";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../assets/icons";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = () => {
    setConfirmPassword(!confirmPassword);
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
    region: "",
    district: "",
    newPassword: "",
    repeatPassword: "",
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 dark:text-white/90 text-2xl sm:text-title-md">
            Hello!
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Register below to enjoy full functionality
          </p>
        </div>

        <div>
          <form className="space-y-6">
            <div>
              <div className="flex flex-row md:flex-wrap items-center justify-between">
                {/* First Name */}
                <fieldset className="fieldset w-full md:w-[48%]">
                  <legend className="fieldset-legend text-sm">
                    First Name
                  </legend>
                  <input
                    className="input validator"
                    name="firstName"
                    type="text"
                    required
                    placeholder="e.g. John"
                    title="Enter your first name"
                    onChange={handleInput}
                  />
                </fieldset>

                {/* Last Name */}
                <fieldset className="fieldset w-full md:w-[48%]">
                  <legend className="fieldset-legend text-sm">Last Name</legend>
                  <input
                    className="input validator"
                    name="lastName"
                    type="text"
                    required
                    placeholder="e.g. Doe"
                    title="Enter your last name"
                    onChange={handleInput}
                  />
                </fieldset>
              </div>

              {/* E-mail */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-sm">E-mail</legend>
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
                    placeholder="e.g. mail@site.com"
                    title="Enter your e-mail"
                    onChange={handleInput}
                    required
                  />
                </label>
              </fieldset>

              <div className="flex flex-row md:flex-wrap items-center justify-between">
                {/* Phone */}
                <fieldset className="fieldset w-full md:w-[56%]">
                  <legend className="fieldset-legend text-sm">Phone</legend>
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
                      className="tabular-nums"
                      name="phoneNumber"
                      required
                      placeholder="Enter your Phone Number"
                      pattern="[0-9]*"
                      minlength="10"
                      maxlength="10"
                      title="Must be 10 digits"
                      onChange={handleInput}
                    />

                    {/* <PhoneInput
                      country={"tz"}
                      value={phone}
                      onChange={setPhone}
                      enableSearch={true}
                    /> */}
                  </label>
                </fieldset>

                {/* Date of Birth */}
                <fieldset className="fieldset w-full md:w-[40%]">
                  <legend className="fieldset-legend text-sm">
                    Date of Birth
                  </legend>
                  <input
                    type="date"
                    name="birthDate"
                    className="input validator w-full"
                    required
                    title="The day you were born"
                    onChange={handleInput}
                  />
                </fieldset>
              </div>

              {/* Location */}
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-sm">Location</legend>
                  <div className="flex flex-row md:flex-wrap items-center justify-between">
                    <label className="select w-full md:w-[48%]">
                      <span className="label">Region</span>
                      <select name="region" onChange={handleInput}>
                        <option>Choose...</option>
                        <option>Dar Es Salaam</option>
                      </select>
                    </label>

                    <label className="select w-full md:w-[48%]">
                      <span className="label">District</span>
                      <select name="district" onChange={handleInput}>
                        <option>Choose...</option>
                        <option>Ubungo</option>
                      </select>
                    </label>
                  </div>
                </fieldset>
              </div>

              <div className="flex flex-row md:flex-wrap items-center justify-between">
                {/* Password */}
                <fieldset className="fieldset w-full md:w-[48%]">
                  <legend className="fieldset-legend text-sm">
                    Your Password
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
                      name="newPassword"
                      required
                      placeholder="Enter new Password"
                      onChange={handleInput}
                    />
                    <span
                      onClick={togglePassword}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </label>
                </fieldset>

                {/* Confirm Password */}
                <fieldset className="fieldset w-full md:w-[48%]">
                  <legend className="fieldset-legend text-sm">
                    Confirm Password
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
                      placeholder="Repeat Password"
                      onChange={handleInput}
                    />
                    <span
                      onClick={togglePassword}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </label>
                </fieldset>
              </div>
            </div>

            <button onClick={handleSubmit} className="btn btn-soft btn-info w-full">
              Sign Up
            </button>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Already have an account? {""}
              <Link to="/signin" className="link link-hover link-info">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
