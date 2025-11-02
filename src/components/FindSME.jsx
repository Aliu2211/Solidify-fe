import { useState, useEffect, useCallback } from "react";
import { Header } from "./Header";
import { Profile } from "./Profile";
import { Body } from "./Dashboard";
import UserSelectionModal from "./common/UserSelectionModal";
import useOrganizationStore from "../stores/organizationStore";
import useAuthStore from "../stores/authStore";
import organizationService from "../services/organization.service";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function FindSME() {
  const {
    organizations,
    filters,
    isLoading,
    pagination,
    fetchOrganizations,
    setFilters,
    clearFilters,
    setPage,
  } = useOrganizationStore();

  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [modalUsers, setModalUsers] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);

  // Fetch organizations on mount and when filters/pagination change
  useEffect(() => {
    fetchOrganizations();
  }, [filters, pagination.page]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters({ search: searchInput });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleFilterChange = (filterName, value) => {
    setFilters({ [filterName]: value });
  };

  const handleClearFilters = () => {
    clearFilters();
    setSearchInput("");
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConnect = async (organization) => {
    if (!organization._id) {
      toast.error("Cannot connect: Invalid organization");
      return;
    }

    // Don't allow connecting to own organization
    if (organization._id === user?.organization?._id) {
      toast.error("You cannot connect to your own organization");
      return;
    }

    // Open modal and fetch users
    setSelectedOrganization(organization);
    setShowModal(true);
    setIsConnecting(true);

    try {
      const response = await organizationService.getOrganizationUsers(organization._id);
      if (response.success) {
        setModalUsers(response.data || []);
      } else {
        toast.error("Failed to load organization members");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load organization members");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleChatWithOrganization = async () => {
    if (!selectedOrganization) return;

    setIsConnecting(true);
    try {
      const response = await organizationService.connectWithOrganization(
        selectedOrganization._id,
        { connectType: "organization" }
      );

      if (response.success) {
        toast.success(`Group conversation created with ${selectedOrganization.name}!`);
        setShowModal(false);
        navigate("/chat");
      } else {
        toast.error(response.message || "Failed to create conversation");
      }
    } catch (error) {
      console.error("Connection error:", error);
      console.error("Error response:", error.response?.data);

      // Show detailed error message from backend
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.errors?.[0] ||
                          "Failed to create conversation";
      toast.error(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleChatWithUser = async (userId) => {
    if (!selectedOrganization) return;

    setIsConnecting(true);
    try {
      console.log("Connecting with user:", userId);
      console.log("Organization ID:", selectedOrganization._id);
      console.log("Request payload:", { connectType: "user", userId });

      const response = await organizationService.connectWithOrganization(
        selectedOrganization._id,
        { connectType: "user", userId }
      );

      if (response.success) {
        const user = modalUsers.find((u) => u._id === userId);
        toast.success(`Direct conversation created with ${user?.firstName || "user"}!`);
        setShowModal(false);
        navigate("/chat");
      } else {
        toast.error(response.message || "Failed to create conversation");
      }
    } catch (error) {
      console.error("Connection error:", error);
      console.error("Error response:", error.response?.data);

      // Show detailed error message from backend
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.errors?.[0] ||
                          "Failed to create conversation";
      toast.error(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrganization(null);
    setModalUsers([]);
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== "" && v !== null
  ).length;

  return (
    <div className="find-sme-page">
      <Header defaultTab="crowdsource">
        <Profile />
      </Header>

      <Body className="find-sme">
        <div className="find-sme-container">
          {/* Header Section */}
          <div className="find-sme-header">
            <div className="header-content">
              <h1 className="page-title">Find SME Partners</h1>
              <p className="page-subtitle">
                Connect with other SMEs and collaborate on sustainability initiatives
              </p>
            </div>

            {/* Search and Filter Controls */}
            <div className="search-filter-controls">
              <div className="search-box">
                <span className="material-symbols-outlined search-icon">search</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search organizations by name or description..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                {searchInput && (
                  <button
                    className="clear-search-btn"
                    onClick={() => setSearchInput("")}
                    aria-label="Clear search"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                )}
              </div>

              <button
                className={`filter-toggle-btn ${showFilters ? "active" : ""}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <span className="material-symbols-outlined">tune</span>
                Filters
                {activeFilterCount > 0 && (
                  <span className="filter-badge">{activeFilterCount}</span>
                )}
              </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="filters-panel">
                <div className="filters-grid">
                  {/* Industry Type Filter */}
                  <div className="filter-group">
                    <label className="filter-label">Industry Type</label>
                    <select
                      className="filter-select"
                      value={filters.industryType}
                      onChange={(e) => handleFilterChange("industryType", e.target.value)}
                    >
                      <option value="">All Industries</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Technology">Technology</option>
                      <option value="Retail">Retail</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Services">Services</option>
                      <option value="Energy">Energy</option>
                      <option value="Construction">Construction</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Size Filter */}
                  <div className="filter-group">
                    <label className="filter-label">Company Size</label>
                    <select
                      className="filter-select"
                      value={filters.size}
                      onChange={(e) => handleFilterChange("size", e.target.value)}
                    >
                      <option value="">All Sizes</option>
                      <option value="small">Small (1-50 employees)</option>
                      <option value="medium">Medium (51-250 employees)</option>
                    </select>
                  </div>

                  {/* Sustainability Level Filter */}
                  <div className="filter-group">
                    <label className="filter-label">Sustainability Level</label>
                    <select
                      className="filter-select"
                      value={filters.sustainabilityLevel || ""}
                      onChange={(e) =>
                        handleFilterChange(
                          "sustainabilityLevel",
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                    >
                      <option value="">All Levels</option>
                      <option value="1">Level 1 - Foundation</option>
                      <option value="2">Level 2 - Efficiency</option>
                      <option value="3">Level 3 - Transformation</option>
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div className="filter-group">
                    <label className="filter-label">Location</label>
                    <input
                      type="text"
                      className="filter-input"
                      placeholder="e.g., Accra, Kumasi"
                      value={filters.location}
                      onChange={(e) => handleFilterChange("location", e.target.value)}
                    />
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <button className="clear-filters-btn" onClick={handleClearFilters}>
                    <span className="material-symbols-outlined">filter_alt_off</span>
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="results-section">
            <div className="results-header">
              <p className="results-count">
                {isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    <strong>{pagination.total || organizations.length}</strong> organization
                    {pagination.total !== 1 ? "s" : ""} found
                  </>
                )}
              </p>
            </div>

            {/* Organizations Grid */}
            {isLoading ? (
              <div className="organizations-grid">
                {Array.from({ length: 6 }).map((_, index) => (
                  <OrganizationCardSkeleton key={index} />
                ))}
              </div>
            ) : organizations.length === 0 ? (
              <div className="no-results">
                <span className="material-symbols-outlined no-results-icon">
                  corporate_fare
                </span>
                <h3>No organizations found</h3>
                <p>Try adjusting your search or filters</p>
                {activeFilterCount > 0 && (
                  <button className="btn-primary" onClick={handleClearFilters}>
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="organizations-grid">
                  {organizations.map((org) => (
                    <OrganizationCard
                      key={org._id}
                      organization={org}
                      onConnect={handleConnect}
                      isOwnOrg={org._id === user?.organization?._id}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                      Previous
                    </button>

                    <div className="pagination-info">
                      Page {pagination.page} of {pagination.totalPages}
                    </div>

                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                    >
                      Next
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Body>

      {/* User Selection Modal */}
      {showModal && selectedOrganization && (
        <UserSelectionModal
          organization={selectedOrganization}
          users={modalUsers}
          isLoading={isConnecting}
          onClose={handleCloseModal}
          onChatWithOrganization={handleChatWithOrganization}
          onChatWithUser={handleChatWithUser}
        />
      )}
    </div>
  );
}

// Organization Card Component
function OrganizationCard({ organization, onConnect, isOwnOrg}) {
  const sustainabilityLevels = {
    1: { name: "Foundation", color: "#22c55e" },
    2: { name: "Efficiency", color: "#3b82f6" },
    3: { name: "Transformation", color: "#8b5cf6" },
  };

  const levelInfo = sustainabilityLevels[organization.sustainabilityLevel] || {
    name: "Not Set",
    color: "#9ca3af",
  };

  return (
    <div className="organization-card">
      {/* Logo and Badge */}
      <div className="org-card-header">
        <div className="org-logo-wrapper">
          {organization.logoUrl ? (
            <img
              src={organization.logoUrl}
              alt={organization.name}
              className="org-logo"
            />
          ) : (
            <div className="org-logo-placeholder">
              <span className="material-symbols-outlined">corporate_fare</span>
            </div>
          )}
        </div>
        <div className="org-header-info">
          <h3 className="org-name">{organization.name}</h3>
          <p className="org-industry-tag">
            {organization.industryType || "Industry"}
          </p>
        </div>
        {organization.verified && (
          <span className="verified-badge" title="Verified Organization">
            <span className="material-symbols-outlined">verified</span>
          </span>
        )}
      </div>

      {/* Organization Info */}
      <div className="org-card-body">

        <div className="org-meta">
          <span className="org-meta-item">
            <span className="material-symbols-outlined">location_on</span>
            {organization.location || "N/A"}
          </span>
          <span className="org-meta-item">
            <span className="material-symbols-outlined">groups</span>
            {organization.size === "small" ? "1-50" : "51-250"} employees
          </span>
        </div>

        {organization.description && (
          <p className="org-description">{organization.description}</p>
        )}

        {/* Sustainability Level Badge */}
        <div
          className="sustainability-badge"
          style={{ borderColor: levelInfo.color, color: levelInfo.color }}
        >
          <span className="material-symbols-outlined">eco</span>
          Level {organization.sustainabilityLevel} - {levelInfo.name}
        </div>

        {organization.website && (
          <a
            href={organization.website}
            target="_blank"
            rel="noopener noreferrer"
            className="org-website"
          >
            <span className="material-symbols-outlined">link</span>
            Visit Website
          </a>
        )}
      </div>

      {/* Actions */}
      <div className="org-card-footer">
        {isOwnOrg ? (
          <button className="btn-connect" disabled>
            <span className="material-symbols-outlined">check_circle</span>
            Your Organization
          </button>
        ) : (
          <button className="btn-connect" onClick={() => onConnect(organization)}>
            <span className="material-symbols-outlined">chat</span>
            Start Conversation
          </button>
        )}
      </div>
    </div>
  );
}

// Skeleton Loader
function OrganizationCardSkeleton() {
  return (
    <div className="organization-card skeleton-card">
      <div className="org-card-header">
        <div className="skeleton skeleton-circle" style={{ width: "80px", height: "80px" }}></div>
      </div>
      <div className="org-card-body">
        <div className="skeleton skeleton-text" style={{ width: "70%", height: "24px", marginBottom: "12px" }}></div>
        <div className="skeleton skeleton-text" style={{ width: "100%", height: "16px", marginBottom: "8px" }}></div>
        <div className="skeleton skeleton-text" style={{ width: "90%", height: "16px", marginBottom: "8px" }}></div>
        <div className="skeleton skeleton-text" style={{ width: "100%", height: "48px", marginBottom: "12px" }}></div>
        <div className="skeleton skeleton-rect" style={{ width: "60%", height: "32px" }}></div>
      </div>
      <div className="org-card-footer">
        <div className="skeleton skeleton-rect" style={{ width: "100%", height: "44px" }}></div>
      </div>
    </div>
  );
}
