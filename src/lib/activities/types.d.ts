export type ActivityType = 'run' | 'strength' | 'bike' | 'orienteering' | 'other'

export type ActivityZone = 'Z0' | 'Z1' | 'Z2' | 'Z3' | 'Z4' | 'Z5';

export type Activity = {
  date: Date
  time?: number
  title: string
  description?: string
  href: string
  type: ActivityType
  duration: number
  distance?: number // in km
  elevationGain?: number // in meters
  intensity: Record<ActivityZone, number>
  calculatedIntensity: number
  metadata?: Record<string, string>
}
