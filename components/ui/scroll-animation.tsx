"use client"

import { useRef, ReactNode, useMemo } from "react"
import { motion, useInView, Variants } from "framer-motion"

type Direction = "up" | "down" | "left" | "right"

interface ScrollAnimationProps {
  children: ReactNode
  direction?: Direction
  delay?: number
  duration?: number
  className?: string
}

const directionVariants: Record<Direction, { opacity: number; x?: number; y?: number }> = {
  up: { opacity: 0, y: 40 },
  down: { opacity: 0, y: -40 },
  left: { opacity: 0, x: 40 },
  right: { opacity: 0, x: -40 },
}

const visibleState = { opacity: 1, x: 0, y: 0 }

export function ScrollAnimation({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  className,
}: ScrollAnimationProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const transition = useMemo(() => ({ duration, delay, ease: "easeOut" as const }), [duration, delay])

  return (
    <motion.div
      ref={ref}
      initial={directionVariants[direction]}
      animate={inView ? visibleState : directionVariants[direction]}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  const containerVariants = useMemo<Variants>(
    () => ({
      hidden: {},
      visible: { transition: { staggerChildren: 0.1, delayChildren: delay } },
    }),
    [delay],
  )

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}
