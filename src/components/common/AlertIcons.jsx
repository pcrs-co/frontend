const baseClass = "h-5 w-5 shrink-0 stroke-current";

export const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    className={baseClass}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

export const SuccessIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={baseClass}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={baseClass}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.682-1.14 1.118-2.047L13.118 4.953c-.527-.89-1.71-.89-2.236 0L3.964 16.953C3.4 17.86 4.028 19 5.082 19z"
    />
  </svg>
);

export const ErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={baseClass}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const LoadingIcon = () => (
  <span className="loading loading-spinner"></span>
);