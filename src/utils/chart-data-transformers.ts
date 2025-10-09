import type { ShortLinkAnalytics, AgentAnalytics } from '@/types/dashboard'

/**
 * Transform analytics data to chart series format
 * @param analyticsData - Array of analytics data with date and count
 * @param seriesName - Name for the series (default: 'Data')
 * @returns Array of series objects for ApexCharts
 */
export const transformToSeries = (
  analyticsData: ShortLinkAnalytics[],
  seriesName: string = 'Data',
) => {
  if (analyticsData && analyticsData.length > 0) {
    return [
      {
        name: seriesName,
        data: analyticsData.map((item) => parseInt(item.count.toString())),
      },
    ]
  }
  return [
    {
      name: seriesName,
      data: [0],
    },
  ]
}

/**
 * Transform analytics data to chart categories format
 * @param analyticsData - Array of analytics data with date and count
 * @param dateFormat - Date format options (default: { month: 'short', day: 'numeric' })
 * @returns Array of formatted date strings for chart categories
 */
export const transformToCategories = (
  analyticsData: ShortLinkAnalytics[],
  dateFormat: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' },
) => {
  if (analyticsData && analyticsData.length > 0) {
    return analyticsData.map((item) => {
      const date = new Date(item.date)
      return date.toLocaleDateString('en-US', dateFormat)
    })
  }
  return ['No Data']
}

/**
 * Transform analytics data to both series and categories
 * @param analyticsData - Array of analytics data with date and count
 * @param seriesName - Name for the series (default: 'Data')
 * @param dateFormat - Date format options (default: { month: 'short', day: 'numeric' })
 * @returns Object containing series and categories
 */
export const transformAnalyticsData = (
  analyticsData: ShortLinkAnalytics[],
  seriesName: string = 'Data',
  dateFormat: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' },
) => {
  return {
    series: transformToSeries(analyticsData, seriesName),
    categories: transformToCategories(analyticsData, dateFormat),
  }
}

/**
 * Create multiple series from different analytics data
 * @param dataSets - Array of objects containing analytics data and series name
 * @returns Array of series objects for ApexCharts
 */
export const createMultipleSeries = (
  dataSets: Array<{
    data: ShortLinkAnalytics[]
    name: string
  }>,
) => {
  return dataSets.map(({ data, name }) => ({
    name,
    data: data && data.length > 0 ? data.map((item) => parseInt(item.count.toString())) : [0],
  }))
}

/**
 * Get date range from analytics data
 * @param analyticsData - Array of analytics data with date and count
 * @returns Object with start and end dates
 */
export const getDateRange = (analyticsData: ShortLinkAnalytics[]) => {
  if (!analyticsData || analyticsData.length === 0) {
    return { startDate: null, endDate: null }
  }

  const dates = analyticsData.map((item) => new Date(item.date))
  const startDate = new Date(Math.min(...dates.map((date) => date.getTime())))
  const endDate = new Date(Math.max(...dates.map((date) => date.getTime())))

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  }
}

/**
 * Fill missing dates in analytics data
 * @param analyticsData - Array of analytics data with date and count
 * @param startDate - Start date for the range
 * @param endDate - End date for the range
 * @returns Array with filled missing dates (count = 0)
 */
export const fillMissingDates = (
  analyticsData: ShortLinkAnalytics[],
  startDate: string,
  endDate: string,
): ShortLinkAnalytics[] => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const result: ShortLinkAnalytics[] = []

  // Create a map of existing data for quick lookup
  const dataMap = new Map(
    analyticsData.map((item) => [new Date(item.date).toISOString().split('T')[0], item]),
  )

  // Iterate through each day in the range
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const dateString = date.toISOString().split('T')[0]
    const existingData = dataMap.get(dateString)

    if (existingData) {
      result.push(existingData)
    } else {
      result.push({
        date: date.toISOString(),
        count: 0,
      })
    }
  }

  return result
}

/**
 * Calculate total count from analytics data
 * @param analyticsData - Array of analytics data with date and count
 * @returns Total count
 */
export const calculateTotalCount = (analyticsData: ShortLinkAnalytics[]): number => {
  if (!analyticsData || analyticsData.length === 0) {
    return 0
  }

  return analyticsData.reduce((total, item) => total + parseInt(item.count.toString()), 0)
}

/**
 * Get peak date from analytics data
 * @param analyticsData - Array of analytics data with date and count
 * @returns Object with peak date and count
 */
export const getPeakData = (analyticsData: ShortLinkAnalytics[]) => {
  if (!analyticsData || analyticsData.length === 0) {
    return { date: null, count: 0 }
  }

  const peakItem = analyticsData.reduce((peak, current) => {
    const currentCount = parseInt(current.count.toString())
    const peakCount = parseInt(peak.count.toString())
    return currentCount > peakCount ? current : peak
  })

  return {
    date: new Date(peakItem.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    count: parseInt(peakItem.count.toString()),
  }
}

// ===== AGENT ANALYTICS TRANSFORMERS =====

/**
 * Transform agent analytics data to pie chart series format
 * @param agentData - Array of agent analytics data with name and count
 * @returns Array of numbers for pie chart series
 */
export const transformAgentToSeries = (agentData: AgentAnalytics[]): number[] => {
  if (agentData && agentData.length > 0) {
    return agentData.map((item) => parseInt(item.count.toString()))
  }
  return [0]
}

/**
 * Transform agent analytics data to pie chart labels format
 * @param agentData - Array of agent analytics data with name and count
 * @returns Array of strings for pie chart labels
 */
export const transformAgentToLabels = (agentData: AgentAnalytics[]): string[] => {
  if (agentData && agentData.length > 0) {
    return agentData.map((item) => item.name || 'Other')
  }
  return ['No Data']
}

/**
 * Transform agent analytics data to pie chart colors
 * @param agentData - Array of agent analytics data with name and count
 * @param customColors - Optional custom color array
 * @returns Array of colors for pie chart
 */
export const transformAgentToColors = (
  agentData: AgentAnalytics[],
  customColors?: string[],
): string[] => {
  const defaultColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#EC4899', // Pink
    '#6B7280', // Gray
  ]

  const colors = customColors || defaultColors
  const dataLength = agentData ? agentData.length : 0

  return colors.slice(0, Math.max(dataLength, 1))
}

/**
 * Transform agent analytics data to complete pie chart format
 * @param agentData - Array of agent analytics data with name and count
 * @param customColors - Optional custom color array
 * @returns Object containing series, labels, and colors for pie chart
 */
export const transformAgentToPieChart = (agentData: AgentAnalytics[], customColors?: string[]) => {
  return {
    series: transformAgentToSeries(agentData),
    labels: transformAgentToLabels(agentData),
    colors: transformAgentToColors(agentData, customColors),
  }
}

/**
 * Get top N agents by count
 * @param agentData - Array of agent analytics data with name and count
 * @param limit - Number of top agents to return (default: 5)
 * @returns Array of top N agents
 */
export const getTopAgents = (agentData: AgentAnalytics[], limit: number = 5): AgentAnalytics[] => {
  if (!agentData || agentData.length === 0) {
    return []
  }

  return agentData
    .map((item) => ({
      ...item,
      name: item.name || 'Other',
    }))
    .sort((a, b) => parseInt(b.count.toString()) - parseInt(a.count.toString()))
    .slice(0, limit)
}

/**
 * Calculate percentage distribution for agent analytics
 * @param agentData - Array of agent analytics data with name and count
 * @returns Array of agents with percentage added
 */
export const calculateAgentPercentages = (agentData: AgentAnalytics[]) => {
  if (!agentData || agentData.length === 0) {
    return []
  }

  const total = agentData.reduce((sum, item) => sum + parseInt(item.count.toString()), 0)

  return agentData.map((item) => ({
    ...item,
    name: item.name || 'Other',
    percentage: total > 0 ? (parseInt(item.count.toString()) / total) * 100 : 0,
  }))
}
