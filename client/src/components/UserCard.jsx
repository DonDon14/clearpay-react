import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import '../styles/UserCard.css';

// Role colors constant
const ROLE_COLORS = {
  admin: "#FF6B6B",
  officer: "#4ECDC4",
  staff: "#556270",
  member: "#C7F464",
  guest: "#A8A8A8",
};

// Avatar component with fallback
const Avatar = ({ name, role, profilePicture }) => {
  const initials = name ? name.charAt(0).toUpperCase() : "?";
  const bgColor = ROLE_COLORS[role] || "#999";

  return profilePicture ? (
    <img
      src={profilePicture}
      alt={name || "User"}
      className="avatar"
      onError={(e) => {
        e.target.onerror = null;
        e.target.style.display = "none";
      }}
    />
  ) : (
    <div className="avatar fallback-avatar" style={{ backgroundColor: bgColor }}>
      {initials}
    </div>
  );
};

// Main UserCard
const UserCard = ({ name, email, id, batch, role, profile_picture }) => {
  return (
    <>
      <div className="user-card">
        <div className="top-row">
          <Avatar name={name} role={role} profilePicture={profile_picture} />
          <div className="main-info">
            <h2 className="name">{name}</h2>
            <p className="email">{email}</p>
          </div>
          <div className="actions">
            <button className="icon-btn edit" aria-label="Edit user">
              <MdEdit size={18} />
            </button>
            <button className="icon-btn delete" aria-label="Delete user">
              <MdDelete size={18} />
            </button>
          </div>
        </div>

        <div className="badge-grid">
          <span className="badge">ID: {id}</span>
          <span className="badge">Batch: {batch}</span>
          <span className="badge" style={{ backgroundColor: ROLE_COLORS[role] || "#ccc" }}>
            {role}
          </span>
        </div>
      </div>
    </>
  );
};

export default UserCard;
