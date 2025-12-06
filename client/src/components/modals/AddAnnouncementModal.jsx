import React, { useState, useEffect } from 'react';
import { editAnnouncement, addAnnouncement } from '../../api/announcements';
import '../../styles/AddAnnouncementModal.css';

const AddMemberModal = ( {isOpen, onClose, onSuccess, initialData}) => {
    const [formData, setFormData] = useState({
      title: '',
      text: '',
      type: 'general',
      priority: 'low',
      target_audience: 'all'
    });

    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          title: '',
          text: '',
          type: 'general',
          priority: 'low',
          target_audience: 'all'
        });
      }
      setError('');
    }, [isOpen, initialData]);
    
    if (!isOpen) return null;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            
            if (initialData) {
                // UPDATE
                await editAnnouncement(token, initialData.id, formData);
                alert('Announcement Updated Successfully!');
            } else {
                // CREATE
                await addAnnouncement(token, formData);
                alert('Announcement Posted Successfully!');
            }
            
            onSuccess();
            onClose();
            } catch (err) {
            setError(err.response?.data?.message || 'Error saving announcement');
            }
        };
    
    return (
        <div className= 'modal-overlay'>
        <div className='modal-content'>
            <div className='modal-header'>
                <h3>Post New Announcement</h3>
                <button className="modal-close" onClick={onClose}>&times;</button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form className="modal-form" onSubmit={handleSubmit}>
              <input type="text" name="title" placeholder="Title (e.g. No Classes Tomorrow)" value={formData.title} onChange={handleChange} required/>
              <textarea
                name="text" placeholder="Write the details here..." rows="4" value={formData.text} onChange={handleChange} required/>
              <div className='modal-tags'>
                <select className='dropdown-tags' name="type" value={formData.type} onChange={handleChange}>
                  <option value="general">General</option>
                  <option value="event">Event</option>
                  <option value="urgent">Urgent</option>
                  <option value="maintenance">Maintenance</option>
                </select>
                <select className='dropdown-tags' name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                <select className='dropdown-tags' name="target_audience" value={formData.target_audience} onChange={handleChange}>
                  <option value="all">Everyone</option>
                  <option value="members">Members Only</option>
                  <option value="staff">Staff Only</option>
                </select>
              </div>
              <div className='btn-container'>
                  <button className="btn-submit" type="submit">
                    Post Announcement
                  </button>
              </div>
            </form>
        </div>
      </div>
    );
    
}

export default AddMemberModal;