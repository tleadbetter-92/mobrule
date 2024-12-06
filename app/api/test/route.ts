import { NextResponse } from 'next/server'
import clientPromise from '@/lib/db'
import User from '@/models/User'

export async function GET() {
  try {
    await clientPromise
    // This will create a test user in your database
    const testUser = new User({
      email: 'test@example.com',
      password: 'testpassword'
    })
    await testUser.save()
    return NextResponse.json({ message: 'Database connection successful and test user created' })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({ error: 'Failed to connect to the database' }, { status: 500 })
  }
}

