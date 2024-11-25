import express from 'express';
import Workout from '../models/workout.js';
import authMiddleware from '../middleware/auth.js';  // Import the authentication middleware

const router = express.Router();

// View All Workouts (accessible by anyone)
router.get('/', async (req, res) => {
  try {
    // Fetch all workouts from the database
    const workouts = await Workout.find();  
    // Render the 'workouts' view and pass the fetched workout data to it
    res.render('workouts', { workouts });
  } catch (error) {
    console.error('Error fetching workouts:', error);  // Log error details
    res.status(500).send('Error fetching workouts');  // Send error response
  }
});

// Add New Workout (only authenticated users can add)
router.get('/new', authMiddleware, (req, res) => {
  // Render the 'newWorkout' form view, allowing only authenticated users
  res.render('newWorkout');
});

// Handle New Workout Submission (only authenticated users can add)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, duration, description } = req.body;  // Extract form data

    // Create a new workout document and save it to the database
    const newWorkout = new Workout({ name, duration, description });
    await newWorkout.save();  // Save workout to MongoDB

    // After saving, redirect the user to the list of workouts
    res.redirect('/workouts');
  } catch (error) {
    console.error('Error adding workout:', error);  // Log errors to the console
    res.status(500).send('Error adding workout');  // Return an error response
  }
});

// Render the form for editing a workout (only authenticated users can edit)
router.get('/:id/edit', authMiddleware, async (req, res) => {
  const { id } = req.params;  // Extract workout ID from URL parameters

  try {
    // Find the workout by its ID from MongoDB
    const workout = await Workout.findById(id);

    // If the workout doesn't exist, send a 404 response
    if (!workout) {
      return res.status(404).send('Workout not found');
    }

    // Render the 'edit' form with the workout data for editing
    res.render('edit', { workout });
  } catch (error) {
    console.error('Error fetching workout for editing:', error);
    res.status(500).send('Error fetching workout for editing');
  }
});

// Update Workout (only authenticated users can update)
router.post('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;  // Extract the workout ID from URL parameters
  const { name, duration, description } = req.body;  // Extract updated data from form

  try {
    // Update the workout with the new data
    const updatedWorkout = await Workout.findByIdAndUpdate(
      id,
      { name, duration, description },  // Fields to update
      { new: true }  // Return the updated workout document
    );

    // If the workout doesn't exist, send a 404 response
    if (!updatedWorkout) {
      return res.status(404).send('Workout not found');
    }

    // After updating, redirect to the workouts list
    res.redirect('/workouts');
  } catch (error) {
    console.error('Error updating workout:', error);
    res.status(500).send('Error updating workout');
  }
});

// Delete Workout (only authenticated users can delete)
router.get('/:id/delete', authMiddleware, async (req, res) => {
  const { id } = req.params;  // Extract workout ID from URL parameters

  try {
    // Find the workout by ID and delete it from the database
    const deletedWorkout = await Workout.findByIdAndDelete(id);

    // If the workout doesn't exist, send a 404 response
    if (!deletedWorkout) {
      return res.status(404).send('Workout not found');
    }

    // After deletion, redirect to the workouts list
    res.redirect('/workouts');
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).send('Error deleting workout');
  }
});

// Export the router to use in the main app
export default router;