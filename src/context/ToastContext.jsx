import { createContext, useContext, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from "../components/common/AlertIcons";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(
    ({ message, type = "info", duration = 5000 }) => {
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
        return <SuccessIcon className="alert-success" />;
      case "warning":
        return <WarningIcon className="alert-warning" />;
      case "error":
        return <ErrorIcon className="alert-error" />;
      default:
        return <InfoIcon className="alert-info" />;
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
