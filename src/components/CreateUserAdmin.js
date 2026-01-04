import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../globalContext/constant";
import { useNavigate } from "react-router-dom";
import image from "../images/singup.webp"; // Adjust image path if needed

const SignUpPage = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    role: "", // Default to client, admin can only be set from the backend
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    gender: "",
    birthdate: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Post user data to the backend for registration
      await axios.post(`${backendUrl}/api/users/signup/`, userData);
      // todo: need to publish error response if any
      // Redirect to login page after successful sign-up
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error during user creation", error);
    }
  };

  const handleforwa = (e) => {};

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button
          type="button"
          onClick={handleBackHome}
          style={styles.backButton}
        >
          Back Home
        </button>
        <h2 style={styles.heading}>Create A New Profile</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>First name:</label>
          <input
            type="text"
            name="firstname"
            value={userData.firstname}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <br />
          <label style={styles.label}>Last name:</label>
          <input
            type="text"
            name="lastname"
            value={userData.lastname}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <br />
          <label style={styles.label}>Gender:</label>
          <select
            name="gender"
            value={userData.gender}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <br />
          <label style={styles.label}>User Type:</label>
          <select
            name="role"
            value={userData.role}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">Select Role</option>
            <option value="client">client</option>
            <option value="admin">admin</option>
          </select>
          <br />
          <label style={styles.label}>Date of Birth:</label>
          <input
            type="date"
            name="birthdate"
            value={userData.birthdate}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <br />
          <label style={styles.label}>Phone Number:</label>
          <input
            type="number"
            name="phonenumber"
            value={userData.phonenumber}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <br />
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <br />
          <label style={styles.label}>Username:</label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <br />
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <br />
          <button type="submit" style={styles.button}>
            Create User
          </button>
          <br />
          <button
            type="button"
            onClick={handleBackToLogin}
            style={styles.backButton}
          >
            Back to DashBoard
          </button>
          <br />
        </form>
      </div>
    </div>
  );
};

// Inline styles
const styles = {
  page: {
    minHeight: "100vh",
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "50px 0",
  },
  container: {
    maxWidth: "500px",
    width: "100%",
    margin: "0 auto",
    padding: "30px",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "5px",
    fontSize: "1rem",
    color: "#555",
    textAlign: "left",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    marginBottom: "20px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "100%",
  },
  button: {
    padding: "10px 15px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  backButton: {
    padding: "10px 15px",
    fontSize: "1rem",
    color: "#333",
    backgroundColor: "#f1f1f1",
    border: "none",
    borderRadius: "5px",
    marginTop: "10px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default SignUpPage;
