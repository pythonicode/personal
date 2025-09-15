import { Suspense } from 'react'
import { subWeeks } from 'date-fns'
import { fetchActivities } from '@/lib/activities/ap-fetch'
import OrienteeringSessionsCalendar, { OrienteeringSessionsCalendarSkeleton } from './orienteering-sessions-calendar'

interface OrienteeringSessionsCalendarAsyncProps {
  weeks?: number
  targetSessions?: number
}

async function OrienteeringSessionsCalendarContent({ weeks = 50, targetSessions = 3 }: OrienteeringSessionsCalendarAsyncProps) {
  const endDate = new Date()
  const startDate = subWeeks(endDate, weeks)
  const activities = await fetchActivities('2697', startDate, endDate)

  return <OrienteeringSessionsCalendar weeks={weeks} activities={activities} targetSessions={targetSessions} />
}

export function OrienteeringSessionsCalendarAsync({ weeks = 50, targetSessions = 3 }: OrienteeringSessionsCalendarAsyncProps) {
  return (
    <Suspense fallback={<OrienteeringSessionsCalendarSkeleton weeks={weeks} />}>
      <OrienteeringSessionsCalendarContent weeks={weeks} targetSessions={targetSessions} />
    </Suspense>
  )
}
