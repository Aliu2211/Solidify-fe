import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { initializeSocket, disconnectSocket } from '../../services/socket';
import useChatStore from '../../stores/chatStore';
import useAuthStore from '../../stores/authStore';
import toast from 'react-hot-toast';

export default function SocketManager() {
  const { user } = useAuthStore();
  const { addMessage, addConversation } = useChatStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    console.log("SocketManager: Initializing socket...");
    const socket = initializeSocket();

    if (socket) {
      // Remove existing listeners to avoid duplicates if component remounts
      socket.off("new_message");
      socket.off("conversation_created");

      socket.on("new_message", (message) => {
        console.log("SocketManager: New message received", message);
        addMessage(message);

        // Show notification if not on chat page
        if (location.pathname !== '/chat') {
          const senderName = message.sender?.firstName || "Someone";
          toast((t) => (
            <div 
              onClick={() => {
                toast.dismiss(t.id);
                navigate('/chat', { state: { conversationId: message.conversation } });
              }}
              style={{ cursor: 'pointer' }}
            >
              <b>{senderName} sent a message</b>
              <div style={{ fontSize: '0.9em', marginTop: '4px' }}>
                {message.content.substring(0, 50)}
                {message.content.length > 50 ? '...' : ''}
              </div>
            </div>
          ), {
            duration: 5000,
            icon: '💬',
          });
        }
      });

      socket.on("conversation_created", (data) => {
        console.log("SocketManager: New conversation created", data);
        addConversation(data.conversation);
        
        if (location.pathname !== '/chat') {
          toast.success(`New conversation created with ${data.conversation.name || 'a group'}`);
        }
      });
    }

    return () => {
      // We don't necessarily want to disconnect on unmount if we want it persistent,
      // but if the user logs out (user becomes null), we should.
      // For now, let's keep it alive unless user changes.
    };
  }, [user, addMessage, addConversation, location.pathname, navigate]);

  // Disconnect when user logs out
  useEffect(() => {
    if (!user) {
      disconnectSocket();
    }
  }, [user]);

  return null; // This component doesn't render anything
}
