import { format, isSameDay, subDays } from 'date-fns'
import { cn } from '@/lib/utils/css'
import { Activity, ActivityType } from '@/lib/activities/types'
import { Suspense } from 'react'
import { fetchActivities } from '@/lib/activities/ap-fetch'
import { HtmlRenderer } from '../../utils/html'
import { truncate } from '@/lib/utils/strings'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'

const ACTIVITY_BAR: Record<ActivityType, string> = {
  run: 'bg-cyan-500',
  strength: 'bg-purple-400',
  bike: 'bg-emerald-500',
  orienteering: 'bg-orange-500',
  other: 'bg-amber-400',
}

const BAR_HEIGHT = 64

interface ActivityCalendarProps {
  activities?: Activity[]
}

export default function ActivityCalendar({ activities = [] }: ActivityCalendarProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const days = Array.from({ length: 7 }, (_, index) => subDays(today, 6 - index))

  const activitiesByDay = days.map((date) =>
    activities.filter((activity) => isSameDay(activity.date, date)),
  )
  const secondsByDay = activitiesByDay.map((dayActivities) =>
    dayActivities.reduce((total, activity) => total + activity.duration, 0),
  )
  const maxSeconds = Math.max(...secondsByDay, 1)
  const totalSeconds = secondsByDay.reduce((total, seconds) => total + seconds, 0)
  const totalKm = activities.reduce((total, activity) => total + (activity.distance ?? 0), 0)
  const totalClimb = activities.reduce((total, activity) => total + (activity.elevationGain ?? 0), 0)

  return (
    <div className="w-full">
      <div className="mb-3 flex items-baseline justify-between gap-3 text-xs">
        <span className="font-medium tabular-nums">{formatHours(totalSeconds)}</span>
        <span className="text-muted-foreground tabular-nums">
          {formatKm(totalKm)} km
          {totalClimb > 0 ? ` · +${Math.round(totalClimb)} m` : ''}
        </span>
      </div>
      <div className="flex items-end gap-1.5">
        {days.map((date, index) => {
          const dayActivities = activitiesByDay[index] ?? []
          const daySeconds = secondsByDay[index] ?? 0
          const isToday = isSameDay(date, today)
          const barHeight = daySeconds > 0 ? Math.max(10, Math.round((daySeconds / maxSeconds) * BAR_HEIGHT)) : 0

          return (
            <Popover key={date.toISOString()}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-1.5 border-0 bg-transparent p-0 font-inherit outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                >
                  <span className="text-[10px] tabular-nums text-muted-foreground">
                    {daySeconds > 0 ? formatCompact(daySeconds) : '—'}
                  </span>
                  <span className="flex h-16 w-full max-w-8 items-end">
                    {dayActivities.length > 0 ? (
                      <span className="flex w-full flex-col-reverse gap-0.5" style={{ height: barHeight }}>
                        {dayActivities.map((activity, activityIndex) => (
                          <span
                            key={`${activity.title}-${activityIndex}`}
                            className={cn(
                              'w-full min-h-1 rounded-sm transition-opacity hover:opacity-80',
                              ACTIVITY_BAR[activity.type],
                              activityIndex === dayActivities.length - 1 && 'rounded-t-sm',
                            )}
                            style={{ flex: `${Math.max(activity.duration, 1)} 1 0` }}
                          />
                        ))}
                      </span>
                    ) : (
                      <span className="h-1 w-full rounded-full bg-muted" />
                    )}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] uppercase tracking-wide',
                      isToday ? 'font-semibold text-cyan-700 dark:text-cyan-300' : 'text-muted-foreground',
                    )}
                  >
                    {format(date, 'EEE')}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent side="top">
                <div className="flex flex-col gap-2 text-xs">
                  <div className="font-medium">
                    {date.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  {dayActivities.length === 0 ? (
                    <span className="text-muted-foreground">Rest day</span>
                  ) : (
                    dayActivities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <div className={cn('h-2 w-2 rounded-full', ACTIVITY_BAR[activity.type])} />
                          {activity.href ? (
                            <a href={activity.href} className="font-medium hover:underline">
                              {activity.title}
                            </a>
                          ) : (
                            <span className="font-medium">{activity.title}</span>
                          )}
                          <span className="text-muted-foreground">{formatCompact(activity.duration)}</span>
                        </div>
                        <div className="flex flex-row flex-wrap gap-x-1">
                          {activity.metadata &&
                            Object.entries(activity.metadata).map(([key, value]) => (
                              <span key={key} className="text-muted-foreground">
                                {value}
                              </span>
                            ))}
                        </div>
                        {activity.description && (
                          <span className="text-muted-foreground">
                            <HtmlRenderer htmlContent={truncate(activity.description, 256)} />
                            {activity.href && (
                              <a href={activity.href} className="mt-1 inline font-medium hover:underline">
                                Read More
                              </a>
                            )}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )
        })}
      </div>
    </div>
  )
}

function formatHours(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.round((seconds % 3600) / 60)
  return `${hours}h ${minutes.toString().padStart(2, '0')}m`
}

function formatCompact(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.round((seconds % 3600) / 60)
  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h${minutes.toString().padStart(2, '0')}`
}

function formatKm(km: number): string {
  const rounded = Math.round(km * 10) / 10
  return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1)
}

function ActivityCalendarSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="mb-3 flex justify-between">
        <div className="h-3 w-16 rounded bg-muted" />
        <div className="h-3 w-24 rounded bg-muted" />
      </div>
      <div className="flex items-end gap-1.5">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="h-2 w-6 rounded bg-muted" />
            <div className="flex h-16 w-full max-w-8 items-end">
              <div
                className="w-full rounded-sm bg-muted"
                style={{ height: `${28 + ((index * 17) % 48)}%` }}
              />
            </div>
            <div className="h-2 w-6 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}

async function TrainingCalendarContent() {
  const endDate = new Date()
  const startDate = subDays(endDate, 6)
  const activities = await fetchActivities('2697', startDate, endDate)

  return <ActivityCalendar activities={activities} />
}

export function TrainingCalendar() {
  return (
    <Suspense fallback={<ActivityCalendarSkeleton />}>
      <TrainingCalendarContent />
    </Suspense>
  )
}
