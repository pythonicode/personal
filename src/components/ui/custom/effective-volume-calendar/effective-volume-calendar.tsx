'use client'

import { addWeeks, format, startOfWeek, subWeeks, subDays } from 'date-fns'
import { cn } from '@/lib/utils/css'
import { Activity, ActivityType } from '@/lib/activities/types'
import { useMemo, useState, useEffect } from 'react'
import { useMobile } from '@/lib/hooks/use-mobile'
import { RiArrowUpLine, RiArrowDownLine } from '@remixicon/react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface EffectiveVolumeCalendarProps {
  weeks: number
  activities?: Activity[]
  targetVolume?: number
}

interface WeeklyVolume {
  weekStart: Date
  weekEnd: Date
  effectiveVolume: number
  runningVolume: number
  orienteeringVolume: number
  activities: Activity[]
  metGoal: boolean
  week: string
}

const TRAINING_ACTIVITY_TYPES: ActivityType[] = ['run', 'orienteering']

// Helper function to calculate effective volume for an activity
const getEffectiveVolume = (activity: Activity): number => {
  const distance = activity.distance || 0 // km
  const elevationGain = activity.elevationGain || 0 // meters
  
  if (activity.type === 'run') {
    // Running: distance (km) + 5 * (elevationGain (m) / 1000)
    return distance + (5 * elevationGain) / 1000
  } else if (activity.type === 'orienteering') {
    // Orienteering: 1.5 * distance (km) + 5 * (elevationGain (m) / 1000)
    return (1.5 * distance) + (5 * elevationGain) / 1000
  }
  
  return 0
}

const chartConfig = {
  effectiveVolume: {
    label: "Effective Volume",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export default function EffectiveVolumeCalendar({ 
  weeks, 
  activities = [], 
  targetVolume = 100 
}: EffectiveVolumeCalendarProps) {

  const isMobile = useMobile()
  const displayWeeks = isMobile ? Math.min(weeks, 25) : weeks // Show max 25 weeks on mobile
  
  const today = new Date()
  const startDate = startOfWeek(subWeeks(today, displayWeeks - 1), { weekStartsOn: 1 })

  const weeklyData = useMemo(() => {
    const data: WeeklyVolume[] = []
    
    for (let i = 0; i < displayWeeks; i++) {
      const weekStart = addWeeks(startDate, i)
      const weekEnd = addWeeks(weekStart, 1)
      
      // Filter activities for this week and training types only
      const weekActivities = activities.filter(activity => 
        TRAINING_ACTIVITY_TYPES.includes(activity.type) &&
        activity.date >= weekStart && 
        activity.date < weekEnd
      )
      
      // Calculate effective volume by activity type
      let runningVolume = 0
      let orienteeringVolume = 0
      
      weekActivities.forEach(activity => {
        const volume = getEffectiveVolume(activity)
        if (activity.type === 'run') {
          runningVolume += volume
        } else if (activity.type === 'orienteering') {
          orienteeringVolume += volume
        }
      })
      
      const effectiveVolume = runningVolume + orienteeringVolume
      
      data.push({
        weekStart,
        weekEnd,
        effectiveVolume,
        runningVolume,
        orienteeringVolume,
        activities: weekActivities,
        metGoal: effectiveVolume >= targetVolume,
        week: format(weekStart, 'MMM d')
      })
    }
    
    return data
  }, [activities, displayWeeks, startDate, targetVolume])

  const maxVolume = useMemo(() => {
    return Math.max(...weeklyData.map(week => week.effectiveVolume), targetVolume * 1.5)
  }, [weeklyData, targetVolume])

  const goalAchievementRate = useMemo(() => {
    // Exclude current week from goal achievement calculation
    const completedWeeks = weeklyData.slice(0, -1)
    const metGoals = completedWeeks.filter(week => week.metGoal).length
    const totalWeeksWithData = completedWeeks.filter(week => week.effectiveVolume > 0).length
    return totalWeeksWithData > 0 ? (metGoals / totalWeeksWithData) * 100 : 0
  }, [weeklyData])

  const averageVolume = useMemo(() => {
    // Exclude current week from average volume calculation
    const completedWeeks = weeklyData.slice(0, -1)
    const weeksWithData = completedWeeks.filter(week => week.effectiveVolume > 0)
    if (weeksWithData.length === 0) return 0
    return weeksWithData.reduce((sum, week) => sum + week.effectiveVolume, 0) / weeksWithData.length
  }, [weeklyData])

  const trendData = useMemo(() => {
    // Exclude current week (K) from trend calculation
    const completedWeeks = weeklyData.slice(0, -1)
    
    // Need at least 8 completed weeks for trend calculation
    if (completedWeeks.length < 8) return 0
    
    // Recent 4 weeks: K-1, K-2, K-3, K-4 (last 4 completed weeks)
    const recentWeeks = completedWeeks.slice(-4)
    // Earlier 4 weeks: K-5, K-6, K-7, K-8 (4 weeks before the recent ones)
    const earlierWeeks = completedWeeks.slice(-8, -4)
    
    const recentSum = recentWeeks.reduce((sum, week) => sum + week.effectiveVolume, 0)
    const earlierSum = earlierWeeks.reduce((sum, week) => sum + week.effectiveVolume, 0)
    
    if (earlierSum === 0) return 0
    return ((recentSum - earlierSum) / earlierSum) * 100
  }, [weeklyData])

  return (
    <div className="flex flex-col gap-6">
      {/* Header with stats */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Effective Training Volume</h3>
          <p className="text-sm text-muted-foreground">
            Running: distance + 5×(elevation/1000) • Orienteering: 1.5×distance + 5×(elevation/1000) • Target {targetVolume}/week
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Goal Achievement</span>
            <span className="font-medium">
              {weeklyData.slice(0, -1).filter(w => w.metGoal).length}/{displayWeeks - 1} weeks
            </span>
            <span className="text-xs text-muted-foreground">
              {goalAchievementRate.toFixed(0)}% success rate
            </span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Average Volume</span>
            <span className="font-medium">{averageVolume.toFixed(0)}</span>
            <span className="text-xs text-muted-foreground">
              {((averageVolume / targetVolume) * 100).toFixed(0)}% of target
            </span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">4-Week Trend</span>
            <div className="flex items-center gap-1">
              {trendData > 0 ? (
                <RiArrowUpLine className="h-3 w-3 text-green-600" />
              ) : (
                <RiArrowDownLine className="h-3 w-3 text-red-600" />
              )}
              <span className={cn(
                "font-medium text-xs",
                trendData > 0 ? "text-green-600" : "text-red-600"
              )}>
                {Math.abs(trendData).toFixed(0)}%
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              vs previous 4 weeks
            </span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Peak Week</span>
            <span className="font-medium">
              {Math.max(...weeklyData.map(w => w.effectiveVolume)).toFixed(0)}
            </span>
            <span className="text-xs text-muted-foreground">
              max this period
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full">
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={weeklyData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={false}
              // @ts-expect-error ChartTooltipContent expects recharts props but works correctly
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="effectiveVolume"
              type="monotone"
              fill="var(--color-effectiveVolume)"
              fillOpacity={0.4}
              stroke="var(--color-effectiveVolume)"
              strokeWidth={2}
            />
            {/* Target line */}
            <Area
              dataKey={() => targetVolume}
              type="monotone"
              fill="transparent"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1}
              strokeDasharray="5 5"
              fillOpacity={0}
            />
          </AreaChart>
        </ChartContainer>
      </div>

      {/* Footer with trend information */}
      <div className="flex w-full items-start gap-2 text-sm">
        <div className="grid gap-2">
          <div className="flex items-center gap-2 leading-none font-medium">
            {trendData > 0 ? (
              <>
                Trending up by {Math.abs(trendData).toFixed(1)}% <RiArrowUpLine className="h-4 w-4 text-green-600" />
              </>
            ) : trendData < 0 ? (
              <>
                Trending down by {Math.abs(trendData).toFixed(1)}% <RiArrowDownLine className="h-4 w-4 text-red-600" />
              </>
            ) : (
              "Volume stable over recent weeks"
            )}
          </div>
          <div className="text-muted-foreground flex items-center gap-2 leading-none">
            {format(weeklyData[0]?.weekStart || startDate, 'MMM d')} - {format(subDays(weeklyData[weeklyData.length - 2]?.weekEnd || new Date(), 1), 'MMM d, yyyy')}
          </div>
        </div>
      </div>
    </div>
  )
}

export function EffectiveVolumeCalendarSkeleton({ weeks = 9 }: { weeks?: number }) {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const startTime = Date.now()
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const exponentialProgress = 95 * (1 - Math.exp(-elapsed / 3000))
      setProgress(Math.min(exponentialProgress, 94.5))
    }, 100)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="animate-pulse">
      <div className="flex flex-col gap-6">
        {/* Header skeleton */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="h-6 w-64 bg-muted rounded" />
            <div className="h-4 w-96 bg-muted rounded" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-5 w-16 bg-muted rounded" />
                <div className="h-3 w-20 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Chart skeleton */}
        <div className="relative h-64 w-full bg-muted rounded-lg flex items-center justify-center">
          <div className="bg-background/80 backdrop-blur-sm px-3 py-1 rounded-md text-xs text-muted-foreground">
            Loading effective volume data... {progress.toFixed(0)}%
          </div>
        </div>
        
        {/* Footer skeleton */}
        <div className="flex flex-col gap-2">
          <div className="h-5 w-48 bg-muted rounded" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>
    </div>
  )
}
