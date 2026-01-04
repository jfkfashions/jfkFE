// AdminCreateOrder.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../globalContext/constant";
import { useActionData } from "react-router-dom";
import { Navigate } from "react-router-dom";

const AdminCreateOrder = () => {
  const [clients, setClients] = useState([]);
  const [orderData, setOrderData] = useState({
    client_id: "",
    status: "Pending", // Default status for new orders
    measurements: "",
    customization_options: "",
    comments: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/admin/users/`);
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    const username = localStorage.getItem("username");

    if (!username && userRole !== "admin") {
      return <Navigate to="/login" />;
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/api/admin/orders/create/`, orderData);
      setSuccessMessage("Order created successfully!");
      setOrderData({
        client_id: "",
        status: "Pending",
        measurements: "",
        customization_options: "",
        comments: "",
      });
    } catch (error) {
      setErrorMessage("Error creating order.");
      console.error("Error creating order:", error);
    }
  };

  const handleChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={styles.container}>
      <h2>Create Order for Client</h2>
      {successMessage && <p style={styles.success}>{successMessage}</p>}
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <label htmlFor="client_id">Select Client:</label>
        <select
          name="client_id"
          value={orderData.client_id}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">-- Select Client --</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.firstname} {client.lastname} ({client.username})
            </option>
          ))}
        </select>
        <label htmlFor="measurements">Measurements:</label>
        <textarea
          name="measurements"
          value={orderData.measurements}
          onChange={handleChange}
          required
          style={styles.textarea}
        />
        <label htmlFor="customization_options">Customization Options:</label>
        <input
          type="text"
          name="customization_options"
          value={orderData.customization_options}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <label htmlFor="comments">Comments:</label>
        <textarea
          name="comments"
          value={orderData.comments}
          onChange={handleChange}
          style={styles.textarea}
        />
        <button type="submit" style={styles.button}>
          Create Order
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "10px",
    fontSize: "1rem",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    height: "100px",
  },
  button: {
    padding: "10px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  success: {
    color: "green",
    marginBottom: "10px",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
};

export default AdminCreateOrder;
