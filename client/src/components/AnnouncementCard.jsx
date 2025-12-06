import React from "react";
import { deleteAnnouncement, editAnnouncement } from '../api/announcements'; 
import { MdEdit, MdDelete } from "react-icons/md";
import '../styles/AnnouncementCard.css';


const AnnouncementCard = ({ data, onEdit, onDeleteSuccess }) => {
  const { id, title, text, type, priority, target_audience } = data;


  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const token = localStorage.getItem('token');
      await deleteAnnouncement(token, id);
      alert('Announcement deleted successfully!');
      if(onDeleteSuccess) onDeleteSuccess();
    } catch (err) {
      alert('Error deleting announcement');
    }
  };

  const handleEdit = (ann) => {
    setSelectedAnnouncement(ann);
    setIsAddModalOpen(true);
  };
  return (
    <>
      <div className="card-container">
        <div className="user-card">
          <div className="top-row">
            <div>
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
            <div className="actions">
              <button onClick={onEdit}className="icon-btn edit" aria-label="Edit user">
                <MdEdit size={18} />
              </button>
              <button onClick={handleDelete} className="icon-btn delete" aria-label="Delete user">
                <MdDelete size={18} />
              </button>
            </div>
          </div>
          <div className="badge-grid">
        
            <span className="badge">{type}</span>
            <span className="badge">{priority}</span>
            <span className="badge">{target_audience}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnnouncementCard;
