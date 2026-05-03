export function processData(rows) {
  if (!rows || rows.length === 0) return null

  const amountKey = Object.keys(rows[0]).find((key) =>
    ['amount', 'revenue', 'sales', 'total', 'price'].includes(key.toLowerCase())
  )
  const regionKey = Object.keys(rows[0]).find((key) =>
    ['region', 'city', 'location', 'area'].includes(key.toLowerCase())
  )
  const categoryKey = Object.keys(rows[0]).find((key) =>
    ['product', 'category', 'item', 'type'].includes(key.toLowerCase())
  )
  const statusKey = Object.keys(rows[0]).find((key) =>
    ['status', 'state', 'result'].includes(key.toLowerCase())
  )

  const totalRevenue = rows.reduce((sum, row) => {
    return sum + (parseFloat(row[amountKey]) || 0)
  }, 0)

  const totalOrders = rows.length
  const avgOrderValue = totalRevenue / totalOrders

  const byRegion = {}
  rows.forEach((row) => {
    const region = row[regionKey] || 'Unknown'
    byRegion[region] = (byRegion[region] || 0) + (parseFloat(row[amountKey]) || 0)
  })

  const byCategory = {}
  rows.forEach((row) => {
    const cat = row[categoryKey] || 'Unknown'
    byCategory[cat] = (byCategory[cat] || 0) + (parseFloat(row[amountKey]) || 0)
  })

  const byStatus = {}
  rows.forEach((row) => {
    const status = row[statusKey] || 'Unknown'
    byStatus[status] = (byStatus[status] || 0) + 1
  })

  const topRegion = Object.entries(byRegion).sort((a, b) => b[1] - a[1])[0][0]

  const regionChartData = Object.entries(byRegion)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const categoryChartData = Object.entries(byCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const statusChartData = Object.entries(byStatus)
    .map(([name, value]) => ({ name, value }))

  return {
    totalRevenue,
    totalOrders,
    avgOrderValue,
    topRegion,
    byRegion,
    byCategory,
    byStatus,
    regionChartData,
    categoryChartData,
    statusChartData,
    columns: Object.keys(rows[0]),
    rawRows: rows,
  }
}
