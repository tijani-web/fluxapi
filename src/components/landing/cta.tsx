'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Star, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export function CtaSection() {
  const { isAuthenticated } = useAuth()

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background via-background/50 to-background" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Stars */}
          <div className="flex justify-center gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 text-amber-500 fill-amber-500" />
            ))}
          </div>

          {/* Testimonial */}
          <blockquote className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto italic">
            "I built a complete API for my startup in 2 hours. What used to take days now takes minutes."
          </blockquote>
          <div className="text-muted-foreground mb-12">
            — Alex Chen, Full-stack Developer
          </div>

          {/* Main CTA */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                revolutionize
              </span>{' '}
              your API workflow?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers building faster with API Flow Studio
            </p>

            {isAuthenticated ? (
              <Link href="/workspace">
                <Button size="lg" className="gap-3 text-lg px-8">
                  <Zap className="h-5 w-5" />
                  Open Workspace
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="gap-3 text-lg px-8">
                    <Sparkles className="h-5 w-5" />
                    Start Building Free
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Watch Demo First
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Social Proof */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Developers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500K+</div>
              <div className="text-sm text-muted-foreground">APIs Built</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>

          {/* No Credit Card Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 pt-8 border-t border-border/40"
          >
            <p className="text-muted-foreground">
              No credit card required • Free forever plan • Start building in seconds
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}