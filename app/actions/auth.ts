'use server'

import { hash, compare } from 'bcrypt';
import User from '@/models/User';
import clientPromise from '@/lib/db';

export async function signUp(formData: FormData) {
  await clientPromise; // Ensure the database connection is established

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, message: 'User already exists' };
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return { success: true, message: 'Sign up successful!' };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, message: 'An error occurred during sign up' };
  }
}

export async function signIn(formData: FormData) {
  await clientPromise; // Ensure the database connection is established

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Compare passwords
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: 'Invalid credentials' };
    }

    return { success: true, message: 'Sign in successful!' };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, message: 'An error occurred during sign in' };
  }
}

