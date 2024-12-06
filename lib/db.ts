[V0_FILE]typescript:file="app/layout.tsx" isEdit="true" isMerged="true"
import '@/app/globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Politics Site',
  description: 'A simple politics site with authentication',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

export const runtime = 'nodejs'

[V0_FILE]typescriptreact:file="app/page.tsx" isMerged="true"
import SignUpForm from '@/components/sign-up-form'
import SignInForm from '@/components/sign-in-form'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex w-full max-w-4xl justify-between gap-8">
        <SignUpForm />
        <SignInForm />
      </div>
    </main>
  )
}

[V0_FILE]typescript:file="app/actions/auth.ts" isEdit="true" isMerged="true"
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

[V0_FILE]typescriptreact:file="components/sign-up-form.tsx" isEdit="true" isQuickEdit="true" isMerged="true"
'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { signUp } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignUpForm() {
  const [state, formAction] = useActionState(signUp, null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = (formData: FormData) => {
    setIsPending(true)
    formAction(formData)
    setIsPending(false)
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input id="signup-email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input id="signup-password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Signing up...' : 'Sign Up'}
          </Button>
        </CardFooter>
      </form>
      {state?.message && (
        <p className="text-center mt-4 text-sm text-green-600">{state.message}</p>
      )}
    </Card>
  )
}

[V0_FILE]typescriptreact:file="components/sign-in-form.tsx" isEdit="true" isQuickEdit="true" isMerged="true"
'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { signIn } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignInForm() {
  const [state, formAction] = useActionState(signIn, null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = (formData: FormData) => {
    setIsPending(true)
    formAction(formData)
    setIsPending(false)
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signin-email">Email</Label>
            <Input id="signin-email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signin-password">Password</Label>
            <Input id="signin-password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Signing in...' : 'Sign In'}
          </Button>
        </CardFooter>
      </form>
      {state?.message && (
        <p className="text-center mt-4 text-sm text-green-600">{state.message}</p>
      )}
    </Card>
  )
}

[V0_FILE]typescript:file="models/User.ts" isMerged="true"
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);

[V0_FILE]typescript:file="lib/db.ts" isEdit="true"
import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

let clientPromise: Promise<typeof mongoose>;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongoose = global as typeof globalThis & {
    mongoose: Promise<typeof mongoose>;
  };
  if (!globalWithMongoose.mongoose) {
    globalWithMongoose.mongoose = mongoose.connect(uri);
  }
  clientPromise = globalWithMongoose.mongoose;
} else {
  clientPromise = mongoose.connect(uri);
}

export default clientPromise;
