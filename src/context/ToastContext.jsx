import { createContext, useContext, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from "../components/common/ToastIcons";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(
    ({ message, type = "info", duration = 3000 }) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <SuccessIcon />;
      case "warning":
        return <WarningIcon />;
      case "error":
        return <ErrorIcon />;
      default:
        return <InfoIcon />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className="toast toast-top toast-center z-50">
          {toasts.map(({ id, message, type }) => (
            <div key={id} className={`alert alert-${type} alert-soft`}>
              {getIcon(type)}
              <span>{message}</span>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}
