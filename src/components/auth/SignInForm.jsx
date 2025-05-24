import { useEffect, useState } from "react";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../assets/icons";

export default function SignInForm() {
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const { email, password } = signInData;
    const isValid = email && password;
    setDisabled(!isValid);
  }, [signInData]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    setSignInData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate async request
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Placeholder "response"
      console.log("Submitted:", signInData);

      // Reset form
      setSignInData({ email: "", password: "" });
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
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
              <fieldset className="fieldset">
                {/* E-mail */}
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
                    type="email"
                    name="email"
                    placeholder="E.g. mail@site.com"
                    required
                    onChange={handleInput}
                    value={signInData.email}
                    disabled={loading}
                  />
                </label>
              </fieldset>

              <fieldset>
                {/* Password */}
                <legend className="fieldset-legend text-sm">
                  Password<span className="text-error opacity-60">*</span>
                </legend>
                <label
                  className={`input w-full ${
                    signInData.password ? "validator" : ""
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
                    required
                    placeholder="Enter your Password"
                    name="password"
                    onChange={handleInput}
                    value={signInData.password}
                    disabled={loading}
                  />
                  <label className="swap">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={togglePasswordVisibility}
                      className="hidden"
                    />
                    <EyeIcon className="swap-on fill-gray-500 dark:fill-gray-400 size-full" />
                    <EyeCloseIcon className="swap-off fill-gray-500 dark:fill-gray-400 size-full" />
                  </label>
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
      </div>
    </div>
  );
}
