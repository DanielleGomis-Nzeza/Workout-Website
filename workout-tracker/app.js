// Import required modules
import express from 'express'; // Express framework for routing and handling requests
import mongoose from 'mongoose'; // Mongoose to interact with MongoDB
import dotenv from 'dotenv'; // To load environment variables from .env file
import bodyParser from 'body-parser'; // To parse incoming request data
import workoutRoutes from './routes/workouts.js'; // Import workout routes for handling workout-related requests
import authRoutes from './middleware/auth.js'; // Import authentication routes
import path from 'path'; // Path module for handling file paths

// Load environment variables from .env file
dotenv.config(); // Ensures that environment variables are available from .env

// Create Express app
const app = express();

// Middleware setup
app.use(express.json()); // Parse JSON data in requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data (e.g., form submissions)
app.set('view engine', 'ejs'); // Set view engine to EJS for rendering templates
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files (CSS, images, etc.)

// MongoDB URI from environment variables (or default to localhost)
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/workout-tracker';

// Connect to MongoDB using the URI stored in environment variables
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
  }
};

// Connect to the database when the server starts
connectDB(); // Calling connectDB function

// Use routes for handling requests related to workouts and authentication
app.use('/workouts', workoutRoutes); // All routes under /workouts will use workoutRoutes
app.use('/auth', authRoutes); // All routes under /auth will use authRoutes (authentication)

// Routes
// Home Page Route (Splash or Landing Page)
app.get('/', (req, res) => {
  res.render('index'); // Renders the index.ejs template as the home page
});

// Start the server and listen on the specified port
const PORT = process.env.PORT || 9001; // Use the PORT from .env or default to 9001
app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});

// Add a timeout for long startup
server.setTimeout(50000); // 50 seconds