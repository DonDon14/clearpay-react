import React, { useEffect, useState } from 'react';
import { deleteAnnouncement, getAnnouncements } from '../../api/announcements'; 
import AddAnnouncementModal from '../../components/modals/AddAnnouncementModal';


function AdminAnnouncements() {
  // 1. STATE
  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    type: 'general',          
    priority: 'low',          
    target_audience: 'all'    
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // 2. FETCH EXISTING (The Read Logic)
  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await getAnnouncements(token);
      setAnnouncements(data);
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
      await addAnnouncement(token, formData);
      alert('Announcement added successfully!')
      
      setMessage('✅ Announcement Posted!');
      setFormData({ title: '', text: '', type: 'general', priority: 'low', target_audience: 'all' }); // Reset form
      fetchAnnouncements(); // Refresh the list below
      
    } catch (err) {
      setMessage('❌ Error creating announcement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const token = localStorage.getItem('token');
      await deleteAnnouncement(token, id);
      alert('Announcement deleted successfully!');
      fetchAnnouncements();
    } catch (err) {
      alert('Error deleting announcement');
    }
  };

  const handleEdit = (ann) => {
    setSelectedAnnouncement(ann);
    setIsAddModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedAnnouncement(null);
    setIsAddModalOpen(true);
  };



  return (
    <div className="admin-container">
      <h2>📢 Manage Announcements</h2>
      
      {/* LEFT: CREATE FORM */}
      

      {/* RIGHT: PREVIEW LIST */}
      <div>
        <h3>📜 Recent Announcements</h3>
        <div className='admin-controls'>
          <p>Manage announcements</p>
          <button onClick={handleCreate} className="btn-add">➕ Add New Announcement</button>
        </div>
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
        <AddAnnouncementModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={fetchAnnouncements}
          initialData={selectedAnnouncement} // <--- Pass the data here!
        />
    </div>
  );
}

export default AdminAnnouncements;