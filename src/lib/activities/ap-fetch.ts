import * as cheerio from 'cheerio'
import { Activity, ActivityType, ActivityZone } from '@/lib/activities/types'

export async function fetchActivities(
  userId: string,
  startDate: Date,
  endDate: Date,
): Promise<Activity[]> {
  const activities: Activity[] = []
  
  // Normalize dates to start of day for comparison
  const normalizedStartDate = new Date(startDate)
  normalizedStartDate.setHours(0, 0, 0, 0)
  
  const normalizedEndDate = new Date(endDate)
  normalizedEndDate.setHours(0, 0, 0, 0)
  
  let currentDate = normalizedEndDate

  while (currentDate >= normalizedStartDate) {
    const url = `https://www.attackpoint.org/viewlog.jsp/user_${userId}/period-7/enddate-${currentDate.toISOString().split('T')[0]}`

    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)

    $('.tlactivity').each((_, element) => {
      const $el = $(element)

      // Skip comment-only activities (those without actual workout data)
      const hasWorkoutData = $el.find('p').length > 0
      if (!hasWorkoutData) {
        return
      }

      // Get activity date from parent .tlday h3
      const $tlday = $el.closest('.tlday')
      // Try to get date from h3 a first, then fall back to h3 text directly
      let dateText = $tlday.find('h3 a').first().text().trim()
      if (!dateText) {
        dateText = $tlday.find('h3').first().text().trim()
      }
      
      const date = parseDate(dateText)

      if (date >= normalizedStartDate && date <= normalizedEndDate) {
        // Extract activity details
        const title = $el.find('b').first().text()
        const description = $el.find('.descrow.descrowtype0').first().text().trim() || undefined

        // Get duration and distance - look for span with xclass attribute
        const durationText = $el.find('span[xclass="i0"]').text()
        const distanceMatch = $el
          .find('p')
          .text()
          .match(/(\d+\.?\d*)\s*km/)
        const distance = distanceMatch ? distanceMatch[1] : null

        // Get elevation gain
        const elevationSpan = $el.find('span[title="climb"]')
        const elevationText = elevationSpan.text()
        const elevationMatch = elevationText.match(/\+(\d+)m/)
        const elevationGain = elevationMatch ? parseInt(elevationMatch[1]) : undefined

        // Map activity type
        let type: ActivityType = 'other'
        const lowerTitle = title.toLowerCase()
        if (lowerTitle.includes('swimming')) {
          type = 'other'
        } else if (lowerTitle.includes('cycling') || lowerTitle.includes('bike')) {
          type = 'bike'
        } else if (lowerTitle.includes('orienteering')) {
          type = 'orienteering'
        } else if (lowerTitle.includes('run')) {
          type = 'run'
        } else if (lowerTitle.includes('conditioning')) {
          type = 'strength'
        } else if (lowerTitle.includes('hiking')) {
          type = 'other'
        }

        // Parse duration
        const duration = parseDuration(durationText)

        // Calculate intensity based on heart rate and/or pace
        let intensityMatch = $el.find('svg.ichart title').text()
        
        // If no SVG chart, try to get intensity from strong element
        if (!intensityMatch) {
          intensityMatch = $el.find('strong').attr('title') || ''
        }
        
        let intensity: Record<ActivityZone, number>
        let calculatedIntensity: number

        if (intensityMatch && intensityMatch.includes('intensity:')) {
          const zones = intensityMatch.match(/\(([^)]+)\)/g) || []
          const zoneIntensity: Record<ActivityZone, number> = {
            Z0: 0, Z1: 0, Z2: 0, Z3: 0, Z4: 0, Z5: 0
          }

          let totalIntensity = 0
          zones.forEach((zone) => {
            const [time, level] = zone.slice(1, -1).split('@')
            const zoneSeconds = parseDuration(time.trim())
            const zoneLevel = parseInt(level)

            // Map zone level to zone name
            const zoneName = `Z${zoneLevel}` as ActivityZone
            if (zoneName in zoneIntensity) {
              zoneIntensity[zoneName] = zoneSeconds
            }

            totalIntensity += Math.pow(zoneSeconds, 0.75) * zoneLevel
          })

          intensity = zoneIntensity
          calculatedIntensity = Math.round(totalIntensity / 10)
        } else {
          // If no intensity data, use duration * 1
          calculatedIntensity = Math.round(Math.pow(duration, 0.75) / 10)
          // Create empty zone intensity record
          intensity = {
            Z0: 0, Z1: 0, Z2: 0, Z3: 0, Z4: 0, Z5: 0
          }
        }

        // Get link to activity details
        const dayViewUrl = `https://www.attackpoint.org/viewlog.jsp/user_${userId}/period-1/enddate-${date.toISOString().split('T')[0]}`

        // Build metadata object
        const metadata: Record<string, string> = {}
        if (distance) {
          metadata['Distance'] = `${distance}km`
        }
        if (durationText) {
          metadata['Duration'] = durationText
        }

        activities.push({
          date,
          title,
          description,
          href: dayViewUrl,
          type,
          duration,
          distance: distance ? parseFloat(distance) : undefined,
          elevationGain,
          intensity,
          calculatedIntensity,
          metadata,
        })
      }
    })

    // Move back 7 days
    currentDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000)
  }

  const filteredActivities = activities.filter((activity) => {
    const isValidIntensity = typeof activity.intensity === 'object' && activity.intensity !== null
    const isValidTitle = activity.title !== '' && activity.title !== null
    const isValidCalculatedIntensity = typeof activity.calculatedIntensity === 'number' && !isNaN(activity.calculatedIntensity)
    
    return isValidIntensity && isValidTitle && isValidCalculatedIntensity
  })

  return filteredActivities
}

function parseDuration(durationText: string): number {
  // Handle hours:minutes:seconds format
  const timeParts = durationText.split(':')
  let seconds = 0
  
  if (timeParts.length === 3) {
    // Hours:Minutes:Seconds
    seconds =
      parseInt(timeParts[0]) * 3600 + parseInt(timeParts[1]) * 60 + parseInt(timeParts[2])
  } else if (timeParts.length === 2) {
    // Minutes:Seconds
    const [mins, secs = '0'] = timeParts
    seconds = parseInt(mins) * 60 + parseInt(secs)
  } else {
    // Just seconds
    seconds = parseInt(timeParts[0])
  }
  
  return seconds
}

function parseDate(dateText: string): Date {
  // Example input: "Wednesday Nov 19 #" or "Sunday Dec 8"
  // Extract month and day, skipping day of week
  const match = dateText.match(/(\w+)\s+(\w+)\s+(\d+)/)
  
  if (match) {
    // Format: "DayOfWeek Month Day"
    const [_, dayOfWeek, month, day] = match
    const currentYear = new Date().getFullYear()
    const date = new Date(`${month} ${day} ${currentYear}`)
    
    // Handle year boundary cases
    if (date > new Date()) {
      date.setFullYear(currentYear - 1)
    }
    
    // Set to start of day to avoid time comparison issues
    date.setHours(0, 0, 0, 0)
    
    return date
  }
  
  // Fallback to old format: "Month Day"
  const fallbackMatch = dateText.match(/(\w+)\s+(\d+)/)
  if (fallbackMatch) {
    const [_, month, day] = fallbackMatch
    const currentYear = new Date().getFullYear()
    const date = new Date(`${month} ${day} ${currentYear}`)
    
    if (date > new Date()) {
      date.setFullYear(currentYear - 1)
    }
    
    date.setHours(0, 0, 0, 0)
    return date
  }
  
  return new Date()
}

