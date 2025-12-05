import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MemberDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]); 
  const [payments, setPayments] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]); // <--- 1. NEW: Add State
  
  // Payment Form State
  const [selectedFee, setSelectedFee] = useState('');
  const [amount, setAmount] = useState('');
  const [refCode, setRefCode] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  // 1. Fetch ALL data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { token: token } };

        const profileRes = await axios.get('http://localhost:5000/dashboard', config);
        const catsRes = await axios.get('http://localhost:5000/categories'); 
        const historyRes = await axios.get('http://localhost:5000/payments/my-history', config);
        
        // <--- 2. NEW: Fetch Payment Methods
        const methodsRes = await axios.get('http://localhost:5000/payment-methods', config); 

        setUser(profileRes.data);
        setCategories(catsRes.data);
        setPayments(historyRes.data);
        setPaymentMethods(methodsRes.data); // <--- 3. NEW: Save to State
        
      } catch (error) {
        console.error(error);
        // optional: only redirect if it's a 401/403, otherwise just log error
        if(error.response && error.response.status === 403) {
            localStorage.removeItem('token');
            navigate('/login');
        }
      }
    };
    fetchData();
  }, [navigate]);

  // ... (rest of your handles are perfect) ...
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFee || !file) {
      setMessage('Please select a fee and upload a file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('category_id', selectedFee);
      formData.append('amount', amount);
      formData.append('reference_code', refCode);
      formData.append('proof', file); 

      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/payments', formData, {
        headers: { 
          'token': token,
          'Content-Type': 'multipart/form-data' 
        }
      });

      setMessage('Payment Uploaded Successfully! 🚀');
      const historyRes = await axios.get('http://localhost:5000/payments/my-history', { headers: { token } });
      setPayments(historyRes.data);
      setRefCode(''); setFile(null);

    } catch (err) {
      console.error(err);
      setMessage('Upload Failed');
    }
  };

  if (!user) return <div>Loading...</div>;

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/login'); };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>👋 Hello, {user.name}</h1>
      {/* We removed the logout button here because the Sidebar handles it now! */}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        
        {/* LEFT COLUMN */}
        <div>
            {/* PAYMENT METHODS SECTION */}
            <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <h3>How to Pay:</h3>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                    {paymentMethods.map(method => (
                    <div key={method.id} style={{ background: 'white', padding: '10px', borderRadius: '5px', minWidth: '200px', border: '1px solid #ccc' }}>
                        <strong>{method.name}</strong>
                        <div style={{ fontSize: '14px' }}>{method.account_number}</div>
                        {method.qr_code_file && (
                        <img src={`http://localhost:5000/uploads/${method.qr_code_file}`} width="100%" style={{marginTop:'5px', maxHeight:'150px', objectFit:'contain'}} alt="QR" />
                        )}
                    </div>
                    ))}
                </div>
            </div>
            
            {/* PAYMENT FORM */}
            <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px' }}>
                <h2>💸 Make a Payment</h2>
                {message && <p style={{color:'green'}}>{message}</p>}
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <label>Select Fee:</label>
                    <select 
                    value={selectedFee} 
                    onChange={(e) => {
                        setSelectedFee(e.target.value);
                        const cat = categories.find(c => c.id == e.target.value);
                        if(cat) setAmount(cat.amount);
                    }}
                    required
                    style={{padding:'10px'}}
                    >
                    <option value="">-- Choose what to pay --</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name} - ${cat.amount}</option>
                    ))}
                    </select>

                    <label>Amount Paid:</label>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{padding:'10px'}} />

                    <label>Reference Code (GCash/Bank Ref):</label>
                    <input type="text" value={refCode} onChange={e => setRefCode(e.target.value)} placeholder="e.g. REF123456" style={{padding:'10px'}} />

                    <label>Upload Screenshot:</label>
                    <input type="file" onChange={handleFileChange} accept="image/*" required />

                    <button type="submit" style={{padding:'10px', background:'green', color:'white', border:'none'}}>Submit Payment</button>
                </form>
            </div>
        </div>

        {/* RIGHT: History */}
        <div>
          <h2>📜 My Payment History</h2>
          {payments.length === 0 ? <p>No payments yet.</p> : (
            <ul style={{listStyle:'none', padding:0}}>
              {payments.map(p => (
                <li key={p.id} style={{borderBottom:'1px solid #eee', padding:'10px 0'}}>
                  <strong>{p.category_name}</strong> - ${p.amount} <br/>
                  <span style={{
                    backgroundColor: p.status === 'approved' ? '#d4edda' : p.status === 'pending' ? '#fff3cd' : '#f8d7da',
                    padding: '2px 8px', borderRadius: '4px', fontSize: '12px'
                  }}>
                    {p.status.toUpperCase()}
                  </span>
                  <br/>
                  <small>Ref: {p.reference_code}</small>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default MemberDashboard;