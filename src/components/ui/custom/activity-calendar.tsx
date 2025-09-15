import { addDays, isSameDay, startOfWeek, subWeeks } from 'date-fns'
import { cn } from '@/lib/utils/css'
import { Activity } from '@/lib/activities/types'
import { Suspense, useMemo } from 'react'
import { fetchActivities } from '@/lib/activities/ap-fetch'
import { getActivityColor } from '@/lib/activities'
import { HtmlRenderer } from '../../utils/html'
import { truncate } from '@/lib/utils/strings'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'

interface ActivityCalendarProps {
  weeks: number
  activities?: Activity[]
}

export default function ActivityCalendar({ weeks, activities = [] }: ActivityCalendarProps) {
  // Calculate the start date (going back 'weeks' number of weeks from today)
  const today = new Date()
  const startDate = startOfWeek(subWeeks(today, weeks - 1), { weekStartsOn: 1 })

  // Add this function to get month labels
  const getMonthLabels = () => {
    const labels: { text: string; index: number }[] = []
    let currentMonth = startDate.getMonth()

    Array.from({ length: weeks }).forEach((_, weekIndex) => {
      const date = addDays(startDate, (weekIndex + 1) * 7)
      const month = date.getMonth()

      if (month !== currentMonth) {
        labels.push({
          text: date.toLocaleString('default', { month: 'short' }),
          index: weekIndex,
        })
        currentMonth = month
      }
    })
    return labels
  }
  const maxIntensity = useMemo(() => {
    // Group activities by date and sum calculated intensities
    const dailyIntensities = activities.reduce(
      (acc, activity) => {
        const dateStr = activity.date.toDateString()
        acc[dateStr] = (acc[dateStr] || 0) + activity.calculatedIntensity
        return acc
      },
      {} as Record<string, number>,
    )

    return Math.max(...Object.values(dailyIntensities), 1)
  }, [activities])

  const minIntensity = useMemo(() => {
    // Group activities by date and sum calculated intensities
    const dailyIntensities = activities.reduce(
      (acc, activity) => {
        const dateStr = activity.date.toDateString()
        acc[dateStr] = (acc[dateStr] || 0) + activity.calculatedIntensity
        return acc
      },
      {} as Record<string, number>,
    )

    return Math.min(...Object.values(dailyIntensities), 0)
  }, [activities])

  const calculateColorFromIntensity = (intensity: number) => {
    const range = maxIntensity - minIntensity
    const normalizedIntensity = range === 0 ? 0 : (intensity - minIntensity) / range

    // Calculate opacity hex value based on intensity (50-100%)
    const opacity = Math.floor((normalizedIntensity * 0.5 + 0.5) * 255)
      .toString(16)
      .padStart(2, '0')

    // Map normalized intensity to cyan color scale with opacity (darker = higher intensity)
    if (normalizedIntensity === 0) return `#ecfeff${opacity}` // 50
    if (normalizedIntensity < 0.1) return `#cffafe${opacity}` // 100
    if (normalizedIntensity < 0.2) return `#a5f3fc${opacity}` // 200
    if (normalizedIntensity < 0.3) return `#67e8f9${opacity}` // 300
    if (normalizedIntensity < 0.4) return `#22d3ee${opacity}` // 400
    if (normalizedIntensity < 0.5) return `#06b6d4${opacity}` // 500
    if (normalizedIntensity < 0.6) return `#0891b2${opacity}` // 600
    if (normalizedIntensity < 0.7) return `#0e7490${opacity}` // 700
    if (normalizedIntensity < 0.8) return `#155e75${opacity}` // 800
    if (normalizedIntensity < 0.9) return `#164e63${opacity}` // 900
    return `#083344${opacity}` // 950
  }

  return (
    <div className="flex flex-col gap-1">
      {/* Add month labels */}
      <div className="flex gap-1">
        <div className="w-6" /> {/* Spacer for day labels */}
        <div className="grid" style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}>
          {Array.from({ length: weeks }).map((_, weekIndex: number) => {
            const monthLabel = getMonthLabels().find((label) => label.index === weekIndex)
            return (
              <div key={weekIndex} className="text-xs text-muted-foreground">
                {monthLabel?.text || ''}
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex gap-1">
        <div className="flex flex-col gap-y-1 text-xs text-muted-foreground items-end mr-1">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${weeks + 1}, 1fr)` }}>
          {Array.from({ length: weeks }).map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-y-1">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const date = addDays(startDate, weekIndex * 7 + dayIndex)

                const isToday = isSameDay(date, today)

                const activitiesForDay = activities.filter((activity) =>
                  isSameDay(activity.date, date),
                )

                const intensity = activitiesForDay.reduce(
                  (acc, activity) => acc + activity.calculatedIntensity,
                  0,
                )

                const side = (() => {
                  const leftWeight = (weeks - weekIndex) / weeks
                  const topWeight = (7 - dayIndex) / 7
                  const rightWeight = 1 - leftWeight
                  const bottomWeight = 1 - topWeight

                  const max = Math.max(leftWeight, topWeight, rightWeight, bottomWeight)

                  if (max === topWeight) {
                    return 'top'
                  } else if (max === leftWeight) {
                    return 'left'
                  } else if (max === rightWeight) {
                    return 'right'
                  } else {
                    return 'bottom'
                  }
                })()

                return (
                  <Popover key={`${weekIndex}-${dayIndex}`}>
                    <PopoverTrigger asChild>
                      <div
                        className={cn(
                          'cursor-pointer aspect-square rounded-sm w-4 h-4 bg-muted transition-opacity duration-200 hover:opacity-80',
                          isToday && 'border-2 border-muted-foreground',
                        )}
                        style={{
                          backgroundColor:
                            intensity > 0 ? calculateColorFromIntensity(intensity) : 'var(--muted)', // fallback to muted color when no activity
                        }}
                      />
                    </PopoverTrigger>
                    <PopoverContent side={side}>
                      <div className="flex flex-col gap-2 text-xs">
                        <div className="font-medium">
                          {date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        {activitiesForDay.map((activity, i) => (
                          <div key={i} className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  'h-2 w-2 rounded-full',
                                  `bg-${getActivityColor(activity.type)}-500`,
                                )}
                              />
                              {activity.href ? (
                                <a href={activity.href} className="font-medium hover:underline">
                                  {activity.title}
                                </a>
                              ) : (
                                <span className="font-medium">{activity.title}</span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                ({activity.calculatedIntensity})
                              </span>
                            </div>
                            <div className="flex flex-row gap-x-1 flex-wrap">
                              {activity.metadata &&
                                Object.entries(activity.metadata).map(([key, value]) => (
                                  <span key={key} className="text-xs text-muted-foreground">
                                    {value}
                                  </span>
                                ))}
                            </div>
                            {activity.description && (
                              <span className="text-xs text-muted-foreground">
                                <HtmlRenderer htmlContent={truncate(activity.description, 256)} />
                                {activity.href && (
                                  <a
                                    href={activity.href}
                                    className="hover:underline inline font-medium mt-1"
                                  >
                                    Read More
                                  </a>
                                )}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ActivityCalendarSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <div className="w-6" />
          <div className="grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded" />
            ))}
          </div>
        </div>
        <div className="flex gap-1">
          <div className="flex flex-col gap-y-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-4 w-6 bg-muted rounded" />
            ))}
          </div>
          <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
            {Array.from({ length: 84 }).map((_, i) => (
              <div key={i} className="aspect-square w-4 h-4 bg-muted rounded-sm" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

async function TrainingCalendarContent() {
  const endDate = new Date()
  const startDate = subWeeks(endDate, 12)
  const activities = await fetchActivities('2697', startDate, endDate)

  return <ActivityCalendar weeks={12} activities={activities} />
}

export function TrainingCalendar() {
  return (
    <Suspense fallback={<ActivityCalendarSkeleton />}>
      <TrainingCalendarContent />
    </Suspense>
  )
}
