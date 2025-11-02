import { useState, useEffect } from "react";

/**
 * User Selection Modal
 * Allows user to choose between chatting with entire organization or specific user
 */
export default function UserSelectionModal({
  organization,
  users,
  isLoading,
  onClose,
  onChatWithOrganization,
  onChatWithUser,
}) {
  const [selectedOption, setSelectedOption] = useState(null); // 'organization' or 'user'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content user-selection-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3>Connect with {organization.name}</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {selectedOption === null ? (
            // Step 1: Choose option
            <div className="connection-options">
              <p className="modal-description">How would you like to connect?</p>

              <button
                className="connection-option-btn"
                onClick={() => setSelectedOption("organization")}
              >
                <span className="material-symbols-outlined">groups</span>
                <div className="option-content">
                  <h4>Chat with Organization</h4>
                  <p>Start a group conversation with admins and managers</p>
                </div>
                <span className="material-symbols-outlined">chevron_right</span>
              </button>

              <button
                className="connection-option-btn"
                onClick={() => setSelectedOption("user")}
              >
                <span className="material-symbols-outlined">person</span>
                <div className="option-content">
                  <h4>Chat with Specific Member</h4>
                  <p>Start a direct conversation with one person</p>
                </div>
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          ) : selectedOption === "organization" ? (
            // Step 2a: Confirm organization chat
            <div className="confirmation-screen">
              <div className="confirmation-icon">
                <span className="material-symbols-outlined">groups</span>
              </div>
              <h4>Start Group Conversation</h4>
              <p>
                You're about to start a group conversation with {organization.name}. Admins and
                managers from both organizations will be added.
              </p>
              <div className="modal-actions">
                <button
                  className="btn-secondary"
                  onClick={() => setSelectedOption(null)}
                >
                  Back
                </button>
                <button
                  className="btn-primary"
                  onClick={onChatWithOrganization}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Start Conversation"}
                </button>
              </div>
            </div>
          ) : (
            // Step 2b: Select user
            <div className="user-selection-screen">
              <div className="screen-header">
                <button
                  className="back-btn"
                  onClick={() => setSelectedOption(null)}
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  Back
                </button>
                <h4>Select a Member</h4>
              </div>

              {isLoading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading members...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="empty-state">
                  <span className="material-symbols-outlined">person_off</span>
                  <p>No active members found in this organization</p>
                </div>
              ) : (
                <div className="users-list">
                  {users.map((user) => (
                    <button
                      key={user._id}
                      className="user-item"
                      onClick={() => onChatWithUser(user._id)}
                      disabled={isLoading}
                    >
                      <div className="user-avatar">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.firstName} />
                        ) : (
                          <div className="avatar-placeholder">
                            <span className="material-symbols-outlined">person</span>
                          </div>
                        )}
                      </div>
                      <div className="user-info">
                        <div className="user-name">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="user-meta">
                          <span className={`user-role role-${user.role}`}>
                            {user.role}
                          </span>
                          {user.email && (
                            <span className="user-email">{user.email}</span>
                          )}
                        </div>
                      </div>
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
