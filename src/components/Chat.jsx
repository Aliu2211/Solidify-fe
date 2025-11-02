import { useEffect, useState, useRef } from "react";
import { Header } from "./Header";
import { Profile } from "./Profile";
import { Body } from "./Dashboard";
import useChatStore from "../stores/chatStore";
import useAuthStore from "../stores/authStore";
import { ChatSkeleton } from "./common/Skeleton";
import toast from "react-hot-toast";

export default function Chat() {
  const {
    conversations,
    currentConversation,
    messages,
    isLoading,
    fetchConversations,
    fetchMessages,
    sendMessage,
    setCurrentConversation,
    markAsRead,
  } = useChatStore();

  const { user } = useAuthStore();
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Poll for new conversations and unread counts every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchConversations();
    }, 30000); // Refresh every 30 seconds to reduce API calls

    return () => clearInterval(intervalId);
  }, [fetchConversations]);

  // Poll for new messages every 3 seconds
  useEffect(() => {
    if (!currentConversation) return;

    const intervalId = setInterval(() => {
      fetchMessages(currentConversation._id);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentConversation, fetchMessages]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation._id);
      markAsRead(currentConversation._id);
    }
  }, [currentConversation, fetchMessages, markAsRead]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);

    // Typing indicator logic
    if (!isTyping) {
      setIsTyping(true);
      // TODO: Send typing status to server
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      // TODO: Send stop typing status to server
    }, 1000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !currentConversation || isSending) return;

    setIsSending(true);
    setIsTyping(false);

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const result = await sendMessage({
      conversationId: currentConversation._id,
      content: messageInput.trim(),
    });

    if (result.success) {
      setMessageInput("");
      // Refresh messages to show the new message
      await fetchMessages(currentConversation._id);
    }
    setIsSending(false);
  };

  const handleEditMessage = async (messageId, newContent) => {
    if (!currentConversation) return;
    // TODO: Implement API call to edit message
    toast.success("Message edited!");
    setEditingMessage(null);
    fetchMessages(currentConversation._id);
  };

  const handleDeleteMessage = async (messageId) => {
    if (!currentConversation) return;
    // TODO: Implement API call to delete message
    if (window.confirm("Delete this message?")) {
      toast.success("Message deleted!");
      fetchMessages(currentConversation._id);
    }
  };

  const handleReaction = async (messageId, emoji) => {
    if (!currentConversation) return;
    // TODO: Implement API call to add reaction
    toast.success(`Reacted with ${emoji}`);
    setShowEmojiPicker(null);
    fetchMessages(currentConversation._id);
  };

  const handleAttachment = async (file) => {
    // TODO: Implement file upload
    toast.success(`Uploading ${file.name}...`);
    setShowAttachMenu(false);
  };

  const handleConversationClick = (conversation) => {
    setCurrentConversation(conversation);
    setShowSettings(false);
  };

  const handleStartEditName = () => {
    setEditedName(currentConversation?.name || "");
    setIsEditingName(true);
  };

  const handleSaveConversationName = () => {
    // TODO: Implement API call to update conversation name
    toast.success("Conversation name updated!");
    setIsEditingName(false);
    setShowSettings(false);
  };

  if (isLoading && conversations.length === 0) {
    return (
      <div className="chat-page">
        <Header defaultTab="chat">
          <Profile />
        </Header>
        <Body className="chat">
          <ChatSkeleton />
        </Body>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <Header defaultTab="chat">
        <Profile />
      </Header>
      <Body className="chat">
        <div className="chat-container">
          {/* Conversations Sidebar */}
          <ConversationsList
            conversations={conversations}
            currentConversation={currentConversation}
            onConversationClick={handleConversationClick}
            user={user}
          />

          {/* Message Thread */}
          {currentConversation ? (
            <MessageThread
              conversation={currentConversation}
              messages={messages}
              user={user}
              messageInput={messageInput}
              handleInputChange={handleInputChange}
              handleSendMessage={handleSendMessage}
              isSending={isSending}
              messagesEndRef={messagesEndRef}
              showSettings={showSettings}
              setShowSettings={setShowSettings}
              isEditingName={isEditingName}
              setIsEditingName={setIsEditingName}
              editedName={editedName}
              setEditedName={setEditedName}
              onStartEditName={handleStartEditName}
              onSaveName={handleSaveConversationName}
              typingUsers={typingUsers}
              showEmojiPicker={showEmojiPicker}
              setShowEmojiPicker={setShowEmojiPicker}
              editingMessage={editingMessage}
              setEditingMessage={setEditingMessage}
              showAttachMenu={showAttachMenu}
              setShowAttachMenu={setShowAttachMenu}
              onEditMessage={handleEditMessage}
              onDeleteMessage={handleDeleteMessage}
              onReaction={handleReaction}
              onAttachment={handleAttachment}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </Body>
    </div>
  );
}

// Conversations List Component
function ConversationsList({ conversations, currentConversation, onConversationClick, user }) {
  return (
    <div className="conversations-sidebar">
      <div className="conversations-header">
        <h2 className="conversations-title">Messages</h2>
        <span className="conversations-count">{conversations.length}</span>
      </div>

      <div className="conversations-list">
        {conversations.length > 0 ? (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation._id}
              conversation={conversation}
              isActive={currentConversation?._id === conversation._id}
              onClick={() => onConversationClick(conversation)}
              user={user}
            />
          ))
        ) : (
          <div className="no-conversations">
            <span className="material-symbols-outlined">chat_bubble</span>
            <p>No conversations yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Conversation Item Component
function ConversationItem({ conversation, isActive, onClick, user }) {
  // Get conversation display info
  const getConversationInfo = () => {
    if (conversation.type === "group") {
      // For group chats, show conversation name and participant count
      const participantCount = conversation.participants?.length || 0;
      return {
        name: conversation.name || "Group Chat",
        subtitle: `${participantCount} members`,
        avatar: null, // Could add group icon
      };
    } else {
      // For direct chats, show other participant
      const otherParticipant = conversation.participants?.find(
        (p) => p.user?._id !== user?._id
      );

      return {
        name: otherParticipant?.user?.fullName || otherParticipant?.user?.firstName + " " + otherParticipant?.user?.lastName || "User",
        subtitle: otherParticipant?.organization?.name || "Unknown Organization",
        avatar: otherParticipant?.user?.avatarUrl,
      };
    }
  };

  const info = getConversationInfo();
  const lastMessage = conversation.lastMessage;
  const hasUnread = conversation.unreadCount > 0;

  return (
    <div
      className={`conversation-item ${isActive ? "active" : ""} ${hasUnread ? "unread" : ""}`}
      onClick={onClick}
    >
      <div className="conversation-avatar">
        {info.avatar ? (
          <img src={info.avatar} alt={info.name} />
        ) : conversation.type === "group" ? (
          <div className="avatar-placeholder group">
            <span className="material-symbols-outlined">groups</span>
          </div>
        ) : (
          <img src="https://i.pravatar.cc/100" alt={info.name} />
        )}
        {hasUnread && <div className="unread-indicator"></div>}
      </div>

      <div className="conversation-info">
        <div className="conversation-header-row">
          <h4 className="conversation-name">{info.name}</h4>
          {lastMessage && (
            <span className="conversation-time">
              {formatTime(lastMessage.timestamp || lastMessage.createdAt)}
            </span>
          )}
        </div>

        <div className="conversation-subtitle">{info.subtitle}</div>

        <div className="conversation-preview">
          {lastMessage ? (
            <>
              {lastMessage.sender === user?._id && <span className="you-prefix">You: </span>}
              {lastMessage.content || "No messages yet"}
            </>
          ) : (
            "No messages yet"
          )}
        </div>

        {hasUnread && (
          <div className="unread-badge">{conversation.unreadCount}</div>
        )}
      </div>
    </div>
  );
}

// Message Thread Component
function MessageThread({
  conversation,
  messages,
  user,
  messageInput,
  handleInputChange,
  handleSendMessage,
  isSending,
  messagesEndRef,
  showSettings,
  setShowSettings,
  isEditingName,
  setIsEditingName,
  editedName,
  setEditedName,
  onStartEditName,
  onSaveName,
  typingUsers,
  showEmojiPicker,
  setShowEmojiPicker,
  editingMessage,
  setEditingMessage,
  showAttachMenu,
  setShowAttachMenu,
  onEditMessage,
  onDeleteMessage,
  onReaction,
  onAttachment,
}) {
  // Get conversation display info
  const getConversationHeader = () => {
    if (conversation.type === "group") {
      const participantCount = conversation.participants?.length || 0;
      const organizations = [...new Set(conversation.participants?.map(p => p.organization?.name))];

      return {
        name: conversation.name || "Group Chat",
        subtitle: `${participantCount} members from ${organizations.length} organizations`,
        avatar: null,
      };
    } else {
      const otherParticipant = conversation.participants?.find(
        (p) => p.user?._id !== user?._id
      );

      return {
        name: otherParticipant?.user?.fullName || "User",
        subtitle: `${otherParticipant?.user?.role || "User"} at ${otherParticipant?.organization?.name || "Unknown"}`,
        avatar: otherParticipant?.user?.avatarUrl,
        isOnline: otherParticipant?.user?.isOnline || false,
      };
    }
  };

  const headerInfo = getConversationHeader();

  return (
    <div className="message-thread">
      {/* Thread Header */}
      <div className="thread-header">
        <div className="thread-user-info">
          <div className="thread-avatar-container">
            {headerInfo.avatar ? (
              <img
                src={headerInfo.avatar}
                alt={headerInfo.name}
                className="thread-avatar"
              />
            ) : conversation.type === "group" ? (
              <div className="thread-avatar-placeholder group">
                <span className="material-symbols-outlined">groups</span>
              </div>
            ) : (
              <img
                src="https://i.pravatar.cc/100"
                alt={headerInfo.name}
                className="thread-avatar"
              />
            )}
            {conversation.type !== "group" && headerInfo.isOnline && (
              <div className="online-status-indicator"></div>
            )}
          </div>
          <div>
            {isEditingName ? (
              <div className="edit-name-input">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onBlur={onSaveName}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSaveName();
                    if (e.key === "Escape") setIsEditingName(false);
                  }}
                  autoFocus
                  className="name-edit-input"
                />
              </div>
            ) : (
              <h3 className="thread-name">{headerInfo.name}</h3>
            )}
            <p className="thread-role">
              {conversation.type !== "group" && headerInfo.isOnline && (
                <span className="online-text">● Online • </span>
              )}
              {headerInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Settings Menu Button */}
        <div className="thread-actions">
          <button
            className="thread-settings-btn"
            onClick={() => setShowSettings(!showSettings)}
          >
            <span className="material-symbols-outlined">more_vert</span>
          </button>

          {/* Settings Dropdown */}
          {showSettings && (
            <div className="settings-dropdown">
              <button className="settings-option" onClick={onStartEditName}>
                <span className="material-symbols-outlined">edit</span>
                Rename Conversation
              </button>
              <button className="settings-option">
                <span className="material-symbols-outlined">group</span>
                View Members
              </button>
              <button className="settings-option">
                <span className="material-symbols-outlined">notifications_off</span>
                Mute Notifications
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages List */}
      <div className="messages-list">
        {messages.length > 0 ? (
          <>
            {messages.map((message, index) => {
              const prevMessage = index > 0 ? messages[index - 1] : null;
              const showDateDivider = shouldShowDateDivider(message, prevMessage);
              const showSenderInfo = shouldShowSenderInfo(message, prevMessage);

              return (
                <div key={message._id}>
                  {showDateDivider && (
                    <div className="date-divider">
                      <span>{formatDateDivider(message.createdAt)}</span>
                    </div>
                  )}
                  <MessageBubble
                    message={message}
                    isOwn={message.sender?._id === user?._id}
                    showSenderInfo={showSenderInfo}
                    isGroup={conversation.type === "group"}
                    showEmojiPicker={showEmojiPicker}
                    setShowEmojiPicker={setShowEmojiPicker}
                    editingMessage={editingMessage}
                    setEditingMessage={setEditingMessage}
                    onEditMessage={onEditMessage}
                    onDeleteMessage={onDeleteMessage}
                    onReaction={onReaction}
                  />
                </div>
              );
            })}
            {typingUsers.length > 0 && (
              <div className="typing-indicator-container">
                <div className="typing-indicator">
                  <div className="typing-avatar">
                    <img src="https://i.pravatar.cc/50" alt="User" />
                  </div>
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <p className="typing-text">{typingUsers[0]} is typing...</p>
              </div>
            )}
          </>
        ) : (
          <div className="no-messages">
            <span className="material-symbols-outlined">chat</span>
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form className="message-input-form" onSubmit={handleSendMessage}>
        <div className="message-input-actions">
          <button
            type="button"
            className="attachment-button"
            onClick={() => setShowAttachMenu(!showAttachMenu)}
          >
            <span className="material-symbols-outlined">attach_file</span>
          </button>

          {showAttachMenu && (
            <div className="attachment-menu">
              <label className="attachment-option">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files[0] && onAttachment(e.target.files[0])}
                  style={{ display: "none" }}
                />
                <span className="material-symbols-outlined">image</span>
                <span>Photo</span>
              </label>
              <label className="attachment-option">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => e.target.files[0] && onAttachment(e.target.files[0])}
                  style={{ display: "none" }}
                />
                <span className="material-symbols-outlined">description</span>
                <span>Document</span>
              </label>
              <label className="attachment-option">
                <input
                  type="file"
                  onChange={(e) => e.target.files[0] && onAttachment(e.target.files[0])}
                  style={{ display: "none" }}
                />
                <span className="material-symbols-outlined">folder</span>
                <span>File</span>
              </label>
            </div>
          )}
        </div>

        <input
          type="text"
          className="message-input"
          placeholder="Type a message..."
          value={messageInput}
          onChange={handleInputChange}
          disabled={isSending}
        />
        <button
          type="submit"
          className="send-button"
          disabled={!messageInput.trim() || isSending}
        >
          {isSending ? (
            <span className="material-symbols-outlined">hourglass_empty</span>
          ) : (
            <span className="material-symbols-outlined">send</span>
          )}
        </button>
      </form>
    </div>
  );
}

// Message Bubble Component
function MessageBubble({
  message,
  isOwn,
  showSenderInfo,
  isGroup,
  showEmojiPicker,
  setShowEmojiPicker,
  editingMessage,
  setEditingMessage,
  onEditMessage,
  onDeleteMessage,
  onReaction
}) {
  const [showActions, setShowActions] = useState(false);
  const [editText, setEditText] = useState(message.content);
  const readBy = message.readBy?.length || 0;

  const quickEmojis = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

  const handleEdit = () => {
    setEditingMessage(message._id);
    setEditText(message.content);
    setShowActions(false);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== message.content) {
      onEditMessage(message._id, editText.trim());
    }
    setEditingMessage(null);
  };

  return (
    <div
      className={`message-bubble ${isOwn ? "own" : "other"}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {!isOwn && showSenderInfo && (
        <img
          src={message.sender?.avatarUrl || "https://i.pravatar.cc/50"}
          alt={message.sender?.fullName || "User"}
          className="message-avatar"
        />
      )}
      {!isOwn && !showSenderInfo && <div className="message-avatar-spacer"></div>}

      <div className="message-content">
        {!isOwn && showSenderInfo && (
          <span className="message-sender">
            {message.sender?.fullName || message.sender?.firstName + " " + message.sender?.lastName || "User"}
          </span>
        )}

        <div className="message-wrapper">
          {editingMessage === message._id ? (
            <div className="message-edit-container">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit();
                  if (e.key === "Escape") setEditingMessage(null);
                }}
                className="message-edit-input"
                autoFocus
              />
              <div className="message-edit-actions">
                <button onClick={handleSaveEdit} className="save-edit-btn">
                  <span className="material-symbols-outlined">check</span>
                </button>
                <button onClick={() => setEditingMessage(null)} className="cancel-edit-btn">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="message-text">
                {message.content}
                {message.edited && <span className="edited-badge">(edited)</span>}
              </div>

              {/* Reactions */}
              {message.reactions && message.reactions.length > 0 && (
                <div className="message-reactions">
                  {message.reactions.map((reaction, idx) => (
                    <span key={idx} className="reaction-badge">
                      {reaction.emoji} {reaction.count > 1 && reaction.count}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Actions */}
        {showActions && editingMessage !== message._id && (
          <div className="message-quick-actions">
            <button
              className="quick-action-btn"
              onClick={() => setShowEmojiPicker(showEmojiPicker === message._id ? null : message._id)}
              title="React"
            >
              <span className="material-symbols-outlined">add_reaction</span>
            </button>
            {isOwn && (
              <>
                <button
                  className="quick-action-btn"
                  onClick={handleEdit}
                  title="Edit"
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button
                  className="quick-action-btn delete"
                  onClick={() => onDeleteMessage(message._id)}
                  title="Delete"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Emoji Picker */}
        {showEmojiPicker === message._id && (
          <div className="emoji-picker-popup">
            {quickEmojis.map((emoji) => (
              <button
                key={emoji}
                className="emoji-option"
                onClick={() => onReaction(message._id, emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="message-footer">
          <span className="message-time">{formatMessageTime(message.createdAt)}</span>
          {isOwn && (
            <span className="message-status">
              {readBy > 0 ? (
                <span className="material-symbols-outlined read-icon">done_all</span>
              ) : (
                <span className="material-symbols-outlined sent-icon">done</span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="chat-empty-state">
      <span className="material-symbols-outlined empty-icon">chat_bubble</span>
      <h3>Select a conversation</h3>
      <p>Choose a conversation from the list to start messaging</p>
    </div>
  );
}

// Helper functions
function formatTime(timestamp) {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  // Less than 1 minute
  if (diff < 60000) return "Just now";

  // Less than 1 hour
  if (diff < 3600000) {
    const mins = Math.floor(diff / 60000);
    return `${mins}m`;
  }

  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h`;
  }

  // Less than 7 days
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}d`;
  }

  // Format as date
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatMessageTime(timestamp) {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDateDivider(timestamp) {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  }
}

function shouldShowDateDivider(message, prevMessage) {
  if (!prevMessage) return true;

  const messageDate = new Date(message.createdAt).toDateString();
  const prevDate = new Date(prevMessage.createdAt).toDateString();

  return messageDate !== prevDate;
}

function shouldShowSenderInfo(message, prevMessage) {
  if (!prevMessage) return true;

  // Show sender if different from previous message
  if (message.sender?._id !== prevMessage.sender?._id) return true;

  // Show sender if more than 5 minutes apart
  const timeDiff = new Date(message.createdAt) - new Date(prevMessage.createdAt);
  if (timeDiff > 300000) return true;

  return false;
}