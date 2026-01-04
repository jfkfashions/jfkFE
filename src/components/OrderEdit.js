import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../globalContext/constant";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/global.css";
import "../styles/OrderEdit.css"; // Extracted styles to a separate file
import image from "../images/orderform.webp"; // Background image

const OrderEdit = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState({
    measurements: "",
    comments: "",
    expectedDate: "",
    eventType: "",
    material: false,
    preferredColor: "",
    client: "",
    order_date: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/users/orders/view/${orderId}/`
        );
        const {
          measurements,
          comments,
          expected_date,
          event_type,
          material,
          preferred_Color,
          client,
          order_date,
        } = response.data;

        setOrderData({
          measurements,
          comments,
          expectedDate: expected_date,
          eventType: event_type,
          material,
          preferredColor: preferred_Color,
          client,
          order_date,
        });
      } catch (error) {
        setErrorMessage(
          "Error fetching order details. Please try again later."
        );
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOrderData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const orderdate = orderData.order_date.split(".")[0].replace("T", " ");
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${backendUrl}/api/users/orders/update/${orderId}/`, {
        measurements: orderData.measurements,
        comments: orderData.comments,
        expected_date: orderData.expectedDate,
        event_type: orderData.eventType,
        material: orderData.material,
        preferred_Color: orderData.preferredColor,
      });
      navigate("/orders");
    } catch (error) {
      setErrorMessage("Error updating the order. Please try again.");
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="container" style={{ backgroundImage: `url(${image})` }}>
      <h2>
        Edit Order #{orderId} for {orderData.client}, Created on {orderdate}
      </h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleUpdate} className="order-edit-form">
        <label htmlFor="measurements">Measurements:</label>
        <textarea
          id="measurements"
          name="measurements"
          value={orderData.measurements}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="comments">Comments:</label>
        <textarea
          id="comments"
          name="comments"
          value={orderData.comments}
          onChange={handleInputChange}
        />
        <label htmlFor="expectedDate">Expected Delivery Date:</label>
        <input
          type="date"
          id="expectedDate"
          name="expectedDate"
          value={orderData.expectedDate}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="eventType">Event Type:</label>
        <input
          type="text"
          id="eventType"
          name="eventType"
          value={orderData.eventType}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="material">Will We Provide Material?</label>
        <input
          type="checkbox"
          id="material"
          name="material"
          checked={orderData.material}
          onChange={handleInputChange}
        />
        <label htmlFor="preferredColor">Preferred Color:</label>
        <input
          type="text"
          id="preferredColor"
          name="preferredColor"
          value={orderData.preferredColor}
          onChange={handleInputChange}
        />
        <div className="button-group">
          <button type="submit">Update Order</button>
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderEdit;
