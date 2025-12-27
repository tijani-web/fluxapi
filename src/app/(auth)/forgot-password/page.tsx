'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/contexts/ToastContext'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Mail, ArrowLeft, Loader2, CheckCircle, Clock } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const toast = useToast()
  
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setLoading(true)
    
    try {
      await api.requestPasswordReset(email)
      setEmailSent(true)
      toast.success('Password reset email sent! Check your inbox.')
      
      setCountdown(30)
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendEmail = () => {
    if (countdown > 0) return
    handleSubmit(new Event('submit') as any)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-gray-950 p-4">
      <div className="w-full max-w-md">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center space-y-2 relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-0 top-0 h-8 px-2"
              onClick={() => router.push('/login')}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            
            <CardTitle className="text-2xl font-bold mt-1">Reset your password</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {emailSent ? (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-5">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                
                <h3 className="text-xl font-semibold mb-2">Check your email</h3>
                <p className="text-muted-foreground mb-6">
                  We've sent a password reset link to{' '}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
                
                <div className="space-y-5">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      Didn't receive the email?{' '}
                      <button
                        onClick={handleResendEmail}
                        disabled={countdown > 0}
                        className="text-primary hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {countdown > 0 ? `Resend in ${countdown}s` : 'Click to resend'}
                      </button>
                    </span>
                  </div>
                  
                  <div className="pt-5 border-t border-border/40 space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Make sure to check your spam folder
                    </p>
                    <Link href="/login">
                      <Button variant="outline" className="w-full h-11">
                        Return to login
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10 h-11"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter the email address associated with your account
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-11"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    'Send reset link'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col items-center text-center text-sm text-muted-foreground border-t pt-6 space-y-2">
            <p>
              Remember your password?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium transition-colors">
                Sign in here
              </Link>
            </p>
            <p>
              Don't have an account?{' '}
              <Link href="/register" className="text-primary hover:underline font-medium transition-colors">
                Sign up for free
              </Link>
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            If you're having trouble resetting your password,{' '}
            <Link href="/support" className="text-primary hover:underline transition-colors">
              contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}