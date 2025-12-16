import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Logout from "./Logout";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const displayName = user?.name || "STEVE COOK";

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="header">
        <input
          type="checkbox"
          id="menu-toggle"
          className="menu-toggle-input"
          aria-hidden="true"
        />
        <div>
          <div className="company-name">LEVERX</div>
          <div className="service">EMPLOYEE SERVICES</div>
        </div>

        <div className="nav-tabs">
          <Link
            to="/"
            className={"nav-tab" + (isActive("/") ? " nav-tab--active" : "")}
          >
            Address Book
          </Link>
          <span className="nav-tab">Leave Requests</span>
          {isAdmin && (
            <Link
              to="/settings"
              className={
                "nav-tab nav-tab-settings" +
                (isActive("/settings") ? " nav-tab--active" : "")
              }
            >
              Settings
            </Link>
          )}
        </div>
        <nav className="btn-container">
          <button className="header-btn btn-support">
            <img
              className="question-mark"
              src="./assets/question-mark-circled-svgrepo-com.svg"
              alt="question mark"
            />
            SUPPORT
          </button>
          <button
            type="button"
            className="header-btn btn-profile"
            onClick={() => navigate("/")}
          >
            <img
              className="profile-icon"
              src="./assets/usericon.png"
              alt="user icon"
            />
            {displayName}
          </button>
          <Logout />
        </nav>

        <label
          htmlFor="menu-toggle"
          className="menu-icon"
          aria-label="Toggle navigation menu"
        >
          <span className="menu-icon-line"></span>
          <span className="menu-icon-line"></span>
        </label>

        <nav className="mobile-menu" aria-label="Mobile navigation">
          <div className="mobile-menu-inner">
            <div className="mobile-menu-profile">
              <div className="mobile-menu-avatar">
                <img
                  src="./assets/usericon.png"
                  alt="User avatar"
                  className="mobile-menu-avatar-img"
                />
              </div>
              <div className="mobile-menu-profile-info">
                <div className="mobile-menu-name">{displayName}</div>
                <button type="button" className="mobile-menu-signout">
                  Sign out
                </button>
              </div>
            </div>

            <div className="mobile-menu-links">
              <span className="mobile-menu-link">Address Book</span>
            </div>

            <button className="mobile-menu-support" type="button">
              SUPPORT
            </button>
          </div>
        </nav>
      </header>
      {children}
    </>
  );
};

export default Layout;
