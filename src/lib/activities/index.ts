import { ActivityType } from './types'

export function getActivityColor(type: ActivityType) {
  switch (type) {
    case 'run':
      return 'cyan'
    case 'strength':
      return 'purple'
    case 'bike':
      return 'green'
    case 'orienteering':
      return 'orange'
    case 'other':
      return 'yellow'
    default:
      return 'gray'
  }
}
