import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../globalContext/constant";
import { useNavigate, useParams } from "react-router-dom";
import background from "../images/editprofile.webp"; // Adjust path accordingly

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
          `${backendUrl}/api/users/profile/${ProfileId}`
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
        }
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
    padding: "40px",
  },
  container: {
    maxWidth: "800px",
    width: "100%",
    margin: "50px auto",
    padding: "50px",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: "15px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "2.5rem",
    marginBottom: "30px",
    textAlign: "center",
    color: "#333",
  },
  profileInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  field: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #ccc",
  },
  label: {
    fontWeight: "bold",
    fontSize: "1.2rem",
    color: "#555",
  },
  value: {
    fontSize: "1.2rem",
    color: "#333",
  },
  homeButton: {
    padding: "15px 20px",
    fontSize: "1.2rem",
    color: "#fff",
    backgroundColor: "#28a745",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px",
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "red",
    fontSize: "1.2rem",
    marginBottom: "20px",
    textAlign: "center",
  },
  actionButtonContainer: {
    display: "inline-block", // Ensures inline display of buttons
  },
  actionbutton: {
    padding: "15px 20px",
    margin: "0 5px", // Adjust the spacing between buttons
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    minWidth: "75px", // Ensure all buttons have the same width
    textAlign: "center",
    alignItems: "center",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, // Ensure the modal is above all content
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "80%", // Ensure it's not too wide on smaller screens
    maxWidth: "400px",
  },
  modalHeading: {
    fontSize: "1.5rem",
    color: "#333",
    marginBottom: "10px",
  },
  modalText: {
    fontSize: "1rem",
    color: "#333",
    marginBottom: "20px",
  },
  closeButton: {
    padding: "10px 20px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ViewProfilePage;
