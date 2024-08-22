import axios from 'axios';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import './form.css';

const statesAndCities = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"],
  "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro", "Pasighat"],
  "Assam": ["Guwahati", "Dibrugarh", "Silchar", "Jorhat"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
  "Chhattisgarh": ["Raipur", "Bilaspur", "Durg", "Korba"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  "Haryana": ["Gurgaon", "Faridabad", "Panipat", "Ambala"],
  "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Solan"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubli-Dharwad"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
  "Manipur": ["Imphal", "Churachandpur", "Thoubal", "Ukhrul"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongstoin"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Puri"],
  "Punjab": ["Chandigarh", "Amritsar", "Ludhiana", "Jalandhar"],
  "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur", "Kota"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Nainital", "Rishikesh"],
  "West Bengal": ["Kolkata", "Darjeeling", "Siliguri", "Asansol"]
};
const FormData = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    state: '',
    city: '',
    address: '',
    pincode: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData({ ...formData, state: selectedState });
    setCities(statesAndCities[selectedState] || []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/users/register', formData);
      console.log('Response:', response.data);
      setErrors({});

      // clear the form data after register
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        state: '',
        city: '',
        address: '',
        pincode: '',
        password: '',
      });

      toast.success('Registration successfully done!');
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const validationErrors = {};
        error.response.data.errors.forEach((err) => {
          validationErrors[err.path[0]] = err.message;
        });
        setErrors(validationErrors);
      } else {
        console.error('Server Error:', error.response.data);
      }
    }
  };

  return (
    <>
    <h1>Registration Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="name-row">
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <br />
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <p className="error">{errors.email}</p>}
        <br />
        <label>Mobile:</label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          required
        />
        {errors.mobile && <p className="error">{errors.mobile}</p>}
        <br />
        <label>State:</label>
        <select name="state" value={formData.state} onChange={handleStateChange} required>
          <option value="">Select State</option>
          {Object.keys(statesAndCities).map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        {errors.state && <p className="error">{errors.state}</p>}
        <br />
        <label>City:</label>
        <select
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          disabled={!formData.state}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        {errors.city && <p className="error">{errors.city}</p>}
        <br />
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        {errors.address && <p className="error">{errors.address}</p>}
        <br />
        <label>Pincode:</label>
        <input
          type="text"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          required
        />
        {errors.pincode && <p className="error">{errors.pincode}</p>}
        <br />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <p className="error">{errors.password}</p>}
        <br />
        <button type="submit">Register</button>
      </form>
      <ToastContainer />
    </>
  );
};

export default FormData;
