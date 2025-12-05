import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Auth.css'; // <--- Import the CSS file

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/login', formData);
      localStorage.setItem('token', response.data.token);

      const role = response.data.user.role; // Get user role from response
      
      setMessage({ text: 'Login Successful! Redirecting...', type: 'success' });
      
      // TODO: Later we will check the role to decide where to redirect!
      setTimeout(() => {
        if (role === 'admin' || role === 'officer') {
          navigate('/admin/dashboard');
        } else if (role === 'member') {
          navigate('/member/dashboard');
        } else if (role === 'superadmin') {
          navigate('/superadmin/dashboard');
        }
      }, 1500);

    } catch (error) {
        const errorMsg = error.response?.data?.message || 'Server Error';
        setMessage({ text: errorMsg, type: 'error' });
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login to Clearpay</h2>
      
      {message.text && (
        <div className={`auth-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <input 
          className="auth-input"
          type="email" 
          name="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
        <input 
          className="auth-input"
          type="password" 
          name="password" 
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
        />
        <button type="submit" className="auth-button btn-success">
          Login
        </button>
      </form>
      
      <p style={{textAlign: 'center', marginTop: '15px'}}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;