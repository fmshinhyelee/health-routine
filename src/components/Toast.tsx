import { useEffect, useState } from 'react'

let showToastFn: ((msg: string) => void) | null = null

export function showToast(msg: string) {
  showToastFn?.(msg)
}

export default function Toast() {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    showToastFn = (msg: string) => {
      setMessage(msg)
      setVisible(true)
      setTimeout(() => setVisible(false), 2000)
    }
    return () => { showToastFn = null }
  }, [])

  return (
    <div
      className={`fixed bottom-[90px] left-1/2 z-[999] -translate-x-1/2 whitespace-nowrap rounded-full bg-green px-5 py-2.5 text-[13px] font-bold text-black transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
      }`}
    >
      {message}
    </div>
  )
}
