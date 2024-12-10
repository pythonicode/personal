export type ActivityType = 'run' | 'strength' | 'workout' | 'bike' | 'orienteering' | 'other'

export type Activity = {
  date: Date
  title: string
  description?: string
  href?: string
  type: ActivityType
  intensity: number
  properties?: Record<string, string>
}
