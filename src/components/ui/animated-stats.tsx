'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'

interface AnimatedNumberProps {
  value: number | string
  suffix?: string
  prefix?: string
  duration?: number
}

export function AnimatedNumber({ value, suffix = '', prefix = '', duration = 2 }: AnimatedNumberProps) {
  const [count, setCount] = useState(0)
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref)

  useEffect(() => {
    if (isInView) {
      if (typeof value === 'number') {
        const step = value / (duration * 60) // 60fps
        let current = 0
        
        const timer = setInterval(() => {
          current += step
          if (current >= value) {
            setCount(value)
            clearInterval(timer)
          } else {
            setCount(Math.floor(current))
          }
        }, 1000 / 60)
        
        return () => clearInterval(timer)
      }
      controls.start({ opacity: 1, y: 0 })
    }
  }, [isInView, value, duration, controls])

  if (typeof value === 'string') {
    return (
      <motion.span
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        className="text-4xl font-bold"
      >
        {prefix}{value}{suffix}
      </motion.span>
    )
  }

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      className="text-4xl font-bold"
    >
      {prefix}{count}{suffix}
    </motion.span>
  )
}