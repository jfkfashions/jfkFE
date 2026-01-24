import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../globalContext/constant";
import { useParams, useNavigate } from "react-router-dom";
import { COLORS, SELECTED_FONT } from "../utils/constants";
import "../styles/global.css";
import "../styles/OrderEdit.css";
import orderformBackground from "../images/orderform.webp";

const OrderEdit = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendUrl}/api/users/orders/view/${orderId}/`,
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
          "Error fetching order details. Please try again later.",
        );
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
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
    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await axios.put(`${backendUrl}/api/users/orders/update/${orderId}/`, {
        measurements: orderData.measurements,
        comments: orderData.comments,
        expected_date: orderData.expectedDate,
        event_type: orderData.eventType,
        material: orderData.material,
        preferred_Color: orderData.preferredColor,
      });
      setSuccessMessage("Order updated successfully!");
      setTimeout(() => navigate("/orders"), 1500);
    } catch (error) {
      setErrorMessage("Error updating the order. Please try again.");
      console.error("Error updating order:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        className="order-edit-page"
        style={{ backgroundImage: `url(${orderformBackground})` }}
      >
        <div className="order-edit-container">
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ fontSize: "18px", color: COLORS.TEXT_GRAY }}>
              Loading order details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="order-edit-page"
      style={{ backgroundImage: `url(${orderformBackground})` }}
    >
      <div className="order-edit-container">
        {/* Header */}
        <div className="order-edit-header">
          <button
            onClick={() => navigate(-1)}
            className="back-button"
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              color: COLORS.TEXT_WHITE,
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ← Back
          </button>
          <div className="header-content">
            <h1
              className="page-title"
              style={{ color: COLORS.TEXT_WHITE, marginBottom: "8px" }}
            >
              Edit Order #{orderId}
            </h1>
            <p
              className="page-subtitle"
              style={{ color: "rgba(255, 255, 255, 0.9)" }}
            >
              Client: <strong>{orderData.client}</strong> | Created:{" "}
              <strong>{orderdate}</strong>
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="order-edit-content">
          {errorMessage && (
            <div
              className="alert alert-error"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: `1px solid ${COLORS.ERROR}`,
                color: COLORS.ERROR,
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div
              className="alert alert-success"
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                border: `1px solid ${COLORS.SUCCESS}`,
                color: COLORS.SUCCESS,
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              {successMessage}
            </div>
          )}

          <form onSubmit={handleUpdate} className="order-edit-form">
            {/* Measurements */}
            <div className="form-group">
              <label htmlFor="measurements" className="form-label">
                Measurements *
              </label>
              <textarea
                id="measurements"
                name="measurements"
                value={orderData.measurements}
                onChange={handleInputChange}
                required
                className="form-textarea"
                placeholder="Enter detailed measurements..."
              />
            </div>

            {/* Comments */}
            <div className="form-group">
              <label htmlFor="comments" className="form-label">
                Additional Comments
              </label>
              <textarea
                id="comments"
                name="comments"
                value={orderData.comments}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Add any special notes or instructions..."
              />
            </div>

            {/* Grid Layout for other fields */}
            <div className="form-grid">
              {/* Expected Date */}
              <div className="form-group">
                <label htmlFor="expectedDate" className="form-label">
                  Expected Delivery Date *
                </label>
                <input
                  type="date"
                  id="expectedDate"
                  name="expectedDate"
                  value={orderData.expectedDate}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              {/* Event Type */}
              <div className="form-group">
                <label htmlFor="eventType" className="form-label">
                  Event Type *
                </label>
                <input
                  type="text"
                  id="eventType"
                  name="eventType"
                  value={orderData.eventType}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="e.g., Wedding, Party, etc."
                />
              </div>

              {/* Preferred Color */}
              <div className="form-group">
                <label htmlFor="preferredColor" className="form-label">
                  Preferred Color
                </label>
                <input
                  type="text"
                  id="preferredColor"
                  name="preferredColor"
                  value={orderData.preferredColor}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Black, Blue, etc."
                />
              </div>

              {/* Material Checkbox */}
              <div className="form-group checkbox-group">
                <label htmlFor="material" className="checkbox-label">
                  <input
                    type="checkbox"
                    id="material"
                    name="material"
                    checked={orderData.material}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  <span>Yes/No</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className="form-actions"
              style={{ justifyContent: "center", gap: "16px" }}
            >
              <button
                type="submit"
                disabled={submitting}
                className="button button-primary"
                style={{
                  background: submitting
                    ? COLORS.BUTTON_DISABLED
                    : COLORS.BUTTON_ACTIVE,
                  color: COLORS.TEXT_WHITE,
                  padding: "12px 32px",
                  fontSize: "16px",
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.6 : 1,
                }}
              >
                {submitting ? "Updating..." : "✓ Update Order"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={submitting}
                className="button button-secondary"
                style={{
                  background: "rgba(139, 69, 19, 0.1)",
                  color: COLORS.PRIMARY_BROWN_1,
                  border: `1px solid ${COLORS.PRIMARY_BROWN_1}`,
                  padding: "12px 32px",
                  fontSize: "16px",
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.6 : 1,
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderEdit;
