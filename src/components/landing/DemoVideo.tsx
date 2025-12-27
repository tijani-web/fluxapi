'use client'

import { motion } from 'framer-motion'
import { Play, Pause, Maximize2, Minimize2, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useState, useRef, useEffect } from 'react'

export function DemoVideoSection() {
  const [playing, setPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  const videoSrc = "/hero.mp4" // Your video in public folder

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
        setShowControls(true)
      }
      setPlaying(!playing)
    }
  }

  const handleFullscreen = () => {
    if (!containerRef.current) return
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      setDuration(videoRef.current.duration || 0)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value)
    setVolume(vol)
    if (videoRef.current) {
      videoRef.current.volume = vol
      setMuted(vol === 0)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted
      setMuted(!muted)
      if (!muted) {
        setVolume(0)
      } else {
        setVolume(0.8)
      }
    }
  }

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    
    // Auto-hide controls after 3 seconds of inactivity
    let controlsTimeout: NodeJS.Timeout
    const hideControls = () => {
      if (playing && showControls) {
        controlsTimeout = setTimeout(() => setShowControls(false), 3000)
      }
    }

    if (playing && showControls) {
      hideControls()
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      clearTimeout(controlsTimeout)
    }
  }, [playing, showControls])

  return (
    <section id="demo" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Watch it{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                work
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how developers build APIs in minutes instead of hours
            </p>
          </div>

          {/* Video Player Container */}
          <div 
            ref={containerRef}
            className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => {
              if (playing) {
                setTimeout(() => setShowControls(false), 1000)
              }
            }}
            onMouseMove={() => {
              setShowControls(true)
            }}
          >
            {/* Background Glow - Only show when not fullscreen */}
            {!isFullscreen && (
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl opacity-30" />
            )}
            
            <Card className={`relative overflow-hidden ${isFullscreen ? 'rounded-none border-0 h-screen' : 'border-2 border-border/50 bg-card/50 backdrop-blur-sm'}`}>
              {/* Video Container */}
              <div className="relative bg-black">
                {/* Aspect Ratio Container */}
                <div className={`relative ${isFullscreen ? 'h-[calc(100vh-200px)]' : 'aspect-video'}`}>
                  {/* Video Element */}
                  <video
                    ref={videoRef}
                    src={videoSrc}
                    className="w-full h-full object-contain bg-black" 
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        setDuration(videoRef.current.duration)
                      }
                    }}
                    onEnded={() => setPlaying(false)}
                    poster="/video-thumbnail.png" 
                  />
                  
                  {/* Video Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                    {/* Play/Pause Button Center - FIXED: Show when video is not playing */}
                    {!playing && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handlePlayPause}
                          className="group relative"
                        >
                          {/* Play Button Glow */}
                          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-colors" />
                          
                          {/* Play Button */}
                          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl">
                            <Play className="h-8 w-8 text-white ml-1" />
                          </div>
                        </motion.button>
                        
                        {/* Play Label */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                          <div className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full">
                            <span className="text-sm">Watch demo video (2:45)</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Custom Controls Overlay - FIXED: Always show when showControls is true */}
                    {showControls && (
                      <>
                        {/* Skip Buttons */}
                        <div className="absolute inset-0 flex items-center justify-between px-8">
                          <button
                            onClick={() => skip(-10)}
                            className="p-4 hover:bg-white/10 rounded-full transition-colors opacity-0 hover:opacity-100"
                          >
                            <SkipBack className="h-6 w-6 text-white" />
                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-black/80 px-2 py-1 rounded">
                              -10s
                            </span>
                          </button>
                          
                          <button
                            onClick={() => skip(10)}
                            className="p-4 hover:bg-white/10 rounded-full transition-colors opacity-0 hover:opacity-100"
                          >
                            <SkipForward className="h-6 w-6 text-white" />
                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-black/80 px-2 py-1 rounded">
                              +10s
                            </span>
                          </button>
                        </div>

                        {/* Bottom Controls Bar */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          {/* Progress Bar */}
                          <div className="mb-3">
                            <input
                              type="range"
                              min="0"
                              max={duration || 0}
                              value={currentTime}
                              onChange={handleSeek}
                              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                            />
                            <div className="flex justify-between text-xs text-gray-300 mt-1">
                              <span>{formatTime(currentTime)}</span>
                              <span>{formatTime(duration)}</span>
                            </div>
                          </div>

                          {/* Control Buttons */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <button
                                onClick={handlePlayPause}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                              >
                                {playing ? (
                                  <Pause className="h-5 w-5 text-white" />
                                ) : (
                                  <Play className="h-5 w-5 text-white" />
                                )}
                              </button>
                              
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={toggleMute}
                                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                  {muted ? (
                                    <VolumeX className="h-5 w-5 text-white" />
                                  ) : (
                                    <Volume2 className="h-5 w-5 text-white" />
                                  )}
                                </button>
                                <input
                                  type="range"
                                  min="0"
                                  max="1"
                                  step="0.01"
                                  value={volume}
                                  onChange={handleVolumeChange}
                                  className="w-20 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={handleFullscreen}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                              >
                                {isFullscreen ? (
                                  <Minimize2 className="h-5 w-5 text-white" />
                                ) : (
                                  <Maximize2 className="h-5 w-5 text-white" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Live Demo Badge */}
                  {!isFullscreen && (
                    <div className="absolute top-4 left-4 z-10">
                      <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-primary/30">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-mono tracking-wider">LIVE DEMO</span>
                      </div>
                    </div>
                  )}

                  {/* Fullscreen Close Button */}
                  {isFullscreen && (
                    <button
                      onClick={handleFullscreen}
                      className="absolute top-4 right-4 z-50 p-3 bg-black/60 backdrop-blur-sm rounded-lg hover:bg-black/80 transition-colors border border-white/20"
                    >
                      <span className="text-white text-sm font-mono">ESC</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Demo Steps - Hide in fullscreen */}
              {!isFullscreen && (
                <div className="p-6 md:p-8 border-t border-border/50 bg-gradient-to-b from-gray-950/50 to-black/50">
                  <h3 className="text-xl font-semibold mb-6 text-center">
                    What you'll see in the demo:
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      {
                        step: "01",
                        title: "Create Project",
                        description: "Start from scratch in seconds",
                        color: "from-blue-500 to-cyan-500"
                      },
                      {
                        step: "02", 
                        title: "Create Mock and Environment Data",
                        description: "Mock data and environment variables",
                        color: "from-purple-500 to-pink-500"
                      },
                      {
                        step: "03",
                        title: "Build Endpoint",
                        description: "Visual builder + code editor",
                        color: "from-orange-500 to-red-500"
                      },
                       {
                        step: "04",
                        title: "Test & Share",
                        description: "Instant execution + collaboration",
                        color: "from-orange-500 to-red-500"
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}
                        className="text-center group"
                      >
                        <div className={`text-4xl font-bold bg-gradient-to-br ${item.color} bg-clip-text text-transparent mb-2`}>
                          {item.step}
                        </div>
                        <h4 className="font-semibold mb-2 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground group-hover:text-gray-300 transition-colors">
                          {item.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Video Stats - Hide in fullscreen */}
          {!isFullscreen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
            >
              {[
                { label: "Time Saved", value: "95%" },
                { label: "Lines of Code", value: "-80%" },
                { label: "Setup Time", value: "< 2min" },
                { label: "API Requests", value: "10k/mo" }
              ].map((stat, index) => (
                <div key={index} className="p-4 rounded-xl bg-gray-900/30 border border-gray-800/50">
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}