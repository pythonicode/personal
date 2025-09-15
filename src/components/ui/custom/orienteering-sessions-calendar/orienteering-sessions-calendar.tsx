'use client'

import { addWeeks, format, startOfWeek, subWeeks, subDays } from 'date-fns'
import { cn } from '@/lib/utils/css'
import { Activity, ActivityType } from '@/lib/activities/types'
import { useMemo, useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../../popover'
import { useMobile } from '@/lib/hooks/use-mobile'

interface OrienteeringSessionsCalendarProps {
  weeks: number
  activities?: Activity[]
  targetSessions?: number
}

interface WeeklySessions {
  weekStart: Date
  weekEnd: Date
  sessionCount: number
  uniqueDays: number
  activities: Activity[]
  metGoal: boolean
}

const ORIENTEERING_ACTIVITY_TYPES: ActivityType[] = ['orienteering']

export default function OrienteeringSessionsCalendar({ 
  weeks, 
  activities = [], 
  targetSessions = 2 
}: OrienteeringSessionsCalendarProps) {
  const isMobile = useMobile()
  const displayWeeks = isMobile ? Math.min(weeks, 25) : weeks // Show max 25 weeks on mobile
  
  const today = new Date()
  const startDate = startOfWeek(subWeeks(today, displayWeeks - 1), { weekStartsOn: 1 })

  const weeklyData = useMemo(() => {
    const data: WeeklySessions[] = []
    
    for (let i = 0; i < displayWeeks; i++) {
      const weekStart = addWeeks(startDate, i)
      const weekEnd = addWeeks(weekStart, 1)
      
      // Filter activities for this week and orienteering only
      // Use >= start and < end to avoid double counting overlapping days
      const weekActivities = activities.filter(activity => 
        ORIENTEERING_ACTIVITY_TYPES.includes(activity.type) &&
        activity.date >= weekStart && 
        activity.date < weekEnd
      )
      
      // Count unique days with orienteering sessions
      const uniqueDays = new Set(
        weekActivities.map(activity => activity.date.toDateString())
      ).size
      
      data.push({
        weekStart,
        weekEnd,
        sessionCount: weekActivities.length,
        uniqueDays,
        activities: weekActivities,
        metGoal: uniqueDays >= targetSessions
      })
    }
    
    return data
  }, [activities, displayWeeks, startDate, targetSessions])

  const maxSessions = useMemo(() => {
    return Math.max(...weeklyData.map(week => week.uniqueDays), targetSessions * 1.5)
  }, [weeklyData, targetSessions])

  const getBarHeight = (uniqueDays: number) => {
    const percentage = Math.min((uniqueDays / maxSessions) * 100, 100)
    return `${percentage}%`
  }

  const getBarColor = (week: WeeklySessions) => {
    if (week.metGoal) {
      // Orange gradient for met goals
      const intensity = Math.min(week.uniqueDays / (targetSessions * 1.5), 1)
      if (intensity > 0.8) return 'bg-orange-600'
      if (intensity > 0.6) return 'bg-orange-500'
      return 'bg-orange-400'
    } else if (week.uniqueDays > 0) {
      // Yellow/amber for partial progress
      const progress = week.uniqueDays / targetSessions
      if (progress > 0.7) return 'bg-amber-500'
      if (progress > 0.4) return 'bg-amber-400'
      return 'bg-amber-300'
    }
    return 'bg-muted'
  }

  const getMonthLabels = () => {
    const labels: { text: string; weekIndex: number }[] = []
    let currentMonth = startDate.getMonth()

    weeklyData.forEach((week, index) => {
      const month = week.weekStart.getMonth()
      if (month !== currentMonth && index > 0) {
        labels.push({
          text: format(week.weekStart, 'MMM'),
          weekIndex: index,
        })
        currentMonth = month
      }
    })
    return labels
  }

  const goalAchievementRate = useMemo(() => {
    const metGoals = weeklyData.filter(week => week.metGoal).length
    return weeklyData.length > 0 ? (metGoals / weeklyData.length) * 100 : 0
  }, [weeklyData])

  return (
    <div className="flex flex-col gap-4 relative">
      {/* Header with stats */}
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Orienteering Sessions Goal Progress</h3>
          <p className="text-sm text-muted-foreground">
            {targetSessions}+ session days/week • Orienteering • Last {displayWeeks} weeks
          </p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-orange-500" />
            <span>Goal Met ({weeklyData.filter(w => w.metGoal).length}/{displayWeeks})</span>
          </div>
          <div className="text-muted-foreground">
            {goalAchievementRate.toFixed(0)}% success rate
          </div>
        </div>
      </div>

      {/* Month labels */}
      <div className="relative">
        <div className="flex">
          {getMonthLabels().map((label) => (
            <div
              key={label.weekIndex}
              className="absolute text-xs text-muted-foreground"
              style={{ left: `${(label.weekIndex / displayWeeks) * 100}%` }}
            >
              {label.text}
            </div>
          ))}
        </div>
      </div>

      {/* Session bars */}
      <div className="flex items-end gap-1 h-24 mt-6">
        {weeklyData.map((week, index) => (
          <Popover key={index}>
            <PopoverTrigger asChild>
              <div className="flex-1 flex flex-col justify-end h-full group cursor-pointer">
                {/* Goal line indicator */}
                {week.metGoal && (
                  <div 
                    className="w-full border-t-2 border-orange-600 mb-px"
                    style={{ 
                      position: 'absolute',
                      bottom: '1.5rem',
                      left: `${(index / displayWeeks) * 100}%`,
                      width: `${100 / displayWeeks}%`
                    }}
                  />
                )}
                
                {/* Session count bar */}
                <div
                  className={cn(
                    'w-full rounded-t-sm transition-all duration-200 group-hover:opacity-80',
                    getBarColor(week),
                    week.uniqueDays === 0 && 'min-h-[2px]'
                  )}
                  style={{ height: getBarHeight(week.uniqueDays) }}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent side="top" className="w-64 md:w-72">
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {format(week.weekStart, 'MMM d')} - {format(subDays(week.weekEnd, 1), 'MMM d')}
                  </span>
                  <span className={cn(
                    'text-xs px-2 py-1 rounded',
                    week.metGoal 
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' 
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                  )}>
                    {week.metGoal ? 'Goal Met' : 'Below Goal'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Session Days:</span>
                  <span className="font-medium">{week.uniqueDays} days</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Total Sessions:</span>
                  <span className="font-medium">{week.sessionCount} sessions</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Goal Progress:</span>
                  <span className="font-medium">
                    {((week.uniqueDays / targetSessions) * 100).toFixed(0)}%
                  </span>
                </div>

                {week.activities.length > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="text-xs text-muted-foreground mb-1">
                      Sessions ({week.activities.length}):
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {week.activities.map((activity, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="truncate mr-2">{activity.title}</span>
                          <span className="text-muted-foreground">
                            {format(activity.date, 'MMM d')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>

      {/* Goal line legend */}
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>0 days</span>
        <span>{targetSessions} days goal</span>
        <span>{maxSessions.toFixed(0)} days</span>
      </div>
    </div>
  )
}

export function OrienteeringSessionsCalendarSkeleton({ weeks = 50 }: { weeks?: number }) {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const startTime = Date.now()
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      // Exponential progress that asymptotically approaches 95%
      // Formula: 95 * (1 - e^(-t/3000)) where t is elapsed time in ms
      const exponentialProgress = 95 * (1 - Math.exp(-elapsed / 3000))
      setProgress(Math.min(exponentialProgress, 94.5)) // Cap at 94.5% to never finish
    }, 100)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="animate-pulse relative">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <div className="flex flex-col gap-2">
            <div className="h-6 w-64 bg-muted rounded" />
            <div className="h-4 w-80 bg-muted rounded" />
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
          </div>
        </div>
        
        <div className="h-4 w-full bg-muted rounded" />
        
        <div className="flex items-end gap-1 h-24 relative mt-6">
          {Array.from({ length: weeks }).map((_, i) => {
            // Deterministic "random" heights for SSR consistency
            const height = ((i * 11 + 37) % 80) + 20 // Creates pseudo-random heights between 20-100%
            return (
              <div key={i} className="flex-1 bg-muted rounded-t-sm" style={{ height: `${Math.min(height, 100)}%` }} />
            )
          })}
          
          {/* Loading progress overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="h-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-t-sm transition-all duration-300 ease-out"
                 style={{ width: `${progress}%` }}>
              <div className="h-full w-full bg-gradient-to-t from-orange-600/30 to-transparent rounded-t-sm" />
            </div>
          </div>
          
          {/* Loading text overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background/80 backdrop-blur-sm px-3 py-1 rounded-md text-xs text-muted-foreground">
              Loading sessions... {progress.toFixed(0)}%
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <div className="h-3 w-8 bg-muted rounded" />
          <div className="h-3 w-12 bg-muted rounded" />
          <div className="h-3 w-8 bg-muted rounded" />
        </div>
      </div>
    </div>
  )
}

