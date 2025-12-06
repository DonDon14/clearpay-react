import React, { useEffect, useState } from 'react';
import { deleteAnnouncement, getAnnouncements, addAnnouncement } from '../../api/announcements'; 
import AddAnnouncementModal from '../../components/modals/AddAnnouncementModal';
import AnnouncementCard from '../../components/AnnouncementCard';


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

  const handleCreate = () => {
    setSelectedAnnouncement(null);
    setIsAddModalOpen(true);
  };

  const handleEditClick = (announcement) => {
    setSelectedAnnouncement(announcement);
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

      
          <div className='announcement-grid'>
            {announcements.map(ann => (
              <AnnouncementCard
                data={ann}
                key={ann.id}
                id={ann.id}
                title={ann.title}
                text={ann.text}
                type={ann.type}
                priority={ann.priority}
                target_audience={ann.target_audience}
                onDeleteSuccess={fetchAnnouncements}
                onEdit={() => handleEditClick(ann)}
              />
            ))}
            <AddAnnouncementModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onSuccess={fetchAnnouncements}
              initialData={selectedAnnouncement} // <--- Pass the data here!
            />
          </div>
      </div>
        
        <style>{`
    
          .announcement-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 60px;
            margin-top: 20px;
            margin-left: 20px;
          }
          
          `}

        </style>
    </div>
  );
}

export default AdminAnnouncements;