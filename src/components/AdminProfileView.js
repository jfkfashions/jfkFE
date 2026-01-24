import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../globalContext/constant";
import { useNavigate, useParams } from "react-router-dom";
import background from "../images/editprofile.webp";
import {
  COLORS,
  SELECTED_FONT,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from "../utils/constants";

const ViewProfilePage = () => {
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    bio: "",
    role: "",
    gender: "",
    birthdate: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { ProfileId } = useParams();
  const [modalVisible, setModalVisible] = useState(false); // For error modal visibility

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/users/profile/${ProfileId}`,
        );
        setProfile(response.data);
      } catch (err) {
        setError("Unable to fetch profile information.");
      }
    };

    fetchProfile();
  }, [ProfileId]);

  const handleMeasurementCheck = async () => {
    try {
      const username = ProfileId;
      const response = await axios.get(
        `${backendUrl}/api/users/measurements/view/`,
        {
          params: { username },
        },
      );
      if (response.data) {
        navigate(`/measurements/view/${username}`); // Navigate to measurements page if data exists
      } else {
        setModalVisible(true); // Show modal if no measurements found
      }
    } catch (error) {
      setModalVisible(true); // Show modal on error (e.g., no measurements found)
    }
  };

  const closeModal = () => {
    setModalVisible(false); // Close modal when user clicks "Close"
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>
          View Profile: {profile.firstname} {profile.lastname}
        </h1>
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.profileInfo}>
          <div style={styles.field}>
            <span style={styles.label}>First Name: </span>
            <span style={styles.value}>{profile.firstname}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Last Name: </span>
            <span style={styles.value}>{profile.lastname}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Phone Number: </span>
            <span style={styles.value}>{profile.phonenumber}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Email: </span>
            <span style={styles.value}>{profile.email}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Bio: </span>
            <span style={styles.value}>{profile.bio}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Role: </span>
            <span style={styles.value}>{profile.role}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Gender: </span>
            <span style={styles.value}>{profile.gender}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Birthdate: </span>
            <span style={styles.value}>{profile.birthdate}</span>
          </div>
        </div>
        <br></br>
        <div style={styles.actionButtonContainer}>
          <button
            onClick={() => navigate("/admin/dashboard")}
            style={styles.actionbutton}
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate(`/createmeasurement/${profile.username}`)}
            style={styles.actionbutton}
          >
            Create Measurement
          </button>
          <button onClick={handleMeasurementCheck} style={styles.actionbutton}>
            View/Modify Measurement
          </button>
        </div>
      </div>
      {/* Modal for No Measurements Error */}
      {modalVisible && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalHeading}>Error</h3>
            <p style={styles.modalText}>
              You don't have any measurements to view or update.
            </p>
            <p style={styles.modalText}>
              Please proceed to capture your measurment{" "}
            </p>
            <button onClick={closeModal} style={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Inline styles
const styles = {
  page: {
    minHeight: "100vh",
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.XL,
    fontFamily: SELECTED_FONT,
  },
  container: {
    maxWidth: "900px",
    width: "100%",
    margin: "50px auto",
    padding: SPACING.XXL,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: BORDER_RADIUS.LG,
    boxShadow: SHADOWS.LARGE,
  },
  heading: {
    fontSize: TYPOGRAPHY.HEADING_1,
    fontWeight: TYPOGRAPHY.WEIGHT_BOLD,
    marginBottom: SPACING.XL,
    textAlign: "center",
    color: COLORS.PRIMARY_BROWN_1,
    fontFamily: SELECTED_FONT,
  },
  profileInfo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: SPACING.LG,
    marginBottom: SPACING.XL,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    padding: SPACING.MD,
    backgroundColor: "rgba(139, 69, 19, 0.03)",
    borderRadius: BORDER_RADIUS.MD,
    border: `1px solid ${COLORS.BORDER}`,
  },
  label: {
    fontWeight: TYPOGRAPHY.WEIGHT_SEMIBOLD,
    fontSize: TYPOGRAPHY.BODY,
    color: COLORS.PRIMARY_BROWN_1,
    marginBottom: SPACING.XS,
    fontFamily: SELECTED_FONT,
  },
  value: {
    fontSize: TYPOGRAPHY.BODY,
    color: COLORS.TEXT_DARK,
    fontFamily: SELECTED_FONT,
  },
  error: {
    color: COLORS.SECONDARY_RED,
    fontSize: TYPOGRAPHY.BODY,
    marginBottom: SPACING.LG,
    textAlign: "center",
    padding: SPACING.MD,
    backgroundColor: "rgba(220, 53, 69, 0.1)",
    borderRadius: BORDER_RADIUS.MD,
    fontFamily: SELECTED_FONT,
  },
  actionButtonContainer: {
    display: "flex",
    gap: SPACING.MD,
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: SPACING.XL,
  },
  actionbutton: {
    padding: `${SPACING.MD} ${SPACING.LG}`,
    backgroundColor: COLORS.PRIMARY_BROWN_1,
    color: COLORS.TEXT_WHITE,
    border: "none",
    borderRadius: BORDER_RADIUS.MD,
    cursor: "pointer",
    fontSize: TYPOGRAPHY.BODY,
    fontWeight: TYPOGRAPHY.WEIGHT_SEMIBOLD,
    fontFamily: SELECTED_FONT,
    transition: "all 0.3s ease",
    minWidth: "180px",
    boxShadow: SHADOWS.MEDIUM,
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: COLORS.TEXT_WHITE,
    padding: SPACING.XXL,
    borderRadius: BORDER_RADIUS.LG,
    textAlign: "center",
    boxShadow: SHADOWS.LARGE,
    maxWidth: "450px",
    width: "90%",
  },
  modalHeading: {
    fontSize: TYPOGRAPHY.HEADING_2,
    fontWeight: TYPOGRAPHY.WEIGHT_BOLD,
    color: COLORS.PRIMARY_BROWN_1,
    marginBottom: SPACING.MD,
    fontFamily: SELECTED_FONT,
  },
  modalText: {
    fontSize: TYPOGRAPHY.BODY,
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.MD,
    fontFamily: SELECTED_FONT,
  },
  closeButton: {
    padding: `${SPACING.SM} ${SPACING.XL}`,
    fontSize: TYPOGRAPHY.BODY,
    fontWeight: TYPOGRAPHY.WEIGHT_SEMIBOLD,
    color: COLORS.TEXT_WHITE,
    backgroundColor: COLORS.PRIMARY_BROWN_1,
    border: "none",
    borderRadius: BORDER_RADIUS.MD,
    cursor: "pointer",
    fontFamily: SELECTED_FONT,
    marginTop: SPACING.MD,
    boxShadow: SHADOWS.MEDIUM,
  },
};

export default ViewProfilePage;
