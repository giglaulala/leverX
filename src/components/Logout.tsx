import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/signin");
  }

  return (
    <button className="header-btn btn-off" onClick={handleLogout}>
      <img
        className="power-off"
        src="./assets/power-off-svgrepo-com.svg"
        alt="Log out"
      />
    </button>
  );
}
