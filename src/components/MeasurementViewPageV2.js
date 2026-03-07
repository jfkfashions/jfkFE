// MeasurementViewPage.js - Enhanced with Design System
import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../globalContext/constant";
import { useNavigate, useParams } from "react-router-dom";
import backgroundImage from "../images/measurements_background.webp";
import "../styles/global.css"; // Import global styles
import * as Constants from "../utils/constants"; // Import design system constants

const MeasurementViewPage = () => {
  const [measurements, setMeasurements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const role = localStorage.getItem("role");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { username } = useParams();

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/api/users/measurements/view/`,
        {
          params: { username },
        },
      );
      // Handle both single measurement and array response
      if (Array.isArray(response.data)) {
        setMeasurements(response.data[0]); // Take first measurement if array
      } else {
        setMeasurements(response.data);
      }
    } catch (error) {
      console.error("Error fetching measurements:", error);
      setError("Unable to fetch measurements. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/measurements/update/${username}`);
  };

  const handleBackHome = () => {
    if (role === "client") {
      navigate("/client-home");
    } else if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleRefresh = () => {
    fetchMeasurements();
  };

  const handlePrint = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
      setIsPrintMode(false);
    }, 100);
  };

  // Measurement categories for better organization (all in inches)
  const measurementCategories = [
    {
      title: "Upper Body Measurements",
      icon: "👕",
      measurements: [
        { label: "Neck", value: measurements?.neck, unit: "inches" },
        { label: "Chest", value: measurements?.chest, unit: "inches" },
        { label: "Shoulder", value: measurements?.shoulder, unit: "inches" },
        { label: "Armhole", value: measurements?.armhole, unit: "inches" },
        { label: "Bicep", value: measurements?.bicep, unit: "inches" },
        { label: "Sleeve", value: measurements?.sleeve, unit: "inches" },
        { label: "Wrist", value: measurements?.wrist, unit: "inches" },
      ],
    },
    {
      title: "Lower Body Measurements",
      icon: "👖",
      measurements: [
        { label: "Waist", value: measurements?.waist, unit: "inches" },
        { label: "Hip", value: measurements?.hip, unit: "inches" },
        { label: "Thigh", value: measurements?.thigh, unit: "inches" },
        { label: "Inseam", value: measurements?.inseam, unit: "inches" },
        { label: "Outseam", value: measurements?.outseam, unit: "inches" },
        { label: "Rise", value: measurements?.rise, unit: "inches" },
      ],
    },
    {
      title: "Full Body",
      icon: "👤",
      measurements: [
        {
          label: "Body Length",
          value: measurements?.bodylength,
          unit: "inches",
        },
      ],
    },
  ];

  // Inline styles using constants
  const styles = {
    page: {
      minHeight: "100vh",
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: Constants.SPACING.XL,
      fontFamily: Constants.SELECTED_FONT.family,
    },
    container: {
      width: "100%",
      maxWidth: "800px",
      margin: "0 auto",
      padding: Constants.SPACING.XL,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: Constants.BORDER_RADIUS.LG,
      boxShadow: Constants.SHADOWS.XL,
      position: "relative",
    },
    header: {
      textAlign: "center",
      marginBottom: Constants.SPACING.XL,
    },
    heading: {
      fontSize: Constants.TYPOGRAPHY.HEADING_2.fontSize,
      fontWeight: Constants.TYPOGRAPHY.HEADING_2.fontWeight,
      lineHeight: Constants.TYPOGRAPHY.HEADING_2.lineHeight,
      color: Constants.COLORS.PRIMARY_BROWN_1,
      marginBottom: Constants.SPACING.SM,
      fontFamily: Constants.SELECTED_FONT.family,
    },
    subheading: {
      fontSize: Constants.TYPOGRAPHY.BODY_LARGE.fontSize,
      color: Constants.COLORS.TEXT_GRAY,
      marginBottom: Constants.SPACING.MD,
      fontFamily: Constants.SELECTED_FONT.family,
    },
    usernameBadge: {
      display: "inline-block",
      padding: `${Constants.SPACING.XS} ${Constants.SPACING.MD}`,
      background: Constants.COLORS.PRIMARY_GRADIENT,
      color: Constants.COLORS.TEXT_WHITE,
      borderRadius: Constants.BORDER_RADIUS.PILL,
      fontSize: Constants.TYPOGRAPHY.BODY_SMALL.fontSize,
      fontWeight: "600",
      marginTop: Constants.SPACING.SM,
      fontFamily: Constants.SELECTED_FONT.family,
    },
    categoryCard: {
      background: "rgba(139, 69, 19, 0.05)",
      borderRadius: Constants.BORDER_RADIUS.LG,
      padding: Constants.SPACING.LG,
      marginBottom: Constants.SPACING.LG,
      borderLeft: `4px solid ${Constants.COLORS.PRIMARY_BROWN_1}`,
    },
    categoryHeader: {
      display: "flex",
      alignItems: "center",
      gap: Constants.SPACING.SM,
      marginBottom: Constants.SPACING.MD,
    },
    categoryIcon: {
      fontSize: "1.5rem",
    },
    categoryTitle: {
      fontSize: Constants.TYPOGRAPHY.HEADING_4.fontSize,
      fontWeight: Constants.TYPOGRAPHY.HEADING_4.fontWeight,
      color: Constants.COLORS.PRIMARY_BROWN_2,
      fontFamily: Constants.SELECTED_FONT.family,
    },
    measurementGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: Constants.SPACING.MD,
    },
    measurementCard: {
      background: Constants.COLORS.TEXT_WHITE,
      borderRadius: Constants.BORDER_RADIUS.MD,
      padding: Constants.SPACING.MD,
      boxShadow: Constants.SHADOWS.SM,
      border: `1px solid rgba(139, 69, 19, 0.1)`,
    },
    measurementLabel: {
      fontSize: Constants.TYPOGRAPHY.BODY_SMALL.fontSize,
      color: Constants.COLORS.TEXT_GRAY,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      fontWeight: "500",
      marginBottom: Constants.SPACING.XS,
      fontFamily: Constants.SELECTED_FONT.family,
    },
    measurementValue: {
      fontSize: Constants.TYPOGRAPHY.HEADING_3.fontSize,
      fontWeight: "600",
      color: Constants.COLORS.PRIMARY_BROWN_1,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontFamily: Constants.SELECTED_FONT.family,
    },
    measurementUnit: {
      fontSize: Constants.TYPOGRAPHY.BODY.fontSize,
      color: Constants.COLORS.TEXT_GRAY,
      marginLeft: Constants.SPACING.XS,
      fontFamily: Constants.SELECTED_FONT.family,
    },
    buttonContainer: {
      display: "flex",
      flexDirection: "column",
      gap: Constants.SPACING.MD,
      marginTop: Constants.SPACING.XL,
    },
    primaryButtonRow: {
      display: "flex",
      justifyContent: "center",
      gap: Constants.SPACING.MD,
    },
    secondaryButtonRow: {
      display: "flex",
      justifyContent: "center",
      gap: Constants.SPACING.SM,
    },
    primaryButton: {
      padding: `${Constants.SPACING.MD} ${Constants.SPACING.XL}`,
      fontSize: Constants.TYPOGRAPHY.BUTTON_TEXT.fontSize,
      fontWeight: Constants.TYPOGRAPHY.BUTTON_TEXT.fontWeight,
      border: "none",
      borderRadius: Constants.BORDER_RADIUS.PILL,
      cursor: "pointer",
      transition: `all ${Constants.TRANSITIONS.DEFAULT}`,
      textTransform: Constants.TYPOGRAPHY.BUTTON_TEXT.textTransform,
      letterSpacing: Constants.TYPOGRAPHY.BUTTON_TEXT.letterSpacing,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: Constants.SPACING.SM,
      minWidth: "180px",
      background: Constants.COLORS.PRIMARY_GRADIENT,
      color: Constants.COLORS.TEXT_WHITE,
      fontFamily: Constants.SELECTED_FONT.family,
    },
    secondaryButton: {
      padding: `${Constants.SPACING.SM} ${Constants.SPACING.LG}`,
      fontSize: Constants.TYPOGRAPHY.BODY.fontSize,
      fontWeight: "500",
      border: `2px solid ${Constants.COLORS.PRIMARY_BROWN_1}`,
      borderRadius: Constants.BORDER_RADIUS.MD,
      cursor: "pointer",
      transition: `all ${Constants.TRANSITIONS.DEFAULT}`,
      background: "transparent",
      color: Constants.COLORS.PRIMARY_BROWN_1,
      fontFamily: Constants.SELECTED_FONT.family,
    },
    dangerButton: {
      padding: `${Constants.SPACING.SM} ${Constants.SPACING.LG}`,
      fontSize: Constants.TYPOGRAPHY.BODY.fontSize,
      fontWeight: "500",
      border: `2px solid ${Constants.COLORS.SECONDARY_RED}`,
      borderRadius: Constants.BORDER_RADIUS.MD,
      cursor: "pointer",
      transition: `all ${Constants.TRANSITIONS.DEFAULT}`,
      background: "transparent",
      color: Constants.COLORS.SECONDARY_RED,
      fontFamily: Constants.SELECTED_FONT.family,
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "200px",
    },
    loadingText: {
      fontSize: Constants.TYPOGRAPHY.BODY_LARGE.fontSize,
      color: Constants.COLORS.PRIMARY_BROWN_1,
      fontFamily: Constants.SELECTED_FONT.family,
    },
    errorContainer: {
      textAlign: "center",
      padding: Constants.SPACING.LG,
      background: "rgba(220, 20, 60, 0.1)",
      borderRadius: Constants.BORDER_RADIUS.MD,
    },
    errorHeading: {
      fontSize: Constants.TYPOGRAPHY.HEADING_4.fontSize,
      color: Constants.COLORS.SECONDARY_RED,
      marginBottom: Constants.SPACING.SM,
      fontFamily: Constants.SELECTED_FONT.family,
    },
    noDataContainer: {
      textAlign: "center",
      padding: Constants.SPACING.LG,
    },
    timestamp: {
      textAlign: "center",
      fontSize: Constants.TYPOGRAPHY.BODY_SMALL.fontSize,
      color: Constants.COLORS.TEXT_GRAY,
      marginTop: Constants.SPACING.LG,
      padding: Constants.SPACING.MD,
      borderTop: `1px solid rgba(0, 0, 0, 0.1)`,
      fontFamily: Constants.SELECTED_FONT.family,
    },
    unitNotice: {
      textAlign: "center",
      fontSize: Constants.TYPOGRAPHY.BODY_SMALL.fontSize,
      color: Constants.COLORS.TEXT_GRAY,
      fontStyle: "italic",
      marginBottom: Constants.SPACING.MD,
      fontFamily: Constants.SELECTED_FONT.family,
    },
  };

  // Hover effects for buttons
  const buttonHoverStyle = {
    transform: "translateY(-2px)",
    boxShadow: Constants.SHADOWS.LG,
  };

  return (
    <div className="page" style={styles.page}>
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.header}>
          <h1 style={styles.heading}>Body Measurements</h1>
          <p style={styles.subheading}>
            Professional tailoring measurements for perfect fit
          </p>
          <div style={styles.usernameBadge}>Client: {username}</div>
          <p style={styles.unitNotice}>All measurements in inches (in)</p>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            <p style={styles.loadingText}>Loading measurements...</p>
          </div>
        ) : error ? (
          <div style={styles.errorContainer}>
            <h4 style={styles.errorHeading}>Error Loading Measurements</h4>
            <p>{error}</p>
            <button
              style={{
                ...styles.primaryButton,
                marginTop: Constants.SPACING.MD,
              }}
              onMouseEnter={(e) =>
                Object.assign(e.target.style, buttonHoverStyle)
              }
              onMouseLeave={(e) =>
                Object.assign(e.target.style, {
                  ...styles.primaryButton,
                  marginTop: Constants.SPACING.MD,
                })
              }
              onClick={handleRefresh}
            >
              Try Again
            </button>
          </div>
        ) : !measurements ? (
          <div style={styles.noDataContainer}>
            <h4
              style={{
                color: Constants.COLORS.TEXT_GRAY,
                marginBottom: Constants.SPACING.MD,
              }}
            >
              No Measurements Found
            </h4>
            <p style={{ marginBottom: Constants.SPACING.LG }}>
              No body measurements recorded for this user yet.
            </p>
            <button
              style={styles.primaryButton}
              onMouseEnter={(e) =>
                Object.assign(e.target.style, buttonHoverStyle)
              }
              onMouseLeave={(e) =>
                Object.assign(e.target.style, styles.primaryButton)
              }
              onClick={() => navigate(`/measurements/create/${username}`)}
            >
              Create Measurements
            </button>
          </div>
        ) : (
          <>
            {/* Measurement Categories */}
            <div>
              {measurementCategories.map((category, index) => (
                <div key={index} style={styles.categoryCard}>
                  <div style={styles.categoryHeader}>
                    <span style={styles.categoryIcon}>{category.icon}</span>
                    <h3 style={styles.categoryTitle}>{category.title}</h3>
                  </div>
                  <div style={styles.measurementGrid}>
                    {category.measurements.map((item, idx) => (
                      <div key={idx} style={styles.measurementCard}>
                        <div style={styles.measurementLabel}>{item.label}</div>
                        <div style={styles.measurementValue}>
                          <span>{item.value || "N/A"}</span>
                          <span style={styles.measurementUnit}>
                            {item.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Last Updated Timestamp */}
            {measurements.updated_at && (
              <div style={styles.timestamp}>
                Last updated:{" "}
                {new Date(measurements.updated_at).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}

            {/* Action Buttons */}
            <div style={styles.buttonContainer}>
              <div style={styles.primaryButtonRow}>
                <button
                  style={styles.primaryButton}
                  onMouseEnter={(e) =>
                    Object.assign(e.target.style, {
                      ...styles.primaryButton,
                      ...buttonHoverStyle,
                    })
                  }
                  onMouseLeave={(e) =>
                    Object.assign(e.target.style, styles.primaryButton)
                  }
                  onClick={handleEdit}
                >
                  ✏️ Edit Measurements
                </button>
                <button
                  style={{
                    ...styles.primaryButton,
                    background: Constants.COLORS.SECONDARY_RED,
                  }}
                  onMouseEnter={(e) =>
                    Object.assign(e.target.style, {
                      ...styles.primaryButton,
                      background: Constants.COLORS.SECONDARY_RED,
                      ...buttonHoverStyle,
                    })
                  }
                  onMouseLeave={(e) =>
                    Object.assign(e.target.style, {
                      ...styles.primaryButton,
                      background: Constants.COLORS.SECONDARY_RED,
                    })
                  }
                  onClick={handleBackHome}
                >
                  🏠 Back to Home
                </button>
              </div>

              <div style={styles.secondaryButtonRow}>
                <button
                  style={styles.secondaryButton}
                  onMouseEnter={(e) =>
                    Object.assign(e.target.style, {
                      ...styles.secondaryButton,
                      background: Constants.COLORS.PRIMARY_BROWN_1,
                      color: Constants.COLORS.TEXT_WHITE,
                      ...buttonHoverStyle,
                    })
                  }
                  onMouseLeave={(e) =>
                    Object.assign(e.target.style, styles.secondaryButton)
                  }
                  onClick={handlePrint}
                >
                  🖨️ Print
                </button>
                <button
                  style={styles.secondaryButton}
                  onMouseEnter={(e) =>
                    Object.assign(e.target.style, {
                      ...styles.secondaryButton,
                      background: Constants.COLORS.PRIMARY_BROWN_1,
                      color: Constants.COLORS.TEXT_WHITE,
                      ...buttonHoverStyle,
                    })
                  }
                  onMouseLeave={(e) =>
                    Object.assign(e.target.style, styles.secondaryButton)
                  }
                  onClick={handleRefresh}
                >
                  🔄 Refresh
                </button>
                {/* View History button - commented out for future implementation
                <button
                  style={styles.dangerButton}
                  onMouseEnter={(e) =>
                    Object.assign(e.target.style, {
                      ...styles.dangerButton,
                      background: Constants.COLORS.SECONDARY_RED,
                      color: Constants.COLORS.TEXT_WHITE,
                      ...buttonHoverStyle,
                    })
                  }
                  onMouseLeave={(e) =>
                    Object.assign(e.target.style, styles.dangerButton)
                  }
                  onClick={() => navigate(`/measurements/history/${username}`)}
                >
                  📜 View History
                </button>
                */}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Print styles */}
      {isPrintMode && (
        <style>{`
                    @media print {
                        .page::before,
                        button,
                        .unit-notice {
                            display: none !important;
                        }
                        
                        .page {
                            background: white !important;
                            padding: 0 !important;
                        }
                        
                        .container {
                            box-shadow: none !important;
                            background: white !important;
                            max-width: 100% !important;
                        }
                        
                        h1, h2, h3, h4 {
                            color: black !important;
                        }
                        
                        .username-badge {
                            background: #333 !important;
                            color: white !important;
                            -webkit-print-color-adjust: exact;
                        }
                    }
                `}</style>
      )}
    </div>
  );
};

export default MeasurementViewPage;
