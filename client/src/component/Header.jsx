import React, { useState } from "react";
import "../css/Header.css";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const navigate = useNavigate();
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header style={{ marginBottom: showMenu ? "12rem" : "0px" }}>
      <div className="logo">Cruise Management</div>
      <nav className={showMenu ? "show" : ""}>
        <ul>
          <li>
            <button onClick={() => navigate("/")}>Home</button>
          </li>
          <li>
            <button onClick={() => navigate("/booking-details")}>My Booking</button>
          </li>
          <li>
            <button onClick={() => navigate("/profile")}>Profile</button>
          </li>
          <li>
            <button onClick={() => navigate("/contact-us")}>Contact Us</button>
          </li>
          <li>
            {isAuthenticated ? (
              <button
                type="button"
                className="header-login-button"
                style={{ background: "red", width: "auto" }}
                onClick={() =>
                  logout({ logoutParams: { returnTo: window.location.origin } })
                }
              >
                Logout
              </button>
            ) : (
              <button
                type="button"
                className="header-login-button"
                style={{ background: "green", width: "auto" }}
                onClick={() => loginWithRedirect()}
              >
                Login
              </button>
            )}
          </li>
        </ul>
      </nav>
      <div className="hamburger-menu" onClick={toggleMenu}>
        <div className={showMenu ? "open" : ""}></div>
        <div className={showMenu ? "open" : ""}></div>
        <div className={showMenu ? "open" : ""}></div>
      </div>
    </header>
  );
};

export default Header;
