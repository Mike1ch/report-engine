function LandingPage({ onGetStarted }) {
  const features = [
    { icon: "folder", title: "CSV and Excel Upload", desc: "Drag and drop any CSV or Excel file. We handle the parsing automatically." },
    { icon: "chart", title: "Instant Dashboard", desc: "Beautiful charts appear instantly - bar charts, pie charts, line trends and more." },
    { icon: "AI", title: "AI Insights", desc: "Groq AI analyzes your data and gives you 4 smart business insights with real numbers." },
    { icon: "PDF", title: "PDF Export", desc: "Download a clean, professional PDF report ready to share with your team or clients." }
  ]
  const steps = [
    { step: "01", title: "Upload your file", desc: "Drop any CSV or Excel file into the uploader" },
    { step: "02", title: "View your dashboard", desc: "Charts and metrics are generated automatically" },
    { step: "03", title: "Export your report", desc: "Download a PDF or get AI insights instantly" }
  ]
  const stats = [
    { value: "CSV + Excel", label: "File formats" },
    { value: "4 Charts", label: "Visualization types" },
    { value: "AI Insights", label: "Powered by Groq" },
    { value: "Free", label: "No signup needed" }
  ]
  return (
    <div style={{ minHeight: "100vh", background: "#0f1923", color: "white", fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", borderBottom: "1px solid #1e2d3d", position: "sticky", top: 0, background: "#0f1923", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", background: "#1D9E75", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "16px" }}>R</div>
          <span style={{ fontWeight: "700", fontSize: "16px" }}>Report Engine</span>
        </div>
        <button onClick={onGetStarted} style={{ background: "#1D9E75", color: "white", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>Get Started Free</button>
      </nav>
      <div style={{ textAlign: "center", padding: "80px 20px 60px", maxWidth: "760px", margin: "0 auto" }}>
        <div style={{ display: "inline-block", background: "#1e2d3d", border: "1px solid #1D9E75", borderRadius: "20px", padding: "6px 16px", fontSize: "12px", color: "#1D9E75", fontWeight: "600", marginBottom: "24px" }}>POWERED BY GROQ AI</div>
        <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: "800", lineHeight: "1.15", marginBottom: "20px" }}>Turn your data into beautiful reports</h1>
        <p style={{ fontSize: "18px", color: "#6b7a8d", lineHeight: "1.7", marginBottom: "36px", maxWidth: "520px", margin: "0 auto 36px" }}>Upload a CSV or Excel file and get instant charts, AI-powered insights, and a professional PDF report in seconds.</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onGetStarted} style={{ background: "#1D9E75", color: "white", border: "none", borderRadius: "10px", padding: "14px 28px", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>Try it free - no signup needed</button>
          <button onClick={onGetStarted} style={{ background: "none", color: "white", border: "1px solid #1e2d3d", borderRadius: "10px", padding: "14px 28px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>See how it works</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", maxWidth: "960px", margin: "0 auto", padding: "0 20px 60px" }}>
        {features.map(function(feature, i) {
          return (
            <div key={i} style={{ background: "#131f2e", border: "1px solid #1e2d3d", borderRadius: "12px", padding: "24px" }}>
              <div style={{ width: "44px", height: "44px", background: "#1D9E75", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", color: "white", marginBottom: "14px" }}>{feature.icon}</div>
              <h3 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "8px" }}>{feature.title}</h3>
              <p style={{ fontSize: "13px", color: "#6b7a8d", lineHeight: "1.6" }}>{feature.desc}</p>
            </div>
          )
        })}
      </div>
      <div style={{ background: "#131f2e", borderTop: "1px solid #1e2d3d", borderBottom: "1px solid #1e2d3d", padding: "60px 20px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>How it works</h2>
          <p style={{ color: "#6b7a8d", marginBottom: "48px", fontSize: "15px" }}>From raw data to professional report in 3 steps</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "32px" }}>
            {steps.map(function(item, i) {
              return (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#1D9E75", fontWeight: "700", letterSpacing: "0.1em", marginBottom: "12px" }}>{item.step}</div>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "8px" }}>{item.title}</h3>
                  <p style={{ fontSize: "13px", color: "#6b7a8d", lineHeight: "1.6" }}>{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div style={{ padding: "60px 20px", maxWidth: "760px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "24px", textAlign: "center" }}>
          {stats.map(function(stat, i) {
            return (
              <div key={i}>
                <p style={{ fontSize: "22px", fontWeight: "800", color: "#1D9E75", marginBottom: "4px" }}>{stat.value}</p>
                <p style={{ fontSize: "12px", color: "#6b7a8d" }}>{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ background: "#131f2e", borderTop: "1px solid #1e2d3d", padding: "60px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "12px" }}>Ready to try it?</h2>
        <p style={{ color: "#6b7a8d", marginBottom: "28px", fontSize: "15px" }}>No account needed. Just upload your file and go.</p>
        <button onClick={onGetStarted} style={{ background: "#1D9E75", color: "white", border: "none", borderRadius: "10px", padding: "14px 32px", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>Launch the app</button>
      </div>
      <div style={{ borderTop: "1px solid #1e2d3d", padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "24px", height: "24px", background: "#1D9E75", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "12px" }}>R</div>
          <span style={{ fontSize: "13px", color: "#4a5568" }}>Report Engine</span>
        </div>
        <p style={{ fontSize: "12px", color: "#4a5568" }}>Built with React, Node.js, and Groq AI</p>
      </div>
    </div>
  )
}

export default LandingPage
