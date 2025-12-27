'use client'

import { motion } from 'framer-motion'
import { 
  Code2, 
  Users, 
  Zap, 
  Cloud, 
  Shield,
  GitBranch,
  Globe,
  Terminal
} from 'lucide-react'
import { Card } from '@/components/ui/card'

export function FeaturesSection() {
  const features = [
    {
      icon: Code2,
      title: "Visual API Builder",
      description: "Drag-and-drop interface to create endpoints. Write logic in JavaScript, no Express setup needed.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Real-time Collaboration",
      description: "Work with your team like Figma. See live cursors, edit together, and comment in real-time.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Instant Execution",
      description: "Run code in isolated sandboxes. Get immediate feedback with logs and performance metrics.",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: Cloud,
      title: "Mock Data Workspace",
      description: "Create collections, seed data, and simulate real databases - all in your browser.",
      color: "from-emerald-500 to-green-500"
    }
  ]

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <section id="features" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-sm font-medium text-primary">
              Everything you need
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Build complete API systems{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              without the complexity
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            All the tools you need for API development, packaged in one seamless browser experience.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              whileHover={{ y: -8 }}
            >
              <Card className="h-full p-6 border-border/40 hover:border-primary/20 transition-all duration-300 group">
                <div className="mb-4">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-10`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Capabilities */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">And so much more</h3>
            <p className="text-muted-foreground">
              Professional tools for serious development
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Shield, label: "Secure Sandbox" },
              { icon: GitBranch, label: "Version Control" },
              { icon: Globe, label: "API Documentation" },
              { icon: Terminal, label: "CLI Integration" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center p-4 rounded-lg border border-border/40 hover:border-primary/20 transition-colors"
              >
                <item.icon className="h-5 w-5 text-primary mb-2" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}