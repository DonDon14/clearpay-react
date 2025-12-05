import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentMethods = () => {
  const [methods, setMethods] = useState([]);
  const [form, setForm] = useState({ name: '', account_name: '', account_number: '', instructions: '' });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/payment-methods', { headers: { token } });
    setMethods(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (file) formData.append('qr_code', file);

    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/payment-methods', formData, {
      headers: { token, 'Content-Type': 'multipart/form-data' }
    });
    alert('Method Added!');
    fetchMethods();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>💳 Payment Channels</h1>
      
      {/* Form */}
      <div style={{ background: '#fff', padding: '20px', marginBottom: '20px', borderRadius: '8px' }}>
        <h3>Add New Channel</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', maxWidth: '500px' }}>
          <input placeholder="Channel Name (e.g. GCash)" onChange={e => setForm({...form, name: e.target.value})} required style={{padding:'10px'}}/>
          <input placeholder="Account Name" onChange={e => setForm({...form, account_name: e.target.value})} required style={{padding:'10px'}}/>
          <input placeholder="Account Number" onChange={e => setForm({...form, account_number: e.target.value})} required style={{padding:'10px'}}/>
          <textarea placeholder="Instructions" onChange={e => setForm({...form, instructions: e.target.value})} style={{padding:'10px'}}/>
          <label>Upload QR Code (Optional):</label>
          <input type="file" onChange={e => setFile(e.target.files[0])} accept="image/*" />
          <button type="submit" style={{ padding: '10px', background: 'blue', color: 'white' }}>Save Channel</button>
        </form>
      </div>

      {/* List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {methods.map(m => (
          <div key={m.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {m.qr_code_file && (
                <img src={`http://localhost:5000/uploads/${m.qr_code_file}`} alt="QR" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
              )}
              <div>
                <h3 style={{ margin: 0 }}>{m.name}</h3>
                <p style={{ margin: '5px 0' }}>{m.account_number}</p>
                <small>{m.account_name}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;