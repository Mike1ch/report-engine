function SkeletonBox({ width, height, style }) {
  return (
    <div style={{
      width: width || '100%',
      height: height || '20px',
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      borderRadius: '6px',
      animation: 'shimmer 1.5s infinite',
      ...style
    }} />
  )
}

function DashboardSkeleton() {
  return (
    <div>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px', marginBottom: '24px'
      }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            background: 'white', borderRadius: '12px',
            padding: '20px', border: '1px solid #e5e9f0'
          }}>
            <SkeletonBox height="12px" width="60%" style={{ marginBottom: '12px' }} />
            <SkeletonBox height="28px" width="80%" style={{ marginBottom: '8px' }} />
            <SkeletonBox height="10px" width="40%" />
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        {[1,2].map(i => (
          <div key={i} style={{
            background: 'white', borderRadius: '12px',
            padding: '20px', border: '1px solid #e5e9f0'
          }}>
            <SkeletonBox height="14px" width="50%" style={{ marginBottom: '8px' }} />
            <SkeletonBox height="10px" width="70%" style={{ marginBottom: '20px' }} />
            <SkeletonBox height="180px" />
          </div>
        ))}
      </div>

      <div style={{
        background: 'white', borderRadius: '12px',
        padding: '20px', border: '1px solid #e5e9f0'
      }}>
        <SkeletonBox height="14px" width="40%" style={{ marginBottom: '8px' }} />
        <SkeletonBox height="10px" width="60%" style={{ marginBottom: '20px' }} />
        <SkeletonBox height="120px" />
      </div>
    </div>
  )
}

export { DashboardSkeleton }