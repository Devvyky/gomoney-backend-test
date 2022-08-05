import mongoose, { Schema, HookNextFunction } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import validator from 'validator';

import { User, UserRoles } from '../interfaces';

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: UserRoles,
    default: UserRoles.User,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
});

// INSTANCE METHOD TO HASH PASSWORD DURING USER SIGNUP
userSchema.pre('save', async function (next: HookNextFunction) {
  const user = this as User;

  // Only run this function if password was actually modified
  if (!user.isModified('password')) return next();

  // Hash the password with cost of 12
  user.password = await bcrypt.hash(user.password, 12);

  next();
});

// Instance method to check if incoming password matches existing user password during user login
userSchema.methods.correctPassword = async function (
  incomingPassword,
  userPassword
) {
  return await bcrypt.compare(incomingPassword, userPassword);
};

const User = mongoose.model<User>('User', userSchema);

export default User;
