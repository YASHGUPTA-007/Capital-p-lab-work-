'use client'

import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export const CustomCursor = () => {
  const mouse = { x: useMotionValue(0), y: useMotionValue(0) }
  const [cursorVariant, setCursorVariant] = useState('default')
  const smoothOptions = { damping: 20, stiffness: 300, mass: 0.5 }
  const smoothMouse = { x: useSpring(mouse.x, smoothOptions), y: useSpring(mouse.y, smoothOptions) }

  const manageMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e
    mouse.x.set(clientX)
    mouse.y.set(clientY)
  }

  useEffect(() => {
    window.addEventListener("mousemove", manageMouseMove)
    return () => window.removeEventListener("mousemove", manageMouseMove)
  }, [])

  return (
    <>
      <motion.div 
        style={{ left: smoothMouse.x, top: smoothMouse.y }} 
        className="fixed w-8 h-8 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden lg:block will-change-transform"
        animate={cursorVariant}
        variants={{
          default: { scale: 1 },
          hover: { scale: 1.5 }
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-purple-600/30 via-emerald-500/30 to-purple-600/30 blur-md animate-spin-slow" />
      </motion.div>
      <motion.div 
        style={{ left: smoothMouse.x, top: smoothMouse.y }} 
        className="fixed w-2 h-2 bg-purple-600 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden lg:block will-change-transform"
      />
    </>
  )
}

export const NoiseOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-[50] opacity-[0.015] mix-blend-overlay"
   
  />
)

export const FloatingOrbs = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden transform-gpu">
    <motion.div
      animate={{
        x: [0, 100, 0],
        y: [0, -50, 0],
        scale: [1, 1.2, 1],
        opacity: [0.05, 0.15, 0.05]
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-500 to-transparent rounded-full blur-3xl will-change-transform"
    />
    <motion.div
      animate={{
        x: [0, -100, 0],
        y: [0, 100, 0],
        scale: [1, 1.3, 1],
        opacity: [0.05, 0.2, 0.05]
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-emerald-500 to-transparent rounded-full blur-3xl will-change-transform"
    />
    <motion.div
      animate={{
        x: [0, 50, 0],
        y: [0, -100, 0],
        scale: [1, 1.1, 1],
        opacity: [0.03, 0.1, 0.03]
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-purple-300 to-transparent rounded-full blur-3xl will-change-transform"
    />
  </div>
)