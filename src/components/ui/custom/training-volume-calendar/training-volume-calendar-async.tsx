import { Suspense } from 'react'
import { subWeeks } from 'date-fns'
import { fetchActivities } from '@/lib/activities/ap-fetch'
import TrainingVolumeCalendar, { TrainingVolumeCalendarSkeleton } from './training-volume-calendar'

interface TrainingVolumeCalendarAsyncProps {
  weeks?: number
  targetHours?: number
}

async function TrainingVolumeCalendarContent({ weeks = 50, targetHours = 8 }: TrainingVolumeCalendarAsyncProps) {
  const endDate = new Date()
  const startDate = subWeeks(endDate, weeks)
  const activities = await fetchActivities('2697', startDate, endDate)

  return <TrainingVolumeCalendar weeks={weeks} activities={activities} targetHours={targetHours} />
}

export function TrainingVolumeCalendarAsync({ weeks = 50, targetHours = 8 }: TrainingVolumeCalendarAsyncProps) {
  return (
    <Suspense fallback={<TrainingVolumeCalendarSkeleton weeks={weeks} />}>
      <TrainingVolumeCalendarContent weeks={weeks} targetHours={targetHours} />
    </Suspense>
  )
}
