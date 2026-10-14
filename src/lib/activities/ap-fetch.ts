import * as cheerio from 'cheerio'
import type { CheerioAPI } from 'cheerio'
import type { Activity, ActivityType, ActivityZone } from '@/lib/activities/types'

const FETCH_HEADERS = {
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'accept-language': 'en-US,en;q=0.9',
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15',
}

export async function fetchActivities(
  userId: string,
  startDate: Date,
  endDate: Date,
): Promise<Activity[]> {
  const activities: Activity[] = []

  const normalizedStartDate = new Date(startDate)
  normalizedStartDate.setHours(0, 0, 0, 0)

  const normalizedEndDate = new Date(endDate)
  normalizedEndDate.setHours(0, 0, 0, 0)

  // viewlog.jsp now returns an empty 503, and non-browser clients are blocked
  // from it entirely. The latest week is published on log.jsp. Older weeks are
  // still linked from that page and are followed when the response has activities.
  const seenUrls = new Set<string>()
  let nextUrl: string | null = `https://attackpoint.org/log.jsp/user_${userId}`

  while (nextUrl && !seenUrls.has(nextUrl) && seenUrls.size < 60) {
    seenUrls.add(nextUrl)
    const page = await fetchLogPage(nextUrl)
    if (!page) break

    const pageActivities = parsePage(page.$, userId, page.finalUrl)
    if (pageActivities.length === 0) break

    let oldestOnPage = normalizedEndDate
    for (const activity of pageActivities) {
      if (activity.date < oldestOnPage) oldestOnPage = activity.date
      if (activity.date >= normalizedStartDate && activity.date <= normalizedEndDate) {
        activities.push(activity)
      }
    }

    if (oldestOnPage <= normalizedStartDate) break
    nextUrl = page.earlierUrl
  }

  const seenActivities = new Set<string>()
  return activities.filter((activity) => {
    const isValidIntensity = typeof activity.intensity === 'object' && activity.intensity !== null
    const isValidTitle = activity.title !== '' && activity.title !== null
    const isValidCalculatedIntensity =
      typeof activity.calculatedIntensity === 'number' && !isNaN(activity.calculatedIntensity)
    if (!isValidIntensity || !isValidTitle || !isValidCalculatedIntensity) return false

    const key = `${activity.date.getFullYear()}-${activity.date.getMonth()}-${activity.date.getDate()}|${activity.title}|${activity.duration}`
    if (seenActivities.has(key)) return false
    seenActivities.add(key)
    return true
  })
}

async function fetchLogPage(
  url: string,
): Promise<{ $: CheerioAPI; finalUrl: string; earlierUrl: string | null } | null> {
  const response = await fetch(url, { headers: FETCH_HEADERS })
  if (!response.ok) return null

  const html = await response.text()
  if (!html.includes('tlactivity')) return null

  const $ = cheerio.load(html)
  const earlierHref =
    $('a[title="Go backward"]').first().attr('href') ??
    $('a')
      .filter((_, el) => $(el).text().includes('Earlier'))
      .first()
      .attr('href')

  return {
    $,
    finalUrl: response.url,
    earlierUrl: earlierHref ? new URL(earlierHref, response.url).toString() : null,
  }
}

function parsePage($: CheerioAPI, userId: string, pageUrl: string): Activity[] {
  const activities: Activity[] = []

  $('.tlactivity').each((_, element) => {
    const $el = $(element)

    // Skip comment-only activities (those without actual workout data)
    const hasWorkoutData = $el.find('p').length > 0
    if (!hasWorkoutData) return

    const $tlday = $el.closest('.tlday')
    let dateText = $tlday.find('h3 a').first().text().trim()
    if (!dateText) {
      dateText = $tlday.find('h3').first().text().trim()
    }

    const date = parseDate(dateText)
    const title = $el.find('b').first().text().trim()
    const description = $el.find('.descrow.descrowtype0, .descrowtype0').first().text().trim() || undefined

    const durationText =
      $el.find('span[xclass="i0"], span.i0').first().text().trim() ||
      $el.find('p').first().text().match(/\d+:\d{2}(?::\d{2})?/)?.[0] ||
      ''
    const distanceMatch = $el
      .find('p')
      .first()
      .text()
      .match(/(\d+\.?\d*)\s*km/)
    const distance = distanceMatch ? distanceMatch[1] : null

    const elevationSpan = $el.find('span[title="climb"]')
    const elevationText = elevationSpan.text()
    const elevationMatch = elevationText.match(/\+(\d+)m/)
    const elevationGain = elevationMatch ? parseInt(elevationMatch[1], 10) : undefined

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

    const duration = parseDuration(durationText)

    let intensityMatch = $el.find('svg.ichart title').first().text().trim()
    if (!intensityMatch) {
      intensityMatch = $el.find('strong').attr('title') || ''
    }

    let intensity: Record<ActivityZone, number>
    let calculatedIntensity: number

    if (intensityMatch && intensityMatch.includes('intensity:')) {
      const zones = intensityMatch.match(/\(([^)]+)\)/g) || []
      const zoneIntensity: Record<ActivityZone, number> = {
        Z0: 0, Z1: 0, Z2: 0, Z3: 0, Z4: 0, Z5: 0,
      }

      let totalIntensity = 0
      zones.forEach((zone) => {
        const [time, level] = zone.slice(1, -1).split('@')
        const zoneSeconds = parseDuration((time ?? '').trim())
        const zoneLevel = parseInt((level ?? '').trim(), 10)
        if (Number.isNaN(zoneLevel)) return

        const zoneName = `Z${zoneLevel}` as ActivityZone
        if (zoneName in zoneIntensity) {
          zoneIntensity[zoneName] += zoneSeconds
        }

        totalIntensity += Math.pow(zoneSeconds, 0.75) * zoneLevel
      })

      intensity = zoneIntensity
      calculatedIntensity = Math.round(totalIntensity / 10)
    } else {
      calculatedIntensity = Math.round(Math.pow(duration, 0.75) / 10)
      intensity = {
        Z0: 0, Z1: 0, Z2: 0, Z3: 0, Z4: 0, Z5: 0,
      }
    }

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
      href: pageUrl || `https://attackpoint.org/log.jsp/user_${userId}`,
      type,
      duration,
      distance: distance ? parseFloat(distance) : undefined,
      elevationGain,
      intensity,
      calculatedIntensity,
      metadata,
    })
  })

  return activities
}

function parseDuration(durationText: string): number {
  const timeParts = durationText.trim().split(':')
  let seconds = 0

  if (timeParts.length === 3) {
    seconds =
      parseInt(timeParts[0], 10) * 3600 + parseInt(timeParts[1], 10) * 60 + parseInt(timeParts[2], 10)
  } else if (timeParts.length === 2) {
    const [mins, secs = '0'] = timeParts
    seconds = parseInt(mins, 10) * 60 + parseInt(secs, 10)
  } else {
    seconds = parseInt(timeParts[0], 10)
  }

  return seconds
}

function parseDate(dateText: string): Date {
  // Example input: "Wednesday Nov 19 #" or "Tuesday Oct 13" or "Sunday Dec 8"
  const match = dateText.match(/(\w+)\s+(\w+)\s+(\d+)/)

  if (match) {
    const [, , month, day] = match
    const currentYear = new Date().getFullYear()
    const date = new Date(`${month} ${day} ${currentYear}`)

    if (date > new Date()) {
      date.setFullYear(currentYear - 1)
    }

    date.setHours(0, 0, 0, 0)
    return date
  }

  const fallbackMatch = dateText.match(/(\w+)\s+(\d+)/)
  if (fallbackMatch) {
    const [, month, day] = fallbackMatch
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
