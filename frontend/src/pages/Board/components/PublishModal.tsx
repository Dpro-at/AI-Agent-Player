import React, { useState } from "react";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId?: string;
  boardName: string;
  boardId: string;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  agentId,
  boardName,
  boardId
}) => {
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      alert("Please enter a product description");
      return;
    }
    setIsSubmitting(true);
    
    setTimeout(() => {
      alert("Product published successfully to marketplace!");
      setIsSubmitting(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      backdropFilter: "blur(4px)"
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        width: "500px",
        maxWidth: "90vw",
        padding: "24px",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
      }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: "22px", 
          fontWeight: "700",
          color: "#333",
          marginBottom: "20px"
        }}>
          Publish {agentId ? "Agent" : "Board"} to Marketplace
        </h2>
        
        <div>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: "600",
            color: "#333"
          }}>
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your board/agent functionality..."
            style={{
              width: "100%",
              minHeight: "100px",
              padding: "12px",
              border: "2px solid #e9ecef",
              borderRadius: "8px",
              fontSize: "14px",
              resize: "vertical",
              outline: "none"
            }}
          />
        </div>

        <div style={{ 
          display: "flex", 
          gap: "12px", 
          justifyContent: "flex-end",
          marginTop: "24px"
        }}>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            style={{
              background: "none",
              border: "2px solid #6c757d",
              borderRadius: "8px",
              padding: "10px 20px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "600",
              color: "#6c757d"
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !description.trim()}
            style={{
              background: isSubmitting ? "#6c757d" : "#667eea",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 24px",
              cursor: (isSubmitting || !description.trim()) ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            {isSubmitting ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
};
