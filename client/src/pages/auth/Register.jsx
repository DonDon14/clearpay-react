import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Auth.css';

function Register() {
  const navigate = useNavigate();
  
  // 1. Updated State to include new student fields
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',            // <--- NEW
    department: '', // <--- NEW
    batch: '',       // <--- NEW
    password: ''
  });

  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // The backend will now automatically set the role to 'student'
      const response = await axios.post('http://localhost:5000/auth/register', formData);
      
      // Auto-login logic (saving the token immediately)
      localStorage.setItem('token', response.data.token);
      
      setMessage({ text: 'Registration Successful! Redirecting...', type: 'success' });
      
      // Redirect to the Student Dashboard
      setTimeout(() => {
        navigate('/member/dashboard');
      }, 1500);

    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Server Error';
      setMessage({ text: errorMsg, type: 'error' });
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Member Registration</h2>
      
      {message.text && (
        <div className={`auth-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        {/* Basic Info */}
        <input 
          className="auth-input" type="text" name="name" placeholder="Full Name" 
          value={formData.name} onChange={handleChange} required 
        />
        <input 
          className="auth-input" type="text" name="username" placeholder="Member ID / Username" 
          value={formData.username} onChange={handleChange} required 
        />
        
        {/* Contact Info */}
        <input 
          className="auth-input" type="email" name="email" placeholder="Email Address" 
          value={formData.email} onChange={handleChange} required 
        />
        <input 
          className="auth-input" type="text" name="phone" placeholder="Phone Number" 
          value={formData.phone} onChange={handleChange} required 
        />

        {/* Academic Info */}
        <select 
          className="auth-input" name="department" 
          value={formData.department} onChange={handleChange} required
        >
          <option value="">Select Department</option>
          <option value="BSIT">BS Information Technology</option>
          <option value="BSCS">BS Computer Science</option>
          <option value="BSEd">Education</option>
          {/* Add more departments as needed */}
        </select>

        <select 
          className="auth-input" name="year_level" 
          value={formData.year_level} onChange={handleChange} required
        >
          <option value="">Select Year Level</option>
          <option value="Batch 1">Batch 1</option>
          <option value="Batch 2">Batch 2</option>
          <option value="Batch 3">Batch 3</option>
          <option value="Regular">Regular</option>
          <option value="VIP">VIP</option>
        </select>

        <input 
          className="auth-input" type="password" name="password" placeholder="Password" 
          value={formData.password} onChange={handleChange} required 
        />

        <button type="submit" className="auth-button btn-primary">
          Register Account
        </button>
      </form>
      
      <p style={{textAlign: 'center', marginTop: '15px'}}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;