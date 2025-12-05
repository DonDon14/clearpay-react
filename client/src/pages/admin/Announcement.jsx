import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminAnnouncements() {
  // 1. STATE
  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    type: 'general',          // Default value
    priority: 'low',          // Default value
    target_audience: 'all'    // Default value
  });

  // 2. FETCH EXISTING (The Read Logic)
  const fetchAnnouncements = async () => {
    try {
      // Note: This route is public based on your code, so no token needed for GET (optional)
      const res = await axios.get('http://localhost:5000/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      console.error('Error fetching announcements');
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // 3. HELPER: Handle Input Changes
  // This one function handles ALL inputs!
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. SUBMIT (The Create Logic)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/announcements', formData, {
        headers: { token }
      });
      
      setMessage('✅ Announcement Posted!');
      setFormData({ title: '', text: '', type: 'general', priority: 'low', target_audience: 'all' }); // Reset form
      fetchAnnouncements(); // Refresh the list below
      
    } catch (err) {
      setMessage('❌ Error creating announcement');
    }
  };

  return (
    <div className="admin-container">
      <h2>📢 Manage Announcements</h2>
      
      {/* LEFT: CREATE FORM */}
      <div style={{ background: '#fff', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '40px' }}>
        <h3>Post New Announcement</h3>
        {message && <p style={{ fontWeight: 'bold' }}>{message}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '600px' }}>
          
          <input 
            type="text" 
            name="title" 
            placeholder="Title (e.g. No Classes Tomorrow)" 
            value={formData.title} 
            onChange={handleChange} 
            required 
            style={{ padding: '10px' }}
          />

          <textarea 
            name="text" 
            placeholder="Write the details here..." 
            rows="4"
            value={formData.text} 
            onChange={handleChange} 
            required 
            style={{ padding: '10px' }}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <select name="type" value={formData.type} onChange={handleChange} style={{ padding: '10px', flex: 1 }}>
              <option value="general">General</option>
              <option value="event">Event</option>
              <option value="urgent">Urgent</option>
              <option value="maintenance">Maintenance</option>
            </select>

            <select name="priority" value={formData.priority} onChange={handleChange} style={{ padding: '10px', flex: 1 }}>
              <option value="low">Low Priority</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            <select name="target_audience" value={formData.target_audience} onChange={handleChange} style={{ padding: '10px', flex: 1 }}>
              <option value="all">Everyone</option>
              <option value="members">Members Only</option>
              <option value="staff">Staff Only</option>
            </select>
          </div>

          <button type="submit" style={{ padding: '12px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            Post Announcement
          </button>
        </form>
      </div>

      {/* RIGHT: PREVIEW LIST */}
      <div>
        <h3>📜 Recent Announcements</h3>
        {announcements.map(ann => (
          <div key={ann.id} style={{ background: '#f9f9f9', padding: '15px', borderLeft: '5px solid #007bff', marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>{ann.title}</h4>
              <small style={{ color: '#666' }}>{new Date(ann.created_at).toLocaleDateString()}</small>
            </div>
            <p style={{ margin: 0 }}>{ann.text}</p>
            <div style={{ marginTop: '10px', fontSize: '12px' }}>
              <span style={{ background: '#eee', padding: '2px 6px', marginRight: '5px' }}>{ann.type}</span>
              <span style={{ background: '#eee', padding: '2px 6px' }}>{ann.priority}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default AdminAnnouncements;