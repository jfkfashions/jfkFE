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

const EditProfilePage = () => {
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    bio: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // To control the success modal visibility
  const navigate = useNavigate();
  const { ProfileId } = useParams();
  console.log(ProfileId);
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
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${backendUrl}/api/users/profile/${ProfileId}/`, profile);
      setSuccess(true); // Show the success modal
      setTimeout(() => {
        navigate("/admin/dashboard"); // Redirect to homepage after 2 seconds
      }, 2000); // Adjust the delay as needed
    } catch (err) {
      setError("Unable to update profile.");
    }
  };

  const closeModal = () => {
    setSuccess(false);
    navigate("/admin/dashboard");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Edit Profile: {ProfileId}</h1>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>First Name:</label>
          <input
            type="text"
            name="firstname"
            value={profile.firstname}
            onChange={handleChange}
            style={styles.input}
          />
          <label style={styles.label}>Last Name:</label>
          <input
            type="text"
            name="lastname"
            value={profile.lastname}
            onChange={handleChange}
            style={styles.input}
          />
          <label style={styles.label}>Phone Number:</label>
          <input
            type="text"
            name="phonenumber"
            value={profile.phonenumber}
            onChange={handleChange}
            style={styles.input}
          />
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            readOnly
            style={styles.inputReadonly}
          />
          <label style={styles.label}>Bio:</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            style={styles.textarea}
          ></textarea>
          <button type="submit" style={styles.button}>
            Update Profile
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            style={styles.homeButton}
          >
            Back to Home
          </button>
        </form>
      </div>

      {/* Modal for Success Message */}
      {success && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalHeading}>Success!</h3>
            <p style={styles.modalText}>Profile updated successfully.</p>
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
    maxWidth: "700px",
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
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: SPACING.SM,
    fontSize: TYPOGRAPHY.BODY,
    fontWeight: TYPOGRAPHY.WEIGHT_SEMIBOLD,
    color: COLORS.PRIMARY_BROWN_1,
    fontFamily: SELECTED_FONT,
  },
  input: {
    padding: SPACING.MD,
    fontSize: TYPOGRAPHY.BODY,
    marginBottom: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    border: `1px solid ${COLORS.BORDER}`,
    fontFamily: SELECTED_FONT,
    transition: "border-color 0.3s ease",
  },
  inputReadonly: {
    padding: SPACING.MD,
    fontSize: TYPOGRAPHY.BODY,
    marginBottom: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    border: `1px solid ${COLORS.BORDER}`,
    fontFamily: SELECTED_FONT,
    backgroundColor: "#f5f5f5",
    color: "#666",
    cursor: "not-allowed",
  },
  textarea: {
    padding: SPACING.MD,
    fontSize: TYPOGRAPHY.BODY,
    marginBottom: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    border: `1px solid ${COLORS.BORDER}`,
    resize: "vertical",
    height: "120px",
    fontFamily: SELECTED_FONT,
    transition: "border-color 0.3s ease",
  },
  button: {
    padding: `${SPACING.MD} ${SPACING.LG}`,
    fontSize: TYPOGRAPHY.BODY,
    fontWeight: TYPOGRAPHY.WEIGHT_SEMIBOLD,
    color: COLORS.TEXT_WHITE,
    backgroundColor: COLORS.PRIMARY_BROWN_1,
    border: "none",
    borderRadius: BORDER_RADIUS.MD,
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginBottom: SPACING.MD,
    fontFamily: SELECTED_FONT,
    boxShadow: SHADOWS.MEDIUM,
  },
  homeButton: {
    padding: `${SPACING.MD} ${SPACING.LG}`,
    fontSize: TYPOGRAPHY.BODY,
    fontWeight: TYPOGRAPHY.WEIGHT_SEMIBOLD,
    color: COLORS.TEXT_WHITE,
    backgroundColor: COLORS.SECONDARY_RED,
    border: "none",
    borderRadius: BORDER_RADIUS.MD,
    cursor: "pointer",
    fontFamily: SELECTED_FONT,
    boxShadow: SHADOWS.MEDIUM,
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
    width: "90%",
    maxWidth: "450px",
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
    marginBottom: SPACING.LG,
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
    boxShadow: SHADOWS.MEDIUM,
  },
};

export default EditProfilePage;
