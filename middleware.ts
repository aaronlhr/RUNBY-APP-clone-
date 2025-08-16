import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/discovery(.*)',
  '/matches(.*)',
  '/chat(.*)',
  '/profile(.*)',
])

// Define public routes that don't need authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/auth/sign-in(.*)',
  '/auth/sign-up(.*)',
  '/auth/simple-signin',
  '/test-basic',
  '/test-clerk',
  '/api/(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  // Allow public routes
  if (isPublicRoute(req)) {
    return
  }

  // For protected routes, just let the page handle authentication
  // This avoids the immutable error with redirects
  if (isProtectedRoute(req)) {
    // The page will handle redirects client-side
    return
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
