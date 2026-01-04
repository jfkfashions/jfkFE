import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../globalContext/constant";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../images/adminBackgroundUsers.webp";
import {
  COLORS,
  SELECTED_FONT,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TRANSITIONS,
} from "../utils/constants";

const AdminUserProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "username",
    direction: "asc",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/users/userprofile`);
        setProfiles(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching user profiles:", error);
        setError("Failed to load user profiles. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleDelete = async (username, firstname, lastname) => {
    if (
      window.confirm(
        `Are you sure you want to delete the profile of ${firstname} ${lastname}?`
      )
    ) {
      try {
        await axios.delete(`${backendUrl}/api/users/profile/${username}/`);
        setProfiles(
          profiles.filter((profile) => profile.username !== username)
        );
      } catch (error) {
        console.error("Error deleting profile:", error);
        setError("Failed to delete profile. Please try again.");
      }
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedProfiles = [...profiles].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredProfiles = sortedProfiles.filter(
    (profile) =>
      profile.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <h3 style={styles.loadingText}>Loading Client Profiles...</h3>
        </div>
      </div>
    );
  }

  if (error && profiles.length === 0) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <h3 style={styles.errorTitle}>Error Loading Profiles</h3>
          <p style={styles.errorMessage}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={styles.retryButton}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Client Management</h1>
            <p style={styles.subtitle}>
              Manage and monitor all client profiles
            </p>
          </div>
          <div style={styles.headerActions}>
            <button
              onClick={() => navigate("/signup")}
              style={styles.primaryButton}
            >
              + Create New Profile
            </button>
            <button
              onClick={() => navigate("/admin/dashboard")}
              style={styles.secondaryButton}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>👥</div>
            <div>
              <h3 style={styles.statValue}>{profiles.length}</h3>
              <p style={styles.statLabel}>Total Clients</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div
              style={{
                ...styles.statIcon,
                background: COLORS.SUCCESS + "20",
                color: COLORS.SUCCESS,
              }}
            >
              ✓
            </div>
            <div>
              <h3 style={styles.statValue}>
                {profiles.filter((p) => p.is_active).length}
              </h3>
              <p style={styles.statLabel}>Active Clients</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div style={styles.searchContainer}>
          <div style={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search clients by name, username, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            <span style={styles.searchIcon}>🔍</span>
          </div>
          <div style={styles.filterInfo}>
            <span style={styles.filterText}>
              Showing {filteredProfiles.length} of {profiles.length} clients
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                style={styles.clearFilterButton}
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={styles.alert}>
            <span style={styles.alertIcon}>⚠️</span>
            <span>{error}</span>
            <button onClick={() => setError(null)} style={styles.alertClose}>
              ×
            </button>
          </div>
        )}

        {/* Clients Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th
                  style={styles.tableHeader}
                  onClick={() => handleSort("username")}
                >
                  <div style={styles.tableHeaderContent}>
                    Username
                    <span style={styles.sortIndicator}>
                      {sortConfig.key === "username" &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </span>
                  </div>
                </th>
                <th
                  style={styles.tableHeader}
                  onClick={() => handleSort("firstname")}
                >
                  <div style={styles.tableHeaderContent}>
                    Name
                    <span style={styles.sortIndicator}>
                      {sortConfig.key === "firstname" &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </span>
                  </div>
                </th>
                <th
                  style={styles.tableHeader}
                  onClick={() => handleSort("email")}
                >
                  <div style={styles.tableHeaderContent}>
                    Email
                    <span style={styles.sortIndicator}>
                      {sortConfig.key === "email" &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </span>
                  </div>
                </th>
                <th style={styles.tableHeader}>Status</th>
                <th style={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.map((profile) => (
                <tr key={profile.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>
                    <div style={styles.userCell}>
                      <div style={styles.avatar}>
                        {profile.firstname?.charAt(0)}
                        {profile.lastname?.charAt(0)}
                      </div>
                      <div>
                        <div style={styles.username}>{profile.username}</div>
                        <div style={styles.userId}>ID: {profile.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.nameCell}>
                      <div style={styles.name}>
                        {profile.firstname} {profile.lastname}
                      </div>
                      {profile.phone && (
                        <div style={styles.phone}>📱 {profile.phone}</div>
                      )}
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.emailCell}>
                      <div style={styles.email}>{profile.email}</div>
                      {profile.is_active !== undefined && (
                        <div style={styles.verificationStatus}>
                          {profile.is_active ? "Verified" : "Pending"}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.statusCell}>
                      <span style={styles.statusBadge}>
                        {profile.is_active ? "Active" : "Inactive"}
                      </span>
                      <div style={styles.statusDetail}>
                        Member since{" "}
                        {new Date(
                          profile.created_at || Date.now()
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.actionButtons}>
                      <button
                        onClick={() =>
                          navigate(`/admin/users/view/${profile.username}`)
                        }
                        style={styles.viewButton}
                        title="View full profile"
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/admin/users/edit/${profile.username}`)
                        }
                        style={styles.editButton}
                        title="Edit profile"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(
                            profile.username,
                            profile.firstname,
                            profile.lastname
                          )
                        }
                        style={styles.deleteButton}
                        title="Delete profile"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredProfiles.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>👤</div>
            <h3 style={styles.emptyTitle}>No clients found</h3>
            <p style={styles.emptyMessage}>
              {searchTerm
                ? "Try a different search term"
                : "No client profiles available"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                style={styles.emptyActionButton}
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: "100vh",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: SPACING.XL,
    fontFamily: SELECTED_FONT.family,
  },
  container: {
    width: "100%",
    maxWidth: "1200px",
    background: "rgba(255, 255, 255, 0.97)",
    borderRadius: BORDER_RADIUS.XL,
    boxShadow: SHADOWS.XL,
    padding: SPACING.XL,
    animation: "fadeIn 0.5s ease-out",
  },
  loadingContainer: {
    background: "white",
    padding: SPACING.XXL,
    borderRadius: BORDER_RADIUS.XL,
    boxShadow: SHADOWS.XL,
    textAlign: "center",
    maxWidth: "400px",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: `3px solid ${COLORS.PRIMARY_BROWN_1}20`,
    borderTop: `3px solid ${COLORS.PRIMARY_BROWN_1}`,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
    marginBottom: SPACING.LG,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.HEADING_3.fontSize,
    fontWeight: "600",
    color: COLORS.TEXT_GRAY,
  },
  errorContainer: {
    background: "white",
    padding: SPACING.XXL,
    borderRadius: BORDER_RADIUS.XL,
    boxShadow: SHADOWS.XL,
    textAlign: "center",
    maxWidth: "500px",
  },
  errorIcon: {
    fontSize: "3rem",
    marginBottom: SPACING.LG,
  },
  errorTitle: {
    fontSize: TYPOGRAPHY.HEADING_3.fontSize,
    fontWeight: "600",
    color: COLORS.ERROR,
    marginBottom: SPACING.MD,
  },
  errorMessage: {
    fontSize: TYPOGRAPHY.BODY.fontSize,
    color: COLORS.TEXT_GRAY,
    marginBottom: SPACING.LG,
  },
  retryButton: {
    padding: `${SPACING.MD} ${SPACING.XL}`,
    background: COLORS.PRIMARY_GRADIENT,
    color: COLORS.TEXT_WHITE,
    border: "none",
    borderRadius: BORDER_RADIUS.PILL,
    cursor: "pointer",
    fontWeight: "600",
    transition: `all ${TRANSITIONS.DEFAULT}`,
    fontSize: TYPOGRAPHY.BODY.fontSize,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.XL,
    paddingBottom: SPACING.LG,
    borderBottom: `2px solid ${COLORS.PRIMARY_BROWN_1}20`,
  },
  title: {
    fontSize: TYPOGRAPHY.HEADING_1.fontSize,
    fontWeight: "700",
    background: COLORS.PRIMARY_GRADIENT,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: SPACING.XS,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.BODY_LARGE.fontSize,
    color: COLORS.TEXT_GRAY,
    fontWeight: "400",
  },
  headerActions: {
    display: "flex",
    gap: SPACING.MD,
    alignItems: "flex-start",
  },
  primaryButton: {
    padding: `${SPACING.MD} ${SPACING.XL}`,
    background: COLORS.PRIMARY_GRADIENT,
    color: COLORS.TEXT_WHITE,
    border: "none",
    borderRadius: BORDER_RADIUS.PILL,
    cursor: "pointer",
    fontWeight: "600",
    transition: `all ${TRANSITIONS.DEFAULT}`,
    fontSize: TYPOGRAPHY.BODY.fontSize,
    display: "flex",
    alignItems: "center",
    gap: SPACING.XS,
    boxShadow: SHADOWS.MD,
  },
  secondaryButton: {
    padding: `${SPACING.MD} ${SPACING.XL}`,
    background: COLORS.BG_LIGHT,
    color: COLORS.TEXT_BLACK,
    border: `2px solid ${COLORS.PRIMARY_BROWN_1}30`,
    borderRadius: BORDER_RADIUS.PILL,
    cursor: "pointer",
    fontWeight: "600",
    transition: `all ${TRANSITIONS.DEFAULT}`,
    fontSize: TYPOGRAPHY.BODY.fontSize,
    display: "flex",
    alignItems: "center",
    gap: SPACING.XS,
  },
  statsContainer: {
    display: "flex",
    gap: SPACING.LG,
    marginBottom: SPACING.XL,
  },
  statCard: {
    flex: 1,
    background: "white",
    padding: SPACING.LG,
    borderRadius: BORDER_RADIUS.LG,
    boxShadow: SHADOWS.MD,
    display: "flex",
    alignItems: "center",
    gap: SPACING.MD,
    transition: `transform ${TRANSITIONS.DEFAULT}`,
  },
  statIcon: {
    width: "60px",
    height: "60px",
    background: COLORS.PRIMARY_GRADIENT,
    borderRadius: BORDER_RADIUS.ROUND,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    color: COLORS.TEXT_WHITE,
  },
  statValue: {
    fontSize: TYPOGRAPHY.HEADING_2.fontSize,
    fontWeight: "700",
    color: COLORS.TEXT_BLACK,
    margin: 0,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.BODY.fontSize,
    color: COLORS.TEXT_GRAY,
    margin: 0,
  },
  searchContainer: {
    marginBottom: SPACING.LG,
  },
  searchWrapper: {
    position: "relative",
    marginBottom: SPACING.SM,
  },
  searchInput: {
    width: "100%",
    padding: `${SPACING.MD} ${SPACING.XL} ${SPACING.MD} ${SPACING.XL * 2}`,
    border: `2px solid ${COLORS.PRIMARY_BROWN_1}30`,
    borderRadius: BORDER_RADIUS.PILL,
    fontSize: TYPOGRAPHY.BODY.fontSize,
    fontFamily: SELECTED_FONT.family,
    transition: `all ${TRANSITIONS.FAST}`,
  },
  searchIcon: {
    position: "absolute",
    left: SPACING.LG,
    top: "50%",
    transform: "translateY(-50%)",
    color: COLORS.PRIMARY_BROWN_1,
  },
  filterInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterText: {
    fontSize: TYPOGRAPHY.BODY_SMALL.fontSize,
    color: COLORS.TEXT_GRAY,
  },
  clearFilterButton: {
    background: "none",
    border: "none",
    color: COLORS.SECONDARY_RED,
    cursor: "pointer",
    fontSize: TYPOGRAPHY.BODY_SMALL.fontSize,
    fontWeight: "600",
  },
  alert: {
    background: `${COLORS.WARNING}15`,
    border: `1px solid ${COLORS.WARNING}30`,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.LG,
    display: "flex",
    alignItems: "center",
    gap: SPACING.MD,
  },
  alertIcon: {
    fontSize: "1.2rem",
  },
  alertClose: {
    marginLeft: "auto",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1.5rem",
    color: COLORS.TEXT_GRAY,
  },
  tableContainer: {
    overflowX: "auto",
    borderRadius: BORDER_RADIUS.LG,
    boxShadow: SHADOWS.MD,
    marginBottom: SPACING.XL,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
  },
  tableHeaderRow: {
    background: COLORS.PRIMARY_GRADIENT,
  },
  tableHeader: {
    padding: SPACING.LG,
    textAlign: "left",
    color: COLORS.TEXT_WHITE,
    fontWeight: "600",
    fontSize: TYPOGRAPHY.BODY.fontSize,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    cursor: "pointer",
    transition: `all ${TRANSITIONS.FAST}`,
  },
  tableHeaderContent: {
    display: "flex",
    alignItems: "center",
    gap: SPACING.XS,
  },
  sortIndicator: {
    fontSize: "0.8rem",
  },
  tableRow: {
    borderBottom: `1px solid ${COLORS.BG_LIGHT}`,
    transition: `all ${TRANSITIONS.FAST}`,
  },
  tableCell: {
    padding: SPACING.LG,
    color: COLORS.TEXT_BLACK,
    fontSize: TYPOGRAPHY.BODY.fontSize,
  },
  userCell: {
    display: "flex",
    alignItems: "center",
    gap: SPACING.MD,
  },
  avatar: {
    width: "40px",
    height: "40px",
    background: COLORS.PRIMARY_GRADIENT,
    borderRadius: BORDER_RADIUS.ROUND,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: COLORS.TEXT_WHITE,
    fontWeight: "600",
    fontSize: TYPOGRAPHY.BODY.fontSize,
  },
  username: {
    fontWeight: "600",
    color: COLORS.TEXT_BLACK,
  },
  userId: {
    fontSize: TYPOGRAPHY.BODY_SMALL.fontSize,
    color: COLORS.TEXT_GRAY,
  },
  nameCell: {
    display: "flex",
    flexDirection: "column",
    gap: SPACING.XS,
  },
  name: {
    fontWeight: "500",
  },
  phone: {
    fontSize: TYPOGRAPHY.BODY_SMALL.fontSize,
    color: COLORS.TEXT_GRAY,
  },
  emailCell: {
    display: "flex",
    flexDirection: "column",
    gap: SPACING.XS,
  },
  email: {
    color: COLORS.INFO,
  },
  verificationStatus: {
    fontSize: TYPOGRAPHY.BODY_SMALL.fontSize,
    color: COLORS.TEXT_GRAY,
    fontStyle: "italic",
  },
  statusCell: {
    display: "flex",
    flexDirection: "column",
    gap: SPACING.XS,
  },
  statusBadge: {
    display: "inline-block",
    padding: `${SPACING.XS} ${SPACING.MD}`,
    borderRadius: BORDER_RADIUS.PILL,
    fontSize: TYPOGRAPHY.BODY_SMALL.fontSize,
    fontWeight: "600",
    textTransform: "uppercase",
    background: `${COLORS.SUCCESS}15`,
    color: COLORS.SUCCESS,
  },
  statusDetail: {
    fontSize: TYPOGRAPHY.BODY_SMALL.fontSize,
    color: COLORS.TEXT_GRAY,
  },
  actionButtons: {
    display: "flex",
    gap: SPACING.SM,
  },
  viewButton: {
    padding: `${SPACING.SM} ${SPACING.MD}`,
    background: `${COLORS.INFO}20`,
    color: COLORS.INFO,
    border: `1px solid ${COLORS.INFO}30`,
    borderRadius: BORDER_RADIUS.MD,
    cursor: "pointer",
    fontWeight: "600",
    fontSize: TYPOGRAPHY.BODY_SMALL.fontSize,
    display: "flex",
    alignItems: "center",
    gap: SPACING.XS,
    transition: `all ${TRANSITIONS.FAST}`,
  },
  editButton: {
    padding: `${SPACING.SM} ${SPACING.MD}`,
    background: `${COLORS.WARNING}20`,
    color: COLORS.WARNING,
    border: `1px solid ${COLORS.WARNING}30`,
    borderRadius: BORDER_RADIUS.MD,
    cursor: "pointer",
    fontWeight: "600",
    fontSize: TYPOGRAPHY.BODY_SMALL.fontSize,
    display: "flex",
    alignItems: "center",
    gap: SPACING.XS,
    transition: `all ${TRANSITIONS.FAST}`,
  },
  deleteButton: {
    padding: `${SPACING.SM} ${SPACING.MD}`,
    background: `${COLORS.ERROR}20`,
    color: COLORS.ERROR,
    border: `1px solid ${COLORS.ERROR}30`,
    borderRadius: BORDER_RADIUS.MD,
    cursor: "pointer",
    fontWeight: "600",
    fontSize: TYPOGRAPHY.BODY_SMALL.fontSize,
    display: "flex",
    alignItems: "center",
    gap: SPACING.XS,
    transition: `all ${TRANSITIONS.FAST}`,
  },
  emptyState: {
    textAlign: "center",
    padding: SPACING.XXL,
    background: "white",
    borderRadius: BORDER_RADIUS.LG,
    boxShadow: SHADOWS.MD,
  },
  emptyIcon: {
    fontSize: "4rem",
    marginBottom: SPACING.LG,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.HEADING_3.fontSize,
    color: COLORS.TEXT_BLACK,
    marginBottom: SPACING.SM,
  },
  emptyMessage: {
    color: COLORS.TEXT_GRAY,
    fontSize: TYPOGRAPHY.BODY_LARGE.fontSize,
    marginBottom: SPACING.LG,
  },
  emptyActionButton: {
    padding: `${SPACING.MD} ${SPACING.XL}`,
    background: COLORS.PRIMARY_GRADIENT,
    color: COLORS.TEXT_WHITE,
    border: "none",
    borderRadius: BORDER_RADIUS.PILL,
    cursor: "pointer",
    fontWeight: "600",
    fontSize: TYPOGRAPHY.BODY.fontSize,
  },
};

// Add CSS animations
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`,
  styleSheet.cssRules.length
);
styleSheet.insertRule(
  `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`,
  styleSheet.cssRules.length
);

// Add hover effects
styleSheet.insertRule(
  `
  .table-row:hover {
    background: ${COLORS.PRIMARY_BROWN_1}08;
  }
`,
  styleSheet.cssRules.length
);

export default AdminUserProfileList;
