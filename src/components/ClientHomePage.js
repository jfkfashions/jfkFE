import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../globalContext/constant";
import { useNavigate } from "react-router-dom";
import clientHomePageBackground from "../images/clienthome.webp";
import "../styles/global.css";
import "../styles/ClientHomePage.css";
import { COLORS, SELECTED_FONT } from "../utils/constants";

const ClientHomePage = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${backendUrl}/api/users/profile/${username}`,
        );
        setProfile(response.data);
      } catch (err) {
        setError(
          "Unable to fetch profile information. Please try again later.",
        );
        console.error("Profile fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    } else {
      setError("No user session found. Please login again.");
      setIsLoading(false);
    }
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleMeasurementCheck = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/users/measurements/view/`,
        {
          params: { username },
        },
      );
      if (response.data) {
        navigate(`/measurements/view/${username}`);
      } else {
        setModalVisible(true);
      }
    } catch (error) {
      setModalVisible(true);
      console.error("Measurement check error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleCreateMeasurement = () => {
    navigate(`/createmeasurement/${profile.username}`);
  };

  if (isLoading) {
    return (
      <div
        className="client-home-page"
        style={{ fontFamily: SELECTED_FONT.family }}
      >
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="client-home-page"
        style={{ fontFamily: SELECTED_FONT.family }}
      >
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2 className="error-heading">Error</h2>
          <p className="error-message">{error}</p>
          <button
            className="button button-primary"
            onClick={() => navigate("/login")}
            style={{
              background: COLORS.BUTTON_ACTIVE,
              color: COLORS.TEXT_WHITE,
              marginTop: "20px",
            }}
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div
      className="client-home-page"
      style={{
        backgroundImage: `url(${clientHomePageBackground})`,
        fontFamily: SELECTED_FONT.family,
      }}
    >
      <div className="client-home-container">
        {/* Header Section */}
        <header className="client-header">
          <div className="header-content">
            <div className="greeting-section">
              <h1 className="greeting">
                {greeting},{" "}
                <span className="client-name">
                  {profile.firstname} {profile.lastname}
                </span>
              </h1>
              <p className="welcome-text">
                Welcome to your JFK Tailor Shop dashboard
              </p>
            </div>
            <div className="user-badge">
              <div className="avatar-circle">
                <span className="avatar-text">
                  {profile.firstname.charAt(0)}
                  {profile.lastname.charAt(0)}
                </span>
              </div>
              <div className="user-info">
                <span className="user-role">{profile.role}</span>
                <span className="user-status">Active</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="client-main">
          {/* Profile Summary Card */}
          <div className="profile-summary-card">
            <h2 className="card-title">Profile Summary</h2>
            <div className="profile-grid">
              <div className="profile-item">
                <span className="profile-label">Username</span>
                <span className="profile-value">{profile.username}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Contact</span>
                <span className="profile-value">{profile.phonenumber}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Email</span>
                <span className="profile-value">{profile.email}</span>
              </div>
              {profile.bio && (
                <div className="profile-bio">
                  <span className="profile-label">Bio</span>
                  <p className="profile-value">{profile.bio}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="actions-section">
            <h2 className="section-title">Quick Actions</h2>
            <div className="actions-grid">
              <button
                className="action-card"
                onClick={() => navigate("/edit-profile")}
                style={{
                  background: COLORS.PRIMARY_GRADIENT,
                  color: COLORS.TEXT_WHITE,
                }}
              >
                <div className="action-icon">✏️</div>
                <h3 className="action-title">Edit Profile</h3>
                <p className="action-desc">Update your personal information</p>
              </button>

              {/* Biodata - Commented out for now, may be useful in future */}
              {/* <button
                className="action-card"
                onClick={() => navigate("/biodata")}
                style={{
                  background:
                    "linear-gradient(135deg, #A0522D 0%, #8B4513 100%)",
                  color: COLORS.TEXT_WHITE,
                }}
              >
                <div className="action-icon">📋</div>
                <h3 className="action-title">Biodata</h3>
                <p className="action-desc">View or submit your biodata</p>
              </button> */}

              <button
                className="action-card"
                onClick={() => navigate("/neworders")}
                style={{
                  background:
                    "linear-gradient(135deg, #8B4513 0%, #A0522D 50%)",
                  color: COLORS.TEXT_WHITE,
                }}
              >
                <div className="action-icon">🛒</div>
                <h3 className="action-title">New Order</h3>
                <p className="action-desc">Create a new tailoring order</p>
              </button>

              <button
                className="action-card"
                onClick={() => navigate("/orders")}
                style={{
                  background:
                    "linear-gradient(135deg, #A0522D 0%, #8B4513 100%)",
                  color: COLORS.TEXT_WHITE,
                }}
              >
                <div className="action-icon">📦</div>
                <h3 className="action-title">View Orders</h3>
                <p className="action-desc">Check your order status</p>
              </button>

              <button
                className="action-card"
                onClick={handleCreateMeasurement}
                style={{
                  background: COLORS.PRIMARY_GRADIENT,
                  color: COLORS.TEXT_WHITE,
                }}
              >
                <div className="action-icon">📏</div>
                <h3 className="action-title">Create Measurements</h3>
                <p className="action-desc">Set up your body measurements</p>
              </button>

              <button
                className="action-card"
                onClick={handleMeasurementCheck}
                style={{
                  background:
                    "linear-gradient(135deg, #A0522D 0%, #8B4513 50%)",
                  color: COLORS.TEXT_WHITE,
                }}
              >
                <div className="action-icon">👁️</div>
                <h3 className="action-title">View/Update Measurements</h3>
                <p className="action-desc">Review or modify measurements</p>
              </button>
            </div>
          </div>

          {/* Logout Section */}
          <div className="logout-section">
            <button
              className="button button-secondary logout-button"
              onClick={handleLogout}
              style={{
                background: COLORS.SECONDARY_RED,
                color: COLORS.TEXT_WHITE,
              }}
            >
              <span className="logout-icon">🚪</span>
              Logout
            </button>
            <p className="logout-note">Secure session • Last login: Today</p>
          </div>
        </main>
      </div>

      {/* Modal for No Measurements Error */}
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-icon">📏</div>
              <h3 className="modal-title">No Measurements Found</h3>
            </div>
            <div className="modal-body">
              <p className="modal-text">
                You don't have any measurements recorded yet.
              </p>
              <p className="modal-text">
                Please create your measurements first to proceed.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="button button-secondary"
                onClick={closeModal}
                style={{
                  background: COLORS.SECONDARY_RED,
                  color: COLORS.TEXT_WHITE,
                }}
              >
                Close
              </button>
              <button
                className="button button-primary"
                onClick={handleCreateMeasurement}
                style={{
                  background: COLORS.BUTTON_ACTIVE,
                  color: COLORS.TEXT_WHITE,
                }}
              >
                Create Measurements
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner-large"></div>
          <p className="loading-text">Processing...</p>
        </div>
      )}
    </div>
  );
};

export default ClientHomePage;
