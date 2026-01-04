import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../globalContext/constant";
import { useNavigate, Navigate } from "react-router-dom";
import backgroundImage from "../images/adminBackground.webp";
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
        //const type = 'all';
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
  const itemsPerPage = 5; // Adjust as needed

  // Calculate indexes for slicing the orders array
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
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
    if (path === "client") {
      navigate("/admin/clients");
    }
    if (path === "all") {
      localStorage.removeItem("list_type");
      localStorage.setItem("list_type", "all");
      navigate("/orders");
    }
    if (path === "pending") {
      localStorage.removeItem("list_type");
      localStorage.setItem("list_type", "pending");
      navigate("/orders");
    }
    if (path === "in-progress") {
      localStorage.removeItem("list_type");
      localStorage.setItem("list_type", "in_progress");
      navigate("/orders");
    }
    if (path === "completed") {
      localStorage.removeItem("list_type");
      localStorage.setItem("list_type", "completed");
      navigate("/orders");
    }
    if (path === "unconfirmed") {
      localStorage.removeItem("list_type");
      localStorage.setItem("list_type", "unconfirmed");
      navigate("/orders");
    }
    if (path === "confirmed") {
      localStorage.removeItem("list_type");
      localStorage.setItem("list_type", "confirmed");
      navigate("/orders");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div
      className="page"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="container">
        <button onClick={handleLogout} className="logout-button">
          Log Out
        </button>

        <h2 className="header">Admin Dashboard</h2>
        <div className="metrics-grid">
          <div onClick={() => handleNavigate("client")} className="metric-card">
            <h3>Total Clients</h3>
            <p>{metrics.total_clients}</p>
          </div>
          <div onClick={() => handleNavigate("all")} className="metric-card">
            <h3>Total Orders</h3>
            <p>{metrics.total_orders}</p>
          </div>
          <div
            onClick={() => handleNavigate("unconfirmed")}
            className="metric-card"
          >
            <h3>Unconfirmed Orders</h3>
            <p>{metrics.unconfirmed_orders}</p>
          </div>
          <div
            onClick={() => handleNavigate("in-progress")}
            className="metric-card"
          >
            <h3>In Progress Orders</h3>
            <p>{metrics.in_progress_orders}</p>
          </div>
          <div
            onClick={() => handleNavigate("completed")}
            className="metric-card"
          >
            <h3>Completed Orders</h3>
            <p>{metrics.completed_orders}</p>
          </div>
          <div
            onClick={() => handleNavigate("pending")}
            className="metric-card"
          >
            <h3>Pending Orders</h3>
            <p>{metrics.pending_orders}</p>
          </div>
        </div>

        <h2 className="order-header">Order Management</h2>
        <div>
          <table className="table">
            <thead>
              <tr>
                <th className="table-header">Order ID</th>
                <th className="table-header">Client</th>
                <th className="table-header">Event Type</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="table-cell">{order.id}</td>
                  <td className="table-cell">{order.client}</td>
                  <td className="table-cell">{order.event_type}</td>
                  <td className="table-cell">
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    <button
                      onClick={() => updateOrderStatus(order.id, "in_progress")}
                      className="button"
                    >
                      Mark In Progress
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, "fitting")}
                      className="button"
                    >
                      Mark Ready for Fitting
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, "Completed")}
                      className="button completed-button"
                    >
                      Mark Completed
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page + 1}
              onClick={() => handlePageChange(page + 1)}
              className={page + 1 === currentPage ? "active" : ""}
            >
              {page + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardAndOrders;
