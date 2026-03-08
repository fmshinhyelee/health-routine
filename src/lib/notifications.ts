export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export function scheduleNotification(routineName: string, timeStr: string): number | null {
  if (Notification.permission !== 'granted') return null

  const [hours, minutes] = timeStr.split(':').map(Number)
  const now = new Date()
  const target = new Date()
  target.setHours(hours, minutes, 0, 0)

  if (target <= now) return null

  const delay = target.getTime() - now.getTime()
  const timerId = window.setTimeout(() => {
    new Notification('건강 루틴 알림', {
      body: `${routineName} 할 시간이에요!`,
      icon: '/icon-192.png',
    })
  }, delay)

  return timerId
}

export function cancelNotification(timerId: number) {
  window.clearTimeout(timerId)
}
