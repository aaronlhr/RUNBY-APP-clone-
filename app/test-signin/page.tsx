'use client'

import { SignIn } from "@clerk/nextjs"

export default function TestSignInPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-4">Test Sign In Page</h1>
      
      <div className="mb-4">
        <p>Testing Clerk SignIn component...</p>
      </div>

      <div className="border border-gray-300 p-4 rounded">
        <SignIn />
      </div>
    </div>
  )
}
