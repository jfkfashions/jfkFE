// MeasurementUpdatePage.js - Enhanced Version
import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../globalContext/constant";
import { useNavigate, useParams } from "react-router-dom";
import backgroundImage from "../images/measurement_background_update.webp";
import * as Constants from "../utils/constants";

const MeasurementUpdatePage = () => {
  const [userData, setUserData] = useState({
    username: "",
    neck: "",
    chest: "",
    waist: "",
    hip: "",
    shoulder: "",
    sleeve: "",
    armhole: "",
    bicep: "",
    wrist: "",
    inseam: "",
    outseam: "",
    thigh: "",
    rise: "",
    bodylength: "",
  });

  const [originalData, setOriginalData] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("upper");
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/api/users/measurements/view/`,
        { params: { username } },
      );

      let measurements;
      if (Array.isArray(response.data)) {
        measurements = response.data[0];
      } else {
        measurements = response.data;
      }

      // Data is already in inches from API - no conversion needed
      const inchesData = convertInchesToInches(measurements);
      setUserData(inchesData);
      setOriginalData(inchesData);
    } catch (error) {
      console.error("Error fetching measurements:", error);
      setError("Unable to fetch measurements.");
    } finally {
      setLoading(false);
    }
  };

  // No conversion needed - measurements are already stored in inches
  const convertInchesToInches = (data) => {
    if (!data) return {};
    return { ...data };
  };

  // No conversion needed - submit directly in inches
  const convertInchesToApi = (data) => {
    return { ...data };
  };

  const validateForm = () => {
    const requiredFields = ["neck", "chest", "waist", "hip", "shoulder"];
    for (let field of requiredFields) {
      if (!userData[field] || userData[field] === "") {
        setError(`Please fill in the ${field} field.`);
        return false;
      }
      if (parseFloat(userData[field]) <= 0) {
        setError(`${field} must be greater than 0.`);
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowConfirmModal(true);
  };

  const handleConfirmSubmission = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      // Data is already in inches - submit directly without conversion
      const dataForApi = convertInchesToApi(userData);

      await axios.put(`${backendUrl}/api/users/measurements/update/`, {
        ...dataForApi,
        username,
      });

      setSuccessMessage("Measurements updated successfully!");
      setShowConfirmModal(false);

      setTimeout(() => {
        navigate(`/measurements/view/${username}`);
      }, 2000);
    } catch (error) {
      console.error("Error updating measurements:", error);
      setError("Failed to update measurements. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and one decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setUserData({
        ...userData,
        [e.target.name]: value,
      });
    }
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  const handleReset = () => {
    if (originalData) {
      setUserData(originalData);
      setError("");
    }
  };

  const handleBack = () => {
    navigate(`/measurements/view/${username}`);
  };

  // Measurement categories for organized input
  const measurementCategories = {
    upper: {
      title: "Upper Body",
      icon: "👕",
      fields: [
        {
          label: "Neck",
          name: "neck",
          placeholder: "Enter neck measurement in inches",
        },
        {
          label: "Chest",
          name: "chest",
          placeholder: "Enter chest measurement in inches",
        },
        {
          label: "Shoulder",
          name: "shoulder",
          placeholder: "Enter shoulder width in in",
        },
        {
          label: "Sleeve",
          name: "sleeve",
          placeholder: "Enter sleeve length in in",
        },
        {
          label: "Armhole",
          name: "armhole",
          placeholder: "Enter armhole measurement in inches",
        },
        {
          label: "Bicep",
          name: "bicep",
          placeholder: "Enter bicep measurement in inches",
        },
        {
          label: "Wrist",
          name: "wrist",
          placeholder: "Enter wrist measurement in inches",
        },
      ],
    },
    lower: {
      title: "Lower Body",
      icon: "👖",
      fields: [
        {
          label: "Waist",
          name: "waist",
          placeholder: "Enter waist measurement in inches",
        },
        {
          label: "Hip",
          name: "hip",
          placeholder: "Enter hip measurement in inches",
        },
        {
          label: "Thigh",
          name: "thigh",
          placeholder: "Enter thigh measurement in inches",
        },
        {
          label: "Inseam",
          name: "inseam",
          placeholder: "Enter inseam length in in",
        },
        {
          label: "Outseam",
          name: "outseam",
          placeholder: "Enter outseam length in in",
        },
        {
          label: "Rise",
          name: "rise",
          placeholder: "Enter rise measurement in inches",
        },
      ],
    },
    full: {
      title: "Full Body",
      icon: "👤",
      fields: [
        {
          label: "Body Length",
          name: "bodylength",
          placeholder: "Enter body length in in",
        },
      ],
    },
  };

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
      maxWidth: "900px",
      margin: "0 auto",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: Constants.BORDER_RADIUS.LG,
      boxShadow: Constants.SHADOWS.XL,
      padding: Constants.SPACING.XL,
      position: "relative",
    },
    header: {
      textAlign: "center",
      marginBottom: Constants.SPACING.XL,
    },
    heading: {
      fontSize: Constants.TYPOGRAPHY.HEADING_2.fontSize,
      fontWeight: Constants.TYPOGRAPHY.HEADING_2.fontWeight,
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
      fontFamily: Constants.SELECTED_FONT.family,
    },
    unitNotice: {
      textAlign: "center",
      fontSize: Constants.TYPOGRAPHY.BODY_SMALL.fontSize,
      color: Constants.COLORS.TEXT_GRAY,
      fontStyle: "italic",
      marginTop: Constants.SPACING.SM,
      marginBottom: Constants.SPACING.LG,
      fontFamily: Constants.SELECTED_FONT.family,
    },
    categoryTabs: {
      display: "flex",
      justifyContent: "center",
      gap: Constants.SPACING.SM,
      marginBottom: Constants.SPACING.LG,
      flexWrap: "wrap",
    },
    tabButton: (isActive) => ({
      padding: `${Constants.SPACING.SM} ${Constants.SPACING.LG}`,
      fontSize: Constants.TYPOGRAPHY.BODY.fontSize,
      fontWeight: "500",
      border: "none",
      borderRadius: Constants.BORDER_RADIUS.PILL,
      cursor: "pointer",
      transition: `all ${Constants.TRANSITIONS.DEFAULT}`,
      background: isActive ? Constants.COLORS.PRIMARY_GRADIENT : "transparent",
      color: isActive
        ? Constants.COLORS.TEXT_WHITE
        : Constants.COLORS.PRIMARY_BROWN_1,
      border: isActive
        ? "none"
        : `2px solid ${Constants.COLORS.PRIMARY_BROWN_1}`,
      display: "flex",
      alignItems: "center",
      gap: Constants.SPACING.SM,
      fontFamily: Constants.SELECTED_FONT.family,
    }),
    form: {
      display: "flex",
      flexDirection: "column",
    },
    measurementGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: Constants.SPACING.MD,
      marginBottom: Constants.SPACING.XL,
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
    },
    inputLabel: {
      fontSize: Constants.TYPOGRAPHY.BODY.fontSize,
      fontWeight: "500",
      color: Constants.COLORS.TEXT_BLACK,
      marginBottom: Constants.SPACING.XS,
      fontFamily: Constants.SELECTED_FONT.family,
    },
    inputWrapper: {
      position: "relative",
    },
    input: {
      width: "100%",
      padding: `${Constants.SPACING.MD} ${Constants.SPACING.LG}`,
      fontSize: Constants.TYPOGRAPHY.BODY.fontSize,
      border: `2px solid ${Constants.COLORS.TEXT_GRAY}`,
      borderRadius: Constants.BORDER_RADIUS.MD,
      transition: `all ${Constants.TRANSITIONS.FAST}`,
      fontFamily: Constants.SELECTED_FONT.family,
    },
    inputUnit: {
      position: "absolute",
      right: Constants.SPACING.MD,
      top: "50%",
      transform: "translateY(-50%)",
      color: Constants.COLORS.TEXT_GRAY,
      fontSize: Constants.TYPOGRAPHY.BODY_SMALL.fontSize,
      fontFamily: Constants.SELECTED_FONT.family,
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      gap: Constants.SPACING.MD,
      marginTop: Constants.SPACING.LG,
      flexWrap: "wrap",
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
      padding: `${Constants.SPACING.MD} ${Constants.SPACING.XL}`,
      fontSize: Constants.TYPOGRAPHY.BUTTON_TEXT.fontSize,
      fontWeight: Constants.TYPOGRAPHY.BUTTON_TEXT.fontWeight,
      border: `2px solid ${Constants.COLORS.SECONDARY_RED}`,
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
      background: "transparent",
      color: Constants.COLORS.SECONDARY_RED,
      fontFamily: Constants.SELECTED_FONT.family,
    },
    errorContainer: {
      padding: Constants.SPACING.MD,
      background: "rgba(220, 20, 60, 0.1)",
      borderRadius: Constants.BORDER_RADIUS.MD,
      marginBottom: Constants.SPACING.MD,
      textAlign: "center",
    },
    errorText: {
      color: Constants.COLORS.SECONDARY_RED,
      fontSize: Constants.TYPOGRAPHY.BODY.fontSize,
      fontFamily: Constants.SELECTED_FONT.family,
    },
    successContainer: {
      padding: Constants.SPACING.MD,
      background: "rgba(16, 185, 129, 0.1)",
      borderRadius: Constants.BORDER_RADIUS.MD,
      marginBottom: Constants.SPACING.MD,
      textAlign: "center",
    },
    successText: {
      color: Constants.COLORS.SUCCESS,
      fontSize: Constants.TYPOGRAPHY.BODY.fontSize,
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
    // Modal Styles
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: Constants.Z_INDEX.MODAL,
      padding: Constants.SPACING.XL,
    },
    modalContent: {
      background: Constants.COLORS.TEXT_WHITE,
      borderRadius: Constants.BORDER_RADIUS.LG,
      padding: Constants.SPACING.XL,
      maxWidth: "800px",
      width: "100%",
      maxHeight: "80vh",
      overflow: "auto",
      boxShadow: Constants.SHADOWS.XL,
    },
    modalHeader: {
      textAlign: "center",
      marginBottom: Constants.SPACING.LG,
    },
    modalTitle: {
      fontSize: Constants.TYPOGRAPHY.HEADING_3.fontSize,
      color: Constants.COLORS.PRIMARY_BROWN_1,
      marginBottom: Constants.SPACING.SM,
      fontFamily: Constants.SELECTED_FONT.family,
    },
    comparisonTable: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: Constants.SPACING.LG,
    },
    tableHeader: {
      background: Constants.COLORS.PRIMARY_GRADIENT,
      color: Constants.COLORS.TEXT_WHITE,
      padding: Constants.SPACING.MD,
      textAlign: "left",
      fontFamily: Constants.SELECTED_FONT.family,
    },
    tableCell: {
      padding: Constants.SPACING.MD,
      borderBottom: `1px solid rgba(0, 0, 0, 0.1)`,
      fontFamily: Constants.SELECTED_FONT.family,
    },
    changedCell: {
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      fontWeight: "600",
    },
    unchangedCell: {
      color: Constants.COLORS.TEXT_GRAY,
    },
    modalButtons: {
      display: "flex",
      justifyContent: "center",
      gap: Constants.SPACING.MD,
    },
    confirmButton: {
      padding: `${Constants.SPACING.MD} ${Constants.SPACING.XL}`,
      fontSize: Constants.TYPOGRAPHY.BUTTON_TEXT.fontSize,
      fontWeight: Constants.TYPOGRAPHY.BUTTON_TEXT.fontWeight,
      border: "none",
      borderRadius: Constants.BORDER_RADIUS.PILL,
      cursor: "pointer",
      transition: `all ${Constants.TRANSITIONS.DEFAULT}`,
      background: Constants.COLORS.PRIMARY_GRADIENT,
      color: Constants.COLORS.TEXT_WHITE,
      minWidth: "150px",
      fontFamily: Constants.SELECTED_FONT.family,
    },
    cancelButton: {
      padding: `${Constants.SPACING.MD} ${Constants.SPACING.XL}`,
      fontSize: Constants.TYPOGRAPHY.BUTTON_TEXT.fontSize,
      fontWeight: Constants.TYPOGRAPHY.BUTTON_TEXT.fontWeight,
      border: `2px solid ${Constants.COLORS.SECONDARY_RED}`,
      borderRadius: Constants.BORDER_RADIUS.PILL,
      cursor: "pointer",
      transition: `all ${Constants.TRANSITIONS.DEFAULT}`,
      background: "transparent",
      color: Constants.COLORS.SECONDARY_RED,
      minWidth: "150px",
      fontFamily: Constants.SELECTED_FONT.family,
    },
  };

  // Hover effects
  const buttonHoverStyle = {
    transform: "translateY(-2px)",
    boxShadow: Constants.SHADOWS.LG,
  };

  // Check if a field has changed
  const hasChanged = (fieldName) => {
    return originalData && userData[fieldName] !== originalData[fieldName];
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loadingContainer}>
            <p style={styles.loadingText}>Loading measurements...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.heading}>Update Body Measurements</h1>
          <p style={styles.subheading}>
            Update your tailoring measurements for perfect fit
          </p>
          <div style={styles.usernameBadge}>Client: {username}</div>
          <p style={styles.unitNotice}>
            All measurements are in inches (in)
          </p>
        </div>

        {error && (
          <div style={styles.errorContainer}>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        {successMessage && (
          <div style={styles.successContainer}>
            <p style={styles.successText}>{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Category Tabs */}
          <div style={styles.categoryTabs}>
            {Object.keys(measurementCategories).map((categoryKey) => (
              <button
                key={categoryKey}
                type="button"
                style={styles.tabButton(activeCategory === categoryKey)}
                onMouseEnter={(e) =>
                  activeCategory !== categoryKey &&
                  Object.assign(e.target.style, buttonHoverStyle)
                }
                onMouseLeave={(e) =>
                  activeCategory !== categoryKey &&
                  Object.assign(e.target.style, styles.tabButton(false))
                }
                onClick={() => setActiveCategory(categoryKey)}
              >
                <span>{measurementCategories[categoryKey].icon}</span>
                <span>{measurementCategories[categoryKey].title}</span>
              </button>
            ))}
          </div>

          {/* Measurement Inputs by Category */}
          <div style={styles.measurementGrid}>
            {measurementCategories[activeCategory].fields.map((field) => (
              <div key={field.name} style={styles.inputGroup}>
                <label style={styles.inputLabel}>
                  {field.label}
                  {hasChanged(field.name) && " *"}
                </label>
                <div style={styles.inputWrapper}>
                  <input
                    type="text"
                    name={field.name}
                    value={userData[field.name] || ""}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder={field.placeholder}
                    required
                  />
                  <span style={styles.inputUnit}>in</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={styles.buttonContainer}>
            <button
              type="submit"
              style={styles.primaryButton}
              onMouseEnter={(e) =>
                Object.assign(e.target.style, buttonHoverStyle)
              }
              onMouseLeave={(e) =>
                Object.assign(e.target.style, styles.primaryButton)
              }
            >
              📝 Update Measurements
            </button>
            <button
              type="button"
              style={styles.secondaryButton}
              onMouseEnter={(e) =>
                Object.assign(e.target.style, buttonHoverStyle)
              }
              onMouseLeave={(e) =>
                Object.assign(e.target.style, styles.secondaryButton)
              }
              onClick={handleReset}
            >
              ↩️ Reset to Original
            </button>
            <button
              type="button"
              style={styles.secondaryButton}
              onMouseEnter={(e) =>
                Object.assign(e.target.style, buttonHoverStyle)
              }
              onMouseLeave={(e) =>
                Object.assign(e.target.style, styles.secondaryButton)
              }
              onClick={handleBack}
            >
              ← Back to View
            </button>
          </div>
        </form>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Review Your Changes</h2>
                <p>Please review and confirm your measurement updates:</p>
              </div>

              <table style={styles.comparisonTable}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Measurement</th>
                    <th style={styles.tableHeader}>Current (in)</th>
                    <th style={styles.tableHeader}>Updated (in)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(userData)
                    .filter((key) => key !== "username" && key !== "id")
                    .map((key) => {
                      const isChanged = hasChanged(key);
                      return (
                        <tr key={key}>
                          <td style={styles.tableCell}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </td>
                          <td
                            style={{
                              ...styles.tableCell,
                              ...(isChanged ? styles.unchangedCell : {}),
                            }}
                          >
                            {originalData?.[key] || "N/A"}
                          </td>
                          <td
                            style={{
                              ...styles.tableCell,
                              ...(isChanged ? styles.changedCell : {}),
                            }}
                          >
                            {userData[key] || "N/A"}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              <div style={styles.modalButtons}>
                <button
                  onClick={handleConfirmSubmission}
                  style={styles.confirmButton}
                  disabled={isSubmitting}
                  onMouseEnter={(e) =>
                    !isSubmitting &&
                    Object.assign(e.target.style, buttonHoverStyle)
                  }
                  onMouseLeave={(e) =>
                    !isSubmitting &&
                    Object.assign(e.target.style, styles.confirmButton)
                  }
                >
                  {isSubmitting ? "🔄 Updating..." : "✅ Confirm Update"}
                </button>
                <button
                  onClick={handleCancel}
                  style={styles.cancelButton}
                  onMouseEnter={(e) =>
                    Object.assign(e.target.style, buttonHoverStyle)
                  }
                  onMouseLeave={(e) =>
                    Object.assign(e.target.style, styles.cancelButton)
                  }
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeasurementUpdatePage;
