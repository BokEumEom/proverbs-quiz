"use client"

import { useEffect, useState } from "react"
import ReactConfetti from "react-confetti"

export default function Confetti() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [particles, setParticles] = useState(200)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // 창 크기 설정
    const { innerWidth, innerHeight } = window
    setDimensions({
      width: innerWidth,
      height: innerHeight,
    })

    // 5초 후에 confetti 효과 중지
    const timer = setTimeout(() => {
      setParticles(0)
      setIsComplete(true)
    }, 5000)

    // 메모리 누수 방지를 위한 클린업
    return () => {
      clearTimeout(timer)
    }
  }, [])

  // 완전히 끝났을 때 컴포넌트 언마운트
  if (isComplete && particles === 0) {
    return null
  }

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      numberOfPieces={particles}
      recycle={false}
      onConfettiComplete={() => setIsComplete(true)}
      className="fixed inset-0 z-50 pointer-events-none"
    />
  )
}

