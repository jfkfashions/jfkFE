// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { backendUrl } from "../globalContext/constant";
// import { useNavigate, Navigate } from "react-router-dom";
// import backgroundImage from "../images/adminBackground.webp";
// import "../styles/AdminDashboardAndOrders.css";

// const AdminDashboardAndOrders = () => {
//   const [metrics, setMetrics] = useState({
//     total_clients: 0,
//     total_orders: 0,
//     pending_orders: 0,
//     in_progress_orders: 0,
//     completed_orders: 0,
//     total_notifications: 0,
//   });
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const userRole = localStorage.getItem("role");
//     const username = localStorage.getItem("username");
//     if (!username && userRole !== "admin") {
//       return <Navigate to="/login" />;
//     }
//   }, []);

//   useEffect(() => {
//     const fetchMetrics = async () => {
//       try {
//         const response = await axios.get(
//           `${backendUrl}/api/users/admin/dashboard`
//         );
//         setMetrics(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching dashboard metrics:", error);
//         setError("Failed to load dashboard metrics.");
//         setLoading(false);
//       }
//     };
//     fetchMetrics();
//   }, []);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         //const type = 'all';
//         const response = await axios.get(
//           `${backendUrl}/api/users/admin/orders`,
//           {
//             params: { type: "pending" },
//           }
//         );
//         setOrders(response.data);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//         setError("Failed to load orders.");
//       }
//     };
//     fetchOrders();
//   }, []);

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5; // Adjust as needed

//   // Calculate indexes for slicing the orders array
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

//   // Calculate total pages
//   const totalPages = Math.ceil(orders.length / itemsPerPage);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const updateOrderStatus = async (id, status) => {
//     try {
//       await axios.put(`${backendUrl}/api/users/orders/updatestatus/${id}/`, {
//         status,
//       });
//       setOrders(
//         orders.map((order) => (order.id === id ? { ...order, status } : order))
//       );
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       setError("Failed to update order status.");
//     }
//   };

//   const handleNavigate = (path) => {
//     if (path === "client") {
//       navigate("/admin/clients");
//     }
//     if (path === "all") {
//       localStorage.removeItem("list_type");
//       localStorage.setItem("list_type", "all");
//       navigate("/orders");
//     }
//     if (path === "pending") {
//       localStorage.removeItem("list_type");
//       localStorage.setItem("list_type", "pending");
//       navigate("/orders");
//     }
//     if (path === "in-progress") {
//       localStorage.removeItem("list_type");
//       localStorage.setItem("list_type", "in_progress");
//       navigate("/orders");
//     }
//     if (path === "completed") {
//       localStorage.removeItem("list_type");
//       localStorage.setItem("list_type", "completed");
//       navigate("/orders");
//     }
//     if (path === "unconfirmed") {
//       localStorage.removeItem("list_type");
//       localStorage.setItem("list_type", "unconfirmed");
//       navigate("/orders");
//     }
//     if (path === "confirmed") {
//       localStorage.removeItem("list_type");
//       localStorage.setItem("list_type", "confirmed");
//       navigate("/orders");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("username");
//     navigate("/login");
//   };

//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }

//   if (error) {
//     return <div className="error">{error}</div>;
//   }

//   return (
//     <div
//       className="page"
//       style={{ backgroundImage: `url(${backgroundImage})` }}
//     >
//       <div className="container">
//         <button onClick={handleLogout} className="logout-button">
//           Log Out
//         </button>

//         <h2 className="header">Admin Dashboard</h2>
//         <div className="metrics-grid">
//           <div onClick={() => handleNavigate("client")} className="metric-card">
//             <h3>Total Clients</h3>
//             <p>{metrics.total_clients}</p>
//           </div>
//           <div onClick={() => handleNavigate("all")} className="metric-card">
//             <h3>Total Orders</h3>
//             <p>{metrics.total_orders}</p>
//           </div>
//           <div
//             onClick={() => handleNavigate("unconfirmed")}
//             className="metric-card"
//           >
//             <h3>Unconfirmed Orders</h3>
//             <p>{metrics.unconfirmed_orders}</p>
//           </div>
//           <div
//             onClick={() => handleNavigate("in-progress")}
//             className="metric-card"
//           >
//             <h3>In Progress Orders</h3>
//             <p>{metrics.in_progress_orders}</p>
//           </div>
//           <div
//             onClick={() => handleNavigate("completed")}
//             className="metric-card"
//           >
//             <h3>Completed Orders</h3>
//             <p>{metrics.completed_orders}</p>
//           </div>
//           <div
//             onClick={() => handleNavigate("pending")}
//             className="metric-card"
//           >
//             <h3>Pending Orders</h3>
//             <p>{metrics.pending_orders}</p>
//           </div>
//         </div>

//         <h2 className="order-header">Order Management</h2>
//         <div>
//           <table className="table">
//             <thead>
//               <tr>
//                 <th className="table-header">Order ID</th>
//                 <th className="table-header">Client</th>
//                 <th className="table-header">Event Type</th>
//                 <th className="table-header">Status</th>
//                 <th className="table-header">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentOrders.map((order) => (
//                 <tr key={order.id}>
//                   <td className="table-cell">{order.id}</td>
//                   <td className="table-cell">{order.client}</td>
//                   <td className="table-cell">{order.event_type}</td>
//                   <td className="table-cell">
//                     <span className={`status ${order.status.toLowerCase()}`}>
//                       {order.status}
//                     </span>
//                   </td>
//                   <td className="table-cell">
//                     <button
//                       onClick={() => updateOrderStatus(order.id, "in_progress")}
//                       className="button"
//                     >
//                       Mark In Progress
//                     </button>
//                     <button
//                       onClick={() => updateOrderStatus(order.id, "fitting")}
//                       className="button"
//                     >
//                       Mark Ready for Fitting
//                     </button>
//                     <button
//                       onClick={() => updateOrderStatus(order.id, "Completed")}
//                       className="button completed-button"
//                     >
//                       Mark Completed
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <div className="pagination">
//           {[...Array(totalPages).keys()].map((page) => (
//             <button
//               key={page + 1}
//               onClick={() => handlePageChange(page + 1)}
//               className={page + 1 === currentPage ? "active" : ""}
//             >
//               {page + 1}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboardAndOrders;

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
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    orderId: null,
    currentStatus: null,
    newStatus: null,
    orderDetails: null,
  });
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
          `${backendUrl}/api/users/admin/dashboard`,
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
            params: { type: "confirmed" },
          },
        );
        console.log("Fetched orders:", response.data);
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders.");
      }
    };
    fetchOrders();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    filterOrdersByStatus();
  }, [statusFilter, searchQuery, orders]);

  const filterOrdersByStatus = () => {
    let filtered = orders;

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Apply search filter (Order ID, Client, Event Type)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          (order.order_id && order.order_id.toLowerCase().includes(query)) ||
          (order.client && order.client.toLowerCase().includes(query)) ||
          (order.event_type && order.event_type.toLowerCase().includes(query)),
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "in_progress":
        return "In Progress";
      case "fitting":
        return "Ready for Fitting";
      case "Pending":
        return "Pending";
      case "Completed":
        return "Completed";
      default:
        return status;
    }
  };

  const showStatusConfirmation = (orderId, newStatus, order) => {
    setConfirmModal({
      isOpen: true,
      orderId,
      currentStatus: order.status,
      newStatus,
      orderDetails: order,
    });
  };

  const confirmStatusChange = async () => {
    const { orderId, newStatus } = confirmModal;
    try {
      const updateData = { status: newStatus };

      if (newStatus === "Completed") {
        await axios.put(
          `${backendUrl}/api/users/orders/updatestatus/${orderId}/`,
          {
            ...updateData,
            completed: true,
          },
        );
      } else {
        await axios.put(
          `${backendUrl}/api/users/orders/updatestatus/${orderId}/`,
          updateData,
        );
      }

      // Refresh orders after update
      const response = await axios.get(`${backendUrl}/api/users/admin/orders`, {
        params: { type: "confirmed" },
      });
      setOrders(response.data);
      setFilteredOrders(
        response.data.filter((order) =>
          statusFilter === "all" ? true : order.status === statusFilter,
        ),
      );
      setConfirmModal({
        isOpen: false,
        orderId: null,
        currentStatus: null,
        newStatus: null,
        orderDetails: null,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status.");
    }
  };

  const cancelStatusChange = () => {
    setConfirmModal({
      isOpen: false,
      orderId: null,
      currentStatus: null,
      newStatus: null,
      orderDetails: null,
    });
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const updateData = { status };

      // If marking as completed, also set completed_date
      if (status === "Completed") {
        await axios.put(`${backendUrl}/api/users/orders/updatestatus/${id}/`, {
          ...updateData,
          completed: true,
        });
      } else {
        await axios.put(
          `${backendUrl}/api/users/orders/updatestatus/${id}/`,
          updateData,
        );
      }

      // Refresh orders after update
      const response = await axios.get(`${backendUrl}/api/users/admin/orders`, {
        params: { type: "confirmed" },
      });
      setOrders(response.data);
      setFilteredOrders(
        response.data.filter((order) =>
          statusFilter === "all" ? true : order.status === statusFilter,
        ),
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
      fitting: "fitting",
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
                label: "Pending Orders",
                value: metrics.pending_orders,
                path: "pending",
                icon: "📋",
              },
              {
                label: "In Progress Orders",
                value: metrics.in_progress_orders,
                path: "in-progress",
                icon: "🚀",
              },
              {
                label: "Ready for Fittings",
                value: metrics.fitting_orders || 0,
                path: "fitting",
                icon: "👔",
              },
              {
                label: "Completed Orders",
                value: metrics.completed_orders,
                path: "completed",
                icon: "✅",
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

          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by Order ID, Client Name, or Event Type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="clear-search-button"
              >
                ✕
              </button>
            )}
          </div>

          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr className="table-header-row">
                  <th className="table-header">Order ID</th>
                  <th className="table-header">Client</th>
                  <th className="table-header">Event Type</th>
                  <th className="table-header status-header">
                    <div className="status-header-content">
                      <span>Status</span>
                      <select
                        className="status-filter-dropdown"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="all">All</option>
                        <option value="Pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="fitting">Ready for Fitting</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </th>
                  <th className="table-header">Confirmed Date</th>
                  <th className="table-header">Completed Date</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.id} className="table-row">
                    <td className="table-cell">
                      <span className="order-id">
                        {order.order_id || order.id}
                      </span>
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
                        {order.status === "in_progress"
                          ? "In Progress"
                          : order.status === "fitting"
                            ? "Ready for Fitting"
                            : order.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="confirmed-date">
                        {order.confirmed_date
                          ? (() => {
                              const date = new Date(order.confirmed_date);
                              date.setHours(date.getHours() + 1);
                              return date.toUTCString().replace("GMT", "GMT+1");
                            })()
                          : "—"}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="completed-date">
                        {order.completed_date
                          ? (() => {
                              const date = new Date(order.completed_date);
                              date.setHours(date.getHours() + 1);
                              return date.toUTCString().replace("GMT", "GMT+1");
                            })()
                          : "—"}
                      </span>
                    </td>
                    <td className="table-cell actions-cell">
                      <div className="action-buttons">
                        {/* Pending/Confirmed: Show Mark In Progress */}
                        {order.status === "Pending" && (
                          <button
                            onClick={() =>
                              showStatusConfirmation(
                                order.id,
                                "in_progress",
                                order,
                              )
                            }
                            className="action-button button-active"
                          >
                            Mark In Progress
                          </button>
                        )}

                        {/* In Progress: Show Ready for Fitting + Mark Completed */}
                        {order.status === "in_progress" && (
                          <>
                            <button
                              onClick={() =>
                                showStatusConfirmation(
                                  order.id,
                                  "fitting",
                                  order,
                                )
                              }
                              className="action-button button-fitting"
                            >
                              Ready for Fitting
                            </button>
                            <button
                              onClick={() =>
                                showStatusConfirmation(
                                  order.id,
                                  "Completed",
                                  order,
                                )
                              }
                              className="action-button button-positive"
                            >
                              Mark Completed
                            </button>
                          </>
                        )}

                        {/* Ready for Fitting: Show Mark Completed */}
                        {order.status === "fitting" && (
                          <button
                            onClick={() =>
                              showStatusConfirmation(
                                order.id,
                                "Completed",
                                order,
                              )
                            }
                            className="action-button button-positive"
                          >
                            Mark Completed
                          </button>
                        )}

                        {/* Completed: No action buttons */}
                        {order.status === "Completed" && (
                          <span className="no-action">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
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

        {/* Status Change Confirmation Modal */}
        {confirmModal.isOpen && (
          <div className="order-modal-overlay">
            <div className="order-modal-content">
              <div className="modal-header">
                <div className="modal-icon">⚠️</div>
                <h3 className="modal-title">Confirm Status Change</h3>
              </div>

              <div className="modal-body">
                <p className="confirmation-text">
                  Are you sure you want to change the order status?
                </p>
                <div className="order-summary">
                  <div className="summary-item">
                    <span className="summary-label">Order ID:</span>
                    <span className="summary-value">
                      {confirmModal.orderDetails?.order_id}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Client:</span>
                    <span className="summary-value">
                      {confirmModal.orderDetails?.client}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Current Status:</span>
                    <span
                      className="summary-value"
                      style={{ color: COLORS.SECONDARY_RED }}
                    >
                      {getStatusLabel(confirmModal.currentStatus)}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">New Status:</span>
                    <span
                      className="summary-value"
                      style={{ color: COLORS.PRIMARY_BROWN_1 }}
                    >
                      {getStatusLabel(confirmModal.newStatus)}
                    </span>
                  </div>
                </div>

                <p className="confirmation-text" style={{ marginTop: "20px" }}>
                  This action will trigger a notification email to the client.
                  Please confirm that you want to proceed.
                </p>
              </div>

              <div className="modal-footer">
                <button
                  onClick={cancelStatusChange}
                  className="button button-secondary"
                  style={{
                    background: COLORS.SECONDARY_RED,
                  }}
                >
                  No, Cancel
                </button>
                <button
                  onClick={confirmStatusChange}
                  className="button button-positive"
                  style={{
                    background: COLORS.PRIMARY_BROWN_1,
                  }}
                >
                  Yes, Confirm Change
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardAndOrders;
