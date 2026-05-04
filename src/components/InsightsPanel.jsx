function InsightsPanel({ insights, loading }) {
  const colors = {
    positive: { bg: '#E1F5EE', border: '#1D9E75', icon: '??' },
    warning: { bg: '#FAEEDA', border: '#BA7517', icon: '??' },
    info: { bg: '#E6F1FB', border: '#3266ad', icon: '??' },
    tip: { bg: '#FAECE7', border: '#993C1D', icon: '??' },
  }

  if (loading) {
    return (
      <div style={{
        background: '#fff',
        border: '1px solid #e5e5e5',
        borderRadius: '10px',
        padding: '32px',
        textAlign: 'center',
        marginTop: '16px'
      }}>
        <p style={{ color: '#999', fontSize: '14px' }}>
          Generating AI insights...
        </p>
      </div>
    )
  }

  if (!insights || insights.length === 0) return null

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e5e5',
      borderRadius: '10px',
      padding: '20px',
      marginTop: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600' }}>AI Insights</h3>
        <span style={{
          fontSize: '11px',
          background: '#E1F5EE',
          color: '#0F6E56',
          padding: '3px 8px',
          borderRadius: '4px',
          fontWeight: '500'
        }}>Powered by Groq</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {insights.map((insight, i) => {
          const style = colors[insight.type] || colors.info
          return (
            <div key={i} style={{
              display: 'flex',
              gap: '12px',
              padding: '14px',
              background: style.bg,
              borderRadius: '8px',
              borderLeft: '3px solid ' + style.border,
            }}>
              <span style={{ fontSize: '20px' }}>{style.icon}</span>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
                  {insight.title}
                </p>
                <p style={{ fontSize: '13px', color: '#444', lineHeight: '1.55' }}>
                  {insight.text}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default InsightsPanel
