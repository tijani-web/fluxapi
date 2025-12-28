'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Play, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export function CodePreviewSection() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const codeExample = `// Create API endpoint in browser
export async function GET(req) {
  // Fetch mock data from your workspace
  const users = await db.users.findMany({
    where: { active: true },
    take: 10
  });
  
  return Response.json({
    success: true,
    data: users,
    timestamp: new Date().toISOString()
  });
}`

  const responseExample = `{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    },
    {
      "id": "2", 
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "user"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}`

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <section id="code-preview" className="py-20 md:py-32 relative">
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
              See the{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                magic
              </span>{' '}
              in action
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Write backend code directly in your browser. No setup required.
            </p>
          </div>

          {/* Code Preview Card */}
          <div className="relative">
            {/* Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-xl opacity-50" />
            
            <Card className="relative overflow-hidden border-2 border-border/50 bg-card/50 backdrop-blur-sm">
              {/* Terminal Header */}
              <div className="bg-gray-900/80 p-4 flex items-center gap-3 border-b border-border">
                {/* Window Dots */}
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                
                {/* Title */}
                <span className="text-gray-300 text-sm font-mono ml-2">api/users/route.js</span>
                
                {/* Actions */}
                <div className="ml-auto flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className="p-1.5 rounded-md hover:bg-gray-800 transition-colors"
                    title="Copy code"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1.5 rounded-md hover:bg-gray-800 transition-colors"
                    title="Run code"
                  >
                    <Play className="h-4 w-4 text-green-500" />
                  </motion.button>
                  
                  <Badge 
                    variant="default" 
                    className="ml-2 font-mono text-xs px-2 py-0.5 text-green-500"
                  >
                    200 OK
                  </Badge>
                </div>
              </div>

              {/* Code Area */}
              <div className="p-6 md:p-8 font-mono text-sm md:text-base bg-gradient-to-br from-gray-900/50 to-gray-950/50">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left: Code Editor */}
                  <div className="space-y-4">
                    <div className="text-purple-400 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      // Your API endpoint handler
                    </div>
                    
                    <div className="space-y-2 pl-4">
                      <div className="text-blue-400">export async function <span className="text-yellow-300">GET</span>(req) {'{'}</div>
                      <div className="text-gray-300 ml-4">// Fetch mock data from your workspace</div>
                      <div className="text-gray-300 ml-4">const users = await db.users.findMany({'{'}</div>
                      <div className="text-gray-300 ml-8">where: {'{'} active: true {'}'},</div>
                      <div className="text-gray-300 ml-8">take: 10</div>
                      <div className="text-gray-300 ml-4">{'}'});</div>
                      <div className="text-gray-300 ml-4"></div>
                      <div className="text-gray-300 ml-4">return Response.json({'{'}</div>
                      <div className="text-gray-300 ml-8">success: true,</div>
                      <div className="text-gray-300 ml-8">data: users,</div>
                      <div className="text-gray-300 ml-8">timestamp: new Date().toISOString()</div>
                      <div className="text-gray-300 ml-4">{'}'});</div>
                      <div className="text-blue-400">{'}'}</div>
                    </div>
                  </div>

                  {/* Right: Response Preview */}
                  <div className="space-y-4">
                    <div className="text-green-400 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      ✓ Live Response (142ms)
                    </div>
                    
                    <div className="p-4 bg-green-900/10 border border-green-500/20 rounded-lg">
                      <pre className="text-gray-300 text-sm overflow-x-auto">
                        <code>{responseExample}</code>
                      </pre>
                    </div>

                    {/* Response Stats */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/50">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">142ms</div>
                        <div className="text-xs text-muted-foreground">Response Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">2.1KB</div>
                        <div className="text-xs text-muted-foreground">Size</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">200</div>
                        <div className="text-xs text-muted-foreground">Status</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Floating Elements */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-4 -right-4 bg-primary/10 border border-primary/20 rounded-lg p-3"
            >
              <div className="text-xs font-mono text-primary">Live Preview</div>
            </motion.div>
          </div>

          {/* Try it yourself CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground mb-4">
              Want to try it yourself? No signup required.
            </p>
            <button className="text-primary hover:text-primary/80 font-medium flex items-center justify-center gap-2 mx-auto group">
              Launch Interactive Demo
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block"
              >
                →
              </motion.span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}