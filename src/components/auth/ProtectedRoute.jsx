import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../utils/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../utils/constants";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) return setIsAuthorized(false);

      try {
        const { exp, role } = jwtDecode(token);
        const now = Date.now() / 1000;

        if (exp < now) {
          await refreshToken();
        } else if (allowedRoles.length && !allowedRoles.includes(role)) {
          setIsAuthorized("forbidden");
        } else {
          setIsAuthorized(true);
        }
      } catch {
        setIsAuthorized(false);
      }
    };

    checkAuth();
  }, []);

  const refreshToken = async () => {
    const refresh = localStorage.getItem(REFRESH_TOKEN);
    if (!refresh) return setIsAuthorized(false);

    try {
      const res = await api.post("/token/refresh", { refresh });
      const newAccess = res.data.access;
      localStorage.setItem(ACCESS_TOKEN, newAccess);

      const { role } = jwtDecode(newAccess);
      if (allowedRoles.length && !allowedRoles.includes(role)) {
        setIsAuthorized("forbidden");
      } else {
        setIsAuthorized(true);
      }
    } catch {
      setIsAuthorized(false);
    }
  };

  if (isAuthorized === true) {
    return children;
  } else if (isAuthorized === false) {
    return <Navigate to="/signin" />;
  } else if (isAuthorized === "forbidden") {
    return <Navigate to="/403" />;
  }
}

export default ProtectedRoute;
