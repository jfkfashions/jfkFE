import React from "react";
import { Link } from "react-router-dom";
import image from "../images/jfk2.png"; // Background image
import "../styles/global.css";
import "../styles/LandingPage.css";

// Import constants
import { COLORS, SELECTED_FONT, TYPOGRAPHY } from "../utils/constants";

const LandingPage = () => {
  return (
    <div
      className="container-landing"
      style={{
        backgroundImage: `url(${image})`,
        fontFamily: SELECTED_FONT.family,
      }}
    >
      <div className="overlay"></div>
      <div className="content">
        <h1 className="heading-landing">
          Welcome to JFK, where we create magic
        </h1>
        <p className="subText">Please log in or sign up to continue.</p>
        <div className="buttonContainer">
          <Link to="/login" className="link">
            <button
              className="button button-primary"
              style={{
                background: COLORS.BUTTON_ACTIVE,
                color: COLORS.TEXT_WHITE,
              }}
            >
              Login
            </button>
          </Link>
          <Link to="/signup" className="link">
            <button
              className="button button-primary"
              style={{
                background: COLORS.BUTTON_ACTIVE,
                color: COLORS.TEXT_WHITE,
              }}
            >
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
