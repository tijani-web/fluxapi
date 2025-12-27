// app/invite/[token]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  MailCheck, 
  MailWarning, 
  UserPlus, 
  LogIn,
  ExternalLink 
} from 'lucide-react'

export default function AcceptInvitationPage() {
  const { token } = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [invitation, setInvitation] = useState<any>(null)
  
  useEffect(() => {
    if (token) {
      checkInvitation()
    }
  }, [token])
  
  const checkInvitation = async () => {
    try {
      // You need to create a GET endpoint to fetch invitation details
      // For now, we'll just show the accept button
      setLoading(false)
    } catch (error) {
      toast({ title: 'Error', description: 'Invalid invitation', variant: 'destructive' })
      router.push('/')
    }
  }
  
  const handleAccept = async () => {
    if (!isAuthenticated) {
      // Redirect to login with invitation token in URL
      router.push(`/login?invite=${token}`)
      return
    }
    
    try {
      await api.acceptInvitation(token as string)
      toast({ title: 'Success', description: 'Invitation accepted!' })
      router.push('/dashboard')
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    }
  }
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-6 w-6" />
            Project Invitation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAuthenticated ? (
            <>
              <p>You've been invited to join a project!</p>
              <Button onClick={handleAccept} className="w-full">
                Accept Invitation
              </Button>
            </>
          ) : (
            <>
              <p>You need to log in to accept this invitation.</p>
              <Button onClick={handleAccept} className="w-full">
                <LogIn className="h-4 w-4 mr-2" />
                Log In to Accept
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}