"use client"

import { useState, useCallback, useEffect } from "react"

export function useTimelineState(timestamps: number[] = []) {
  const [currentTime, setCurrentTime] = useState<number | null>(
    timestamps.length > 0 ? timestamps[0] : null
  )
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)

  const minTime = timestamps.length > 0 ? Math.min(...timestamps) : 0
  const maxTime = timestamps.length > 0 ? Math.max(...timestamps) : 0

  const play = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const reset = useCallback(() => {
    setCurrentTime(minTime)
    setIsPlaying(false)
  }, [minTime])

  const seek = useCallback((time: number) => {
    const clamped = Math.max(minTime, Math.min(maxTime, time))
    setCurrentTime(clamped)
  }, [minTime, maxTime])

  // Playback animation loop
  useEffect(() => {
    if (!isPlaying || currentTime === null) return

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev === null) return maxTime
        const next = prev + (playbackSpeed * 1000) // Advance by speed * 1 second
        return next > maxTime ? maxTime : next
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed, maxTime])

  // Auto-pause at end
  useEffect(() => {
    if (currentTime === maxTime && isPlaying) {
      setIsPlaying(false)
    }
  }, [currentTime, maxTime, isPlaying])

  return {
    currentTime,
    isPlaying,
    playbackSpeed,
    minTime,
    maxTime,
    play,
    pause,
    reset,
    seek,
    setPlaybackSpeed,
  }
}
