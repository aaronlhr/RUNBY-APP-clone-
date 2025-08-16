'use client'

import { SignIn } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export default function SignInPage() {
  const [clerkLoaded, setClerkLoaded] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    
    // Progressive loading for mobile devices
    const checkClerkLoaded = () => {
      const elapsed = Date.now() - startTime;
      setLoadingTime(elapsed);
      
      // Try to detect if Clerk is loaded
      if (typeof window !== 'undefined' && window.Clerk) {
        setClerkLoaded(true);
        return;
      }
      
      // Fallback: show after 2 seconds or when Clerk is detected
      if (elapsed > 2000) {
        setClerkLoaded(true);
        return;
      }
      
      // Check again in 100ms
      setTimeout(checkClerkLoaded, 100);
    };
    
    checkClerkLoaded();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            Welcome to RUNBY
          </h1>
          <p style={{
            color: '#6b7280'
          }}>
            Sign in to find your running partner
          </p>
        </div>
        
        {!clerkLoaded ? (
          <div style={{
            backgroundColor: 'white',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '2px solid transparent',
              borderTop: '2px solid #2563eb',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{
              color: '#6b7280',
              marginBottom: '8px'
            }}>
              Loading sign-in form...
            </p>
            <p style={{
              fontSize: '12px',
              color: '#9ca3af'
            }}>
              {loadingTime > 0 ? `${Math.round(loadingTime / 1000)}s` : 'Starting...'}
            </p>
          </div>
        ) : (
          <SignIn 
            appearance={{
              baseTheme: undefined,
              variables: {
                colorPrimary: '#2563eb',
                colorBackground: '#ffffff',
                colorInputBackground: '#ffffff',
                colorInputText: '#1f2937',
                colorText: '#1f2937',
                colorTextSecondary: '#6b7280',
                borderRadius: '8px',
                fontFamily: 'Inter, system-ui, sans-serif',
              },
              elements: {
                rootBox: 'mx-auto',
                card: 'shadow-xl border-0 rounded-lg',
                headerTitle: 'text-2xl font-bold text-gray-900',
                headerSubtitle: 'text-gray-600',
                formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors w-full',
                formFieldInput: 'border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full',
                footerActionLink: 'text-blue-600 hover:text-blue-700 font-medium',
                formFieldLabel: 'text-sm font-medium text-gray-700 mb-1',
                formFieldLabelRow: 'mb-2',
                dividerLine: 'bg-gray-200',
                dividerText: 'text-gray-500 text-sm',
                socialButtonsBlockButton: 'border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors',
                socialButtonsBlockButtonText: 'text-gray-700 font-medium',
              },
            }}
            redirectUrl="/discovery"
          />
        )}
      </div>
    </div>
  );
}
