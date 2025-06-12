'use client'

import { useEffect, useState } from 'react'
import AdviceClient from './AdviceClient'

export default function AdvicePage() {
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) return

        const res = await fetch('http://localhost:3333/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()
        if (data && data.userId) {
          setUserId(data.userId)
        }
      } catch (err) {
        console.error('Lỗi lấy userId từ token:', err)
      }
    }

    fetchUserId()
  }, [])

  if (!userId) return <p className="text-center mt-10">Đang tải thông tin người dùng...</p>

  return <AdviceClient userId={userId} />
}
