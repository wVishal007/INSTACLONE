import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  // ✅ run effect every time user changes
  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user, navigate]);

  // ✅ Show nothing while session is loading
  if (user === undefined) return null;

  return <>{children}</>;
};

export default ProtectedRoutes;