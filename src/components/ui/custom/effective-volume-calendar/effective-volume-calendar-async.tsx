import { Suspense } from 'react'
import { subWeeks } from 'date-fns'
import { fetchActivities } from '@/lib/activities/ap-fetch'
import EffectiveVolumeCalendar, { EffectiveVolumeCalendarSkeleton } from './effective-volume-calendar'

interface EffectiveVolumeCalendarAsyncProps {
  weeks?: number
  targetVolume?: number
}

async function EffectiveVolumeCalendarContent({ weeks = 9, targetVolume = 100 }: EffectiveVolumeCalendarAsyncProps) {
  const endDate = new Date()
  const startDate = subWeeks(endDate, weeks)
  const activities = await fetchActivities('2697', startDate, endDate)

  return <EffectiveVolumeCalendar weeks={weeks} activities={activities} targetVolume={targetVolume} />
}

export function EffectiveVolumeCalendarAsync({ weeks = 9, targetVolume = 100 }: EffectiveVolumeCalendarAsyncProps) {
  return (
    <Suspense fallback={<EffectiveVolumeCalendarSkeleton weeks={weeks} />}>
      <EffectiveVolumeCalendarContent weeks={weeks} targetVolume={targetVolume} />
    </Suspense>
  )
}
