'use client'

import { useUser } from '@clerk/nextjs'

export default function TestClerkPage() {
  const { isLoaded, isSignedIn, user } = useUser()

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-4">Clerk Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <strong>isLoaded:</strong> {String(isLoaded)}
        </div>
        <div>
          <strong>isSignedIn:</strong> {String(isSignedIn)}
        </div>
        <div>
          <strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'No user'}
        </div>
      </div>

      <div className="mt-8">
        <a href="/auth/sign-in" className="text-blue-600 hover:underline">
          Go to Sign In
        </a>
      </div>
    </div>
  )
}
