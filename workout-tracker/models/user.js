import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the schema for User
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,  // Ensure the username is unique
  },
  password: {
    type: String,
    required: true,  // Password is required
  },
});

// Hash password before saving the user to ensure passwords are stored securely
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();  // Only hash if password is modified or new

  try {
    // Generate a salt and hash the password with the salt
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();  // Proceed with saving the user
  } catch (error) {
    next(error);  // Pass the error to the next middleware (for error handling)
  }
});

// Method to compare entered password with hashed password in the database
userSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);  // Compare hashed passwords
  } catch (error) {
    throw new Error('Error comparing passwords');  // Error handling for password comparison
  }
};

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

export default User;