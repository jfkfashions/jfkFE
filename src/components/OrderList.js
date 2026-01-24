import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../globalContext/constant";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import image from "../images/orderlist.webp";
import "../styles/global.css";
import "../styles/OrderList.css";
import { COLORS, SELECTED_FONT } from "../utils/constants";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [mailData, setMailData] = useState({
    message: "",
    subject: "",
    username: "",
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(0);
  // Admin-specific measurement view state
  const [adminMeasurements, setAdminMeasurements] = useState(null);
  const [adminMeasLoading, setAdminMeasLoading] = useState(false);
  const ordersPerPage = 8;
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, searchTerm, filterStatus, sortBy]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userRole = localStorage.getItem("role");
      const type = localStorage.getItem("list_type");

      const url =
        userRole === "admin"
          ? `${backendUrl}/api/users/admin/orders`
          : `${backendUrl}/api/users/orders/`;

      const params =
        userRole !== "admin"
          ? { username: localStorage.getItem("username") }
          : { type };

      const response = await axios.get(url, { params });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortOrders = () => {
    let filtered = [...orders];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toString().includes(searchTerm) ||
          order.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.preferred_Color
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      if (filterStatus === "confirmed") {
        filtered = filtered.filter((order) => order.is_confirmed);
      } else if (filterStatus === "pending") {
        filtered = filtered.filter((order) => !order.is_confirmed);
      }
    }

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.order_date) - new Date(a.order_date);
        case "oldest":
          return new Date(a.order_date) - new Date(b.order_date);
        case "id":
          return a.id - b.id;
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
    setCurrentPage(0); // Reset to first page when filters change
  };

  const composeMailData = (order, action) => {
    const actionText =
      action === "confirmed"
        ? "confirmed and is now being processed"
        : "deleted";
    const message = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
                    .email-container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
                    .email-header { background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); padding: 30px 20px; text-align: center; color: white; }
                    .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
                    .order-update { padding: 30px; background: rgba(139, 69, 19, 0.05); border-radius: 8px; margin: 20px 0; }
                    .detail-item { display: flex; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid rgba(139, 69, 19, 0.1); }
                    .detail-label { font-weight: 600; color: #8B4513; min-width: 180px; }
                    .detail-value { font-weight: 500; color: #222; }
                    .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: 600; margin-left: 10px; }
                    .status-confirmed { background: rgba(16, 185, 129, 0.1); color: #10B981; }
                    .footer { background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); padding: 25px; color: white; text-align: center; }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">
                        <div class="logo">JFK TAILOR SHOP</div>
                        <div>📦 Order Update Notification 📦</div>
                    </div>
                    <div style="padding: 30px;">
                        <h2>Hello <strong>${order.client}</strong>,</h2>
                        <p>We wanted to inform you about an important update regarding your order.</p>
                        
                        <div class="order-update">
                            <div class="detail-item">
                                <span class="detail-label">Order Number:</span>
                                <span class="detail-value">${order.id}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Status:</span>
                                <span class="detail-value">
                                    ${
                                      action === "confirmed"
                                        ? "Confirmed"
                                        : "Cancelled"
                                    }
                                    <span class="status-badge status-confirmed">
                                        ${
                                          action === "confirmed"
                                            ? "✓ Processing"
                                            : "✗ Cancelled"
                                        }
                                    </span>
                                </span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Event Type:</span>
                                <span class="detail-value">${
                                  order.event_type
                                }</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Expected Delivery:</span>
                                <span class="detail-value">${new Date(
                                  order.expected_date,
                                ).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}</span>
                            </div>
                            ${
                              action === "confirmed"
                                ? `
                            <div class="detail-item">
                                <span class="detail-label">Next Steps:</span>
                                <span class="detail-value">Our tailors have begun working on your order. We'll update you on progress.</span>
                            </div>
                            `
                                : ""
                            }
                        </div>
                        
                        <p style="margin-top: 25px; text-align: center; font-size: 16px;">
                            ${
                              action === "confirmed"
                                ? "Thank you for your patience. We're excited to create something special for you!"
                                : "We're sorry to see your order cancelled. If this was a mistake, please contact us immediately."
                            }
                        </p>
                        
                        ${
                          action === "confirmed"
                            ? `
                        <div style="background: rgba(16, 185, 129, 0.05); padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #10B981;">
                            <p><strong>📞 Need to make changes?</strong></p>
                            <p>Contact our support team at support@jfktailorshop.com or call +1 (555) 123-4567</p>
                        </div>
                        `
                            : ""
                        }
                    </div>
                    <div class="footer">
                        <p>JFK Tailor Shop | Where Excellence Meets Elegance</p>
                        <p style="margin-top: 15px; font-style: italic;">Best regards,<br/>The JFK Tailor Shop Team</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    setMailData({
      message,
      subject: `Order #${order.id} ${
        action === "confirmed" ? "Confirmed" : "Cancelled"
      }`,
      username: order.client,
    });
  };

  const sendNotificationEmail = async () => {
    try {
      await axios.post(`${backendUrl}/api/users/notifications/email`, mailData);
    } catch (error) {
      console.error("Error sending email notification:", error);
    }
  };

  const handleConfirm = async () => {
    if (!selectedOrder) return;
    try {
      setActionLoading(true);
      await axios.post(
        `${backendUrl}/api/users/orders/confirm/${selectedOrder.id}/`,
        {
          client: selectedOrder.client,
        },
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, is_confirmed: true }
            : order,
        ),
      );

      composeMailData(selectedOrder, "confirmed");
      await sendNotificationEmail();
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Error confirming order:", error);
    } finally {
      setActionLoading(false);
      setSelectedOrder(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedOrder) return;
    try {
      setActionLoading(true);
      await axios.post(
        `${backendUrl}/api/users/orders/delete/${selectedOrder.id}/`,
      );
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== selectedOrder.id),
      );

      composeMailData(selectedOrder, "deleted");
      await sendNotificationEmail();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting order:", error);
    } finally {
      setActionLoading(false);
      setSelectedOrder(null);
    }
  };

  const handleEdit = (orderId) => navigate(`/orders/edit/${orderId}`);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
    // If admin, fetch up-to-date measurements for the client
    if (role === "admin" && order?.client) {
      setAdminMeasLoading(true);
      axios
        .get(`${backendUrl}/api/users/measurements/view/`, {
          params: { username: order.client },
        })
        .then((response) => {
          setAdminMeasurements(response.data);
        })
        .catch((err) => {
          console.error("Error fetching admin measurements:", err);
        })
        .finally(() => setAdminMeasLoading(false));
    }
  };

  const handleOpenConfirmModal = (order) => {
    setSelectedOrder(order);
    setShowConfirmationModal(true);
  };

  const handleOpenDeleteModal = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const handleBack = () => {
    if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/client-home");
    }
  };

  const getStatusBadge = (order) => {
    // Show actual order status for both admin and client
    switch (order.status) {
      case "Completed":
        return <span className="status-badge completed">✓ Completed</span>;
      case "fitting":
        return (
          <span className="status-badge fitting">👔 Ready for Fitting</span>
        );
      case "in_progress":
        return <span className="status-badge in-progress">⚙️ In Progress</span>;
      case "Pending":
        if (order.is_confirmed) {
          return <span className="status-badge confirmed">✓ Confirmed</span>;
        } else {
          return <span className="status-badge pending">⏳ Pending</span>;
        }
      default:
        return <span className="status-badge pending">⏳ Pending</span>;
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setActionLoading(true);
      await axios.put(
        `${backendUrl}/api/users/orders/updatestatus/${orderId}/`,
        {
          status: newStatus,
        },
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const pageCount = Math.ceil(filteredOrders.length / ordersPerPage);
  const offset = currentPage * ordersPerPage;
  const currentOrders = filteredOrders.slice(offset, offset + ordersPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  if (loading) {
    return (
      <div
        className="order-list-page"
        style={{ fontFamily: SELECTED_FONT.family }}
      >
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="order-list-page"
      style={{
        backgroundImage: `url(${image})`,
        fontFamily: SELECTED_FONT.family,
      }}
    >
      <div className="order-list-container">
        {/* Header Section */}
        <div className="orders-header">
          <button
            onClick={handleBack}
            className="button button-secondary back-button"
            style={{
              background: COLORS.SECONDARY_RED,
              color: COLORS.TEXT_WHITE,
            }}
          >
            ← Back to Dashboard
          </button>

          <div className="header-content">
            <h1 className="page-title">Order Management</h1>
            <p className="page-subtitle">
              {role === "admin"
                ? "Manage all client orders"
                : `View and manage your orders, ${username}`}
            </p>
          </div>

          <div className="stats-summary">
            <div className="stat-item">
              <span className="stat-label">Total Orders</span>
              <span className="stat-value">{orders.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Confirmed</span>
              <span className="stat-value">
                {orders.filter((o) => o.is_confirmed).length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pending</span>
              <span className="stat-value">
                {orders.filter((o) => !o.is_confirmed).length}
              </span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="action-bar">
          <button
            onClick={() => navigate("/neworders")}
            className="button button-primary new-order-btn"
            style={{
              background: COLORS.BUTTON_ACTIVE,
              color: COLORS.TEXT_WHITE,
            }}
          >
            📝 Place New Order
          </button>

          <div className="controls-group">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="id">Order ID</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        {currentOrders.length > 0 ? (
          <div className="orders-grid">
            {currentOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div className="order-id">
                    <span className="order-hash">#</span>
                    {order.id}
                  </div>
                  {getStatusBadge(order)}
                </div>

                <div className="order-card-body">
                  <div className="order-info-row">
                    <span className="info-label">Client:</span>
                    <span className="info-value">{order.client}</span>
                  </div>
                  <div className="order-info-row">
                    <span className="info-label">Event:</span>
                    <span className="info-value">{order.event_type}</span>
                  </div>
                  <div className="order-info-row">
                    <span className="info-label">Order Date:</span>
                    <span className="info-value">
                      {new Date(order.order_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="order-info-row">
                    <span className="info-label">Expected Delivery:</span>
                    <span className="info-value">
                      {new Date(order.expected_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="order-info-row">
                    <span className="info-label">Color:</span>
                    <span
                      className="info-value color-chip"
                      style={{ background: order.preferred_Color || "#cccccc" }}
                    >
                      {order.preferred_Color || "Not specified"}
                    </span>
                  </div>
                </div>

                <div className="order-card-footer">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="card-button view-button"
                  >
                    👁️ View Details
                  </button>

                  {/* Admin buttons based on order status */}
                  {role === "admin" && (
                    <>
                      {/* New/Pending orders: Show Confirm button */}
                      {!order.is_confirmed && order.status === "Pending" && (
                        <button
                          onClick={() => handleOpenConfirmModal(order)}
                          className="card-button confirm-button"
                        >
                          ✓ Confirm
                        </button>
                      )}

                      {/* In Progress: Show Ready for Fitting + Mark Completed */}
                      {order.status === "in_progress" && (
                        <>
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, "fitting")
                            }
                            className="card-button fitting-button"
                            disabled={actionLoading}
                          >
                            👔 Ready for Fitting
                          </button>
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, "Completed")
                            }
                            className="card-button completed-button"
                            disabled={actionLoading}
                          >
                            ✓ Mark Completed
                          </button>
                        </>
                      )}

                      {/* Ready for Fitting: Show Mark Completed */}
                      {order.status === "fitting" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "Completed")
                          }
                          className="card-button completed-button"
                          disabled={actionLoading}
                        >
                          ✓ Mark Completed
                        </button>
                      )}

                      {/* Confirmed but still Pending: Show Mark In Progress */}
                      {order.is_confirmed && order.status === "Pending" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "in_progress")
                          }
                          className="card-button progress-button"
                          disabled={actionLoading}
                        >
                          ⚙️ Mark In Progress
                        </button>
                      )}
                    </>
                  )}

                  {/* Client buttons: Only edit/delete for unconfirmed orders */}
                  {role === "client" && !order.is_confirmed && (
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEdit(order.id)}
                        className="card-button edit-button"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(order)}
                        className="card-button delete-button"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h3>No Orders Found</h3>
            <p>
              {searchTerm
                ? "Try adjusting your search terms"
                : "Start by placing your first order"}
            </p>
            <button
              onClick={() => navigate("/neworders")}
              className="button button-primary"
              style={{
                background: COLORS.BUTTON_ACTIVE,
                color: COLORS.TEXT_WHITE,
                marginTop: "20px",
              }}
            >
              Create Your First Order
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > ordersPerPage && (
          <div className="pagination-wrapper">
            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"pagination-container"}
              pageClassName={"pagination-item"}
              pageLinkClassName={"pagination-link"}
              previousClassName={"pagination-nav"}
              nextClassName={"pagination-nav"}
              breakClassName={"pagination-break"}
              activeClassName={"pagination-active"}
              disabledClassName={"pagination-disabled"}
            />
            <div className="pagination-info">
              Showing {offset + 1} to{" "}
              {Math.min(offset + ordersPerPage, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="details-modal-overlay">
          <div className="details-modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                Order #{selectedOrder.id} Details
                {getStatusBadge(selectedOrder)}
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-section">
                  <h4 className="section-title">Client Information</h4>
                  <div className="detail-row">
                    <span className="detail-label">Client:</span>
                    <span className="detail-value">{selectedOrder.client}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Order Date:</span>
                    <span className="detail-value">
                      {new Date(selectedOrder.order_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4 className="section-title">Order Details</h4>
                  <div className="detail-row">
                    <span className="detail-label">Event Type:</span>
                    <span className="detail-value">
                      {selectedOrder.event_type}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Expected Delivery:</span>
                    <span className="detail-value">
                      {new Date(
                        selectedOrder.expected_date,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Preferred Color:</span>
                    <span
                      className="detail-value color-chip"
                      style={{
                        background: selectedOrder.preferred_Color || "#cccccc",
                      }}
                    >
                      {selectedOrder.preferred_Color || "Not specified"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Material Provided:</span>
                    <span className="detail-value">
                      {selectedOrder.material ? "Yes" : "No"}
                    </span>
                  </div>
                </div>

                <div className="detail-section full-width">
                  <h4 className="section-title">Measurements</h4>
                  <div className="measurements-box">
                    {role === "admin" ? (
                      adminMeasLoading ? (
                        <span className="loading-text">
                          Loading measurements...
                        </span>
                      ) : adminMeasurements &&
                        Object.keys(adminMeasurements).length > 0 ? (
                        <div className="measurements-grid">
                          {Object.keys(adminMeasurements)
                            .filter(
                              (key) =>
                                key !== "username" &&
                                key !== "id" &&
                                adminMeasurements[key],
                            )
                            .map((key) => (
                              <div key={key} className="measurement-item">
                                <span className="measurement-label">
                                  {key}:
                                </span>
                                <span className="measurement-value">
                                  {adminMeasurements[key]}
                                </span>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <span>No measurements found for this client.</span>
                      )
                    ) : (
                      selectedOrder.measurements
                    )}
                  </div>
                </div>

                {selectedOrder.comments && (
                  <div className="detail-section full-width">
                    <h4 className="section-title">Additional Comments</h4>
                    <div className="comments-box">{selectedOrder.comments}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              {role === "admin" && !selectedOrder.is_confirmed && (
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleOpenConfirmModal(selectedOrder);
                  }}
                  className="button button-primary"
                  style={{
                    background: COLORS.BUTTON_ACTIVE,
                    color: COLORS.TEXT_WHITE,
                  }}
                >
                  ✓ Confirm Order
                </button>
              )}
              <button
                onClick={() => setShowDetailsModal(false)}
                className="button button-secondary"
                style={{
                  background: COLORS.SECONDARY_RED,
                  color: COLORS.TEXT_WHITE,
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="confirmation-modal-overlay">
          <div className="confirmation-modal-content">
            <div className="modal-icon">✓</div>
            <h3 className="modal-title">Confirm Order #{selectedOrder?.id}</h3>
            <p className="modal-text">
              Are you sure you want to confirm this order? This action will
              notify the client and begin the tailoring process.
            </p>
            <div className="order-preview">
              <p>
                <strong>Client:</strong> {selectedOrder?.client}
              </p>
              <p>
                <strong>Event:</strong> {selectedOrder?.event_type}
              </p>
              <p>
                <strong>Delivery:</strong>{" "}
                {new Date(selectedOrder?.expected_date).toLocaleDateString()}
              </p>
            </div>
            <div className="modal-actions">
              <button
                onClick={handleConfirm}
                className="button button-primary"
                style={{
                  background: COLORS.BUTTON_ACTIVE,
                  color: COLORS.TEXT_WHITE,
                }}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <span className="loading-spinner-small"></span>
                    Confirming...
                  </>
                ) : (
                  "Yes, Confirm Order"
                )}
              </button>
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="button button-secondary"
                style={{
                  background: COLORS.SECONDARY_RED,
                  color: COLORS.TEXT_WHITE,
                }}
                disabled={actionLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-content">
            <div className="modal-icon">🗑️</div>
            <h3 className="modal-title">Delete Order #{selectedOrder?.id}</h3>
            <p className="modal-text">
              Are you sure you want to delete this order? This action cannot be
              undone and will notify the client.
            </p>
            <div className="warning-box">
              ⚠️ This will permanently remove the order from the system.
            </div>
            <div className="modal-actions">
              <button
                onClick={handleDelete}
                className="button button-secondary"
                style={{
                  background: COLORS.SECONDARY_RED,
                  color: COLORS.TEXT_WHITE,
                }}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <span className="loading-spinner-small"></span>
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete Order"
                )}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="button"
                style={{
                  background: "rgba(139, 69, 19, 0.1)",
                  color: COLORS.PRIMARY_BROWN_1,
                  border: `1px solid ${COLORS.PRIMARY_BROWN_1}`,
                }}
                disabled={actionLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
