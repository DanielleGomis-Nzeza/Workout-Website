import mongoose from 'mongoose';

// Define the schema for a workout
const workoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  description: { type: String, required: true }
});

// Create a model based on the schema
const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;
