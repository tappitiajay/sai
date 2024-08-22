import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated hook
import { ToastContainer, toast } from 'react-toastify';
import './form.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/users/signup', formData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      toast.success('Registration successful! Redirecting...');

      // Redirect to the FormData page
      setTimeout(() => {
        navigate('/formdata'); // Adjust this path as needed
      }, 2000); // Delay to show toast message
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="signup-container">
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Signup;
