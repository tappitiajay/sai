import bcrypt from 'bcryptjs';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { z } from 'zod';


const app = express();
// Middleware
app.use(express.json());
app.use(cors());

// JWT Secret
const SECRET = 'SECr3t';

// Connect to MongoDB
mongoose.connect('mongodb+srv://ajay8374877:83Wt5M4D7kaARp8G@cluster0.dwaghd5.mongodb.net/', {
  dbName: 'UserDataBase'
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose schemas
const userSchemaLogin = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
});

// Creating the mongoose model
const UserLogin = mongoose.model('UserLogin', userSchemaLogin);

// User schema
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  password: { type: String, required: true },
});

// User model
const User = mongoose.model('User', UserSchema);


// Zod schema for validation
const userSchema = z.object({
  firstName: z.string().min(3, 'First Name is required'),
  lastName: z.string().min(4, 'Last Name is required'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits'),
  state: z.string().min(5, 'State is required'),
  city: z.string().min(3, 'City is required'),
  address: z.string().min(10, 'Address is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

// Middleware for JWT authentication
const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};


// User signup route
app.post('/users/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await UserLogin.findOne({ username, email });
    if (user) {
      // If user already exists, generate a token
      const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'UserLogin already exists', token });
    } else {
      // Create a new user and generate a token
      const newUser = new UserLogin({ username, email, password });
      await newUser.save();
      const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'UserLogin created successfully', token });
    }
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User registration route with authentication
app.post('/api/users/register', authenticateJwt, async (req, res) => {
  try {
    // Validate user details input with Zod
    const validatedData = userSchema.parse(req.body);

    // Check if email already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password and create a new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);
    const newUser = new User({ ...validatedData, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
