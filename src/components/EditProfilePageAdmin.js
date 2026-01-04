import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../globalContext/constant";
import { useNavigate, useParams } from "react-router-dom";
import background from "../images/editprofile.webp"; // Adjust path accordingly

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
          `${backendUrl}/api/users/profile/${ProfileId}`
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
            onChange={handleChange}
            style={styles.input}
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
    padding: "40px", // Increased padding for a more spacious feel
  },
  container: {
    maxWidth: "600px", // Increased width for a more spacious layout
    width: "100%",
    margin: "50px auto",
    padding: "50px", // Added padding inside the container
    backgroundColor: "rgba(255, 255, 255, 0.85)", // Slightly more transparent for better background visibility
    borderRadius: "15px", // Increased border-radius for a softer look
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", // Stronger shadow for depth
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "2.5rem", // Larger font size for more emphasis
    marginBottom: "30px",
    textAlign: "center",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "10px", // Increased space between labels and inputs
    fontSize: "1.2rem", // Slightly larger font for labels
    color: "#555",
    textAlign: "left",
  },
  input: {
    padding: "15px", // Increased padding for inputs to make them feel more open
    fontSize: "1.2rem", // Larger font size for better readability
    marginBottom: "30px", // Increased space between inputs
    borderRadius: "8px", // Softer edges for a more modern look
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "15px",
    fontSize: "1.2rem",
    marginBottom: "30px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    resize: "vertical",
    height: "150px", // Increased height to make it more comfortable for longer text
  },
  button: {
    padding: "15px 20px",
    fontSize: "1.2rem",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "8px", // Softer edges for buttons
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginBottom: "20px", // Added margin for more space between buttons
  },
  homeButton: {
    padding: "15px 20px",
    fontSize: "1.2rem",
    color: "#fff",
    backgroundColor: "#28a745",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "1.2rem",
    marginBottom: "20px",
    textAlign: "center",
  },

  // Modal styles
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
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "80%",
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

export default EditProfilePage;
