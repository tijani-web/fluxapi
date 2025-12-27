'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Settings, Zap, Clock, Globe, Infinity as InfinityIcon, Bolt } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function HeroSection() {
  const { isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const statItem = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  }

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl"
        />
        
        {/* Floating circles */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-2xl"
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge with animation */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Settings className="h-4 w-4 text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-primary">
              Backend without the backend
            </span>
          </motion.div>

          {/* Main heading with typewriter effect */}
          <motion.h1 
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            Build APIs in the{' '}
            <motion.span 
              className="relative inline-block"
              initial={{ backgroundPosition: '200% center' }}
              animate={{ backgroundPosition: '0% center' }}
              transition={{ duration: 2, ease: "easeInOut" }}
              style={{
                background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              browser
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </motion.span>
            ,{' '}
            <motion.span 
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              instantly
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-accent/0 via-accent to-accent/0"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 1 }}
              />
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Design, test, and deploy APIs with zero setup. No servers, no databases, 
            just pure development flow.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            {isAuthenticated ? (
              <Link href="/workspace">
                <Button 
                  size="lg" 
                  className="gap-2 group relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0"
                    animate={{
                      x: ['-100%', '200%']
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  <Zap className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  <span className="relative">Open Workspace</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button 
                    size="lg" 
                    className="gap-2 group relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0"
                      animate={{
                        x: ['-100%', '200%']
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <Settings className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="relative">Start Building Free</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-primary/20 hover:border-primary/40 transition-colors"
                  >
                    See Demo
                  </Button>
                </Link>
              </>
            )}
          </motion.div>

          {/* Stats - Enhanced with icons and animations */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
          >
            {/* Setup Time */}
            <motion.div 
              variants={statItem}
              className="text-center group"
            >
              <div className="flex justify-center mb-3">
                <motion.div 
                  className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Clock className="h-6 w-6 text-primary" />
                </motion.div>
              </div>
              <div className="text-3xl font-bold text-primary mb-1">0s</div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                Setup Time
              </div>
            </motion.div>

            {/* In Browser */}
            <motion.div 
              variants={statItem}
              className="text-center group"
            >
              <div className="flex justify-center mb-3">
                <motion.div 
                  className="p-3 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Globe className="h-6 w-6 text-green-500" />
                </motion.div>
              </div>
              <div className="text-3xl font-bold text-green-500 mb-1">100%</div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                In Browser
              </div>
            </motion.div>

            {/* Endpoints */}
            <motion.div 
              variants={statItem}
              className="text-center group"
            >
              <div className="flex justify-center mb-3">
                <motion.div 
                  className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <InfinityIcon className="h-6 w-6 text-blue-500" />
                </motion.div>
              </div>
              <div className="text-3xl font-bold text-blue-500 mb-1">∞</div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                Endpoints
              </div>
            </motion.div>

            {/* Instant Execution */}
            <motion.div 
              variants={statItem}
              className="text-center group"
            >
              <div className="flex justify-center mb-3">
                <motion.div 
                  className="p-3 rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bolt className="h-6 w-6 text-amber-500" />
                </motion.div>
              </div>
              <div className="text-3xl font-bold text-amber-500 mb-1">⚡</div>
              <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                Instant Execution
              </div>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          {mounted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="mt-16"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground">Scroll to explore</span>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-6 h-10 border-2 border-border/40 rounded-full flex justify-center"
                >
                  <div className="w-1 h-3 bg-primary rounded-full mt-2" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}