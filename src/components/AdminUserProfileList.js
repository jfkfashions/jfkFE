import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../globalContext/constant";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../images/adminBackgroundUsers.webp"; // Adjust the path as needed

const AdminUserProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/users/userprofile`);
        setProfiles(response.data);
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

  const handleDelete = async (username) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        await axios.delete(`${backendUrl}/api/users/profile/${username}/`);
        const response = await axios.get(`${backendUrl}/api/users/userprofile`);
        setProfiles(response.data);
        // setProfiles(profiles.filter((profile) => profile.username !== username));
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.innerContainer}>
        <h2 style={styles.title}>Client Profiles</h2>
        <div style={styles.buttonGroup}>
          <button
            onClick={() => navigate("/signup")}
            style={styles.createButton}
          >
            Create New Profile
          </button>
          <button
            onClick={() => navigate("/admin/dashboard")}
            style={styles.backButton}
          >
            Back to Home
          </button>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Username</th>
              <th style={styles.tableHeader}>Name</th>
              <th style={styles.tableHeader}>Email</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id} style={styles.tableRow}>
                <td style={styles.tableCell}>{profile.username}</td>
                <td style={styles.tableCell}>
                  {profile.firstname} {profile.lastname}
                </td>
                <td style={styles.tableCell}>{profile.email}</td>
                <td style={styles.tableCell}>
                  <div style={styles.actionButtonContainer}>
                    <button
                      style={styles.actionButton}
                      onClick={() =>
                        navigate(`/admin/users/view/${profile.username}`)
                      }
                    >
                      View
                    </button>
                    <button
                      style={styles.actionButton}
                      onClick={() =>
                        navigate(`/admin/users/edit/${profile.username}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      style={{ ...styles.actionButton, ...styles.deleteButton }}
                      onClick={() => handleDelete(profile.username)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "20px",
  },
  innerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    maxWidth: "1000px",
    minHeight: "600px",
    width: "100%",
    textAlign: "center",
    marginTop: "40px",
    marginBottom: "40px",
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  createButton: {
    padding: "12px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease",
  },
  backButton: {
    padding: "12px 20px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "8px",
  },
  tableHeader: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "15px",
    fontWeight: "bold",
    textAlign: "left",
    borderBottom: "2px solid #0056b3",
  },
  tableCell: {
    padding: "12px 15px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
  },
  actionButtonContainer: {
    display: "inline-block", // Ensures inline display of buttons
  },
  actionButton: {
    padding: "8px 12px",
    margin: "0 5px", // Adjust the spacing between buttons
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    minWidth: "75px", // Ensure all buttons have the same width
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
};

export default AdminUserProfileList;
