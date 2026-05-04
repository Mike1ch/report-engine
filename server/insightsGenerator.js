async function generateInsights(metrics) {
  require('dotenv').config()
  const Groq = require('groq-sdk')
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const prompt = `
You are a business data analyst. Analyze this sales data and give 4 clear, specific insights.
Each insight should be 1-2 sentences. Be direct and mention actual numbers.

Data:
- Total Revenue: N${metrics.totalRevenue.toLocaleString()}
- Total Orders: ${metrics.totalOrders}
- Average Order Value: N${Math.round(metrics.avgOrderValue).toLocaleString()}
- Top Region: ${metrics.topRegion}

Revenue by Region:
${metrics.regionChartData.map(r => '- ' + r.name + ': N' + r.value.toLocaleString()).join('\n')}

Revenue by Product:
${metrics.categoryChartData.map(c => '- ' + c.name + ': N' + c.value.toLocaleString()).join('\n')}

Orders by Status:
${metrics.statusChartData.map(s => '- ' + s.name + ': ' + s.value + ' orders').join('\n')}

Return ONLY a JSON array of 4 insight objects like this:
[
  { "title": "insight title", "text": "insight explanation with numbers", "type": "positive" },
  { "title": "insight title", "text": "insight explanation with numbers", "type": "warning" },
  { "title": "insight title", "text": "insight explanation with numbers", "type": "info" },
  { "title": "insight title", "text": "insight explanation with numbers", "type": "tip" }
]
Types must be one of: positive, warning, info, tip
Return ONLY the JSON array, nothing else.
`

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 800,
  })

  const content = response.choices[0].message.content.trim()
  const parsed = JSON.parse(content)
  return parsed
}

module.exports = { generateInsights }
