import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../globalContext/constant";
import { useNavigate, Navigate } from "react-router-dom";
import backgroundImage from "../images/adminBackground.webp";
import {
  COLORS,
  SELECTED_FONT,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TRANSITIONS,
} from "../utils/constants";
import "../styles/AdminDashboardAndOrders.css";

const AdminDashboardAndOrders = () => {
  const [metrics, setMetrics] = useState({
    total_clients: 0,
    total_orders: 0,
    pending_orders: 0,
    in_progress_orders: 0,
    completed_orders: 0,
    total_notifications: 0,
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    if (!username && userRole !== "admin") {
      return <Navigate to="/login" />;
    }
  }, []);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/users/admin/dashboard`
        );
        setMetrics(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        setError("Failed to load dashboard metrics.");
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/users/admin/orders`,
          {
            params: { type: "pending" },
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders.");
      }
    };
    fetchOrders();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`${backendUrl}/api/users/orders/updatestatus/${id}/`, {
        status,
      });
      setOrders(
        orders.map((order) => (order.id === id ? { ...order, status } : order))
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status.");
    }
  };

  const handleNavigate = (path) => {
    const pathMap = {
      client: "/admin/clients",
      all: "all",
      pending: "pending",
      "in-progress": "in_progress",
      completed: "completed",
      unconfirmed: "unconfirmed",
      confirmed: "confirmed",
    };

    if (path === "client") {
      navigate("/admin/clients");
    } else {
      localStorage.removeItem("list_type");
      localStorage.setItem("list_type", pathMap[path]);
      navigate("/orders");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  if (loading) {
    return (
      <div
        className="page flex-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          fontFamily: SELECTED_FONT.family,
        }}
      >
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="page flex-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          fontFamily: SELECTED_FONT.family,
        }}
      >
        <div className="error-container">
          <h3 style={{ color: COLORS.ERROR }}>Error</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="button button-positive"
            style={{ marginTop: SPACING.MD }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="page"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        fontFamily: SELECTED_FONT.family,
      }}
    >
      <div className="admin-container">
        {/* Header Section */}
        <div className="admin-header">
          <div className="header-content">
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">
              Manage clients, orders, and monitor system metrics
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="button button-negative logout-button"
          >
            Log Out
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-section">
          <h2 className="section-title">Dashboard Overview</h2>
          <div className="metrics-grid">
            {[
              {
                label: "Total Clients",
                value: metrics.total_clients,
                path: "client",
                icon: "👥",
              },
              {
                label: "Total Orders",
                value: metrics.total_orders,
                path: "all",
                icon: "📦",
              },
              {
                label: "Unconfirmed Orders",
                value: metrics.unconfirmed_orders || 0,
                path: "unconfirmed",
                icon: "⏳",
              },
              {
                label: "In Progress Orders",
                value: metrics.in_progress_orders,
                path: "in-progress",
                icon: "🚀",
              },
              {
                label: "Completed Orders",
                value: metrics.completed_orders,
                path: "completed",
                icon: "✅",
              },
              {
                label: "Pending Orders",
                value: metrics.pending_orders,
                path: "pending",
                icon: "📋",
              },
            ].map((metric, index) => (
              <div
                key={index}
                onClick={() => handleNavigate(metric.path)}
                className="metric-card"
                style={{
                  animationDelay: `${index * 100}ms`,
                  cursor: "pointer",
                }}
              >
                <div className="metric-icon">{metric.icon}</div>
                <div className="metric-content">
                  <h3 className="metric-label">{metric.label}</h3>
                  <p className="metric-value">{metric.value}</p>
                </div>
                <div className="metric-arrow">→</div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Management Section */}
        <div className="orders-section">
          <div className="section-header">
            <h2 className="section-title">Order Management</h2>
            <p className="section-subtitle">Manage and update order statuses</p>
          </div>

          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr className="table-header-row">
                  <th className="table-header">Order ID</th>
                  <th className="table-header">Client</th>
                  <th className="table-header">Event Type</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.id} className="table-row">
                    <td className="table-cell">
                      <span className="order-id">#{order.id}</span>
                    </td>
                    <td className="table-cell client-cell">
                      <span className="client-name">{order.client}</span>
                    </td>
                    <td className="table-cell">
                      <span className="event-type">{order.event_type}</span>
                    </td>
                    <td className="table-cell">
                      <span
                        className={`status-badge ${order.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="table-cell actions-cell">
                      <div className="action-buttons">
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "in_progress")
                          }
                          className="action-button button-active"
                        >
                          Mark In Progress
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, "fitting")}
                          className="action-button button-active"
                        >
                          Ready for Fitting
                        </button>
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "Completed")
                          }
                          className="action-button button-positive"
                        >
                          Mark Completed
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No Orders Found</h3>
              <p>There are currently no pending orders to display.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button button-secondary"
              >
                ← Previous
              </button>

              <div className="page-numbers">
                {[...Array(totalPages).keys()].map((page) => (
                  <button
                    key={page + 1}
                    onClick={() => handlePageChange(page + 1)}
                    className={`page-number ${
                      page + 1 === currentPage ? "active" : ""
                    }`}
                    style={{
                      background:
                        page + 1 === currentPage
                          ? COLORS.PRIMARY_GRADIENT
                          : "transparent",
                      color:
                        page + 1 === currentPage
                          ? COLORS.TEXT_WHITE
                          : COLORS.TEXT_BLACK,
                    }}
                  >
                    {page + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button button-secondary"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardAndOrders;
