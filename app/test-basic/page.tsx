export default function TestBasicPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f0f9ff', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '12px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '16px' 
        }}>
          Basic Test Page
        </h1>
        <p style={{ 
          color: '#6b7280', 
          marginBottom: '24px' 
        }}>
          If you can see this, React is working!
        </p>
        <div style={{ 
          backgroundColor: '#3b82f6', 
          color: 'white', 
          padding: '12px 24px', 
          borderRadius: '8px', 
          display: 'inline-block',
          fontWeight: '600'
        }}>
          Success! 🎉
        </div>
      </div>
    </div>
  )
}
