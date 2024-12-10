import * as cheerio from 'cheerio'
import { Activity, ActivityType } from '@/lib/activities/types'

export async function fetchActivities(
  userId: string,
  startDate: Date,
  endDate: Date,
): Promise<Activity[]> {
  const activities: Activity[] = []
  let currentDate = endDate

  while (currentDate >= startDate) {
    const url = `https://www.attackpoint.org/viewlog.jsp/user_${userId}/period-7/enddate-${currentDate.toISOString().split('T')[0]}`

    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)

    $('.tlactivity').each((_, element) => {
      const $el = $(element)

      // Get activity date from parent .tlday h3
      const dateText = $el.closest('.tlday').find('h3 a').text()
      const date = parseDate(dateText)

      if (date >= startDate && date <= endDate) {
        // Extract activity details
        const title = $el.find('b').first().text()
        const description = $el.find('.descrowtype0').html() ?? undefined

        // Get duration and distance
        const durationText = $el.find('[xclass="i0"]').text()
        const distanceMatch = $el
          .find('p')
          .text()
          .match(/(\d+\.?\d*)\s*km/)
        const distance = distanceMatch ? distanceMatch[1] : null

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

        // Calculate intensity based on heart rate and/or pace
        const intensityMatch = $el.find('svg.ichart title').text()
        let intensity: number

        if (intensityMatch) {
          const zones = intensityMatch.match(/\(([^)]+)\)/g) || []

          let totalIntensity = 0
          zones.forEach((zone) => {
            const [time, level] = zone.slice(1, -1).split('@')

            // Handle hours:minutes:seconds format
            const timeParts = time.trim().split(':')
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
            const zoneLevel = parseInt(level)

            totalIntensity += Math.pow(seconds, 0.75) * zoneLevel
          })

          intensity = Math.round(totalIntensity / 10)
        } else {
          // If no intensity data, use duration * 1
          const durationText = $el.find('[xclass="i0"]').text()
          const timeParts = durationText.split(':')
          let totalSeconds = 0

          if (timeParts.length === 3) {
            // Hours:Minutes:Seconds
            totalSeconds =
              parseInt(timeParts[0]) * 3600 + parseInt(timeParts[1]) * 60 + parseInt(timeParts[2])
          } else {
            // Minutes:Seconds
            const [mins, secs = '0'] = timeParts
            totalSeconds = parseInt(mins) * 60 + parseInt(secs)
          }

          intensity = Math.round(Math.pow(totalSeconds, 0.75) / 10)
        }

        // Get link to activity details
        const dayViewUrl = `https://www.attackpoint.org/viewlog.jsp/user_${userId}/period-1/enddate-${date.toISOString().split('T')[0]}`

        // Build properties object
        const properties: Record<string, string> = {}
        if (distance) {
          properties['Distance'] = `${distance}km`
        }
        if (durationText) {
          properties['Duration'] = durationText
        }

        activities.push({
          date,
          title,
          description,
          href: dayViewUrl,
          type,
          intensity,
          properties,
        })
      }
    })

    // Move back 7 days
    currentDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000)
  }

  const filteredActivities = activities.filter((activity) => {
    const isValidIntensity = typeof activity.intensity === 'number' && !isNaN(activity.intensity)
    if (!isValidIntensity) {
      console.warn(`Filtered out activity with invalid intensity:`, activity)
    }
    const isValidTitle = activity.title !== '' && activity.title !== null
    if (!isValidTitle) {
      console.warn(`Filtered out activity with invalid title:`, activity)
    }
    return isValidIntensity && isValidTitle
  })

  return filteredActivities
}

function parseDate(dateText: string): Date {
  // Example input: "Sunday Dec 8"
  const [_, month, day] = dateText.match(/(\w+)\s+(\d+)/) || []
  if (!month || !day) {
    return new Date()
  }

  const currentYear = new Date().getFullYear()
  const date = new Date(`${month} ${day} ${currentYear}`)

  // Handle year boundary cases
  if (date > new Date()) {
    date.setFullYear(currentYear - 1)
  }

  return date
}

const result = await fetchActivities('2697', new Date('2024-12-09'), new Date('2024-12-10'))
console.log(result)
